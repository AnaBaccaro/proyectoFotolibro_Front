import { useEffect, useState } from "react";
import Hero from "../components/Hero";
import LatestGrid from "../components/LatestGrid";
import CuratedCarousel from "../components/CuratedCarousel";
import { getSearchableText } from "../utils/getSearchableText";

import "../css/home.css";

const BOOKS_PER_PAGE = 12;

export default function Home() {
  const [search, setSearch] = useState("");
  const [allBooks, setAllBooks] = useState([]);
  const [results, setResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetch("http://localhost:3001/fotolibros")
      .then((res) => res.json())
      .then((data) => setAllBooks(data));
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
    <>
      <Hero searchValue={search} onSearchChange={setSearch} />

      {search && results.length > 0 && (
        <section className="search-results">
          <div className="search-grid">
            {paginatedResults.map((book, i) => (
              <div key={i} className="book-card">
                <img
                  src={`http://localhost:3001/img/${book.Imagen}`}
                  alt={book.Título || "Sin título"}
                />
                <p className={!book.Título ? "italic opacity-60" : ""}>
                  {book.Título || "Sin título"}
                </p>
              </div>
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
    </>
  );
}
