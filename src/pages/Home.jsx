import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import LatestGrid from "../components/LatestGrid";
import CuratedCarousel from "../components/CuratedCarousel";
import { getSearchableText } from "../utils/getSearchableText";
import "../css/home.css";

const BOOKS_PER_PAGE = 12;
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

const getImgUrl = (book) => {
  const img = (book?.Imagen ?? "").toString().trim();

  if (!img || img.toLowerCase() === "null" || img.toLowerCase() === "undefined") {
    return PLACEHOLDER;
  }

  return `${API_URL}/img/${encodeURIComponent(img)}`;
};

export default function Home() {
  const [search, setSearch] = useState("");
  const [allBooks, setAllBooks] = useState([]);
  const [results, setResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetch(`${API_URL}/fotolibros`)
      .then((res) => res.json())
      .then((data) => {
        setAllBooks(Array.isArray(data) ? data : []);
      });
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setResults([]);
      setCurrentPage(1);
      return;
    }

    const q = search.toLowerCase();
    const filtered = allBooks.filter((book) => getSearchableText(book).includes(q));

    setResults(filtered);
    setCurrentPage(1);
  }, [search, allBooks]);

  const startIndex = (currentPage - 1) * BOOKS_PER_PAGE;
  const endIndex = startIndex + BOOKS_PER_PAGE;
  const paginatedResults = results.slice(startIndex, endIndex);
  const totalPages = Math.ceil(results.length / BOOKS_PER_PAGE);

  return (
    <main className="home-page">
      <Hero searchValue={search} onSearchChange={setSearch} />

      {search && results.length > 0 && (
        <section className="search-results">
          <div className="search-grid">
            {paginatedResults.map((book) => (
              <Link key={book.id} to={`/fotolibro/${book.id}`} className="book-card">
                <img
                  src={getImgUrl(book)}
                  alt={book["Título"] || "Sin título"}
                  loading="lazy"
                  onError={(e) => {
                    const el = e.currentTarget;
                    if (el.dataset.fallback === "1") return;
                    el.dataset.fallback = "1";
                    el.src = PLACEHOLDER;
                  }}
                />
                <p>{book["Título"] || "Sin título"}</p>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                Anterior
              </button>

              <span>
                {currentPage} / {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Siguiente
              </button>
            </div>
          )}
        </section>
      )}

      {!search && (
        <>
          <LatestGrid />
          <CuratedCarousel />
        </>
      )}
    </main>
  );
}