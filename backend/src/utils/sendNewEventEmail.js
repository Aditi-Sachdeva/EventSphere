const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    connectionTimeout: 10000,
});

async function sendNewEventEmail(user, event, club) {
    const eventDate = new Date(event.eventDate).toLocaleDateString("en-IN", {
        day: "numeric", month: "long", year: "numeric",
    });

    const html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px;">
            <h2 style="color: #4f46e5;">🗓️ New Event in <span style="color: #ec4899;">${club.name}</span></h2>
            <p>Hi <strong>${user.name}</strong>,</p>
            <p>A new event has been posted in your club <strong>${club.name}</strong>:</p>
            <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin: 16px 0;">
                <h3 style="margin: 0 0 8px; color: #1f2937;">${event.title}</h3>
                <p style="margin: 4px 0; color: #6b7280; font-size: 14px;">📅 ${eventDate}</p>
                <p style="margin: 4px 0; color: #6b7280; font-size: 14px;">📍 ${event.location || "Venue TBD"}</p>
                ${event.description ? `<p style="margin: 8px 0 0; color: #374151; font-size: 14px;">${event.description}</p>` : ""}
            </div>
            <a href="${process.env.CLIENT_URL}/events/${event._id}" 
               style="display:inline-block; margin-top:8px; padding: 10px 20px; background: linear-gradient(to right, #6366f1, #ec4899); color: white; border-radius: 999px; text-decoration: none; font-weight: 600;">
                View Event
            </a>
            <p style="margin-top: 24px; color: #9ca3af; font-size: 12px;">© 2026 EventSphere</p>
        </div>
    `;

    await transporter.sendMail({
        from: `"EventSphere" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: `🎉 New Event: ${event.title} — ${club.name}`,
        html,
    });
}

module.exports = { sendNewEventEmail };