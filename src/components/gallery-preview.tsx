import Link from "next/link";
import { galleryItems } from "@/config/gallery";

export function GalleryPreview() {
  return (
    <section className="section">
      <div className="container">
        <div className="section__header">
          <h2>Gallery</h2>
          <Link href="/gallery">View all</Link>
        </div>
        <div className="grid">
          {galleryItems.slice(0, 3).map((item) => (
            <article className="card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
