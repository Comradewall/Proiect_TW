import { useEffect, useMemo, useState } from "react";
import Sidebar from "./components/Sidebar.jsx";
import StatsBar from "./components/StatsBar.jsx";
import Toolbar from "./components/Toolbar.jsx";
import TaskBoard from "./components/TaskBoard.jsx";
import NotesPage from "./components/NotesPage.jsx";
import { pozitieInGrila } from "./constants.js";
import "./App.css";

const STORAGE_KEY = "flowless:v2";

const TITLURI = [
  ["Finalizare proiect Tehnologii Web (Etapa 5)", false, "mare"],
  ["Citit capitolul 3 din documentația React", true, "medie"],
  ["Cumpărat cafea și snacks-uri pentru sesiune", false, "mica"],
  ["Implementare rutare dinamică și API fetch", false, "mare"],
  ["Revizuire cod CSS pentru Dark Mode", true, "medie"],
  ["Pregătire prezentare PowerPoint pentru seminar", false, "mare"],
  ["Commit și push pe GitHub pentru repository", false, "mica"],
];

// Mici abateri de la grilă, ca să pară cărți „aruncate” pe birou
const ABATERI = [[0, 0], [10, 14], [-6, 6], [8, -4], [-4, 12], [12, 2], [0, 16]];

const TASKURI_INITIALE = TITLURI.map(([titlu, gata, prioritate], i) => {
  const baza = pozitieInGrila(i);
  return {
    id: i + 1,
    titlu,
    gata,
    prioritate,
    x: baza.x + ABATERI[i][0],
    y: baza.y + ABATERI[i][1],
    z: i + 1,
  };
});

const NOTE_INITIALE = {
  1: {
    text: "Livrabile:\n- [ ] Cod sursă pe GitHub\n- [ ] Documentație scurtă\n- [x] Structura componentelor\n",
    updated: Date.now(),
  },
};

function incarca() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* date corupte sau stocare indisponibilă: pornim de la zero */
  }
  return null;
}

function temaInitiala() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function App() {
  const [salvat] = useState(incarca);
  const [taskuri, setTaskuri] = useState(salvat?.taskuri ?? TASKURI_INITIALE);
  const [note, setNote] = useState(salvat?.note ?? NOTE_INITIALE);
  const [tema, setTema] = useState(temaInitiala);
  const [pagina, setPagina] = useState("board");
  const [taskNotita, setTaskNotita] = useState(null);
  const [cautare, setCautare] = useState("");
  const [filtru, setFiltru] = useState("toate");
  const [toast, setToast] = useState(null);

  // Tema: state-ul pentru buton, atributul data-theme pentru CSS
  useEffect(() => {
    document.documentElement.dataset.theme = tema;
  }, [tema]);

  // Persistență locală
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ taskuri, note }));
    } catch {
      /* ignorăm erorile de stocare */
    }
  }, [taskuri, note]);

  // Toast-ul dispare singur
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 6000);
    return () => clearTimeout(t);
  }, [toast]);

  // --- Acțiuni asupra task-urilor (actualizări imutabile) ---
  function handleToggle(id) {
    setTaskuri((prev) => prev.map((t) => (t.id === id ? { ...t, gata: !t.gata } : t)));
  }

  function handleDelete(id) {
    const sters = taskuri.find((t) => t.id === id);
    if (!sters) return;
    setTaskuri((prev) => prev.filter((t) => t.id !== id));
    setToast({
      mesaj: `„${sters.titlu}” a fost șters.`,
      actiune: "Anulează",
      onAction: () => {
        setTaskuri((prev) => [...prev, sters]);
        setToast(null);
      },
    });
  }

  function handleAdd(titlu, prioritate) {
    setTaskuri((prev) => {
      const poz = pozitieInGrila(prev.length, 960);
      const top = prev.reduce((m, t) => Math.max(m, t.z), 0);
      return [...prev, { id: Date.now(), titlu, gata: false, prioritate, x: poz.x, y: poz.y + 16, z: top + 1 }];
    });
  }

  function handleMove(id, x, y) {
    setTaskuri((prev) => prev.map((t) => (t.id === id ? { ...t, x, y } : t)));
  }

  function handleFront(id) {
    setTaskuri((prev) => {
      const top = prev.reduce((m, t) => Math.max(m, t.z), 0);
      const curent = prev.find((t) => t.id === id);
      if (!curent || curent.z === top) return prev;
      return prev.map((t) => (t.id === id ? { ...t, z: top + 1 } : t));
    });
  }

  function handleArrange() {
    const latime = window.innerWidth <= 860 ? window.innerWidth - 32 : window.innerWidth - 232 - 64;
    setTaskuri((prev) =>
      prev.map((t, i) => ({ ...t, ...pozitieInGrila(i, Math.min(latime, 1400)), z: i + 1 }))
    );
  }

  // --- Notițe ---
  function handleSaveNote(id, text) {
    setNote((prev) => ({ ...prev, [id]: { text, updated: Date.now() } }));
  }

  function handleOpenNotes(id) {
    setTaskNotita(id);
    setPagina("note");
  }

  // Valori derivate
  const total = taskuri.length;
  const finalizate = taskuri.filter((t) => t.gata).length;
  const idsCuNota = useMemo(
    () => new Set(taskuri.filter((t) => note[t.id]?.text.trim()).map((t) => t.id)),
    [taskuri, note]
  );
  const idsPotrivite = useMemo(() => {
    const q = cautare.trim().toLowerCase();
    return new Set(
      taskuri
        .filter((t) => (filtru === "toate" || t.prioritate === filtru) && t.titlu.toLowerCase().includes(q))
        .map((t) => t.id)
    );
  }, [taskuri, cautare, filtru]);

  return (
    <div className="shell">
      <Sidebar
        pagina={pagina}
        onNavigate={setPagina}
        tema={tema}
        onTema={() => setTema((t) => (t === "dark" ? "light" : "dark"))}
        nrNote={idsCuNota.size}
      />

      <div className="content">
        <header className="topbar">
          <h1>{pagina === "board" ? "Board de sarcini" : "Notițe pe task-uri"}</h1>
          <p>
            {pagina === "board"
              ? "Trage cardurile oriunde pe suprafața de lucru pentru a le organiza după cum preferi."
              : "Scrie detalii, pași sau decizii pentru fiecare task. Se salvează automat."}
          </p>
        </header>

        {pagina === "board" ? (
          <>
            <StatsBar total={total} finalizate={finalizate} />
            <Toolbar
              cautare={cautare}
              onCautare={setCautare}
              filtru={filtru}
              onFiltru={setFiltru}
              onAdd={handleAdd}
              onArrange={handleArrange}
            />
            <TaskBoard
              taskuri={taskuri}
              idsPotrivite={idsPotrivite}
              idsCuNota={idsCuNota}
              onToggle={handleToggle}
              onDelete={handleDelete}
              onMove={handleMove}
              onFront={handleFront}
              onOpenNotes={handleOpenNotes}
            />
          </>
        ) : (
          <NotesPage
            taskuri={taskuri}
            note={note}
            idSelectat={taskNotita}
            onSelect={setTaskNotita}
            onSave={handleSaveNote}
          />
        )}
      </div>

      {toast && (
        <div className="toast" role="status">
          <span>{toast.mesaj}</span>
          <button onClick={toast.onAction}>{toast.actiune}</button>
        </div>
      )}
    </div>
  );
}
