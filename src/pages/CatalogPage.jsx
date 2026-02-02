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
      .then((data) => setLibros(data))
      .catch((err) => console.error("Error cargando fotolibros:", err));
  }, []);

  const indexOfLast = currentPage * librosPerPage;
  const indexOfFirst = indexOfLast - librosPerPage;
  const currentLibros = libros.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(libros.length / librosPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>
      <CatalogHero />

      <section className="catalog-grid-section">
        <PhotobookGrid
          libros={currentLibros}
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
        />
      </section>
    </>
  );
}
