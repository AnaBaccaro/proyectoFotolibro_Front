export const getSearchableText = (book) => {
    return [
      book?.Título,
      book?.["Apellido fotógrafe"],
      book?.Nombre,
      book?.Año,
      book?.Editorial,
      book?.País,
      book?.Ciudad,
    ]
      .filter(Boolean)
      .map((field) => {
        if (typeof field === "string") return field;
        if (typeof field === "number") return field.toString();
        if (Array.isArray(field)) return field.join(" ");
        if (typeof field === "object") return Object.values(field).join(" ");
        return "";
      })
      .join(" ")
      .toLowerCase();
  };
  