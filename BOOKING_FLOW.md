# Booking Flow

## Customer Flow

1. Customer opens the booking page.
2. Customer submits the booking inquiry form.
3. The client sends the request to `/api/bookings`.
4. The API validates the payload with `bookingSchema` from `src/lib/validation.ts`.
5. Invalid requests return `400` with validation details.
6. Valid requests are saved through `createBooking` in `src/services/booking-service.ts`.
7. Prisma creates a `Booking` record with `PENDING` status.
8. `sendBookingNotification` is called after persistence.
9. The API returns `201` with the created booking.

## Admin Flow

The admin dashboard entry point exists at `/admin`.

Current booking status values are stored as strings in the database, with new records defaulting to `PENDING`. Accept, reject, and status update actions still need dedicated admin API routes and UI controls.

## Data Model

The Prisma `Booking` model stores:

- `id`
- `name`
- `email`
- `phone`
- `eventDate`
- `guestCount`
- `message`
- `status`
- `createdAt`
- `updatedAt`

## Notification Status

`src/lib/email.ts` currently contains a placeholder notification function. It returns `{ delivered: true }` and should be connected to the chosen SMTP or transactional email provider before production use.
