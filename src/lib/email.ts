import type { BookingInput } from "@/types/booking";

export async function sendBookingNotification(_booking: BookingInput) {
  // Wire this to the chosen SMTP provider when credentials are available.
  return { delivered: true };
}
