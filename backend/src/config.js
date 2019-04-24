// Load custom configuration
let custom = {};
try { custom = require('./config.custom.js') } 
catch (e) { console.error('Custom configuration is missing!'); }
const {ssl, ldap, db, mail, sessionToken, eventScreenshots, ...rest} = custom;


/**
 * Configuration values.
 */
const config = {
    /**
     * Logging-Level.
     * Valid values: 'debug', 'info', 'warn', 'error'.
     * Defaults to 'debug'.
     * @type {string}
     */
    loglevel: 'debug',
    /**
     * Base-URL of client. Needs to end with a slash.
     * Requires overwrite.
     * @type {string}
     */
    baseUrl: 'https://localhost:3000/',
    /**
     * SSL config values.
     */
    ssl: {
        /**
         * Path to ssl-certificate.
         * Requires overwrite.
         * @type {string}
         */
        certPath: './localhost.crt',
        /**
         * Path to ssl-certificates private key.
         * Requires overwrite.
         * @type {string}
         */
        keyPath: './localhost.key',
        ...ssl // overwrite with custom config values
    },
    /**
     * LDAP config values.
     */
    ldap: {
        /**
         * URL to LDAP-Server.
         * Requires overwrite.
         * @type {string}
         */
        url: 'ldaps://ldap.example.com:636',
        /**
         * DN of search-account.
         * Requires overwrite.
         * @type {string}
         */
        dn: 'uid=abc123,...,dc=com',
        /**
         * Password of search-account.
         * Requires overwrite.
         * @type {string}
         */
        password: 'password',
        /**
         * Search-base.
         * Requires overwrite.
         * @type {string}
         */
        base: 'ou=people,dc=example,dc=com',
        /**
         * LDAP entry attributes which are handled as email address.
         * Defaults to ['mail'].
         * @type {Array<string>}
         */
        emailAttributes: ['mail'],
        /**
         * LDAP entry attribute which is handled as a persons name.
         * Defaults to 'cn'.
         * @type {string}
         */
        nameAttribute: 'cn',
        /**
         * LDAP entry attribute which is handled as a persons title.
         * 
         * This setting is optional: if not set, no title is put in front of persons names.
         * @type {(string|undefined)}
         */
        titleAttribute: undefined,
        ...ldap // overwrite with custom config values
    },
    /**
     * Database (MongoDB) config values.
     */
    db: {
        /**
         * Name of database to use.
         * Defaults to 'tableapp'.
         * @type {string}
         */
        name: 'tableapp',
        /**
         * URL to mongodb.
         * Defaults to local mongodb instance on default port.
         * @type {string}
         */
        url: 'mongodb://localhost:27017',
        ...db // overwrite with custom config values
    },
    /**
     * Mail config values.
     */
    mail: {
        /**
         * Hostname of mail-server to connect to (via smtp).
         * Defaults to 'localhost'.
         * @type {string}
         */
        host: 'localhost',
        /**
         * Mail-address to send mails from.
         * Requires overwrite.
         * @type {string}
         */
        from: 'table@example.com',
        ...mail // overwrite with custom config values
    },
    /**
     * Config values for session tokens.
     */
    sessionToken: {
        /**
         * Private key used for signing.
         * Requires overwrite.
         * @type {string}
         */
        privateKey: 'password',
        /**
         * Time span a sessionToken is valid after creation.
         * Defaults to '180d' (180 days).
         * 
         * Value is expressed in seconds or a string describing a time span. Eg: 60, "2 days", "10h", "7d"
         * @type {string}
         */
        validFor: '180d',
        ...sessionToken // overwrite with custom config values
    },
    /**
     * Config values for (event-)screenshots.
     */
    eventScreenshots: {
        /**
         * Time in minutes to keep screenshots available after last received screenshot/update.
         * Defaults to 15.
         * @type {number}
         */
        keepForMinutesAfterLastUpdate: 15,
        /**
         * Determines how many screenshots should be preserved at a time.
         * Defaults to 3.
         * @type {number}
         */
        saveLastCount: 3,
        ...eventScreenshots // overwrite with custom config values
    },
    ...rest
};

module.exports = config;
