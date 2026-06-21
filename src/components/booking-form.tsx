"use client";

import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChefHat,
  Globe2,
  Info,
  Leaf,
  MapPin,
  ShieldCheck,
  Star,
  Users,
  Utensils
} from "lucide-react";
import { FormEvent, useRef, useState } from "react";

const cuisineOptions = ["Ethiopian", "Eritrean", "European"];
const dietaryOptions = ["Vegan", "Gluten-Free", "Halal", "Nut-Free", "Kosher"];
const serviceStyles = [
  { label: "Buffet", icon: Utensils },
  { label: "Plated", icon: ChefHat },
  { label: "Family Style", icon: Users }
];
const bookingImage =
  "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1800&h=2200&q=95";
const finalImage =
  "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1800&h=2200&q=95";

type BookingDraft = {
  eventType?: string;
  guestCount?: string;
  eventDate?: string;
  cuisinePreference?: string[];
  venue?: string;
  serviceStyle?: string;
  dietaryRequirements?: string[];
  dishRequests?: string;
};

export function BookingForm() {
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<BookingDraft>({});
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "submitting" | "sent" | "error">("idle");
  const [notification, setNotification] = useState<
    { tone: "success" | "warning" | "error"; message: string } | null
  >(null);
  const hasSubmittedInquiry = useRef(false);

  function handleStepOneSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setDraft((current) => ({
      ...current,
      eventType: String(formData.get("eventType") ?? ""),
      guestCount: String(formData.get("guestCount") ?? ""),
      eventDate: String(formData.get("eventDate") ?? ""),
      cuisinePreference: selectedCuisines
    }));
    setStatus("idle");
    setNotification(null);
    setStep(2);
  }

  function handleStepTwoSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setDraft((current) => ({
      ...current,
      venue: String(formData.get("venue") ?? ""),
      serviceStyle: String(formData.get("serviceStyle") ?? ""),
      dietaryRequirements: selectedDietary,
      dishRequests: String(formData.get("dishRequests") ?? "")
    }));
    setStatus("idle");
    setNotification(null);
    setStep(3);
  }

  async function handleFinalSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (hasSubmittedInquiry.current) {
      setNotification({ tone: "warning", message: "Inquiry already submitted." });
      return;
    }

    hasSubmittedInquiry.current = true;
    setStatus("submitting");
    setNotification(null);

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      eventDate: draft.eventDate ?? "",
      guestCount: draft.guestCount ?? "",
      message: [
        `Event type: ${draft.eventType ?? "Not specified"}`,
        `Cuisine preferences: ${(draft.cuisinePreference ?? []).join(", ") || "Not specified"}`,
        `Venue: ${draft.venue ?? "Not specified"}`,
        `Service style: ${draft.serviceStyle ?? "Not specified"}`,
        `Dietary requirements: ${(draft.dietaryRequirements ?? []).join(", ") || "Not specified"}`,
        `Dish requests: ${draft.dishRequests || "None"}`,
        `Referral source: ${String(formData.get("source") ?? "Not specified")}`,
        `Additional notes: ${String(formData.get("notes") ?? "None")}`
      ].join("\n")
    };

    const response = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      setStatus("sent");
      setNotification({ tone: "success", message: "Inquiry received." });
      return;
    }

    hasSubmittedInquiry.current = false;
    setStatus("error");
    setNotification({ tone: "error", message: "Please check the form and try again." });
  }

  function toggleSelected(value: string, setter: (update: (current: string[]) => string[]) => void) {
    setter((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value]
    );
  }

  return (
    <div className={`booking-flow ${step === 3 ? "booking-flow--final" : ""}`}>
      <section className="booking-flow__main">
        <div className="booking-progress" aria-label="Booking progress">
          <div className="booking-progress__meta">
            <span>Step {step} of 3</span>
            <span>
              {step === 1
                ? "Event Essentials"
                : step === 2
                  ? "Event Details & Logistics"
                  : "Final Confirmation"}
            </span>
          </div>
          <div className="booking-progress__track">
            <span style={{ width: `${(step / 3) * 100}%` }} />
          </div>
        </div>

        {step === 1 && (
          <>
            <div className="booking-heading">
              <p className="eyebrow">Event inquiry</p>
              <h1>Plan Your Gathering</h1>
              <p>
                Begin with the essentials so we can shape a catering experience around
                your guest count, service style, and preferred menu direction.
              </p>
            </div>

            <form className="booking-step-form" onSubmit={handleStepOneSubmit}>
              <label className="booking-field">
                <span>Event Type</span>
                <div className="booking-input-wrap">
                  <select name="eventType" required defaultValue="">
                    <option value="" disabled>
                      Select event type
                    </option>
                    <option>Wedding</option>
                    <option>Corporate</option>
                    <option>Private Dinner</option>
                    <option>Reception</option>
                    <option>Other</option>
                  </select>
                  <ChevronDown aria-hidden="true" size={20} />
                </div>
              </label>

              <div className="booking-field-grid">
                <label className="booking-field">
                  <span>Estimated Guest Count</span>
                  <div className="booking-input-wrap">
                    <input name="guestCount" min="1" placeholder="e.g. 50" required type="number" />
                    <Users aria-hidden="true" size={20} />
                  </div>
                </label>
                <label className="booking-field">
                  <span>Event Date</span>
                  <div className="booking-input-wrap">
                    <input name="eventDate" required type="date" />
                    <CalendarDays aria-hidden="true" size={20} />
                  </div>
                </label>
              </div>

              <fieldset className="booking-cuisine">
                <legend>Cuisine Preference</legend>
                <div>
                  {cuisineOptions.map((cuisine) => (
                    <button
                      aria-pressed={selectedCuisines.includes(cuisine)}
                      className="booking-cuisine__chip"
                      key={cuisine}
                      onClick={() => toggleSelected(cuisine, setSelectedCuisines)}
                      type="button"
                    >
                      {cuisine}
                    </button>
                  ))}
                </div>
                {selectedCuisines.map((cuisine) => (
                  <input key={cuisine} name="cuisinePreference" type="hidden" value={cuisine} />
                ))}
              </fieldset>

              <div className="booking-actions">
                <button className="booking-next" type="submit">
                  Next Step: Details
                  <ArrowRight aria-hidden="true" size={16} />
                </button>
              </div>
            </form>
          </>
        )}

        {step === 2 && (
          <div className="booking-details-panel">
            <div className="booking-heading">
              <p className="eyebrow">Event details</p>
              <h1>Tell Us More</h1>
              <p>
                Share the logistics and service preferences that help us plan staffing,
                timing, and menu adjustments with more precision.
              </p>
            </div>

            <form className="booking-step-form" onSubmit={handleStepTwoSubmit}>
              <label className="booking-field booking-field--underline">
                <span>Event Location / Venue</span>
                <div className="booking-input-wrap">
                  <input name="venue" placeholder="Enter venue name or address" required type="text" />
                  <MapPin aria-hidden="true" size={20} />
                </div>
              </label>

              <fieldset className="booking-choice-group">
                <legend>Service Style</legend>
                <div className="booking-service-grid">
                  {serviceStyles.map(({ label, icon: Icon }, index) => (
                    <label className="booking-service-card" key={label}>
                      <input defaultChecked={index === 0} name="serviceStyle" type="radio" value={label} />
                      <span>
                        <Icon aria-hidden="true" size={30} />
                        {label}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <fieldset className="booking-cuisine">
                <legend>Dietary Requirements</legend>
                <div>
                  {dietaryOptions.map((requirement) => (
                    <button
                      aria-pressed={selectedDietary.includes(requirement)}
                      className="booking-cuisine__chip"
                      key={requirement}
                      onClick={() => toggleSelected(requirement, setSelectedDietary)}
                      type="button"
                    >
                      {requirement}
                    </button>
                  ))}
                </div>
                {selectedDietary.map((requirement) => (
                  <input key={requirement} name="dietaryRequirements" type="hidden" value={requirement} />
                ))}
              </fieldset>

              <label className="booking-field">
                <span>Specific Dish Requests</span>
                <textarea
                  name="dishRequests"
                  placeholder="Mention any specific dishes, family traditions, or dietary details..."
                  rows={4}
                />
              </label>

              <div className="booking-nav-actions">
                <button className="booking-back" onClick={() => setStep(1)} type="button">
                  <ArrowLeft aria-hidden="true" size={16} />
                  Back
                </button>
                <button className="booking-next booking-next--round" type="submit">
                  Next Step: Contact Info
                  <ArrowRight aria-hidden="true" size={16} />
                </button>
              </div>

            </form>
          </div>
        )}

        {step === 3 && (
          <div className="booking-final-panel">
            <div className="booking-heading">
              <p className="eyebrow">Final confirmation</p>
              <h1>The Finishing Touch</h1>
              <p>
                We&apos;re nearly there. Share your contact information so our team
                can begin crafting your custom proposal.
              </p>
            </div>

            <form className="booking-step-form" onSubmit={handleFinalSubmit}>
              <div className="booking-field-grid">
                <label className="booking-field">
                  <span>Full Name</span>
                  <input name="name" placeholder="Elias Thorne" required type="text" />
                </label>
                <label className="booking-field">
                  <span>Email Address</span>
                  <input name="email" placeholder="elias@example.com" required type="email" />
                </label>
              </div>
              <div className="booking-field-grid">
                <label className="booking-field">
                  <span>Phone Number</span>
                  <input name="phone" placeholder="+1 (555) 000-0000" type="tel" />
                </label>
                <label className="booking-field">
                  <span>How did you hear about us?</span>
                  <div className="booking-input-wrap">
                    <select name="source" defaultValue="">
                      <option value="" disabled>
                        Select an option
                      </option>
                      <option>Social Media</option>
                      <option>Word of Mouth / Referral</option>
                      <option>Press or Publication</option>
                      <option>Attended a Past Event</option>
                      <option>Other</option>
                    </select>
                    <ChevronDown aria-hidden="true" size={20} />
                  </div>
                </label>
              </div>
              <label className="booking-field">
                <span>Additional Notes</span>
                <textarea
                  name="notes"
                  placeholder="Tell us more about the atmosphere or any unique requirements..."
                  rows={4}
                />
              </label>

              <div className="booking-final-actions">
                <button className="booking-back" onClick={() => setStep(2)} type="button">
                  <ArrowLeft aria-hidden="true" size={16} />
                  Back
                </button>
                <button className="booking-next booking-next--round" disabled={status === "submitting"} type="submit">
                  {status === "submitting" ? "Submitting..." : "Submit Inquiry"}
                </button>
                <div className="booking-secure-note">
                  <ShieldCheck aria-hidden="true" size={20} />
                  <p>Our team will respond within 24 hours.</p>
                </div>
              </div>

              {notification && (
                <div
                  className={`booking-notification booking-notification--${notification.tone}`}
                  role={notification.tone === "error" ? "alert" : "status"}
                >
                  <CheckCircle2 aria-hidden="true" size={20} />
                  <p>{notification.message}</p>
                </div>
              )}
            </form>

            <div className="booking-trust">
              <span>
                <Globe2 aria-hidden="true" size={18} />
                Global Traditions
              </span>
              <span>
                <Leaf aria-hidden="true" size={18} />
                Seasonal Sourcing
              </span>
              <span>
                <Star aria-hidden="true" size={18} />
                Custom Planning
              </span>
            </div>
          </div>
        )}
      </section>

      <aside className="booking-aside" aria-label="Booking service highlights">
        <div className="booking-aside__image">
          <Image
            alt="Chef-curated catering table with plated food"
            height={1100}
            quality={95}
            sizes="(min-width: 1024px) 40vw, 100vw"
            src={step === 3 ? finalImage : bookingImage}
            width={900}
          />
          <div>
            <h2>
              {step === 1
                ? "\"Hospitality begins with the right rhythm.\""
                : step === 2
                  ? "Heritage Meets Precision"
                  : "Curated with precision, served with heart."}
            </h2>
            <p>
              {step === 1
                ? "Mignote event planning"
                : step === 2
                  ? "Every detail supports the story of your gathering."
                  : "Final details help us tailor your proposal."}
            </p>
          </div>
        </div>
        {step === 1 ? (
          <div className="booking-aside__stats">
            <div>
              <ChefHat aria-hidden="true" size={22} />
              <p>Chef-Curated</p>
              <strong>Seasonal Menus</strong>
            </div>
            <div>
              <CheckCircle2 aria-hidden="true" size={22} />
              <p>Service</p>
              <strong>Full Planning</strong>
            </div>
            <div>
              <Utensils aria-hidden="true" size={22} />
              <p>Formats</p>
              <strong>Buffet to Plated</strong>
            </div>
          </div>
        ) : step === 2 ? (
          <div className="booking-tip">
            <Info aria-hidden="true" size={22} />
            <div>
              <p>Catering Tip</p>
              <span>
                Family Style service often creates the warmest guest interaction for
                shared menus and mixed dietary needs.
              </span>
            </div>
          </div>
        ) : (
          <div className="booking-promise">
            <h3>Our Promise</h3>
            <p>
              Every Mignote event is planned with care. These final details help
              our team tailor a proposal that reflects your timing, guests, and table.
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}
