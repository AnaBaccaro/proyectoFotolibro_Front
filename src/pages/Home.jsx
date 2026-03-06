import "../css/home.css";

export default function Home() {
  return (
    <main className="home-page" style={{ padding: "40px" }}>
      <div
        style={{
          background: "yellow",
          color: "black",
          padding: "20px",
          fontSize: "28px",
          fontWeight: "bold",
          marginBottom: "24px",
        }}
      >
        BUILD NUEVO
      </div>

      <img
        src="https://img.proyectofotolibro.com/nuestros_codigos_2023.png"
        alt="test"
        style={{ width: "220px", display: "block" }}
      />
    </main>
  );
}