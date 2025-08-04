import nodemailer from 'nodemailer';

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM } = process.env;

const transport = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: false,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  },
  tls: {
    
    rejectUnauthorized: false,
  },
  logger: true,
  debug: true,
});

export const sendResetPasswordEmail = async (to, subject, html) => {
  await transport.sendMail({
    from: SMTP_FROM,
    to,
    subject,
    html,
  });
};
