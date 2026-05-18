require("dotenv").config();
const nodemailer = require("nodemailer");

console.log("USER:", process.env.EMAIL_USER);
console.log("PASS:", process.env.EMAIL_PASS);

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

transporter.verify((err, success) => {
    if (err) {
        console.error("❌ Verify failed:", err.message);
    } else {
        console.log("✅ Transporter verified, sending test email...");

        transporter.sendMail({
            from: `"EventSphere" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER, // send to yourself
            subject: "Test Email",
            text: "If you see this, email works!",
        }, (err, info) => {
            if (err) console.error("❌ Send failed:", err.message);
            else console.log("✅ Email sent!", info.response);
        });
    }
});