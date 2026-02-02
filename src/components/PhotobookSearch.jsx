import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/photobookSearch.css";

export default function PhotobookSearch() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!q.trim()) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(() => {
      fetch(
        `http://localhost:3001/fotolibros/buscar?q=${encodeURIComponent(q)}`
      )
        .then((res) => res.json())
        .then((data) => setResults(data));
    }, 300);

    return () => clearTimeout(timeout);
  }, [q]);

  const goToBook = (book) => {
    setOpen(false);
    setQ("");
    navigate(`/fotolibro/${encodeURIComponent(book["Título"])}`);
  };

  return (
    <div className="photobook-search">
      <input
        type="text"
        placeholder="Buscar por título, autor, país o editorial"
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
      />

      {open && results.length > 0 && (
        <div className="photobook-search-results">
          {results.map((book, i) => (
            <div
              key={i}
              className="photobook-search-item"
              onClick={() => goToBook(book)}
            >
              <img
                src={`http://localhost:3001/img/${book.Imagen}`}
                alt={book["Título"]}
              />

              <div className="photobook-search-meta">
                <div className="title">{book["Título"]}</div>
                <div className="author">
                  {book["Nombre fotógrafe"]} {book["Apellido fotógrafe"]}
                </div>
                <div className="extra">
                  {book["País"]} — {book["Editorial"]}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
