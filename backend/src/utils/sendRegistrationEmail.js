
const nodemailer = require("nodemailer");
const QRCode = require("qrcode");

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

async function sendRegistrationEmail(user, event, qrToken) {
    if (!user?.email || !event?.title || !event?.eventDate || !qrToken) {
        throw new Error("Invalid registration email data");
    }

    const transporter = getTransporter();

    const qrBuffer = await QRCode.toBuffer(qrToken, {
        type: "png",
        width: 350,
        margin: 2,
        errorCorrectionLevel: "H",
        color: {
            dark: "#1e1b4b",
            light: "#ffffff"
        }
    });

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

            <div style="background:#6366f1;padding:28px 32px">
                <h1 style="color:white;margin:0;font-size:22px">
                    You're In! 🎉
                </h1>

                <p style="color:white;margin:6px 0 0;font-size:14px">
                    Registration confirmed for <strong>${title}</strong>
                </p>
            </div>

            <div style="padding:28px 32px">
                <p style="color:#374151;font-size:15px">
                    Hi <strong>${name}</strong>,
                </p>

                <p style="color:#6b7280;font-size:14px">
                    Your spot is confirmed. Here are your event details:
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

                <div style="text-align:center;background:white;
                            border:1px solid #e5e7eb;border-radius:12px;
                            padding:24px;margin:24px 0">

                    <p style="color:#374151;font-weight:600;margin:0 0 16px">
                        Your Attendance QR Code
                    </p>

                    <img src="cid:qrcode"
                         width="220"
                         height="220"
                         alt="Event Attendance QR Code"
                         style="display:block;margin:auto;max-width:100%"/>

                    <p style="color:#9ca3af;font-size:12px;margin-top:12px">
                        Show this QR code at the event entrance.
                        Keep it private.
                    </p>
                </div>

                <p style="color:#6b7280;font-size:13px;margin-top:24px">
                    See you there! 🚀<br/>
                    <strong style="color:#ec4899">Team EventSphere</strong>
                </p>
            </div>
        </div>
    `;

    const text = `
Hello ${user.name},

Your registration for ${event.title} is confirmed.

Date: ${eventDate}
Time: ${eventTime}
Venue: ${event.location}
Club: ${event.clubName || "EventSphere"}

Your attendance QR code is attached to this email.

Team EventSphere
    `;

    const info = await transporter.sendMail({
        from: `"EventSphere" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: `You're registered for ${event.title}`,
        text,
        html,
        attachments: [
            {
                filename: "attendance-qr.png",
                content: qrBuffer,
                contentType: "image/png",
                cid: "qrcode",
                contentDisposition: "inline"
            }
        ]
    });

    console.log("Registration email sent:", info.messageId);

    return info;
}

module.exports = { sendRegistrationEmail };
