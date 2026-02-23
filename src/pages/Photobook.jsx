import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "../css/photobook.css";

const API_URL = "http://localhost:3001";

export default function Photobook() {
  const { id } = useParams();

  const [book, setBook] = useState(null);
  const [related, setRelated] = useState([]);

  // ---------- BOOK BY ID ----------
  useEffect(() => {
    if (!id) return;

    fetch(`${API_URL}/fotolibros/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Libro no encontrado");
        return res.json();
      })
      .then((data) => setBook(data))
      .catch((err) => console.error(err));
  }, [id]);

  // ---------- RELATED ----------
  useEffect(() => {
    if (!book) return;

    fetch(`${API_URL}/fotolibros`)
      .then((res) => res.json())
      .then((allBooks) => {
        const similares = allBooks
          .filter(
            (b) =>
              b.id !== book.id &&
              b.country === book.country &&
              b.image
          )
          .slice(0, 5);

        setRelated(similares);
      });
  }, [book]);

  if (!book) return null;

  return (
    <>
      <section className="photobook-detail-hero">
        <div className="photobook-detail-container">
          <div className="photobook-detail-image">
            <img
              src={`${API_URL}/img/${book.image}`}
              alt={book.title || "Fotolibro"}
            />
          </div>

          <div className="photobook-detail-info">
            <h1 className="photobook-title">
              {book.title}
            </h1>

            <h2 className="photobook-author">
              {book.author}
            </h2>

            <p className="photobook-description">
              {book.description || "—"}
            </p>

            <div className="photobook-meta">
              <div>
                <span className="meta-label">Editorial</span>
                <span>{book.editorial || "—"}</span>
              </div>

              <div>
                <span className="meta-label">Año</span>
                <span>{book.year || "—"}</span>
              </div>

              <div>
                <span className="meta-label">País</span>
                <span>{book.country || "—"}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- RELATED ---------- */}
      {related.length > 0 && (
        <section className="related-section">
          <h3 className="related-title">
            TAMBIÉN TE PUEDE INTERESAR
          </h3>

          <div className="related-grid">
            {related.map((r) => (
              <Link
                key={r.id}
                to={`/fotolibro/${r.id}`}
                className="related-item"
              >
                <img
                  src={`${API_URL}/img/${r.image}`}
                  alt={r.title}
                />
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
