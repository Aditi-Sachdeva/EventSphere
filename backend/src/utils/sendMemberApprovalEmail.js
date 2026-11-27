
const nodemailer = require("nodemailer");

function getTransporter() {
    const { EMAIL_USER, EMAIL_PASS } = process.env;

    if (!EMAIL_USER || !EMAIL_PASS) {
        throw new Error("EMAIL_USER or EMAIL_PASS is not configured");
    }

    return nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASS
        },
        connectionTimeout: 15000,
        greetingTimeout: 15000,
        socketTimeout: 20000
    });
}

function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

function getClientUrl(path) {
    const baseUrl = process.env.CLIENT_URL;

    if (!baseUrl) {
        throw new Error("CLIENT_URL is not configured");
    }

    return `${baseUrl.replace(/\/+$/, "")}${path}`;
}

async function sendMemberApprovalEmail(user, club) {
    if (!user?.email || !club?._id || !club?.name) {
        throw new Error("Invalid membership approval email data");
    }

    const transporter = getTransporter();

    const name = escapeHtml(user.name);
    const clubName = escapeHtml(club.name);

    const clubUrl = getClientUrl(
        `/clubs/${encodeURIComponent(club._id.toString())}`
    );

    const html = `
        <div style="font-family:sans-serif;max-width:600px;margin:auto;
                    padding:24px;border:1px solid #e5e7eb;border-radius:12px">

            <h2 style="color:#4f46e5">
                🎉 You're now a member of
                <span style="color:#ec4899">${clubName}</span>!
            </h2>

            <p>Hi <strong>${name}</strong>,</p>

            <p>
                Your request to join <strong>${clubName}</strong>
                has been
                <span style="color:#16a34a;font-weight:bold">
                    approved
                </span>.
            </p>

            <p>
                You can now access your club's events and activities
                on EventSphere.
            </p>

            <a href="${escapeHtml(clubUrl)}"
               style="display:inline-block;margin-top:16px;padding:10px 20px;
                      background:#6366f1;color:white;border-radius:999px;
                      text-decoration:none;font-weight:600">
                View Club
            </a>

            <p style="margin-top:24px;color:#9ca3af;font-size:12px">
                © ${new Date().getFullYear()} EventSphere
            </p>
        </div>
    `;

    const text = `
Hello ${user.name},

Your request to join ${club.name} has been approved.

You can now access your club's events and activities.

View Club: ${clubUrl}

Team EventSphere
    `;

    const info = await transporter.sendMail({
        from: `"EventSphere" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: `Membership Approved - ${club.name}`,
        text,
        html
    });

    console.log("Membership approval email sent:", info.messageId);

    return info;
}

module.exports = { sendMemberApprovalEmail };
