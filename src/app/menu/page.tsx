import { menuItems } from "@/config/menu";

export default function MenuPage() {
  return (
    <main className="page">
      <section className="container">
        <p className="eyebrow">Menus</p>
        <h1>Seasonal catering selections</h1>
        <div className="grid">
          {menuItems.map((item) => (
            <article className="card" key={item.name}>
              <h2>{item.name}</h2>
              <p>{item.description}</p>
              <span>{item.category}</span>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
