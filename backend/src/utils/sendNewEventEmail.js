
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

async function sendNewEventEmail(user, event, club) {
    if (
        !user?.email ||
        !event?._id ||
        !event?.title ||
        !event?.eventDate ||
        !club?.name ||
        !club?._id
    ) {
        throw new Error("Invalid new event email data");
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

    const title = escapeHtml(event.title);
    const clubName = escapeHtml(club.name);
    const name = escapeHtml(user.name);
    const location = escapeHtml(event.location || "Venue TBD");
    const description = escapeHtml(event.description || "");

    const eventUrl = getClientUrl(
        `/events/${encodeURIComponent(event._id.toString())}`
    );

    const html = `
        <div style="font-family:sans-serif;max-width:600px;margin:auto;
                    padding:24px;border:1px solid #e5e7eb;border-radius:12px">

            <h2 style="color:#4f46e5">
                🗓️ New Event in
                <span style="color:#ec4899">${clubName}</span>
            </h2>

            <p>Hi <strong>${name}</strong>,</p>

            <p>
                A new event has been posted in your club
                <strong>${clubName}</strong>.
            </p>

            <div style="background:#f9fafb;border:1px solid #e5e7eb;
                        border-radius:8px;padding:16px;margin:16px 0">

                <h3 style="margin:0 0 8px;color:#1f2937">
                    ${title}
                </h3>

                <p style="color:#6b7280;font-size:14px">
                    📅 ${eventDate}
                </p>

                <p style="color:#6b7280;font-size:14px">
                    📍 ${location}
                </p>

                ${description
                    ? `<p style="color:#374151;font-size:14px">${description}</p>`
                    : ""}
            </div>

            <a href="${escapeHtml(eventUrl)}"
               style="display:inline-block;margin-top:8px;padding:10px 20px;
                      background:#6366f1;color:white;border-radius:999px;
                      text-decoration:none;font-weight:600">
                View Event
            </a>

            <p style="margin-top:24px;color:#9ca3af;font-size:12px">
                © ${new Date().getFullYear()} EventSphere
            </p>
        </div>
    `;

    const text = `
Hello ${user.name},

A new event has been posted in your club ${club.name}.

Event: ${event.title}
Date: ${eventDate}
Location: ${event.location || "Venue TBD"}

View Event: ${eventUrl}

Team EventSphere
    `;

    const info = await transporter.sendMail({
        from: `"EventSphere" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: `New Event: ${event.title} - ${club.name}`,
        text,
        html
    });

    console.log("New event email sent:", info.messageId);

    return info;
}

module.exports = { sendNewEventEmail };
