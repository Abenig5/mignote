import { testimonials } from "@/config/testimonials";

export function Testimonials() {
  return (
    <section className="section">
      <div className="container">
        <h2>Testimonials</h2>
        <div className="grid">
          {testimonials.map((testimonial) => (
            <figure className="card" key={testimonial.name}>
              <blockquote>{testimonial.quote}</blockquote>
              <figcaption>{testimonial.name}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
