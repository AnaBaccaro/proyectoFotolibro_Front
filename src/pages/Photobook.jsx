import { useEffect, useMemo, useState } from "react";
import CatalogHero from "../components/CatalogHero";
import PhotobookGrid from "../components/PhotobookGrid";
import "../css/catalogPage.css";

const API_URL = "http://localhost:3001";

const hasValidImage = (b) => {
  const img = b?.Imagen;
  return typeof img === "string" && img.trim().length > 0 && img !== "null";
};

export default function CatalogPage() {
  const [libros, setLibros] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const librosPerPage = 12;

  useEffect(() => {
    let alive = true;

    const run = async () => {
      const res = await fetch(`${API_URL}/fotolibros`);
      const data = await res.json();

      const normalized = Array.isArray(data)
        ? data.map((b, idx) => {
            const safeId =
              typeof b?.id === "number" ? b.id : Number(b?.id) || idx + 1;

            const img = hasValidImage(b) ? b.Imagen : "fallback.jpg";

            return {
              ...b,
              id: safeId,
              Imagen: img,
            };
          })
        : [];

      if (alive) setLibros(normalized);
    };

    run();

    return () => {
      alive = false;
    };
  }, []);

  const totalPages = useMemo(() => {
    const pages = Math.ceil(libros.length / librosPerPage);
    return pages > 0 ? pages : 1;
  }, [libros.length]);

  const start = (currentPage - 1) * librosPerPage;

  const currentLibros = useMemo(() => {
    return libros.slice(start, start + librosPerPage);
  }, [libros, start]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [totalPages, currentPage]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

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