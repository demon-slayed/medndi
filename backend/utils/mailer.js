import nodemailer from "nodemailer";

// GoDaddy Professional Email: smtpout.secureserver.net, port 465 (SSL) or 587 (STARTTLS).
// Without SMTP_HOST/SMTP_USER/SMTP_PASS, emails are skipped (logged) so the app still works.
let transporter = null;

const getTransporter = () => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;
  if (!transporter) {
    const port = Number(SMTP_PORT) || 465;
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port,
      secure: port === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
  }
  return transporter;
};

export const mailFrom = () => process.env.MAIL_FROM || `MedNdi <${process.env.SMTP_USER || "info@medndi.com"}>`;

// Fire-and-forget: callers don't await this, and failures never reach the user's request.
export const sendMail = ({ to, subject, html, text }) => {
  const transport = getTransporter();
  if (!transport || !to) {
    console.log(`[mail] skipped "${subject}" to ${to || "nobody"} (SMTP not configured)`);
    return;
  }
  transport
    .sendMail({ from: mailFrom(), to, subject, html, text, replyTo: process.env.MAIL_REPLY_TO || undefined })
    .then(() => console.log(`[mail] sent "${subject}" to ${to}`))
    .catch((error) => console.error(`[mail] failed "${subject}" to ${to}: ${error.message}`));
};

// Checks the SMTP login without sending anything (used by `npm run mail:check`).
export const verifyMailer = async () => {
  const transport = getTransporter();
  if (!transport) throw new Error("SMTP_HOST, SMTP_USER and SMTP_PASS must be set");
  await transport.verify();
};
