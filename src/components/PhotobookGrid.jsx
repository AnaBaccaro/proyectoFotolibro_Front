import "../css/photobookGrid.css";

const API_URL = "http://localhost:3001";

export default function PhotobookGrid({ libros }) {
  return (
    <div className="photobook-grid">
      {libros.map((libro) => (
        <div key={libro.id} className="photobook-item">
          <img
            src={
              libro.images?.[0]?.image_url
                ? `${API_URL}/${libro.images[0].image_url.replace(
                    /^\//,
                    ""
                  )}`
                : "/img/fallback.jpg"
            }
            alt={libro.title}
            loading="lazy"
          />

          <div className="photobook-hover">
            <h3>{libro.title}</h3>
            <p>
              {libro.author_name} {libro.author_lastname}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
