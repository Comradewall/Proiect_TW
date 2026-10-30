import { useState } from "react";
import TaskList from "./components/TaskList.jsx";
import "./App.css";

// Listă extinsă de taskuri pentru a da un aspect realist de aplicație de productivitate
const TASKURI_INITIALE = [
  { id: 1, titlu: "Finalizare proiect Tehnologii Web (Etapa 5)", gata: false, prioritate: "mare" },
  { id: 2, titlu: "Citit capitolul 3 din documentația React", gata: true, prioritate: "medie" },
  { id: 3, titlu: "Cumpărat cafea și snacks-uri pentru sesiune", gata: false, prioritate: "mica" },
  { id: 4, titlu: "Implementare rutare dinamică și API fetch", gata: false, prioritate: "mare" },
  { id: 5, titlu: "Revizuire cod CSS pentru Dark Mode", gata: true, prioritate: "medie" },
  { id: 6, titlu: "Pregătire prezentare PowerPoint pentru seminar", gata: false, prioritate: "mare" },
  { id: 7, titlu: "Commit și push pe GitHub pentru repository", gata: false, prioritate: "mica" },
];

// Tema de pornire: cea a sistemului de operare
function temaInitiala() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export default function App() {
  const [taskuri, setTaskuri] = useState(TASKURI_INITIALE);
  const [tema, setTema] = useState(temaInitiala);

  // Actualizare imutabilă: listă nouă, obiect nou pentru elementul schimbat
  function handleToggle(id) {
    setTaskuri((prev) =>
      prev.map((t) => (t.id === id ? { ...t, gata: !t.gata } : t))
    );
  }

  function handleDelete(id) {
    setTaskuri((prev) => prev.filter((t) => t.id !== id));
  }

  // Comutarea temei: state-ul pentru buton, atributul data-theme pentru CSS
  function handleTema() {
    const noua = tema === "dark" ? "light" : "dark";
    setTema(noua);
    document.documentElement.dataset.theme = noua;
  }

  // Valori derivate pentru statistici avansate în antet
  const total = taskuri.length;
  const active = taskuri.filter((t) => !t.gata).length;
  const gata = total - active;
  const procentaj = total > 0 ? Math.round((gata / total) * 100) : 0;

  return (
    <>
      <header className="app-header">
        <button
          className="theme-toggle"
          onClick={handleTema}
          aria-pressed={tema === "dark"}
        >
          {tema === "dark" ? "☀️ Mod luminos" : "🌙 Mod întunecat"}
        </button>
        <h1>FlowLess Workspace</h1>
        <p>Platformă modernă pentru gestionarea și organizarea sarcinilor zilnice.</p>
        
        {/* Bară de progres și statistici pentru un aspect de aplicație reală */}
        <div style={{ marginTop: "16px", display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <span className="app-count">Total: {total}</span>
          <span className="app-count">Active: {active}</span>
          <span className="app-count">Finalizate: {gata} ({procentaj}%)</span>
        </div>
      </header>

      <main className="container">
        <section className="panel">
          <h2>Task-urile mele active</h2>
          <TaskList
            taskuri={taskuri}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        </section>
      </main>

      <footer className="app-footer">
        <p></p>
      </footer>
    </>
  );
}