import "../css/catalog.css";

export default function Catalog({ photobooks }) {
  if (!photobooks.length) {
    return <p className="empty">No hay fotolibros disponibles.</p>;
  }

  return (
    <section className="catalog-grid">
      {photobooks.map((book) => (
        <article key={book.id} className="catalog-card">
          <img
            src={book.cover_image}
            alt={book.titulo}
            className="catalog-image"
          />

          <div className="catalog-info">
            <h3>{book.titulo}</h3>
            <p>{book.autor}</p>
            <span>{book.año}</span>
          </div>
        </article>
      ))}
    </section>
  );
}
