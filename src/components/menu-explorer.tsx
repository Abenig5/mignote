import Image from "next/image";
import { ArrowRight, Leaf, Star, Utensils } from "lucide-react";
import type { SiteMenuItem } from "@/services/content-service";

type CategoryOption = {
  key: string;
  label: string;
};

const categoryStyles: Record<string, string> = {
  "Ethiopian Dishes": "menu-category-badge--primary",
  "Eritrean Dishes": "menu-category-badge--green",
  "European Cuisines": "menu-category-badge--gold",
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
  "Ethiopian Dishes": "Injera Table",
  "Eritrean Dishes": "Tsebhi & Injera",
  "European Cuisines": "Continental",
  Buffet: "Guest Favorite",
  Plated: "Elegant",
  Reception: "Easy Flow",
  "Family Style": "Shared",
  "Morning Events": "Fresh",
  "Passed Bites": "Social",
  Sweets: "Finale",
  "Plant Forward": "Vegetarian"
};

const cuisineOverviewNames = new Set(["Ethiopian Dishes", "Eritrean Dishes", "European Cuisines"]);

function getCategoryKey(category: string) {
  return category.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function MenuExplorer({
  activeCategory = "all",
  menuItems
}: {
  activeCategory?: string;
  menuItems: SiteMenuItem[];
}) {
  const visibleMenuItems = menuItems.filter((item) => !cuisineOverviewNames.has(item.name));
  const seen = new Set<string>();
  const categories = visibleMenuItems.reduce<CategoryOption[]>(
    (items, item) => {
      const key = getCategoryKey(item.category);

      if (!seen.has(key)) {
        seen.add(key);
        items.push({ key, label: item.category });
      }

      return items;
    },
    [{ key: "all", label: "All" }]
  );
  const activeCategoryKey = getCategoryKey(activeCategory);
  const selectedCategory = categories.some((category) => category.key === activeCategoryKey)
    ? activeCategoryKey
    : "all";
  const filteredItems =
    selectedCategory === "all"
      ? visibleMenuItems
      : visibleMenuItems.filter((item) => getCategoryKey(item.category) === selectedCategory);

  return (
    <main className="menu-explorer">
      <section className="menu-explorer__toolbar">
        <div className="menu-explorer__intro">
          <p className="eyebrow">Menus</p>
          <h1>Menu Categories</h1>
          <p>
            Browse Ethiopian dishes, Eritrean dishes, and European cuisines for buffet,
            plated, family-style, and reception service.
          </p>
        </div>
        <div className="menu-filter" aria-label="Menu categories">
          {categories.map((category) => (
            <a
              aria-current={selectedCategory === category.key ? "true" : undefined}
              className="menu-filter__chip"
              href={category.key === "all" ? "/menu" : `/menu?category=${category.key}`}
              key={category.key}
            >
              {category.label}
            </a>
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
                unoptimized={item.image.startsWith("data:")}
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
                  Book Now
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
