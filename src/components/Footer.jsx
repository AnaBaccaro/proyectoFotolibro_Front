import { Link } from "react-router-dom";
import "../css/footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Columna 1 */}
          <div>
            <h4 className="footer-title">PROYECTO FOTOLIBRO</h4>
            <p className="footer-subtitle">
              Plataforma dedicada a la producción, circulación y estudio de
              fotolibros latinoamericanos.
            </p>
          </div>

          {/* Columna 2 */}
          <div>
            <h5 className="footer-heading">Explorar</h5>
            <ul className="footer-links">
              <li>
                <Link to="/">Inicio</Link>
              </li>
              <li>
                <Link to="/catalogo">Catálogo</Link>
              </li>
              <li>
                <Link to="/sobre">Sobre el proyecto</Link>
              </li>
              <li>
                <Link to="/contacto">Contacto</Link>
              </li>
            </ul>
          </div>

          {/* Columna 3 */}
          <div>
            <h5 className="footer-heading">Conectar</h5>

            <div className="footer-icons">
              <a
                href="https://www.instagram.com/proyectofotolibro"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
              >
                <i className="bi bi-instagram" />
              </a>

              <a
                href="mailto:contacto@proyectofotolibro.com"
                aria-label="Email"
              >
                <i className="bi bi-envelope" />
              </a>

              <a href="#" target="_blank" rel="noreferrer" aria-label="Link">
                <i className="bi bi-link-45deg" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
