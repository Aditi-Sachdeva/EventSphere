const nodemailer = require("nodemailer");
const QRCode = require("qrcode");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

transporter.verify((err) => {
    if (err) console.error("❌ Email transporter error:", err.message);
    else console.log("✅ Email transporter ready");
});

async function sendRegistrationEmail(user, event, qrToken) {
    const qrBuffer = await QRCode.toBuffer(qrToken, {
        width: 300,
        margin: 2,
        color: { dark: "#1e1b4b", light: "#ffffff" },
    });

    const eventDate = new Date(event.eventDate).toLocaleDateString("en-IN", {
        weekday: "long", day: "numeric", month: "long", year: "numeric",
    });
    const eventTime = new Date(event.eventDate).toLocaleTimeString("en-IN", {
        hour: "2-digit", minute: "2-digit",
    });

    const info = await transporter.sendMail({
        from: `"EventSphere" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: `You're registered for ${event.title} 🎉`,
        html: `
      <div style="font-family:sans-serif;max-width:520px;margin:auto;background:#f9fafb;
                  border-radius:12px;overflow:hidden;border:1px solid #e5e7eb">

        <div style="background:linear-gradient(135deg,#ec4899,#6366f1);padding:28px 32px">
          <h1 style="color:white;margin:0;font-size:22px">You're In! 🎉</h1>
          <p style="color:rgba(255,255,255,0.8);margin:6px 0 0;font-size:14px">
            Registration confirmed for <strong>${event.title}</strong>
          </p>
        </div>

        <div style="padding:28px 32px">
          <p style="color:#374151;font-size:15px">Hi <strong>${user.name}</strong>,</p>
          <p style="color:#6b7280;font-size:14px">
            Your spot is confirmed. Here are your event details:
          </p>

          <table style="width:100%;border-collapse:collapse;margin:20px 0">
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;
                         color:#9ca3af;font-size:13px;width:40%">📅 Date</td>
              <td style="color:#111827;font-size:14px;font-weight:600">${eventDate}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;
                         color:#9ca3af;font-size:13px">🕐 Time</td>
              <td style="color:#111827;font-size:14px;font-weight:600">${eventTime}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;
                         color:#9ca3af;font-size:13px">📍 Venue</td>
              <td style="color:#111827;font-size:14px;font-weight:600">${event.location}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;color:#9ca3af;font-size:13px">🏛️ Club</td>
              <td style="color:#111827;font-size:14px;font-weight:600">
                ${event.clubName || "EventSphere"}
              </td>
            </tr>
          </table>

          <div style="text-align:center;background:white;border:1px solid #e5e7eb;
                      border-radius:12px;padding:24px;margin:24px 0">
            <p style="color:#374151;font-weight:600;margin:0 0 16px;font-size:14px">
              Your Attendance QR Code
            </p>
            <img src="cid:qrcode" width="200" alt="QR Code" style="border-radius:8px"/>
            <p style="color:#9ca3af;font-size:12px;margin:12px 0 0">
              Show this at the entrance. Valid for this event only.
            </p>
          </div>

          <p style="color:#6b7280;font-size:13px;margin-top:24px">
            See you there! 🚀<br/>
            <strong style="color:#ec4899">Team EventSphere</strong>
          </p>
        </div>
      </div>
    `,
        attachments: [
            {
                filename: "attendance-qr.png",
                content: qrBuffer,
                cid: "qrcode",
            },
        ],
    });

    console.log("✅ Registration email sent:", info.response);
}

module.exports = { sendRegistrationEmail };