
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

async function sendCancellationEmail(user, event) {
    if (!user?.email || !event?.title || !event?.eventDate) {
        throw new Error("Invalid cancellation email data");
    }

    const transporter = getTransporter();

    const date = new Date(event.eventDate);

    if (Number.isNaN(date.getTime())) {
        throw new Error("Invalid event date");
    }

    const eventDate = date.toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    const eventTime = date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit"
    });

    const name = escapeHtml(user.name);
    const title = escapeHtml(event.title);
    const location = escapeHtml(event.location);
    const clubName = escapeHtml(event.clubName || "EventSphere");

    const html = `
        <div style="font-family:sans-serif;max-width:520px;margin:auto;
                    background:#f9fafb;border-radius:12px;overflow:hidden;
                    border:1px solid #e5e7eb">

            <div style="background:#374151;padding:28px 32px">
                <h1 style="color:white;margin:0;font-size:22px">
                    Registration Cancelled
                </h1>

                <p style="color:white;margin:6px 0 0;font-size:14px">
                    You've unregistered from <strong>${title}</strong>
                </p>
            </div>

            <div style="padding:28px 32px">
                <p style="color:#374151;font-size:15px">
                    Hi <strong>${name}</strong>,
                </p>

                <p style="color:#6b7280;font-size:14px">
                    Your registration has been successfully cancelled.
                </p>

                <table style="width:100%;border-collapse:collapse;margin:20px 0">
                    <tr>
                        <td style="padding:10px 0;color:#9ca3af;font-size:13px">
                            Date
                        </td>
                        <td style="color:#111827;font-size:14px;font-weight:600">
                            ${eventDate}
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:10px 0;color:#9ca3af;font-size:13px">
                            Time
                        </td>
                        <td style="color:#111827;font-size:14px;font-weight:600">
                            ${eventTime}
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:10px 0;color:#9ca3af;font-size:13px">
                            Venue
                        </td>
                        <td style="color:#111827;font-size:14px;font-weight:600">
                            ${location}
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:10px 0;color:#9ca3af;font-size:13px">
                            Club
                        </td>
                        <td style="color:#111827;font-size:14px;font-weight:600">
                            ${clubName}
                        </td>
                    </tr>
                </table>

                <div style="background:#fef3c7;border:1px solid #fde68a;
                            border-radius:8px;padding:16px;margin:20px 0">

                    <p style="color:#92400e;font-size:13px;margin:0">
                        Your seat has been released. You can register again
                        if seats are available and registration is open.
                    </p>
                </div>

                <p style="color:#6b7280;font-size:13px;margin-top:24px">
                    Hope to see you at future events! 👋<br/>
                    <strong style="color:#ec4899">Team EventSphere</strong>
                </p>
            </div>
        </div>
    `;

    const text = `
Hello ${user.name},

Your registration for ${event.title} has been cancelled.

Date: ${eventDate}
Time: ${eventTime}
Venue: ${event.location}
Club: ${event.clubName || "EventSphere"}

Your seat has been released.

Team EventSphere
    `;

    const info = await transporter.sendMail({
        from: `"EventSphere" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: `Registration Cancelled - ${event.title}`,
        text,
        html
    });

    console.log("Cancellation email sent:", info.messageId);

    return info;
}

module.exports = { sendCancellationEmail };
