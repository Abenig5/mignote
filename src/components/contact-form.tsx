"use client";

import { CheckCircle2 } from "lucide-react";
import { FormEvent, useRef, useState } from "react";

type Notification = {
  tone: "success" | "warning" | "error";
  message: string;
};

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [notification, setNotification] = useState<Notification | null>(null);
  const hasSentMessage = useRef(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (hasSentMessage.current) {
      setNotification({ tone: "warning", message: "Message already sent." });
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      message: String(formData.get("message") ?? "")
    };

    hasSentMessage.current = true;
    setStatus("sending");
    setNotification(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setStatus("sent");
        setNotification({ tone: "success", message: "Message sent." });
        form.reset();
        return;
      }

      hasSentMessage.current = false;
      setStatus("error");
      setNotification({ tone: "error", message: "Unable to send message. Please try again." });
    } catch {
      hasSentMessage.current = false;
      setStatus("error");
      setNotification({ tone: "error", message: "Unable to send message. Please try again." });
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="contact-form-pair">
        <label>
          <span>Full Name</span>
          <input name="name" placeholder="Your name" required type="text" />
        </label>
        <label>
          <span>Email Address</span>
          <input name="email" placeholder="you@example.com" required type="email" />
        </label>
      </div>
      <label>
        <span>Your Message</span>
        <textarea
          name="message"
          placeholder="Tell us about the date, guest count, location, and menu direction..."
          required
          rows={5}
        />
      </label>
      <button className="contact-submit" disabled={status === "sending"} type="submit">
        {status === "sending" ? "Sending..." : "Submit Inquiry"}
      </button>
      {notification && (
        <div
          className={`contact-notification contact-notification--${notification.tone}`}
          role={notification.tone === "error" ? "alert" : "status"}
        >
          <CheckCircle2 aria-hidden="true" size={20} />
          <p>{notification.message}</p>
        </div>
      )}
    </form>
  );
}
