import Link from "next/link";
import { siteConfig } from "@/config/site";

const footerLinks = [
  { label: "Home", href: "/" },
  { label: "Menu", href: "/menu" },
  { label: "Gallery", href: "/gallery" },
  { label: "Booking", href: "/booking" },
  { label: "Contact", href: "/contact" }
];

export function SiteFooter() {
  return (
    <footer className="landing-footer">
      <div className="landing-container footer-grid">
        <div>
          <h2>{siteConfig.name}</h2>
          <p>{siteConfig.tagline}</p>
          <Link href={`mailto:${siteConfig.email}`}>{siteConfig.email}</Link>
        </div>
        <nav aria-label="Footer site links">
          <h3>Explore</h3>
          {footerLinks.map((link) => (
            <Link href={link.href} key={link.href}>
              {link.label}
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
      <p className="copyright">(c) 2026 {siteConfig.name}. All rights reserved.</p>
    </footer>
  );
}
