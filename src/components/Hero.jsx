import PhotobookSearch from "./PhotobookSearch";

export default function Hero({ searchValue, onSearchChange }) {
  return (
    <header className="hero">
      <div className="hero-content">
        <div className="hero-title-group">
          <span className="hero-title hero-thin">PROYECTO</span>
          <span className="hero-title hero-bold">FOTOLIBRO</span>
        </div>

        <h4 className="hero-subtitle">
          Plataforma dedicada a la producción, circulación y estudio de fotolibros latinoamericanos.
        </h4>

        <div className="hero-search">
          <PhotobookSearch
            value={searchValue}
            onChange={onSearchChange}
            placeholder="Buscar por título, autor, país, editorial..."
            showIcon={true}
            wrapperClassName="search-wrapper"
            inputClassName="search-input-custom"
            iconClassName="bi bi-search"
          />
        </div>
      </div>
    </header>
  );
}