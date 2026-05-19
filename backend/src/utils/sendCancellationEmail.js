const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    connectionTimeout: 10000,
});
async function sendCancellationEmail(user, event) {
    const eventDate = new Date(event.eventDate).toLocaleDateString("en-IN", {
        weekday: "long", day: "numeric", month: "long", year: "numeric",
    });
    const eventTime = new Date(event.eventDate).toLocaleTimeString("en-IN", {
        hour: "2-digit", minute: "2-digit",
    });

    await transporter.sendMail({
        from: `"EventSphere" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: `Registration Cancelled – ${event.title}`,
        html: `
      <div style="font-family:sans-serif;max-width:520px;margin:auto;background:#f9fafb;
                  border-radius:12px;overflow:hidden;border:1px solid #e5e7eb">

        <div style="background:linear-gradient(135deg,#6b7280,#374151);padding:28px 32px">
          <h1 style="color:white;margin:0;font-size:22px">Registration Cancelled</h1>
          <p style="color:rgba(255,255,255,0.8);margin:6px 0 0;font-size:14px">
            You've unregistered from <strong>${event.title}</strong>
          </p>
        </div>

        <div style="padding:28px 32px">
          <p style="color:#374151;font-size:15px">Hi <strong>${user.name}</strong>,</p>
          <p style="color:#6b7280;font-size:14px">
            Your registration has been successfully cancelled for the following event:
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

          <div style="background:#fef3c7;border:1px solid #fde68a;border-radius:8px;
                      padding:16px;margin:20px 0">
            <p style="color:#92400e;font-size:13px;margin:0">
              ⚠️ Your seat has been released. If this was a mistake, you can re-register
              as long as seats are available.
            </p>
          </div>

          <p style="color:#6b7280;font-size:13px;margin-top:24px">
            Hope to see you at future events! 👋<br/>
            <strong style="color:#ec4899">Team EventSphere</strong>
          </p>
        </div>
      </div>
    `,
    });

    console.log(`✅ Cancellation email sent to ${user.email}`);
}

module.exports = { sendCancellationEmail };