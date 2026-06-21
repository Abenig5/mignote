import { NextResponse } from "next/server";
import { sendContactNotification } from "@/lib/email";
import { contactSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid contact request", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const result = await sendContactNotification(parsed.data);

    if (!result.delivered && result.skipped) {
      return NextResponse.json(
        { error: "Email service is not configured." },
        { status: 503 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact notification email failed:", error);

    return NextResponse.json(
      { error: "Unable to send contact inquiry." },
      { status: 500 }
    );
  }
}
