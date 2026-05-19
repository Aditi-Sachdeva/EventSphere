const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    connectionTimeout: 10000,
});
async function sendMemberApprovalEmail(user, club) {
    const html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px;">
            <h2 style="color: #4f46e5;">🎉 You're now a member of <span style="color: #ec4899;">${club.name}</span>!</h2>
            <p>Hi <strong>${user.name}</strong>,</p>
            <p>Your request to join <strong>${club.name}</strong> has been <span style="color: #16a34a; font-weight: bold;">approved</span>.</p>
            <p>You can now access all club events and activities on EventSphere!</p>
            <a href="${process.env.CLIENT_URL}/clubs/${club._id}" 
               style="display:inline-block; margin-top:16px; padding: 10px 20px; background: linear-gradient(to right, #6366f1, #ec4899); color: white; border-radius: 999px; text-decoration: none; font-weight: 600;">
                View Club
            </a>
            <p style="margin-top: 24px; color: #9ca3af; font-size: 12px;">© 2026 EventSphere</p>
        </div>
    `;

    await transporter.sendMail({
        from: `"EventSphere" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: `✅ Membership Approved — ${club.name}`,
        html,
    });
}

module.exports = { sendMemberApprovalEmail };