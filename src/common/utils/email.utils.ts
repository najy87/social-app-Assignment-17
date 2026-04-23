import nodemailer from "nodemailer";
import { MailOptions } from "nodemailer/lib/json-transport";
import { SEND_EMAIL_PASS, SEND_EMAIL_USER } from "../../config";

export const sendEmail = async ({ to, subject, html }: MailOptions) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: SEND_EMAIL_USER,
      pass: SEND_EMAIL_PASS,
    },
  });
  await transporter.sendMail({
    from: '"social_app_najy"<najy10710@gmail.com>',
    to,
    subject,
    html,
  });
};
