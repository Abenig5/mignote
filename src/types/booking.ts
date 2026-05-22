import type { z } from "zod";
import { bookingSchema } from "@/lib/validation";

export type BookingInput = z.infer<typeof bookingSchema>;

export type BookingStatus = "PENDING" | "ACCEPTED" | "REJECTED";
