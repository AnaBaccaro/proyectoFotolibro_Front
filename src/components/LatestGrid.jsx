import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../css/latestGrid.css";

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

const getImgUrl = (imgName) => {
  const img = (imgName ?? "").toString().trim();

  if (!img || img.toLowerCase() === "null" || img.toLowerCase() === "undefined") {
    return PLACEHOLDER;
  }

  return `${API_URL}/img/${encodeURIComponent(img)}`;
};

export default function LatestGrid() {
  const [libros, setLibros] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/fotolibros/latest`)
      .then((res) => res.json())
      .then((data) => {
        const mapped = (Array.isArray(data) ? data : []).map((pb) => ({
          id: pb.id,
          titulo: pb.Título,
          img: getImgUrl(pb.Imagen),
        }));

        setLibros(mapped);
      });
  }, []);

  if (!libros.length) return null;

  return (
    <section className="latest-grid-section">
      <h2 className="latest-title">ÚLTIMAS INCORPORACIONES</h2>

      <p className="latest-subtitle">
        Selección especial de fotolibros latinoamericanos que destacan por su
        relevancia editorial y artística.
      </p>

      <div className="latest-grid-container">
        {libros.map((libro) => (
          <Link key={libro.id} to={`/fotolibro/${libro.id}`} className="latest-grid-item">
            <img
              src={libro.img}
              alt={libro.titulo || "Fotolibro"}
              loading="lazy"
              onError={(e) => {
                const el = e.currentTarget;
                if (el.dataset.fallback === "1") return;
                el.dataset.fallback = "1";
                el.src = PLACEHOLDER;
              }}
            />
          </Link>
        ))}
      </div>
    </section>
  );
}