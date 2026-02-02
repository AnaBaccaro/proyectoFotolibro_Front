import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import CatalogPage from "./pages/CatalogPage";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalogo" element={<CatalogPage />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
