import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../css/latestGrid.css";

import { API_URL, IMG_BASE_URL, PLACEHOLDER } from "../config/env";

const getImgUrl = (imgName) => {
  const img = (imgName ?? "").toString().trim();
  if (!img || img.toLowerCase() === "null" || img.toLowerCase() === "undefined") {
    return PLACEHOLDER;
  }
  return `${IMG_BASE_URL}/${encodeURIComponent(img)}`;
};

const hasRealImage = (b) => {
  const img = (b?.Imagen ?? "").toString().trim().toLowerCase();
  return !!img && img !== "null" && img !== "undefined";
};

const getTitle = (b) =>
  ((b?.Titulo || b?.["Título"] || "").toString().trim() || "Fotolibro");

const getAuthor = (b) => {
  const first =
    (b?.NombreFotografe || b?.["Nombre fotografe"] || "")
      .toString()
      .trim();

  const last =
    (b?.ApellidoFotografe || b?.["Apellido fotografe"] || "")
      .toString()
      .trim();

  const full = `${first} ${last}`.trim();
  return full || "-";
};

export default function LatestGrid() {
  const [libros, setLibros] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/fotolibros`)
      .then((res) => res.json())
      .then((data) => {
        const books = Array.isArray(data) ? data : [];

        const latest = books
          .filter(hasRealImage)
          .slice(-3)
          .reverse();

        setLibros(latest);
      });
  }, []);

  if (!libros.length) return null;

  return (
    <section className="latest-grid-section">
      <h2 className="latest-title">ÚLTIMAS INCORPORACIONES</h2>

      <div className="latest-grid-container">
        {libros.map((b) => {
          const title = getTitle(b);
          const author = getAuthor(b);

          return (
            <Link
              key={b.id}
              to={`/fotolibro/${b.id}`}
              className="latest-grid-item hover-card"
            >
              <img
                className="hover-card-img"
                src={getImgUrl(b.Imagen)}
                alt={title}
                loading="lazy"
              />

              <div className="hover-card-overlay">
                <div className="hover-card-center">
                  <div className="hover-card-title">{title}</div>
                </div>

                <div className="hover-card-bottom">
                  <div className="hover-card-author">{author}</div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}