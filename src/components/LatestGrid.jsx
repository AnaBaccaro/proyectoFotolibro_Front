import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../css/latestGrid.css";

import { API_URL, IMG_BASE_URL, PLACEHOLDER } from "../config/env";

const PALETTE = ["#C7C7FF", "#FD3D05", "#e66e43"];
const PALETTE_NO_LILAC = ["#FD3D05", "#e66e43"];

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

const getTitleFull = (b) =>
  ((b?.Titulo || b?.["Título"] || b?.["Titulo"] || "").toString().trim() || "Fotolibro");

const getAuthorFull = (b) => {
  const first =
    (b?.NombreFotografe || b?.["Nombre fotografe"] || b?.["Nombre fotógrafe"] || "")
      .toString()
      .trim();

  const last =
    (b?.ApellidoFotografe || b?.["Apellido fotografe"] || b?.["Apellido fotógrafe"] || "")
      .toString()
      .trim();

  const full = `${first} ${last}`.trim();
  return full || "-";
};

const parseTags = (b) => {
  const raw = b?.Tags ?? b?.tags ?? b?.Tag ?? b?.tag ?? "";
  if (Array.isArray(raw)) return raw.map((t) => (t ?? "").toString().trim()).filter(Boolean);
  const s = raw.toString().trim();
  if (!s) return [];
  return s.split(/[,;\n]/g).map((t) => t.trim()).filter(Boolean);
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
  const palette = hasRealImage(b) ? PALETTE : PALETTE_NO_LILAC;
  return pickColor(b?.id, palette);
};

const oneLine = (s) => (s ?? "").toString().replace(/\s+/g, " ").trim();

const truncate = (s, max) => {
  const text = oneLine(s);
  if (!text) return "-";
  if (text.length <= max) return text;
  return text.slice(0, Math.max(0, max - 1)).trimEnd() + "…";
};

export default function LatestGrid() {
  const [libros, setLibros] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/fotolibros/latest`)
      .then((res) => res.json())
      .then((data) => setLibros(Array.isArray(data) ? data : []));
  }, []);

  if (!libros.length) return null;

  return (
    <section className="latest-grid-section">
      <h2 className="latest-title">ÚLTIMAS INCORPORACIONES</h2>

      <p className="latest-subtitle">
        Selección especial de fotolibros latinoamericanos que destacan por su relevancia editorial y artística.
      </p>

      <div className="latest-grid-container">
        {libros.map((b) => {
          const titleFull = getTitleFull(b);
          const authorFull = getAuthorFull(b);

          const title = truncate(titleFull, 58);
          const author = truncate(authorFull, 42);

          const tags = parseTags(b);
          const bg = getHoverColor(b);
          const tagPair = tags.slice(0, 2).join("/");

          return (
            <Link key={b.id} to={`/fotolibro/${b.id}`} className="latest-grid-item hover-card">
              <img
                className="hover-card-img"
                src={getImgUrl(b.Imagen)}
                alt={titleFull}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = PLACEHOLDER;
                }}
              />

              <div className="hover-card-overlay" style={{ backgroundColor: bg }}>
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
    </section>
  );
}