import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "../css/curatedCarousel.css";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

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

const getImgUrl = (imgName) => {
  const img = (imgName ?? "").toString().trim();
  if (!img || img.toLowerCase() === "null" || img.toLowerCase() === "undefined") {
    return PLACEHOLDER;
  }
  return `${API_URL}/img/${encodeURIComponent(img)}`;
};

export default function CuratedCarousel() {
  const [books, setBooks] = useState([]);
  const [viewport, setViewport] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  useEffect(() => {
    fetch(`${API_URL}/fotolibros/curated`)
      .then((res) => res.json())
      .then((data) => setBooks(Array.isArray(data) ? data : []));
  }, []);

  useEffect(() => {
    const onResize = () => setViewport(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const slidesPerView = useMemo(() => {
    if (viewport >= 1024) return 5;
    if (viewport >= 768) return 3;
    return 2;
  }, [viewport]);

  const enableLoop = books.length > slidesPerView;

  if (!books.length) return null;

  return (
    <section className="curated-carousel-section">
      <h2 className="curated-title">NUESTRA SELECCIÓN</h2>
      <p className="curated-subtitle">Nuestros fotolibros favoritos.</p>

      <Swiper
        modules={[Pagination]}
        slidesPerView={slidesPerView}
        spaceBetween={24}
        loop={enableLoop}
        pagination={{ clickable: true }}
      >
        {books.map((book) => (
          <SwiperSlide key={book.id}>
            <Link to={`/fotolibro/${book.id}`}>
              <img
                src={getImgUrl(book.Imagen)}
                alt={book["Título"] || "Fotolibro"}
                loading="lazy"
                onError={(e) => {
                  const el = e.currentTarget;
                  if (el.dataset.fallback === "1") return;
                  el.dataset.fallback = "1";
                  el.src = PLACEHOLDER;
                }}
              />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}