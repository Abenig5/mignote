import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { getGalleryItems, getSiteContent, getTestimonials } from "@/services/content-service";

export const dynamic = "force-dynamic";

const tasteCards = [
  {
    name: "Ethiopian Dishes",
    description:
      "A generous injera table with slow-simmered wots, spiced lentils, vegetables, and traditional shared service.",
    image: "https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7?auto=format&fit=crop&w=2000&h=2200&q=95"
  },
  {
    name: "Eritrean Dishes",
    description:
      "Bright, aromatic platters with tsebhi, shiro, alicha, timtimo, salads, and classic injera accompaniments.",
    image: "https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=2000&h=2200&q=95"
  },
  {
    name: "European Cuisines",
    description:
      "Comforting European mains, pastas, roasts, salads, and desserts prepared for buffet or plated service.",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=2000&h=2200&q=95"
  }
];

export default async function HomePage() {
  const [siteConfig, galleryItems, testimonials] = await Promise.all([
    getSiteContent(),
    getGalleryItems(),
    getTestimonials()
  ]);
  const featuredGalleryItems = galleryItems.slice(0, 3);
  const featuredTestimonial = testimonials[0];

  return (
    <main className="landing">
      <section
        className="landing-hero"
        style={{ "--hero-image": `url("${siteConfig.hero.image}")` } as CSSProperties}
      >
        <div className="landing-hero__content">
          <div className="landing-hero__brand">{siteConfig.name}</div>
          <p className="landing-kicker">{siteConfig.hero.kicker}</p>
          <h1>{siteConfig.hero.title}</h1>
          <p>{siteConfig.hero.description}</p>
          <div className="landing-actions">
            <Link className="landing-button landing-button--primary" href="/menu">
              Explore Menu
            </Link>
            <Link className="landing-button landing-button--secondary" href="/booking">
              Book Catering
            </Link>
          </div>
        </div>
      </section>

      <section className="story-section">
        <div className="landing-container story-grid">
          <div>
            <p className="section-kicker">{siteConfig.story.kicker}</p>
            <h2>{siteConfig.story.title}</h2>
            {siteConfig.story.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="story-media">
            <Image
              alt="Chef preparing catered plates"
              className="story-image"
              height={720}
              quality={95}
              src={siteConfig.story.image}
              width={600}
            />
            <div className="story-note">
              <p>&quot;Hospitality starts with the way the table makes people feel.&quot;</p>
            </div>
          </div>
        </div>
      </section>

      <section className="taste-section">
        <div className="landing-container">
          <div className="centered-heading">
            <p className="section-kicker">Featured Cuisines</p>
            <h2>Ethiopian Dishes, Eritrean Dishes & European Cuisines</h2>
            <span />
          </div>
          <div className="taste-grid">
            {tasteCards.map((item) => (
              <Link className="taste-card" href="/menu" key={item.name}>
                <div className="taste-card__media">
                  <Image
                    alt={`${item.name} food presentation`}
                    height={1000}
                    quality={95}
                    sizes="(min-width: 900px) 33vw, 100vw"
                    src={item.image}
                    width={760}
                  />
                  <div className="taste-card__overlay">
                    <span>View Menu</span>
                  </div>
                </div>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="gallery-section">
        <div className="landing-container">
          <div className="section__header landing-section-header">
            <div>
              <p className="section-kicker">Recent Setups</p>
              <h2>Event tables designed to feel full, polished, and easy to navigate.</h2>
            </div>
            <Link className="landing-button" href="/gallery">
              View Gallery
            </Link>
          </div>
          <div className="gallery-strip">
            {featuredGalleryItems.map((item) => (
              <article className="gallery-tile" key={item.title}>
                <Image
                  alt={item.title}
                  height={520}
                  sizes="(min-width: 760px) 33vw, 100vw"
                  src={item.image}
                  width={760}
                />
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="quote-section">
        <div className="landing-container">
          <div className="quote-mark">&quot;</div>
          <blockquote>&quot;{featuredTestimonial.quote}&quot;</blockquote>
          <p>
            {featuredTestimonial.name}
            {featuredTestimonial.role ? `, ${featuredTestimonial.role}` : ""}
          </p>
        </div>
      </section>

    </main>
  );
}
