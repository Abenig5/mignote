import type { BookingInput } from "@/types/booking";

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const REQUEST_TIMEOUT_MS = 10_000;

type EmailPayload = {
  subject: string;
  text: string;
  replyTo?: string;
};

export type SendResult =
  | { delivered: true; skipped: false; id: string }
  | { delivered: false; skipped: true; reason: string };

export class EmailDeliveryError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "EmailDeliveryError";
    this.status = status;
  }
}

type EmailConfig = {
  apiKey: string;
  from: string;
  notificationEmail: string;
};

const PLACEHOLDER_MARKERS = [
  "USER:PASSWORD",
  "user:password",
  "yourdomain.com",
  "your-email@example.com",
  "YOUR_RESEND_API_KEY"
];

function looksLikePlaceholder(value: string) {
  return PLACEHOLDER_MARKERS.some((marker) => value.includes(marker));
}

/**
 * Resolves the Resend API key. Prefers RESEND_API_KEY, but still accepts the
 * older EMAIL_SERVER SMTP URL so existing deployments keep working after the
 * switch from SMTP to the Resend HTTP API.
 */
function resolveApiKey() {
  const direct = process.env.RESEND_API_KEY?.trim();

  if (direct && !looksLikePlaceholder(direct)) {
    return direct;
  }

  const server = process.env.EMAIL_SERVER?.trim();

  if (!server || looksLikePlaceholder(server)) {
    return null;
  }

  return server.match(/re_[A-Za-z0-9_-]{10,}/)?.[0] ?? null;
}

function getEmailConfig(): { config: EmailConfig } | { reason: string } {
  const apiKey = resolveApiKey();
  const from = process.env.EMAIL_FROM?.trim();
  const notificationEmail = process.env.NOTIFICATION_EMAIL?.trim();

  const missing: string[] = [];

  if (!apiKey) missing.push("RESEND_API_KEY");
  if (!from || looksLikePlaceholder(from)) missing.push("EMAIL_FROM");
  if (!notificationEmail || looksLikePlaceholder(notificationEmail)) {
    missing.push("NOTIFICATION_EMAIL");
  }

  if (!apiKey || !from || !notificationEmail || missing.length > 0) {
    return { reason: `Missing or placeholder environment variables: ${missing.join(", ")}` };
  }

  return { config: { apiKey, from, notificationEmail } };
}

async function readResendError(response: Response) {
  const body = (await response.json().catch(() => null)) as { message?: string } | null;

  return body?.message ?? `Resend returned HTTP ${response.status}`;
}

async function sendEmail({ replyTo, subject, text }: EmailPayload): Promise<SendResult> {
  const resolved = getEmailConfig();

  if ("reason" in resolved) {
    console.warn(`Email notification skipped. ${resolved.reason}`);

    return { delivered: false, skipped: true, reason: resolved.reason };
  }

  const { config } = resolved;

  let response: Response;

  try {
    response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: config.from,
        to: [config.notificationEmail],
        subject,
        text,
        ...(replyTo ? { reply_to: [replyTo] } : {})
      }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)
    });
  } catch (error) {
    const detail = error instanceof Error ? error.message : "unknown network error";

    throw new EmailDeliveryError(502, `Could not reach the Resend API: ${detail}`);
  }

  if (!response.ok) {
    throw new EmailDeliveryError(response.status, await readResendError(response));
  }

  const body = (await response.json().catch(() => null)) as { id?: string } | null;

  return { delivered: true, skipped: false, id: body?.id ?? "unknown" };
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
