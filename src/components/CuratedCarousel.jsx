import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "../css/curatedCarousel.css";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const API_URL = "http://localhost:3001";
const PLACEHOLDER = `${API_URL}/img/placeholder.png`;

const getImgUrl = (imgName) => {
  const img = (imgName ?? "").toString().trim();
  if (!img || img.toLowerCase() === "null" || img.toLowerCase() === "undefined") {
    return PLACEHOLDER;
  }
  return `${API_URL}/img/${encodeURIComponent(img)}`;
};

const getTitle = (b) =>
  (b?.Titulo || b?.["Título"] || b?.["Titulo"] || "Fotolibro").toString().trim();

const getAuthor = (b) => {
  const first = b?.NombreFotografe || b?.["Nombre fotografe"] || b?.["Nombre fotógrafe"] || "";
  const last = b?.ApellidoFotografe || b?.["Apellido fotografe"] || b?.["Apellido fotógrafe"] || "";
  const full = `${first} ${last}`.trim();
  return full || "-";
};

const parseTags = (b) => {
  const raw = b?.Tags ?? b?.tags ?? b?.Tag ?? b?.tag ?? "";
  if (Array.isArray(raw)) {
    return raw.map((t) => (t ?? "").toString().trim()).filter(Boolean);
  }
  const s = raw.toString().trim();
  if (!s) return [];
  return s.split(/[,;\n]/g).map((t) => t.trim()).filter(Boolean);
};

// Paleta (3 colores)
const HOVER_COLORS = ["#C7C7FF", "#FD3D05", "#e66e43"];

// Hash simple, estable
const hashString = (str) => {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
};

const pickHoverColor = (book) => {
  const key = `${book?.id ?? ""}|${getTitle(book)}`;
  const idx = hashString(key) % HOVER_COLORS.length;
  return HOVER_COLORS[idx];
};

export default function CuratedCarousel() {
  const [books, setBooks] = useState([]);
  const [viewport, setViewport] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);

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
        grabCursor={true}
        pagination={{ clickable: true }}
      >
        {books.map((book) => {
          const title = getTitle(book);
          const author = getAuthor(book);
          const tags = parseTags(book).slice(0, 2);
          const tagPair = tags.join("/"); // ✅ formato final
          const bg = pickHoverColor(book);

          return (
            <SwiperSlide key={book.id}>
              <Link to={`/fotolibro/${book.id}`} className="curated-card" style={{ "--hover-bg": bg }}>
                <img
                  className="curated-cover"
                  src={getImgUrl(book.Imagen)}
                  alt={title}
                  loading="lazy"
                  onError={(e) => {
                    const el = e.currentTarget;
                    if (el.dataset.fallback === "1") return;
                    el.dataset.fallback = "1";
                    el.src = PLACEHOLDER;
                  }}
                />

                <div className="curated-hover">
                  {tagPair ? <div className="curated-tagpair">{tagPair}</div> : null}

                  <div className="curated-hover-body">
                    <div className="curated-hover-title">{title}</div>
                    <div className="curated-hover-author">{author}</div>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
}