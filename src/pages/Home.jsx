import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import LatestGrid from "../components/LatestGrid";
import CuratedCarousel from "../components/CuratedCarousel";
import { getSearchableText } from "../utils/getSearchableText";

import "../css/home.css";

const BOOKS_PER_PAGE = 12;
const API_URL = "http://localhost:3001";

export default function Home() {
  const [search, setSearch] = useState("");
  const [allBooks, setAllBooks] = useState([]);
  const [results, setResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetch(`${API_URL}/fotolibros`)
      .then((res) => res.json())
      .then((data) => {
        console.log("PRIMER LIBRO:", data[0]);
        setAllBooks(data);
      });
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setResults([]);
      setCurrentPage(1);
      return;
    }

    const q = search.toLowerCase();

    const filtered = allBooks.filter((book) =>
      getSearchableText(book).includes(q)
    );

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

      {/* RESULTADOS DE BÚSQUEDA */}
      {search && results.length > 0 && (
        <section className="search-results">
          <div className="search-grid">
            {paginatedResults.map((book) => (
              <Link
                key={book.id}
                to={`/fotolibro/${book.id}`}
                className="book-card"
              >
                <img
                  src={`${API_URL}/img/${book.Imagen}`}
                  alt={book.Título || "Sin título"}
                  onError={(e) => {
                    e.target.src = `${API_URL}/img/fallback.jpg`;
                  }}
                />
                <p>{book.Título || "Sin título"}</p>
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

      {/* HOME DEFAULT */}
      {!search && (
        <>
          <LatestGrid />
          <CuratedCarousel />
        </>
      )}
    </main>
  );
}