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
          <div className="search-wrapper">
            <i className="bi bi-search"></i>
            <input
              type="text"
              className="search-input-custom"
              placeholder="Buscar por título, autor, país, editorial..."
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>

      </div>
    </header>
  );
}
