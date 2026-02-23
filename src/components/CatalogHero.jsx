import "../css/catalogHero.css";

export default function CatalogHero() {
  return (
    <section className="catalog-hero">
      <div className="catalog-hero-inner">
        <h1>CATÁLOGO</h1>

        <p>
          Plataforma dedicada a la producción, circulación y estudio de
          fotolibros latinoamericanos.
        </p>

        <input
          type="text"
          placeholder="Buscar por título, autor, país, editorial…"
        />
      </div>
    </section>
  );
}
