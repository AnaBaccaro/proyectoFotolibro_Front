import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../css/curatedCarousel.css";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

import { API_URL, IMG_BASE_URL, PLACEHOLDER } from "../config/env";

const getImgUrl = (imgName) => {
  const img = (imgName ?? "").toString().trim();
  if (!img || img.toLowerCase() === "null" || img.toLowerCase() === "undefined") {
    return PLACEHOLDER;
  }
  return `${IMG_BASE_URL}/${encodeURIComponent(img)}`;
};

const hasRealImage = (b) => {
  const img = (b?.Imagen ?? "").toString().trim().toLowerCase();
  return !!img && img !== "null" && img !== "undefined";
};

const isCurated = (b) => {
  return (
    b?.Curated === true ||
    b?.Curated === 1 ||
    b?.Curated === "1" ||
    b?.Curated === "true"
  );
};

const getTitle = (b) =>
  ((b?.Titulo || b?.["Título"] || "").toString().trim() || "Fotolibro");

const getAuthor = (b) => {
  const first =
    (b?.NombreFotografe || b?.["Nombre fotografe"] || "")
      .toString()
      .trim();

  const last =
    (b?.ApellidoFotografe || b?.["Apellido fotografe"] || "")
      .toString()
      .trim();

  const full = `${first} ${last}`.trim();
  return full || "-";
};

export default function CuratedCarousel() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/fotolibros`)
      .then((res) => res.json())
      .then((data) => {
        const all = Array.isArray(data) ? data : [];

        const curated = all
          .filter((b) => isCurated(b) && hasRealImage(b))
          .sort(
            (a, b) =>
              (Number(a?.CuratedOrder) || 999) -
              (Number(b?.CuratedOrder) || 999)
          )
          .slice(0, 9);

        setBooks(curated);
      });
  }, []);

  if (!books.length) return null;

  return (
    <section className="curated-carousel-section">
      <h2 className="curated-title">NUESTRA SELECCIÓN</h2>

      <Swiper
        modules={[Pagination]}
        slidesPerView={5}
        spaceBetween={24}
        pagination={{ clickable: true }}
        breakpoints={{
          0: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 5 },
        }}
      >
        {books.map((b) => {
          const title = getTitle(b);
          const author = getAuthor(b);

          return (
            <SwiperSlide key={b.id}>
              <Link
                to={`/fotolibro/${b.id}`}
                className="curated-card"
              >
                <img
                  className="curated-cover"
                  src={getImgUrl(b.Imagen)}
                  alt={title}
                  loading="lazy"
                />

                <div className="curated-hover">
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