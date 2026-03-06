import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "../css/photobook.css";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

import { API_URL, IMG_BASE_URL, PLACEHOLDER } from "../config/env";

const PALETTE = ["#C7C7FF", "#FD3D05", "#e66e43"];
const PALETTE_NO_LILAC = ["#FD3D05", "#e66e43"];

const safe = (value) => {
  const v = (value ?? "").toString().trim();
  return v ? v : "-";
};

const displayTag = (tag) => {
  const t = (tag ?? "").toString().trim();
  if (!t) return "";
  return t.charAt(0).toUpperCase() + t.slice(1);
};

const norm = (value) =>
  (value ?? "")
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const getImgUrl = (imgName) => {
  const img = (imgName ?? "").toString().trim();
  if (!img || img.toLowerCase() === "null" || img.toLowerCase() === "undefined") {
    return PLACEHOLDER;
  }
  return `${IMG_BASE_URL}/${encodeURIComponent(img)}`;
};

const getField = (obj, key) => {
  if (!obj || typeof obj !== "object") return undefined;
  if (Object.prototype.hasOwnProperty.call(obj, key)) return obj[key];

  const want = key.toString().trim().toLowerCase();
  const foundKey = Object.keys(obj).find((k) => k.toString().trim().toLowerCase() === want);
  return foundKey ? obj[foundKey] : undefined;
};

const getTitleRaw = (b) => getField(b, "Titulo") ?? getField(b, "Título") ?? "";
const getTitle = (b) => safe(getTitleRaw(b));

const getAuthorRaw = (b) => {
  const first =
    getField(b, "NombreFotografe") ??
    getField(b, "Nombre fotografe") ??
    getField(b, "Nombre fotógrafe") ??
    "";
  const last =
    getField(b, "ApellidoFotografe") ??
    getField(b, "Apellido fotografe") ??
    getField(b, "Apellido fotógrafe") ??
    "";
  return `${first} ${last}`.trim();
};

const getAuthor = (b) => {
  const full = getAuthorRaw(b);
  return full ? full : "-";
};

const getPaisRaw = (b) =>
  (getField(b, "Pais") ?? getField(b, "País") ?? "").toString().trim();

