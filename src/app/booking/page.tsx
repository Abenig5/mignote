import { BookingForm } from "@/components/booking-form";

export default function BookingPage() {
  return (
    <main className="page">
      <section className="container narrow">
        <p className="eyebrow">Event inquiry</p>
        <h1>Tell us about your catering needs</h1>
        <BookingForm />
      </section>
    </main>
  );
}
