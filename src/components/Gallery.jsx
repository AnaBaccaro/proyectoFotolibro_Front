import "../css/gallery.css";

export default function Gallery({ title, subtitle, items = [] }) {
  return (
    <section className="gallery-section">
      {/* Título */}
      <h2 className="gallery-title">{title}</h2>

      {/* Línea divisoria */}
      <div className="gallery-divider"></div>

      {/* Subtítulo */}
      <p className="gallery-subtitle">{subtitle}</p>

      {/* Grid */}
      <div className="gallery-grid">
        {items.map((item, index) => (
          <div key={index} className="gallery-item">
            <img src={item.img} alt={item.alt || "Fotolibro"} />
          </div>
        ))}
      </div>
    </section>
  );
}
