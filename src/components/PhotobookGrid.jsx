import { Link } from "react-router-dom";
import "../css/photobookGrid.css";

const API_URL = "http://localhost:3001";

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
          const imageUrl =
            libro.images &&
            libro.images.length > 0 &&
            libro.images[0].image_url
              ? `${API_URL}/${libro.images[0].image_url.replace(/^\//, "")}`
              : "/img/imgplaceholder_sinimg.jpg";

          return (
            <Link
              key={libro.id}
              to={`/fotolibro/${libro.id}`}
              className="photobook-card"
            >
              <img src={imageUrl} alt={libro.title} />
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
