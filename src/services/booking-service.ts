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

  try {
    await sendBookingNotification(input);
  } catch (error) {
    console.error("Booking notification email failed:", error);
  }

  return booking;
}
