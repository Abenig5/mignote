import { NextResponse } from "next/server";
import { createBooking } from "@/services/booking-service";
import { bookingSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = bookingSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid booking request", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const { booking, notified } = await createBooking(parsed.data);

    return NextResponse.json({ booking, notified }, { status: 201 });
  } catch (error) {
    console.error("Booking creation failed:", error);

    return NextResponse.json(
      { error: "Unable to save booking inquiry." },
      { status: 500 }
    );
  }
}
