import type { CSSProperties } from "react";
import Image from "next/image";
import { Mail, MapPin, Menu as MenuIcon, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { getSiteContent } from "@/services/content-service";

const contactHeroImage =
  "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=2200&q=95";
const studioImage =
  "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1800&q=95";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const siteConfig = await getSiteContent();

  return (
    <main className="contact-page">
      <section
        className="contact-hero"
        style={{ "--contact-hero-image": `url("${contactHeroImage}")` } as CSSProperties}
      >
        <div className="contact-hero__content">
          <p className="eyebrow">Personalized Catering</p>
          <h1>
            Begin the <span>Conversation</span>
          </h1>
          <p>
            Whether you are planning an intimate dinner or a full celebration, we translate
            your vision into a generous, polished catering experience.
          </p>
        </div>
      </section>

      <section className="contact-grid-section">
        <div className="contact-grid">
          <section className="contact-card contact-form-card">
            <h2>Contact Us</h2>
            <ContactForm />
          </section>

          <aside className="contact-side">
            <section className="contact-direct">
              <h2>Direct Concierge</h2>
              <a href={`mailto:${siteConfig.email}`}>
                <Mail aria-hidden="true" size={22} />
                {siteConfig.email}
              </a>
              <a href="tel:+15550198724">
                <Phone aria-hidden="true" size={22} />
                +1 (555) 019-8724
              </a>
            </section>

            <section className="contact-values">
              <p className="eyebrow">Mignote Values</p>
              <ul>
                <li>
                  <span />
                  <div>
                    <h3>Guest-Centered Planning</h3>
                    <p>Menus and service rhythms shaped around the way your guests will gather.</p>
                  </div>
                </li>
                <li>
                  <span />
                  <div>
                    <h3>Calm Service</h3>
                    <p>Clear planning, practical timelines, and a polished team on event day.</p>
                  </div>
                </li>
                <li>
                  <span />
                  <div>
                    <h3>Seasonal Generosity</h3>
                    <p>Food that feels abundant, balanced, and easy for every guest to enjoy.</p>
                  </div>
                </li>
              </ul>
            </section>
          </aside>
        </div>
      </section>

      <section className="contact-quote">
        <MenuIcon aria-hidden="true" size={42} />
        <blockquote>
          &quot;Food is one of the clearest ways to make people feel welcomed, remembered,
          and cared for.&quot;
        </blockquote>
        <div>
          <span />
          <p>The Mignote Approach</p>
          <span />
        </div>
      </section>

      <section className="contact-location">
        <div>
          <MapPin aria-hidden="true" size={52} />
          <h2>The Mignote Studio</h2>
          <p>Available for private events, weddings, and corporate catering consultations.</p>
        </div>
        <Image
          alt="Modern catering studio kitchen"
          height={700}
          quality={95}
          sizes="(min-width: 760px) 50vw, 100vw"
          src={studioImage}
          width={900}
        />
      </section>
    </main>
  );
}
