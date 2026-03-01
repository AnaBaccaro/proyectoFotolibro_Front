import { useEffect, useMemo, useState } from "react";
import CatalogHero from "../components/CatalogHero";
import PhotobookGrid from "../components/PhotobookGrid";
import { getSearchableText } from "../utils/getSearchableText";
import "../css/catalogPage.css";

const API_URL = "http://localhost:3001";
const librosPerPage = 12;

export default function CatalogPage() {
  const [search, setSearch] = useState("");
  const [libros, setLibros] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetch(`${API_URL}/fotolibros`)
      .then((res) => res.json())
      .then((data) => setLibros(Array.isArray(data) ? data : []));
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return libros;
    return libros.filter((b) => getSearchableText(b).includes(q));
  }, [libros, search]);

  const totalPages = Math.ceil(filtered.length / librosPerPage) || 1;

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [currentPage, totalPages]);

  const start = (currentPage - 1) * librosPerPage;
  const currentLibros = filtered.slice(start, start + librosPerPage);

  return (
    <main className="catalog-page">
      <CatalogHero searchValue={search} onSearchChange={setSearch} />

      <section className="catalog-content">
        <PhotobookGrid
          libros={currentLibros}
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      </section>
    </main>
  );
}