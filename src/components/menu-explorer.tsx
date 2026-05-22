"use client";

import Image from "next/image";
import { ArrowRight, Leaf, Star, Utensils } from "lucide-react";
import { useMemo, useState } from "react";
import { menuItems } from "@/config/menu";

const categoryStyles: Record<string, string> = {
  Buffet: "menu-category-badge--primary",
  Plated: "menu-category-badge--primary",
  Reception: "menu-category-badge--green",
  "Family Style": "menu-category-badge--gold",
  "Morning Events": "menu-category-badge--gold",
  "Passed Bites": "menu-category-badge--green",
  Sweets: "menu-category-badge--primary",
  "Plant Forward": "menu-category-badge--green"
};

const detailLabels: Record<string, string> = {
  Buffet: "Guest Favorite",
  Plated: "Elegant",
  Reception: "Easy Flow",
  "Family Style": "Shared",
  "Morning Events": "Fresh",
  "Passed Bites": "Social",
  Sweets: "Finale",
  "Plant Forward": "Vegetarian"
};

export function MenuExplorer() {
  const [activeCategory, setActiveCategory] = useState("All");
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(menuItems.map((item) => item.category)))],
    []
  );
  const filteredItems =
    activeCategory === "All"
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory);

  return (
    <main className="menu-explorer">
      <section className="menu-explorer__toolbar">
        <div className="menu-explorer__intro">
          <p className="eyebrow">Menus</p>
          <h1>Menu Categories</h1>
          <p>
            Browse catering styles by service category, from plated dinners and generous
            buffets to reception bites, brunch tables, desserts, and plant-forward spreads.
          </p>
        </div>
        <div className="menu-filter" aria-label="Menu categories">
          {categories.map((category) => (
            <button
              aria-pressed={activeCategory === category}
              className="menu-filter__chip"
              key={category}
              onClick={() => setActiveCategory(category)}
              type="button"
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      <section className="menu-category-grid" aria-live="polite">
        {filteredItems.map((item) => (
          <article className="menu-category-card" key={item.name}>
            <div className="menu-category-card__media">
              <Image
                alt={`${item.name} food presentation`}
                height={880}
                quality={95}
                sizes="(min-width: 1100px) 33vw, (min-width: 760px) 50vw, 100vw"
                src={item.image}
                width={900}
              />
              <span
                className={`menu-category-badge ${
                  categoryStyles[item.category] ?? "menu-category-badge--primary"
                }`}
              >
                {item.category}
              </span>
            </div>
            <div className="menu-category-card__body">
              <div className="menu-category-card__heading">
                <h2>{item.name}</h2>
                <span>Custom quote</span>
              </div>
              <p>{item.description}</p>
              <div className="menu-category-card__footer">
                <span className="menu-category-card__detail">
                  {item.category === "Plant Forward" ? (
                    <Leaf aria-hidden="true" size={18} />
                  ) : item.category === "Plated" ? (
                    <Star aria-hidden="true" size={18} />
                  ) : (
                    <Utensils aria-hidden="true" size={18} />
                  )}
                  {detailLabels[item.category] ?? "Menu"}
                </span>
                <a className="menu-category-card__link" href="/booking">
                  Details
                  <ArrowRight aria-hidden="true" size={16} />
                </a>
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
