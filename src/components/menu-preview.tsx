import Link from "next/link";
import type { SiteMenuItem } from "@/services/content-service";

type MenuPreviewProps = {
  menuItems: SiteMenuItem[];
};

export function MenuPreview({ menuItems }: MenuPreviewProps) {
  // Featured items first so the admin panel's "featured" toggle controls this section.
  const featured = menuItems.filter((item) => item.featured);
  const preview = (featured.length > 0 ? featured : menuItems).slice(0, 3);

  if (preview.length === 0) {
    return null;
  }

  return (
    <section className="section">
      <div className="container">
        <div className="section__header">
          <h2>Featured menu</h2>
          <Link href="/menu">Explore menu</Link>
        </div>
        <div className="grid">
          {preview.map((item) => (
            <article className="card" key={item.id ?? item.name}>
              <h3>{item.name}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
