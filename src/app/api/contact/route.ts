import { NextResponse } from "next/server";
import { EmailDeliveryError, sendContactNotification } from "@/lib/email";
import { contactSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid contact request", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const result = await sendContactNotification(parsed.data);

    if (result.skipped) {
      console.error(`Contact notification skipped. ${result.reason}`);

      return NextResponse.json(
        { error: "Email service is not configured." },
        { status: 503 }
      );
    }

    return NextResponse.json({ ok: true, id: result.id });
  } catch (error) {
    if (error instanceof EmailDeliveryError) {
      console.error(`Contact notification rejected (${error.status}): ${error.message}`);

      return NextResponse.json(
        {
          error: "Unable to send contact inquiry.",
          // The provider message is useful while debugging but should not leak publicly.
          ...(process.env.NODE_ENV === "production" ? {} : { detail: error.message })
        },
        { status: 502 }
      );
    }

    console.error("Contact notification email failed:", error);

    return NextResponse.json(
      { error: "Unable to send contact inquiry." },
      { status: 500 }
    );
  }
}
