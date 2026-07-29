import { sendBookingNotification } from "@/lib/email";
import { prisma } from "@/lib/db";
import type { BookingInput } from "@/types/booking";

export async function createBooking(input: BookingInput) {
  const booking = await prisma.booking.create({
    data: {
      name: input.name,
      email: input.email,
      phone: input.phone,
      eventDate: new Date(input.eventDate),
      guestCount: input.guestCount,
      message: input.message,
      status: "PENDING"
    }
  });

  // The booking is already persisted, so a failed notification must not fail
  // the request. It is reported back so the caller can surface it.
  let notified = false;

  try {
    const result = await sendBookingNotification(input);

    notified = result.delivered;

    if (result.skipped) {
      console.error(`Booking notification skipped. ${result.reason}`);
    }
  } catch (error) {
    console.error("Booking notification email failed:", error);
  }

  return { booking, notified };
}
