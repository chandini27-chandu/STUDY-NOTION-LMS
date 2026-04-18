const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const info = await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: email,
            subject: title,
            html: body,
        });

        return info;
    } catch (error) {
        console.log("MAIL ERROR:", error);
        throw error;
    }
};

module.exports = mailSender;