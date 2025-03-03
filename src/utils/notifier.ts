import nodemailer from "nodemailer";
import twilio from "twilio";
import { LogModel } from "../models/log";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);

export const sendNotification = async (message: string) => {
  const fullMessage = `[${new Date().toLocaleString()}] ${message}`;
  await LogModel.create({ message: fullMessage });

  await transporter.sendMail({
    from: process.env.EMAIL_USER!,
    to: process.env.NOTIFY_EMAIL!,
    subject: "🚀 New Members Alert",
    text: fullMessage,
  });

  await client.messages.create({
    body: fullMessage,
    from: process.env.TWILIO_PHONE!,
    to: process.env.NOTIFY_PHONE!,
  });

  console.log("✅ Notification Sent:", fullMessage);
};
