import { Link } from "react-router-dom";
import "../css/photobookGrid.css";

const API_URL = "http://localhost:3001";
const PLACEHOLDER = `${API_URL}/img/placeholder.png`;

const getId = (libro) => {
  const id = Number(libro?.id);
  return Number.isFinite(id) && id > 0 ? id : null;
};

const getTitle = (libro) => {
  return (
    libro?.Titulo ||
    libro?.["Título"] ||
    libro?.["Titulo"] ||
    "Fotolibro"
  );
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
                alt={getTitle(libro)}
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