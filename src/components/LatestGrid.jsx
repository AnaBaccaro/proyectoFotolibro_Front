import { useEffect, useState } from "react";
import "../css/latestGrid.css";

const API_URL = "http://localhost:3001";

export default function LatestGrid() {
  const [libros, setLibros] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/fotolibros/latest`)
      .then((res) => res.json())
      .then((data) => {
        const mapped = data.map((pb, index) => ({
          id: index, // temporal hasta DB
          titulo: pb.Título,
          img: `${API_URL}/img/${pb.Imagen}`,
        }));

        setLibros(mapped);
      })
      .catch((err) => {
        console.error("ERROR FETCH LATEST:", err);
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
          <div key={libro.id} className="latest-grid-item">
            <img
              src={libro.img}
              alt={libro.titulo}
              onError={(e) => {
                e.target.src = `${API_URL}/img/fallback.jpg`;
              }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
