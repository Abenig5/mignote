import { useState } from "react";

export function useBookingFormStatus() {
  return useState<"idle" | "submitting" | "sent" | "error">("idle");
}
