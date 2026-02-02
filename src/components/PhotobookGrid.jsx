import React from "react";
import "../css/photobookGrid.css";

const API_URL = "http://localhost:3001";

export default function PhotobookGrid({
  libros,
  currentPage,
  totalPages,
  handlePageChange,
}) {
  return (
    <>
      {/* Grilla */}
      <div className="photobook-grid">
        {libros.map((libro) => (
          <div key={libro.id} className="photobook-item">
            <img
              src={
                libro.images?.[0]?.image_url
                  ? `${API_URL}/${libro.images[0].image_url.replace(/^\//, "")}`
                  : "/img/fallback.jpg"
              }
              alt={libro.title}
            />
            <div className="photobook-hover">
              <h3>{libro.title}</h3>
              <p>
                {libro.author_name} {libro.author_lastname}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Paginación */}
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &lt; Anterior
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={currentPage === i + 1 ? "active" : ""}
            onClick={() => handlePageChange(i + 1)}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Siguiente &gt;
        </button>
      </div>
    </>
  );
}
