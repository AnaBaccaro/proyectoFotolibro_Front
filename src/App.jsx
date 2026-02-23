import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import CatalogPage from "./pages/CatalogPage";
import Photobook from "./pages/Photobook";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalogo" element={<CatalogPage />} />

        {/* Vista individual de un fotolibro */}
        <Route path="/fotolibros/:id" element={<Photobook />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
