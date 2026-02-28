import { useEffect, useState } from "react";
import CatalogHero from "../components/CatalogHero";
import PhotobookGrid from "../components/PhotobookGrid";
import "../css/catalogPage.css";

const API_URL = "http://localhost:3001";

export default function CatalogPage() {
  const [libros, setLibros] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const librosPerPage = 12;

  useEffect(() => {
    fetch(`${API_URL}/fotolibros`)
      .then((res) => res.json())
      .then((data) => setLibros(data));
  }, []);

  const totalPages = Math.ceil(libros.length / librosPerPage);
  const start = (currentPage - 1) * librosPerPage;
  const currentLibros = libros.slice(start, start + librosPerPage);

  return (
    <main className="catalog-page">
      <CatalogHero />
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
