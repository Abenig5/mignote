import { galleryItems } from "@/config/gallery";

export default function GalleryPage() {
  return (
    <main className="page">
      <section className="container">
        <p className="eyebrow">Gallery</p>
        <h1>Recent catered events</h1>
        <div className="grid">
          {galleryItems.map((item) => (
            <article className="card" key={item.title}>
              <h2>{item.title}</h2>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
