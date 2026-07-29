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
9. The API returns `201` with the created booking and a `notified` flag.

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

`src/lib/email.ts` sends notifications through the Resend HTTP API. See the Email Notifications
section of `README.md` for the required environment variables and the Resend sandbox restrictions.

Notification outcomes:

- Delivered: `createBooking` returns `notified: true` and the form shows a success message.
- Skipped, because email environment variables are missing: the missing names are logged,
  `notified` is `false`, and the form shows a warning.
- Rejected by Resend, or the API is unreachable: the error is logged, `notified` is `false`, and
  the form shows a warning.

A notification failure never fails the booking. The record is already persisted before the email
is attempted, so the API still returns `201`. A database failure returns `500` with the cause
logged server side.
