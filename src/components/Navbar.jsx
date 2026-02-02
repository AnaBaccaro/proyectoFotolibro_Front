import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg bg-white py-3">
      <div className="container">

        {/* Logo */}
        <Link className="navbar-brand" to="/">
          <img
            src="http://localhost:3001/img/PF_Logo_SVG.svg"
            alt="Proyecto Fotolibro"
            className="navbar-logo"
          />
        </Link>

        {/* Hamburguesa */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center gap-4">

            <li className="nav-item">
              <Link className="nav-link nav-big hanken-medium" to="/explorar">
                Catálogo
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link nav-big hanken-medium" to="/acerca">
                Sobre el Proyecto
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link nav-big hanken-medium" to="/login">
                Contacto
              </Link>
            </li>

          </ul>
        </div>

      </div>
    </nav>
  );
}
