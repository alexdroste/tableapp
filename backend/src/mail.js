"use strict";

/**
 * Mail transport.
 * @module mail
 */

const config = require('./config');
const nodemailer = require('nodemailer');


/**
 * Nodemailer-transport instance.
 * @type {MailTransport}
 */
const transporter = nodemailer.createTransport({
    host: config.mail.host,
    port: 25,
    pool: true,
    tls: { 
        rejectUnauthorized: false 
    },
});


/**
 * Send mail.
 * @static
 * @async
 * @function
 * @param {string} to e-mail address to send to
 * @param {string} subject subject of mail
 * @param {string} html html-body of mail
 * @returns {Promise} never rejects, errors will be catched and printed
 */
async function sendMail(to, subject, html) {
    console.debug("Sending mail to " + to);
    // ignore return value
    try {
        await transporter.sendMail({
            from: config.mail.from,
            to,
            subject,
            html
        });
    } catch (e) {
        console.error(e);
    }
}
exports.sendMail = sendMail;


/**
 * Tests connection to mailserver.
 * @static
 * @async
 * @function
 * @returns {Promise<boolean>} resolves to true if successful, false otherwise
 */
async function testConnection() {
    try {
        await transporter.verify();
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
}
exports.testConnection = testConnection;
