const norm = (v) =>
  (v ?? "")
    .toString()
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const getField = (obj, candidates) => {
  for (const k of candidates) {
    if (obj && Object.prototype.hasOwnProperty.call(obj, k)) return obj[k];
  }
  return "";
};

const parseTags = (b) => {
  const raw = getField(b, ["Tags", "tags", "Tag", "tag"]);
  if (Array.isArray(raw)) return raw.map((t) => (t ?? "").toString().trim()).filter(Boolean);
  const s = (raw ?? "").toString().trim();
  if (!s) return [];
  return s.split(/[,;\n]/g).map((t) => t.trim()).filter(Boolean);
};

export const getSearchableText = (book) => {
  if (!book) return "";

  const title = getField(book, ["Título", "Titulo", "title"]);
  const first = getField(book, ["Nombre fotógrafe", "Nombre fotografe", "NombreFotografe", "nombre"]);
  const last = getField(book, ["Apellido fotógrafe", "Apellido fotografe", "ApellidoFotografe", "apellido"]);
  const author = `${first} ${last}`.trim();

  const country = getField(book, ["País", "Pais", "country"]);
  const city = getField(book, ["Ciudad", "city"]);
  const editorial = getField(book, ["Editorial", "editorial"]);

  const tags = parseTags(book).join(" ");

  return norm(`${title} ${author} ${country} ${city} ${editorial} ${tags}`);
};