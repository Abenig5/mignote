import nodemailer from "nodemailer";
import type { BookingInput } from "@/types/booking";

const notificationEmail = process.env.NOTIFICATION_EMAIL ?? "abenezergirma5@gmail.com";

type EmailPayload = {
  subject: string;
  text: string;
  replyTo?: string;
};

function getEmailConfig() {
  const server = process.env.EMAIL_SERVER;
  const from = process.env.EMAIL_FROM;

  if (!server || !from || server.includes("user:password") || from.includes("yourdomain.com")) {
    return null;
  }

  return { from, server };
}

async function sendEmail({ replyTo, subject, text }: EmailPayload) {
  const config = getEmailConfig();

  if (!config) {
    console.warn("Email notification skipped: EMAIL_SERVER and EMAIL_FROM are not configured.");
    return { delivered: false, skipped: true };
  }

  const transporter = nodemailer.createTransport(config.server);

  await transporter.sendMail({
    from: config.from,
    replyTo,
    subject,
    text,
    to: notificationEmail
  });

  return { delivered: true, skipped: false };
}

export async function sendBookingNotification(input: BookingInput) {
  return sendEmail({
    replyTo: input.email,
    subject: `New booking inquiry from ${input.name}`,
    text: [
      "A new booking inquiry was submitted on the Mignote site.",
      "",
      `Full name: ${input.name}`,
      `Email: ${input.email}`,
      `Phone: ${input.phone || "Not provided"}`,
      `Event date: ${input.eventDate}`,
      `Guest count: ${input.guestCount}`,
      "",
      "Message:",
      input.message || "No message provided"
    ].join("\n")
  });
}

export async function sendContactNotification(input: { name: string; email: string; message: string }) {
  return sendEmail({
    replyTo: input.email,
    subject: `New contact inquiry from ${input.name}`,
    text: [
      "A new contact inquiry was submitted on the Mignote contact page.",
      "",
      `Full name: ${input.name}`,
      `Email: ${input.email}`,
      "",
      "Message:",
      input.message
    ].join("\n")
  });
}
