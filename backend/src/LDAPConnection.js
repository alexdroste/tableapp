"use strict";

const config = require('./config');
var ldap = require('ldapjs');
const utils = require('./utils');


/**
 * LDAPConnection class can be used to open a ldap-connection
 * and perform several search-actions.
 */
class LDAPConnection {
    /**
     * Creates an LDAPConnection instance.
     * @param {string} dn DN of user to connect with
     * @param {string} password password of user to connect with
     */
    constructor(dn, password) {
        /**
         * DN of user bind will be executed.
         * @private
         * @type {string} 
         */
        this._dn = dn;
        /**
         * Password of user bind will be executed.
         * @private
         * @type {string}
         */
        this._password = password;
        /**
         * Indicates if bound.
         * @private
         * @type {boolean}
         */
        this._bound = false;
        /**
         * Internal connection instance from ldapjs.
         * @private
         * @type {object}
         */
        this._client = null;
    }


    /**
     * Connect to ldap server and bind.
     * @async
     * @function
     * @returns {Promise} indicates successful connect and bind
     */
    open() {
        return this._connect().then(() =>
            this._bind());
    }


    /**
     * Unbind and disconnect.
     * @async
     * @function
     * @returns {Promise} indicates successful unbind and disconnect
     */
    close() {
        return this._unbind().then(() => {
            this._disconnect();
            return Promise.resolve();
        });
    }


    /**
     * Connect to ldap server.
     * @private
     * @async
     * @function
     * @returns {Promise} indicates successful connect 
     */
    _connect() {
        if (this._client)
            return Promise.resolve();

        return new Promise((resolve, reject) => {
            this._client = ldap.createClient({
                url: config.ldap.url
            });

            this._client.once('connect', () => {
                resolve();
            });
            this._client.once('error', (e) => {
                console.error('ldap connect error:', e);
                reject(e);
            });
        });
    }


    /**
     * Disconnect from ldap server. This method should always be called after
     * connection is not used anymore to avoid left open sockets.
     * @private
     * @function
     */
    _disconnect() {
        if (!this._client)
            return;
        this._client.destroy();
        this._client = null;
    }


    /**
     * Binds with dn and password. 
     * Connection needs to be open.
     * @private
     * @async
     * @function
     * @returns {Promise} indicates successful bind
     */
    _bind() {
        if (this._bound)
            return Promise.resolve();

        return new Promise((resolve, reject) => {
            this._client.bind(this._dn, this._password, (err) => {
                if (err)
                    return reject(err);
                this._bound = true;
                resolve();
            });
        });
    }


    /**
     * Unbinds. 
     * Connection needs to be open.
     * @private
     * @async
     * @function
     * @returns {Promise} indicates successful unbind
     */
    _unbind() {
        if (!this._bound)
            return Promise.resolve();

        return new Promise((resolve, reject) => {
            this._client.unbind((err) => {
                if (err)
                    return reject(err);
                this._bound = false;
                resolve();
            });
        });
    }


    /**
     * Performs a search. 
     * Connection need to be open and bound.
     * @async
     * @function
     * @param {(string|filter)} filter ldap filter string (remains unescaped!!!) or a ldap-js Filter object
     * @param {(string|string[])} attributes attributes to select and return
     * @param {boolean} [filterIsDn=false] if set, filter param is used as searchBase, search is performed with scope: base and wildcard filter
     * @param {number} [limit=10] maximum number of entries to return
     * @returns {Promise<object[]>} returns search results as array of result objects
     */
    search(filter, attributes, filterIsDn=false, limit = 10) {
        let searchBase = config.ldap.base;
        const options = {
            attributes,
            filter,
            sizeLimit: limit,
            scope: 'sub',
        };

        // if filter is dn, perform a search on scope base
        if (filterIsDn) {
            searchBase = filter;
            options.filter = '(objectclass=*)';
            options.scope = 'base';
        }

        return new Promise((resolve, reject) => {
            this._client.search(searchBase, options, (err, res) => {
                if (err)
                    return reject(err);

                const entries = []

                const handleStatusCode = (code) => {
                    switch (code) {
                        case 0: // LDAP_SUCCESS
                        case 3: // LDAP_TIMELIMIT_EXCEEDED
                        case 4: // LDAP_SIZELIMIT_EXCEEDED
                            return resolve(entries);                  
                        default:
                            const err = utils.createError('ldap search error - code: ' + code);
                            console.error(err);
                            reject(err);
                    }
                };

                // res is an EventEmitter
                res.on('searchEntry', function(entry) {
                    entries.push(entry.object);
                });
                res.on('error', function(err) {
                    handleStatusCode(err.code);
                });
                res.on('end', function(result) {
                    handleStatusCode(result.status);
                });
            });
        });
    }


    /**
     * Searches for a DN by a given email. 
     * Connection need to be open and bound.
     * @async
     * @function
     * @param {string} email email to search for
     * @returns {Promise<string|null>} resolves to DN if found, null if not found
     */
    searchForDnByEmail(email) {
        if (!email)
            return Promise.reject('email param must not be null');

        const filter = new ldap.filters.OrFilter({
            filters: config.ldap.emailAttributes.map((attribute) => {
                return new ldap.filters.EqualityFilter({
                    attribute,
                    value: email
                });
            })
        });

        const attributes = 'dn';
        return this.search(filter, attributes).then((entries) => {
            if (entries.length === 0)
                return Promise.resolve(null);
            return Promise.resolve(entries[0].dn);
        });
    }


    /**
     * Performs a DN lookup and constructs the users full name (including title).
     * Connection need to be open and bound.
     * @async
     * @function
     * @param {string} dn DN of user
     * @returns {Promise<string>} resolves to the users name
     */
    getNameFromDn(dn) {
        if (!dn)
            return Promise.reject('dn param must not be null');

        const attributes=[config.ldap.nameAttribute];
        if (config.ldap.titleAttribute)
            attributes.push(config.ldap.titleAttribute);
        
        return this.search(dn, attributes, true).then((entries) => {
            if (entries.length === 0)
                return Promise.reject('dn not found');
            let name = entries[0][config.ldap.nameAttribute];
            if (config.ldap.titleAttribute && entries[0][config.ldap.titleAttribute])
                name = entries[0][config.ldap.titleAttribute] + ' ' + name;
            return Promise.resolve(name);
        });
    }


    /**
     * Performs a DN lookup and retrieves the users email.
     * Connection need to be open and bound.
     * @async
     * @function
     * @param {string} dn DN of user
     * @returns {Promise<string>} resolves to the users email
     */
    getEmailFromDn(dn) {
        if (!dn)
            return Promise.reject('dn param must not be null');

        const attributes=[config.ldap.emailAttributes[0]];
        
        return this.search(dn, attributes, true).then((entries) => {
            if (entries.length === 0)
                return Promise.reject('dn not found');
            const email = entries[0][attributes[0]];
            return Promise.resolve(email);
        });
    }
}


module.exports = LDAPConnection;
