import Link from "next/link";

const dishes = [
  {
    name: "Ethiopian Sott",
    description: "Spicy, communal, and deeply comforting heritage dishes.",
    image: "https://images.unsplash.com/photo-1613743990305-736c1f4f1596?auto=format&fit=crop&w=900&q=85"
  },
  {
    name: "Asian Precision",
    description: "Minimalist fusion focused on purity of flavor and texture.",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=900&q=85"
  },
  {
    name: "European Elegance",
    description: "Classic techniques meeting modern ingredient curation.",
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=85"
  }
];

const footerLinks = ["Heritage", "Ethiopian Heritage", "Asian Fusion", "European Classics"];
const companyLinks = ["About Us", "Testimonials", "Careers"];

export default function HomePage() {
  return (
    <main className="landing">
      <header className="topbar" aria-label="Site header">
        <Link className="mark" href="/">
          Global Harvest
        </Link>
        <button className="menu-button" aria-label="Open navigation" type="button">
          <span />
          <span />
        </button>
      </header>

      <section className="landing-hero">
        <div className="landing-hero__overlay" />
        <div className="landing-hero__content">
          <p className="landing-kicker">Global</p>
          <h1>
            Global
            <br />
            Heritage
            <br />
            Gourmet
          </h1>
          <p>
            A curated culinary trip through Ethiopian, Asian precision, and European elegance.
          </p>
          <div className="landing-actions">
            <Link className="landing-button landing-button--primary" href="/menu">
              Explore Our Menu
            </Link>
            <Link className="landing-button landing-button--secondary" href="/booking">
              Our Story
            </Link>
          </div>
        </div>
      </section>

      <section className="story-section">
        <div className="landing-container story-grid">
          <div>
            <p className="section-kicker">Our Heritage</p>
            <h2>A Fusion of Cultures, A Celebration of Taste</h2>
            <p>
              Global Harvest Catering was born from a passion for the world&apos;s most
              storied culinary traditions. We bridge the distance between Addis Ababa&apos;s
              communal dining, Tokyo&apos;s meticulous artistry, and Paris&apos;s timeless technique.
            </p>
            <p>
              Every plate we serve is a testament to cultural respect and gastronomic
              innovation, crafted by chefs who honor their roots while pushing the
              boundaries of flavor.
            </p>
          </div>
          <img
            alt="Chef plating a refined dish"
            className="story-image"
            src="https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=900&q=85"
          />
        </div>
      </section>

      <section className="taste-section">
        <div className="landing-container">
          <div className="centered-heading">
            <h2>Taste the World</h2>
            <span />
          </div>
          <div className="dish-list">
            {dishes.map((dish) => (
              <article className="dish-card" key={dish.name}>
                <img alt="" src={dish.image} />
                <h3>{dish.name}</h3>
                <p>{dish.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="quote-section">
        <div className="landing-container">
          <div className="quote-mark">99</div>
          <blockquote>
            &quot;Global Harvest transformed our gala into an international odyssey. The
            transition between spice-toned Ethiopian bites and delicate Asian fusion was
            seamless and breathtaking.&quot;
          </blockquote>
          <p>- Elena Wong, Cultural Arts Director</p>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="landing-container footer-grid">
          <div>
            <h2>Global Harvest</h2>
            <p>
              A Heritage Gastronomy Experience. Crafting memories through the universal
              language of flavor.
            </p>
          </div>
          <nav aria-label="Footer heritage links">
            <h3>Heritage</h3>
            {footerLinks.map((link) => (
              <Link href="/menu" key={link}>
                {link}
              </Link>
            ))}
          </nav>
          <nav aria-label="Footer company links">
            <h3>Company</h3>
            {companyLinks.map((link) => (
              <Link href="/contact" key={link}>
                {link}
              </Link>
            ))}
          </nav>
          <form className="subscribe-form">
            <h3>Newsletter</h3>
            <label>
              <span>Email address</span>
              <input type="email" placeholder="Email address" />
            </label>
            <button type="submit">Subscribe</button>
          </form>
        </div>
        <p className="copyright">© 2026 Global Harvest Catering. All rights reserved.</p>
      </footer>
    </main>
  );
}
