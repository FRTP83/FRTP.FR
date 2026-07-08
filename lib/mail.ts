import nodemailer from "nodemailer";

export type ContactMailPayload = {
  name: string;
  company?: string;
  email: string;
  phone: string;
  city: string;
  work_type: string;
  message: string;
};

const mailTo = process.env.CONTACT_MAIL_TO || "contact@frtp.fr";

export function isMailConfigured() {
  return Boolean(
    process.env.SMTP_HOST
    && process.env.SMTP_PORT
    && process.env.SMTP_USER
    && process.env.SMTP_PASSWORD
  );
}

export async function sendContactRequestMail(payload: ContactMailPayload) {
  if (!isMailConfigured()) {
    return { skipped: true };
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
    }
  });

  await transporter.sendMail({
    from: process.env.CONTACT_MAIL_FROM || process.env.SMTP_USER,
    to: mailTo,
    replyTo: payload.email,
    subject: `Nouvelle demande de contact FRTP - ${payload.city}`,
    text: buildTextMail(payload),
    html: buildHtmlMail(payload)
  });

  return { skipped: false };
}

function buildTextMail(payload: ContactMailPayload) {
  return [
    "Nouvelle demande de contact depuis frtp.fr",
    "",
    `Nom : ${payload.name}`,
    `Societe : ${payload.company || "Non renseignee"}`,
    `Telephone : ${payload.phone}`,
    `Email : ${payload.email}`,
    `Commune du chantier : ${payload.city}`,
    `Type de travaux : ${payload.work_type}`,
    "",
    "Message :",
    payload.message
  ].join("\n");
}

function buildHtmlMail(payload: ContactMailPayload) {
  const rows = [
    ["Nom", payload.name],
    ["Societe", payload.company || "Non renseignee"],
    ["Telephone", payload.phone],
    ["Email", payload.email],
    ["Commune du chantier", payload.city],
    ["Type de travaux", payload.work_type]
  ];

  return `
    <div style="font-family:Arial,sans-serif;color:#111827;line-height:1.6">
      <h1 style="font-size:22px;margin:0 0 18px">Nouvelle demande de contact FRTP</h1>
      <table style="border-collapse:collapse;width:100%;max-width:680px">
        ${rows.map(([label, value]) => `
          <tr>
            <td style="border:1px solid #e5e7eb;background:#f9fafb;padding:10px;font-weight:700;width:210px">${escapeHtml(label)}</td>
            <td style="border:1px solid #e5e7eb;padding:10px">${escapeHtml(value)}</td>
          </tr>
        `).join("")}
      </table>
      <h2 style="font-size:16px;margin:22px 0 8px">Message</h2>
      <p style="white-space:pre-wrap;border-left:4px solid #c76a00;background:#f9fafb;padding:14px;margin:0">${escapeHtml(payload.message)}</p>
    </div>
  `;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
