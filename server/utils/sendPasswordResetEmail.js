const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === "true",
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 15000,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendPasswordResetEmail = async (email, token) => {
  const resetUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to: email,
    subject: "Reset your Auction Arena password",
    text: `Reset your password using this link: ${resetUrl}\n\nThis link expires in 20 minutes and can only be used once.`,
    html: `<p>Reset your Auction Arena password by clicking the link below.</p><p><a href="${resetUrl}">Reset password</a></p><p>This link expires in 20 minutes and can only be used once.</p>`,
  });
};

module.exports = sendPasswordResetEmail;
