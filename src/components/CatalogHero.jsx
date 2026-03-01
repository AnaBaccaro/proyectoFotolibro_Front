import "../css/catalogHero.css";
import PhotobookSearch from "./PhotobookSearch";

export default function CatalogHero() {
  return (
    <section className="catalog-hero">
      <div className="catalog-hero-inner">
        <h1>CATÁLOGO</h1>

        <p>
          Plataforma dedicada a la producción, circulación y estudio de
          fotolibros latinoamericanos.
        </p>

        <div className="catalog-hero-search">
          <PhotobookSearch />
        </div>
      </div>
    </section>
  );
}