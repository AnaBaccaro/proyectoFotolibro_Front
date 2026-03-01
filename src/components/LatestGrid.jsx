import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../css/latestGrid.css";

const API_URL = "http://localhost:3001";
const PLACEHOLDER = `${API_URL}/img/placeholder.png`;

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
          titulo: pb.Titulo || pb.Título || pb.Titulo || "",
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
          <Link
            key={libro.id}
            to={`/fotolibro/${libro.id}`}
            className="latest-grid-item"
          >
            <img
              src={libro.img}
              alt={libro.titulo || "Fotolibro"}
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = PLACEHOLDER;
              }}
            />
          </Link>
        ))}
      </div>
    </section>
  );
}