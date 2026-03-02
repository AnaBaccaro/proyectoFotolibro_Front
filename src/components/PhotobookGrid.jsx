import { Link } from "react-router-dom";
import "../css/photobookGrid.css";

const API_URL = "http://localhost:3001";
const PLACEHOLDER = `${API_URL}/img/placeholder.png`;

const PALETTE = ["#C7C7FF", "#FD3D05", "#e66e43"];

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
  const first =
    (libro?.NombreFotografe ||
      libro?.["Nombre fotografe"] ||
      libro?.["Nombre fotógrafe"] ||
      "")
      .toString()
      .trim();

  const last =
    (libro?.ApellidoFotografe ||
      libro?.["Apellido fotografe"] ||
      libro?.["Apellido fotógrafe"] ||
      "")
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

const getImg = (libro) => {
  const img = (libro?.Imagen ?? "").toString().trim();

  if (!img || img.toLowerCase() === "null" || img.toLowerCase() === "undefined") {
    return PLACEHOLDER;
  }

  return `${API_URL}/img/${encodeURIComponent(img)}`;
};

const hashString = (str) => {
  const s = (str ?? "").toString();
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
};

const getHoverColor = (libro) => {
  const base = String(getId(libro) ?? "");
  const idx = hashString(base) % PALETTE.length;
  return PALETTE[idx];
};

const oneLine = (s) => (s ?? "").toString().replace(/\s+/g, " ").trim();

const truncate = (s, max) => {
  const text = oneLine(s);
  if (!text) return "-";
  if (text.length <= max) return text;
  return text.slice(0, Math.max(0, max - 1)).trimEnd() + "…";
};

export default function PhotobookGrid({
  libros,
  currentPage,
  totalPages,
  setCurrentPage,
}) {
  if (!libros || libros.length === 0) return null;

  return (
    <>
      <div className="photobook-grid">
        {libros.map((libro) => {
          const id = getId(libro);
          if (!id) return null;

          const title = truncate(getTitle(libro), 34);
          const author = truncate(getAuthor(libro), 30);
          const tags = parseTags(libro);
          const bg = getHoverColor(libro);

          return (
            <Link key={id} to={`/fotolibro/${id}`} className="photobook-card hover-card">
              <img
                className="hover-card-img"
                src={getImg(libro)}
                alt={getTitle(libro)}
                loading="lazy"
                onError={(e) => {
                  const el = e.currentTarget;
                  if (el.dataset.fallback === "1") return;
                  el.dataset.fallback = "1";
                  el.src = PLACEHOLDER;
                }}
              />

              <div className="hover-card-overlay" style={{ backgroundColor: bg }}>
                {tags.length > 0 && (
                  <div className="hover-card-tags">
                    {tags.slice(0, 2).map((t, idx) => (
                      <span key={`${t}-${idx}`} className="hover-card-tag">
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                <div className="hover-card-text">
                  <div className="hover-card-title" title={getTitle(libro)}>
                    {title}
                  </div>
                  <div className="hover-card-author" title={getAuthor(libro)}>
                    {author}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="pagination-bar">
          <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
            ←
          </button>

          <span>
            Página {currentPage} de {totalPages}
          </span>

          <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
            →
          </button>
        </div>
      )}
    </>
  );
}