import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { numarNote } from "../storage.js";
import styles from "./Layout.module.css";

const ICON_BOARD = "M3 3h7v7H3V3zm11 0h7v7h-7V3zM3 14h7v7H3v-7zm11 0h7v7h-7v-7z";
const ICON_NOTE = "M6 2h9l5 5v15H6V2zm8 1.5V8h4.5L14 3.5zM9 12h8v1.5H9V12zm0 4h8v1.5H9V16z";
const ICON_INFO = "M12 2a10 10 0 100 20 10 10 0 000-20zm-1 5h2v2h-2V7zm0 4h2v6h-2v-6z";
const ICON_SUN = "M12 7a5 5 0 100 10 5 5 0 000-10zM11 1h2v3h-2V1zm0 19h2v3h-2v-3zM1 11h3v2H1v-2zm19 0h3v2h-3v-2z";
const ICON_MOON = "M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z";

function Icon({ d }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

// NavLink marchează singur pagina curentă
function navClass({ isActive }) {
  return isActive ? `${styles.link} ${styles.active}` : styles.link;
}

function temaInitiala() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function Layout() {
  const [tema, setTema] = useState(temaInitiala);
  useLocation(); // re-randează la schimbarea paginii, ca numărul de notițe să rămână la zi
  const nrNote = numarNote();

  // Tema: state-ul pentru buton, atributul data-theme pentru CSS
  useEffect(() => {
    document.documentElement.dataset.theme = tema;
  }, [tema]);

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <span className={styles.mark} aria-hidden="true">F</span>
          <span className={styles.logo}>FlowLess</span>
        </div>

        <nav className={styles.nav} data-testid="nav" aria-label="Navigare principală">
          <NavLink to="/" end className={navClass}>
            <Icon d={ICON_BOARD} />
            <span>Task-uri</span>
          </NavLink>
          <NavLink to="/note" className={navClass}>
            <Icon d={ICON_NOTE} />
            <span>Notițe</span>
            {nrNote > 0 && <span className={styles.count}>{nrNote}</span>}
          </NavLink>
          <NavLink to="/despre" className={navClass}>
            <Icon d={ICON_INFO} />
            <span>Despre</span>
          </NavLink>
        </nav>

        <button
          type="button"
          className={`${styles.link} ${styles.theme}`}
          onClick={() => setTema((t) => (t === "dark" ? "light" : "dark"))}
          aria-pressed={tema === "dark"}
        >
          <Icon d={tema === "dark" ? ICON_SUN : ICON_MOON} />
          <span>{tema === "dark" ? "Mod luminos" : "Mod întunecat"}</span>
        </button>
      </aside>

      <div className={styles.content}>
        <main className={styles.main}>
          <Outlet />
        </main>
        <footer className={styles.footer}>Proiect Tehnologii Web</footer>
      </div>
    </div>
  );
}
