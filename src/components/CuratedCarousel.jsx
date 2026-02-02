import { useEffect, useState } from "react";
import "../css/curatedCarousel.css";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

export default function CuratedCarousel() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/fotolibros/curated")
      .then(res => res.json())
      .then(data => setBooks(data));
  }, []);

  if (!books.length) return null;

  return (
    <section className="curated-carousel-section">
      
      <h2 className="curated-title">NUESTRA SELECCIÓN</h2>

      <p className="curated-subtitle">
        Nuestros fotolibros favoritos.
      </p>

      <Swiper
        modules={[Pagination]}
        spaceBetween={116}
        slidesPerView={3}
        loop={true}
        pagination={{ clickable: true }}
        breakpoints={{
          768: { slidesPerView: 2 },
          1200: { slidesPerView: 3 },
        }}
      >
        {books.map((book, i) => (
          <SwiperSlide key={i}>
            <div className="curated-card">
              <img
                src={`http://localhost:3001/img/${book.Imagen}`}
                alt={book.Título}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

    </section>
  );
}
