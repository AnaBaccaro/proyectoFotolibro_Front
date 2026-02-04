import PhotobookSearch from "./PhotobookSearch";
import "../css/catalogHero.css";

export default function CatalogHero() {
  return (
    <section className="catalog-hero-section">
      <div className="catalog-hero-container">
        <h1 className="catalog-hero-title">CATÁLOGO</h1>

        <p className="catalog-hero-subtitle">
          Plataforma dedicada a la producción, circulación y estudio de
          fotolibros latinoamericanos.
        </p>

        <PhotobookSearch />
      </div>
    </section>
  );
}
