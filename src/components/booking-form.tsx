"use client";

import { FormEvent, useState } from "react";

const initialState = {
  name: "",
  email: "",
  phone: "",
  eventDate: "",
  guestCount: "",
  message: ""
};

export function BookingForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "sent" | "error">("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    const response = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    setStatus(response.ok ? "sent" : "error");
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <label>
        Name
        <input name="name" required defaultValue={initialState.name} />
      </label>
      <label>
        Email
        <input name="email" required type="email" defaultValue={initialState.email} />
      </label>
      <label>
        Phone
        <input name="phone" defaultValue={initialState.phone} />
      </label>
      <label>
        Event date
        <input name="eventDate" required type="date" defaultValue={initialState.eventDate} />
      </label>
      <label>
        Guest count
        <input name="guestCount" required type="number" min="1" defaultValue={initialState.guestCount} />
      </label>
      <label>
        Message
        <textarea name="message" rows={5} defaultValue={initialState.message} />
      </label>
      <button className="button" disabled={status === "submitting"} type="submit">
        {status === "submitting" ? "Sending..." : "Submit inquiry"}
      </button>
      {status === "sent" && <p role="status">Inquiry received.</p>}
      {status === "error" && <p role="alert">Please check the form and try again.</p>}
    </form>
  );
}
