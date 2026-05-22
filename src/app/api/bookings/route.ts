import { NextResponse } from "next/server";
import { createBooking } from "@/services/booking-service";
import { bookingSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = bookingSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid booking request", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const booking = await createBooking(parsed.data);

  return NextResponse.json({ booking }, { status: 201 });
}
