require('colors')
const nodemailer = require("nodemailer");
const path = require("path");

const transporter = nodemailer.createTransport({
    service: process.env.MAIL_SERVICE,
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

async function sendMail({ to, subject, html }) {

    try {

        const info = await transporter.sendMail({
            from: `Games-Wave <${process.env.MAIL_USER}>`,
            to,
            subject,
            html,
            attachments: [
                { 
                    filename: 'icon.png',
                    contentType: 'image/png',
                    path: path.join(__dirname, 'icon.png'),
                    cid: 'logo'
                }
            ]
        });
        console.log("Message sent: %s".green, info.messageId);
    } catch (err) {throw err};

}

module.exports = sendMail