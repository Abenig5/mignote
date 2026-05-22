import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { galleryItems } from "@/config/gallery";
import { menuItems } from "@/config/menu";
import { siteConfig } from "@/config/site";
import { testimonials } from "@/config/testimonials";

const featuredGalleryItems = galleryItems.slice(0, 3);
const featuredTestimonial = testimonials[0];
const tasteCards = menuItems.slice(0, 3);

export default function HomePage() {
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
            <p className="section-kicker">Featured Menus</p>
            <h2>Taste the World</h2>
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
            {"role" in featuredTestimonial ? `, ${featuredTestimonial.role}` : ""}
          </p>
        </div>
      </section>

    </main>
  );
}
