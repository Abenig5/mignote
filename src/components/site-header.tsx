"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { siteConfig } from "@/config/site";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Menu", href: "/menu" },
  { label: "Gallery", href: "/gallery" },
  { label: "Book", href: "/booking" },
  { label: "Contact", href: "/contact" }
];

export function SiteHeader() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="topbar" data-open={isOpen} aria-label="Site header">
      <Link className="mark" href="/">
        {siteConfig.name}
      </Link>
      <button
        aria-expanded={isOpen}
        aria-controls="site-navigation"
        aria-label={isOpen ? "Close navigation" : "Open navigation"}
        className="topnav-toggle"
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        {isOpen ? <X aria-hidden="true" size={22} /> : <Menu aria-hidden="true" size={22} />}
      </button>
      <nav className="topnav" id="site-navigation" aria-label="Primary navigation">
        {navLinks.map((link) => {
          const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);

          return (
            <Link
              aria-current={isActive ? "page" : undefined}
              href={link.href}
              key={link.href}
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
