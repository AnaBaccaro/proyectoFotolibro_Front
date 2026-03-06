import { Link } from "react-router-dom";
import "../css/photobookGrid.css";

import { IMG_BASE_URL, PLACEHOLDER } from "../config/env";

const PALETTE = ["#C7C7FF", "#FD3D05", "#e66e43"];
const PALETTE_NO_LILAC = ["#FD3D05", "#e66e43"];

const getId = (libro) => {
  const id = Number(libro?.id);
  return Number.isFinite(id) && id > 0 ? id : null;
};

const getTitle = (libro) => {
  return (
    (libro?.Titulo || libro?.["Título"] || libro?.["Titulo"] || "")
      .toString()
      .trim() || "Fotolibro"
  );
};

const getAuthor = (libro) => {
  const first = (
    libro?.NombreFotografe ||
    libro?.["Nombre fotografe"] ||
    libro?.["Nombre fotógrafe"] ||
    ""
  )
    .toString()
    .trim();

  const last = (
    libro?.ApellidoFotografe ||
    libro?.["Apellido fotografe"] ||
    libro?.["Apellido fotógrafe"] ||
    ""
  )
    .toString()
    .trim();

  const full = `${first} ${last}`.trim();
  return full || "-";
};

const parseTags = (libro) => {
  const raw = libro?.Tags ?? libro?.tags ?? libro?.Tag ?? libro?.tag ?? "";

  if (Array.isArray(raw)) {
    return raw.map((t) => (t ?? "").toString().trim()).filter(Boolean);
  }

  const s = raw.toString().trim();
  if (!s) return [];

  return s
    .split(/[,;\n]/g)
    .map((t) => t.trim())
    .filter(Boolean);
};

const hasRealImage = (libro) => {
  const img = (libro?.Imagen ?? "").toString().trim().toLowerCase();
  return !!img && img !== "null" && img !== "undefined";
};

const getImg = (libro) => {
  const img = (libro?.Imagen ?? "").toString().trim();

  if (
    !img ||
    img.toLowerCase() === "null" ||
    img.toLowerCase() === "undefined"
  ) {
    return PLACEHOLDER;
  }

  return `${IMG_BASE_URL}/${encodeURIComponent(img)}`;
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

const getHoverColor = (libro) => {
  const id = getId(libro);
  const palette = hasRealImage(libro) ? PALETTE : PALETTE_NO_LILAC;
  return pickColor(id, palette);
};

const oneLine = (s) => (s ?? "").toString().replace(/\s+/g, " ").trim();

const truncate = (s, max) => {
  const text = oneLine(s);
  if (!text) return "-";
  if (text.length <= max) return text;
  return text.slice(0, Math.max(0, max - 1)).trimEnd() + "…";
};

// === pagination con ellipsis ===
const getPaginationItems = (currentPage, totalPages) => {
  if (totalPages <= 7)
    return Array.from({ length: totalPages }, (_, i) => i + 1);

  const items = [];
  const first = 1;
  const last = totalPages;

  const left = Math.max(2, currentPage - 1);
  const right = Math.min(totalPages - 1, currentPage + 1);

  items.push(first);

  if (left > 2) items.push("…");

  for (let p = left; p <= right; p++) items.push(p);

  if (right < totalPages - 1) items.push("…");

  items.push(last);

  return items;
};

export default function PhotobookGrid({
  libros,
  currentPage,
  totalPages,
  setCurrentPage,
}) {
  if (!libros || libros.length === 0) return null;

  const pages = getPaginationItems(currentPage, totalPages);

  return (
    <>
      <div className="photobook-grid">
        {libros.map((libro) => {
          const id = getId(libro);
          if (!id) return null;

          const titleFull = getTitle(libro);
          const authorFull = getAuthor(libro);

          const title = truncate(titleFull, 50);
          const author = truncate(authorFull, 34);

          const tags = parseTags(libro);
          const bg = getHoverColor(libro);

          // formato: activismo/memoria (SIN espacios)
          const tagPair = tags.slice(0, 2).join("/");

          return (
            <Link
              key={id}
              to={`/fotolibro/${id}`}
              className="photobook-card hover-card"
            >
              <img
                className="hover-card-img"
                src={getImg(libro)}
                alt={titleFull}
                loading="lazy"
                onError={(e) => {
                  const el = e.currentTarget;
                  if (el.dataset.fallback === "1") return;
                  el.dataset.fallback = "1";
                  el.src = PLACEHOLDER;
                }}
              />

              <div
                className="hover-card-overlay"
                style={{ backgroundColor: bg }}
              >
                <div className="hover-card-top">
                  {tagPair ? (
                    <div className="hover-card-tags" title={tags.join(" / ")}>
                      {tagPair}
                    </div>
                  ) : (
                    <div />
                  )}
                </div>

                <div className="hover-card-center">
                  <div className="hover-card-title" title={titleFull}>
                    {title}
                  </div>
                </div>

                <div className="hover-card-bottom">
                  <div className="hover-card-author" title={authorFull}>
                    {author}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {totalPages > 1 && (
        <nav className="pagination-bar" aria-label="Paginación">
          <button
            className="page-btn nav"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Página anterior"
          >
            ‹
          </button>

          {pages.map((item, idx) => {
            if (item === "…") {
              return (
                <span
                  key={`dots-${idx}`}
                  className="page-dots"
                  aria-hidden="true"
                >
                  …
                </span>
              );
            }

            const page = item;
            const active = page === currentPage;

            return (
              <button
                key={page}
                className={`page-btn ${active ? "active" : ""}`}
                onClick={() => setCurrentPage(page)}
                aria-current={active ? "page" : undefined}
              >
                {page}
              </button>
            );
          })}

          <button
            className="page-btn nav"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Página siguiente"
          >
            ›
          </button>
        </nav>
      )}
    </>
  );
}
