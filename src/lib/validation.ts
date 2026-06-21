import { z } from "zod";

export const bookingSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  eventDate: z.string().min(1),
  guestCount: z.coerce.number().int().positive(),
  message: z.string().optional()
});

export const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(5)
});
