import { Link } from "react-router-dom";
import "../css/navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg bg-white navbar-custom">
      <div className="container navbar-container">
        <Link className="navbar-brand navbar-brand-custom" to="/">
          <img
            src="http://localhost:3001/img/PF_Logo_Horizontal_SVG.svg"
            alt="Proyecto Fotolibro"
            className="navbar-logo"
          />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto navbar-links">
            <li className="nav-item">
              <Link className="nav-link nav-big" to="/catalogo">
                Catálogo
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link nav-big" to="/acerca">
                Sobre el Proyecto
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link nav-big" to="/login">
                Contacto
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}