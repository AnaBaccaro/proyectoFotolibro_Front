import "../css/footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container footer-grid">

        {/* Columna 1 */}
        <div>
          <h4 className="footer-title">PROYECTO FOTOLIBRO</h4>
          <p className="footer-subtitle">
            Plataforma dedicada a la producción, circulación y estudio 
            de fotolibros latinoamericanos.
          </p>
        </div>

        {/* Columna 2 */}
        <div>
          <h5 className="footer-heading">Explorar</h5>
          <ul className="footer-links">
            <li><a href="/">Inicio</a></li>
            <li><a href="/catalogo">Catálogo</a></li>
            <li><a href="/sobre">Sobre el proyecto</a></li>
          </ul>
        </div>

        {/* Columna 3 */}
        <div>
          <h5 className="footer-heading">Conectar</h5>
          <div className="footer-icons">
            <a href="#"><i className="bi bi-instagram"></i></a>
            <a href="#"><i className="bi bi-envelope"></i></a>
          </div>
        </div>

      </div>
    </footer>
  );
}