const parseTags = (b) => {
  const raw =
    getField(b, "Tags") ??
    getField(b, "tags") ??
    getField(b, "Tag") ??
    getField(b, "tag") ??
    "";

  if (Array.isArray(raw)) {
    return raw.map((t) => (t ?? "").toString().trim()).filter(Boolean);
  }

  const s = (raw ?? "").toString().trim();
  if (!s) return [];

  const cleaned = s.startsWith("[") && s.endsWith("]") ? s.slice(1, -1) : s;

  return cleaned
    .split(/[,;\n]/g)
    .map((t) => t.trim().replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1"))
    .filter(Boolean);
};

const getLugar = (b) => {
  const ciudad = (getField(b, "Ciudad") ?? "").toString().trim();
  const pais = getPaisRaw(b);
  if (ciudad && pais) return `${ciudad}, ${pais}`;
  return ciudad || pais || "-";
};

const getEdicion = (b) => safe(getField(b, "Edicion") ?? getField(b, "Edición"));
const getDiseno = (b) => safe(getField(b, "Diseno") ?? getField(b, "Diseño"));
const getISBN = (b) => safe(getField(b, "ISBN"));
const getTextos = (b) => safe(getField(b, "Textos") ?? getField(b, "Texto"));
const getEditorial = (b) => safe(getField(b, "Editorial"));
const getAno = (b) => safe(getField(b, "Año") ?? getField(b, "Ano"));

const hasSomeImage = (b) => {
  const img = (getField(b, "Imagen") ?? "").toString().trim().toLowerCase();
  return !!img && img !== "null" && img !== "undefined";
};

const hashString = (str) => {
  const s = (str ?? "").toString();
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
};

const pickColor = (id, palette) => {
  const idx = hashString(String(id ?? "")) % palette.length;
  return palette[idx];
};

const getHoverColor = (b) => {
  const id = getField(b, "id");
  const palette = hasSomeImage(b) ? PALETTE : PALETTE_NO_LILAC;
  return pickColor(id, palette);
};

export default function Photobook() {
  const { id } = useParams();

  const [book, setBook] = useState(null);
  const [status, setStatus] = useState("loading");
  const [allBooks, setAllBooks] = useState([]);
  const [failedRelatedIds, setFailedRelatedIds] = useState(new Set());

  useEffect(() => {
    setStatus("loading");
    setBook(null);

    fetch(`${API_URL}/fotolibros/${id}`)
      .then((res) => {
        if (res.status === 404) {
          setStatus("notfound");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (!data) return;
        setBook(data);
        setStatus("ok");
      })
      .catch(() => setStatus("error"));
  }, [id]);

  useEffect(() => {
    if (status !== "ok") return;

    fetch(`${API_URL}/fotolibros`)
      .then((res) => res.json())
      .then((data) => {
        setAllBooks(Array.isArray(data) ? data : []);
      });
  }, [status]);

  const related = useMemo(() => {
    if (!book || !allBooks.length) return [];

    const currentId = Number(id);
    const currentTags = new Set(parseTags(book).map(norm));
    const currentAuthor = norm(getAuthorRaw(book));
    const currentPais = norm(getPaisRaw(book));

    const scored = allBooks
      .filter((b) => Number(getField(b, "id")) !== currentId)
      .filter(hasSomeImage)
      .map((b) => {
        const tags = parseTags(b).map(norm);

        let sharedTags = 0;
        for (const t of tags) {
          if (t && currentTags.has(t)) sharedTags++;
        }

        const sameAuthor = currentAuthor && norm(getAuthorRaw(b)) === currentAuthor;
        const samePais = currentPais && norm(getPaisRaw(b)) === currentPais;

        const score = sharedTags * 10 + (sameAuthor ? 25 : 0) + (samePais ? 8 : 0);

        return { b, score };
      })
      .sort((a, b) => b.score - a.score);

    return scored
      .filter((x) => x.score > 0)
      .slice(0, 12)
      .map((x) => x.b);
  }, [allBooks, book, id]);

  const visibleRelated = useMemo(() => {
    return related.filter((b) => !failedRelatedIds.has(getField(b, "id")));
  }, [related, failedRelatedIds]);

  if (status === "loading") return null;

  if (status === "notfound") {
    return (
      <section className="photobook-detail-hero">
        <div className="photobook-detail-container">
          <h1 className="photobook-title">Fotolibro no encontrado</h1>
        </div>
      </section>
    );
  }

  if (status === "error") {
    return (
      <section className="photobook-detail-hero">
        <div className="photobook-detail-container">
          <h1 className="photobook-title">Error al cargar</h1>
        </div>
      </section>
    );
  }

  const title = getTitle(book);
  const author = getAuthor(book);
  const tags = parseTags(book);
  const imgName = getField(book, "Imagen");

  return (
    <>
      <section className="photobook-detail-hero">
        <div className="photobook-detail-container">
          <div className="photobook-detail-image">
            <img
              src={getImgUrl(imgName)}
              alt={title}
              onError={(e) => {
                e.currentTarget.src = PLACEHOLDER;
              }}
            />
          </div>

          <div className="photobook-detail-info">
            <h1 className="photobook-title">{title}</h1>

            <div className="photobook-author">{author}</div>

            {tags.length > 0 && (
              <div className="photobook-tags">
                {tags.map((t, i) => (
                  <span key={`${t}-${i}`}>{displayTag(t)}</span>
                ))}
              </div>
            )}

            <div className="photobook-meta">
              <div>
                <span className="meta-label">Editorial</span>
                <span>{getEditorial(book)}</span>
              </div>

              <div>
                <span className="meta-label">Año</span>
                <span>{getAno(book)}</span>
              </div>

              <div>
                <span className="meta-label">Lugar</span>
                <span>{getLugar(book)}</span>
              </div>

              <div>
                <span className="meta-label">ISBN</span>
                <span>{getISBN(book)}</span>
              </div>

              <div>
                <span className="meta-label">Edición</span>
                <span>{getEdicion(book)}</span>
              </div>

              <div>
                <span className="meta-label">Diseño</span>
                <span>{getDiseno(book)}</span>
              </div>

              <div>
                <span className="meta-label">Textos</span>
                <span>{getTextos(book)}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {visibleRelated.length > 0 && (
        <section className="related-section">
          <h2 className="related-title">TAMBIÉN TE PUEDE INTERESAR</h2>

          <p className="related-subtitle">Recomendaciones según tags, autor y país.</p>

          <Swiper
            className="related-swiper"
            modules={[Pagination]}
            slidesPerView={5}
            spaceBetween={24}
            grabCursor={true}
            loop={visibleRelated.length > 2}
            pagination={{ clickable: true }}
            breakpoints={{
              0: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 5 },
            }}
          >
            {visibleRelated.map((b) => {
              const rid = getField(b, "id");
              const rtitle = getTitle(b);
              const rauthor = getAuthor(b);
              const rtags = parseTags(b);
              const tagPair = rtags.slice(0, 2).join("/");
              const bg = getHoverColor(b);

              return (
                <SwiperSlide key={rid}>
                  <Link to={`/fotolibro/${rid}`} className="related-card">
                    <img
                      className="related-cover"
                      src={getImgUrl(getField(b, "Imagen"))}
                      alt={rtitle}
                      loading="lazy"
                      onError={() =>
                        setFailedRelatedIds((prev) => new Set([...prev, rid]))
                      }
                    />

                    <div className="related-hover" style={{ backgroundColor: bg }}>
                      <div className="related-hover-top">
                        {tagPair ? (
                          <div className="related-hover-tags" title={rtags.join(" / ")}>
                            {tagPair}
                          </div>
                        ) : (
                          <div />
                        )}
                      </div>

                      <div className="related-hover-body">
                        <div className="related-hover-title">{rtitle}</div>
                      </div>

                      <div className="related-hover-bottom">
                        <div className="related-hover-author">{rauthor}</div>
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </section>
      )}
    </>
  );
}