import { Link } from "react-router-dom";
import "../css/photobookGrid.css";

const API_URL = "http://localhost:3001";

const getId = (libro) => {
  // Tu backend ya está enviando id (porque lo generás en el controller)
  const id = Number(libro?.id);
  return Number.isFinite(id) && id > 0 ? id : null;
};

const getImg = (libro) => {
  const img = libro?.Imagen;
  if (typeof img === "string" && img.trim() && img !== "null") {
    return `${API_URL}/img/${img}`;
  }
  return `${API_URL}/img/imgplaceholder_sinimg.jpg`;
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
            <Link
              key={id}
              to={`/fotolibro/${id}`}
              className="photobook-card"
            >
              <img
                src={getImg(libro)}
                alt={libro["Título"] || "Fotolibro"}
                onError={(e) => {
                  e.currentTarget.src = `${API_URL}/img/imgplaceholder_sinimg.jpg`;
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