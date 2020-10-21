const nodemailer = require('nodemailer');

const uids = [
"dWlk...",
];
// const uids = [
//     "dWlkPWF2ZDE1LG91PXBlb3BsZSxkYz10dS1jbGF1c3RoYWwsZGM9ZGU=",
// ];

const transporter = nodemailer.createTransport({
    host: 'mailgate.tu-clausthal.de',
    port: 25,
    pool: true,
    tls: { 
        rejectUnauthorized: false 
    },
});


async function sendMail(to, uid) {
    console.debug("Sending mail to " + to);

    const link = `https://survey.progmem.de/index.php/76915?newtest=Y&lang=de&u=${uid}&e=5cb70db3c02ab2801bac9f62`
    const subject = "Experimentalphysik 2 - Post-Umfrage TABLE";
    const html = `
Guten Tag!
<br/>
<br/>
Danke, dass du dieses Semester unser Rückkanalsystem TABLE in der Experimentalphysik 2 benutzt hast - oder zumindest aufgerufen hast ;).
<br/>
Wie angekündigt handelte es sich dabei um einen Testlauf. 
<br/>
Wir - vom Lehrstuhl HCIS am Institut für Informatik - wollen nun evaluieren, ob sich die Weiterentwicklung und der weitere Einsatz lohnt.
<br/>
Dafür ist es unabdingbar, dass wir Daten über die Nutzung erheben.
<br/>
<br/>
Bitte unterstütze mich und nimm dir 3 Minuten, um die folgende (Post-)Umfrage auszufüllen.
<br/>
<a href="${link}">${link}</a>
<br/>
<br/>
Leider gibt es nichts zu gewinnen, aber für uns sind die Umfrageergebnisse sehr wichtig und es macht einen großen Unterschied, ob wir zum Schluss 5 oder 25 komplett ausgefüllte Bögen haben.
<br/>
<br/>
Beste Grüße
<br/>
Alexander Droste (Entwickler, HCIS)
`;

    // ignore return value
    try {
        await transporter.sendMail({
            from: 'alexander.volker.droste@tu-clausthal.de',
            to,
            subject,
            html
        });
    } catch (e) {
        console.error(e);
    }
}


async function testConnection() {
    try {
        await transporter.verify();
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
}


(async () => {
    if (await testConnection()) {
        console.log('Mailserver connected');
    } else {
        console.error('Could not connect to mailserver');
        process.exit();
        return;
    }

    const mails = uids.map(uid => {
        const b = new Buffer(uid, 'base64');
        const t = b.toString();
        const re = /uid=(.+),ou.+/;
        const m = re.exec(t);
        return `${m[1]}@tu-clausthal.de`;
    });

    for (let i = 0; i < uids.length; ++i) {
        await sendMail(mails[i], uids[i]);
    }

    process.exit();

})().catch(e => {
    // catch all top level errors
    console.error(e);
    process.exit();
});
