import { getGalleryItems } from "@/services/content-service";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const galleryItems = await getGalleryItems();

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
