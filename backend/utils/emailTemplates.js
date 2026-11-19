// Transactional email templates. Inline styles only: most mail clients ignore <style>.

const SITE_URL = () => (process.env.SITE_URL || "https://medndi.com").replace(/\/$/, "");
const SUPPORT_EMAIL = "info@medndi.com";

const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const firstName = (user) => (user?.fullName || "").trim().split(/\s+/)[0] || "there";

const formatIST = (value) => {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return String(value);
  return `${date.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" })} IST`;
};

const formatINR = (value) => (value == null ? "—" : `₹${Number(value).toLocaleString("en-IN")}`);

const button = (href, label) => `
  <a href="${href}" style="display:inline-block;background:#3252DF;color:#ffffff;text-decoration:none;font-weight:600;padding:12px 22px;border-radius:8px;">${escapeHtml(label)}</a>`;

const detailsTable = (rows) => `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:16px 0;background:#F5F7FF;border-radius:8px;">
    ${rows
      .filter(([, value]) => value != null && value !== "")
      .map(
        ([label, value]) => `
      <tr>
        <td style="padding:10px 14px;color:#6B7280;font-size:14px;width:40%;vertical-align:top;">${escapeHtml(label)}</td>
        <td style="padding:10px 14px;color:#111827;font-size:14px;font-weight:600;vertical-align:top;">${escapeHtml(value)}</td>
      </tr>`
      )
      .join("")}
  </table>`;

const layout = ({ preheader, body }) => `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#F3F4F6;font-family:Arial,Helvetica,sans-serif;">
    <span style="display:none;max-height:0;overflow:hidden;">${escapeHtml(preheader)}</span>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F3F4F6;padding:24px 12px;">
      <tr><td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden;">
          <tr><td style="background:#0d1230;padding:20px 24px;">
            <span style="color:#ffffff;font-size:22px;font-weight:700;">Med</span><span style="background:#ffffff;color:#3252DF;font-size:22px;font-weight:700;padding:0 6px;border-radius:4px;margin-left:2px;">Ndi</span>
          </td></tr>
          <tr><td style="padding:28px 24px;color:#111827;font-size:15px;line-height:1.6;">${body}</td></tr>
          <tr><td style="padding:16px 24px 24px;color:#6B7280;font-size:12px;line-height:1.5;border-top:1px solid #E5E7EB;">
            MedNdi · Treatment in Delhi NCR, Bengaluru and Pune<br>
            Questions? Write to <a href="mailto:${SUPPORT_EMAIL}" style="color:#3252DF;">${SUPPORT_EMAIL}</a>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;

export const welcomeEmail = (user) => {
  const name = firstName(user);
  return {
    subject: "Welcome to MedNdi",
    html: layout({
      preheader: "Your MedNdi account is ready.",
      body: `
        <h1 style="font-size:22px;margin:0 0 12px;">Welcome, ${escapeHtml(name)}!</h1>
        <p>Your MedNdi account is ready. You can now compare accredited hospitals, see treatment costs and book your treatment with hotel, travel and insurance in one place.</p>
        <p style="margin:24px 0;">${button(`${SITE_URL()}/treatments`, "Find a treatment")}</p>
        <p>Have a medical report? Upload it to our report analyser from your dashboard to get a quick summary before you talk to a doctor.</p>`,
    }),
    text: `Welcome, ${name}!\n\nYour MedNdi account is ready. Browse treatments: ${SITE_URL()}/treatments\n\nQuestions? ${SUPPORT_EMAIL}`,
  };
};

export const loginAlertEmail = (user, { ip, userAgent, at }) => {
  const when = formatIST(at);
  return {
    subject: "New sign-in to your MedNdi account",
    html: layout({
      preheader: `You signed in on ${when}.`,
      body: `
        <h1 style="font-size:22px;margin:0 0 12px;">New sign-in</h1>
        <p>Hi ${escapeHtml(firstName(user))}, your MedNdi account was just signed in to.</p>
        ${detailsTable([
          ["When", when],
          ["Device", userAgent ? userAgent.slice(0, 120) : "Unknown"],
          ["IP address", ip || "Unknown"],
        ])}
        <p>If this was you, there's nothing to do. If you don't recognise it, reply to this email or write to <a href="mailto:${SUPPORT_EMAIL}" style="color:#3252DF;">${SUPPORT_EMAIL}</a> right away and we'll secure your account.</p>`,
    }),
    text: `New sign-in to your MedNdi account\n\nWhen: ${when}\nDevice: ${userAgent || "Unknown"}\nIP: ${ip || "Unknown"}\n\nNot you? Contact ${SUPPORT_EMAIL} right away.`,
  };
};

export const bookingEmail = (user, { applicationId, treatment, hospital, hotel, insurance, appointment, totalCost }) => {
  const rows = [
    ["Booking ID", applicationId],
    ["Treatment", treatment],
    ["Hospital", hospital],
    ["Appointment", appointment ? formatIST(appointment) : null],
    ["Hotel", hotel || "Not selected"],
    ["Insurance", insurance || "Not selected"],
    ["Estimated total", totalCost ? `up to ${formatINR(totalCost)}` : null],
  ];
  return {
    subject: `Booking request received · ${applicationId}`,
    html: layout({
      preheader: `We've received your request for ${treatment} at ${hospital}.`,
      body: `
        <h1 style="font-size:22px;margin:0 0 12px;">We've received your booking request</h1>
        <p>Hi ${escapeHtml(firstName(user))}, thank you for choosing MedNdi. Here are your details:</p>
        ${detailsTable(rows)}
        <p style="margin:0 0 6px;font-weight:600;">What happens next</p>
        <ol style="margin:0 0 16px;padding-left:20px;">
          <li>A care coordinator reviews your request, usually within 24 hours.</li>
          <li>We may ask for recent reports, prescriptions and ID.</li>
          <li>The hospital's specialists confirm your treatment plan and final quote.</li>
          <li>We help with visa letters, travel and your stay.</li>
        </ol>
        <p>No payment is needed now. You can follow every step from your dashboard.</p>
        <p style="margin:24px 0;">${button(`${SITE_URL()}/patient`, "View my booking")}</p>`,
    }),
    text: `We've received your booking request\n\n${rows
      .filter(([, v]) => v)
      .map(([l, v]) => `${l}: ${v}`)
      .join("\n")}\n\nTrack it at ${SITE_URL()}/patient\nQuestions? ${SUPPORT_EMAIL}`,
  };
};

export const postCareEmail = (user, { service, treatment, followupDates }) => ({
  subject: "Post-care request received",
  html: layout({
    preheader: `We've received your ${service} request.`,
    body: `
      <h1 style="font-size:22px;margin:0 0 12px;">Post-care request received</h1>
      <p>Hi ${escapeHtml(firstName(user))}, we've received your post-treatment care request and will contact you to confirm the details.</p>
      ${detailsTable([
        ["Service", service],
        ["For treatment", treatment],
        ["Preferred follow-up", followupDates],
      ])}
      <p style="margin:24px 0;">${button(`${SITE_URL()}/patient`, "Open my dashboard")}</p>`,
  }),
  text: `Post-care request received\n\nService: ${service}\nFor treatment: ${treatment || "—"}\nPreferred follow-up: ${followupDates || "—"}\n\nDashboard: ${SITE_URL()}/patient\nQuestions? ${SUPPORT_EMAIL}`,
});
