import Link from "next/link";
import { menuItems } from "@/config/menu";

export function MenuPreview() {
  return (
    <section className="section">
      <div className="container">
        <div className="section__header">
          <h2>Featured menu</h2>
          <Link href="/menu">Explore menu</Link>
        </div>
        <div className="grid">
          {menuItems.slice(0, 3).map((item) => (
            <article className="card" key={item.name}>
              <h3>{item.name}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
