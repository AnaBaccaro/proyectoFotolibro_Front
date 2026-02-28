import { Link } from "react-router-dom";
import "../css/photobookGrid.css";

const API_URL = "http://localhost:3001";

const PLACEHOLDER =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="600" height="800">
      <rect width="100%" height="100%" fill="#e6e6e6"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
            font-family="Arial, Helvetica, sans-serif" font-size="28" fill="#666">
        Sin imagen
      </text>
    </svg>
  `);

const getId = (libro) => {
  const id = Number(libro?.id);
  return Number.isFinite(id) && id > 0 ? id : null;
};

const getImg = (libro) => {
  const img = (libro?.Imagen ?? "").toString().trim();

  if (!img || img.toLowerCase() === "null" || img.toLowerCase() === "undefined") {
    return PLACEHOLDER;
  }

  return `${API_URL}/img/${encodeURIComponent(img)}`;
};

export default function PhotobookGrid({
  libros,
  currentPage,
  totalPages,
  setCurrentPage,
}) {
  if (!libros || libros.length === 0) return null;

  return (
    <>
      <div className="photobook-grid">
        {libros.map((libro) => {
          const id = getId(libro);
          if (!id) return null;

          return (
            <Link key={id} to={`/fotolibro/${id}`} className="photobook-card">
              <img
                src={getImg(libro)}
                alt={libro["Título"] || "Fotolibro"}
                loading="lazy"
                onError={(e) => {
                  const el = e.currentTarget;
                  if (el.dataset.fallback === "1") return;
                  el.dataset.fallback = "1";
                  el.src = PLACEHOLDER;
                }}
              />
            </Link>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="pagination-bar">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ←
          </button>

          <span>
            Página {currentPage} de {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            →
          </button>
        </div>
      )}
    </>
  );
}