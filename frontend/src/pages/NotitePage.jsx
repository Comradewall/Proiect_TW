import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";
import { fetchTasks } from "../api.js";
import { ETICHETE_PRIORITATE } from "../constants.js";
import { incarcaNote, salveazaNote } from "../storage.js";
import styles from "./NotitePage.module.css";

function formatData(ts) {
  return new Date(ts).toLocaleString("ro-RO", { dateStyle: "medium", timeStyle: "short" });
}

// Pagina de notițe: /note (primul task) și /note/:id (task-ul din adresă)
export default function NotitePage() {
  const { id } = useParams();
  const [taskuri, setTaskuri] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [note, setNote] = useState(incarcaNote);

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const data = await fetchTasks();
        if (!ignore) setTaskuri(data);
      } catch (err) {
        if (!ignore) setError(err.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    salveazaNote(note);
  }, [note]);

  const activ = id ? taskuri.find((t) => String(t.id) === id) : taskuri[0];
  const notaActiva = activ ? note[activ.id] : undefined;
  const text = notaActiva?.text ?? "";

  function salveaza(idTask, textNou) {
    setNote((prev) => ({ ...prev, [idTask]: { text: textNou, updated: Date.now() } }));
  }

  function adauga(fragment) {
    const separator = text && !text.endsWith("\n") ? "\n" : "";
    salveaza(activ.id, text + separator + fragment);
  }

  const antet = (
    <PageHeader
      titlu="Notițe pe task-uri"
      subtitlu="Scrie detalii, pași sau decizii pentru fiecare task. Se salvează automat."
    />
  );

  if (loading) {
    return (
      <>
        {antet}
        <p className="info" data-testid="loading">
          Se încarcă...
        </p>
      </>
    );
  }

  if (error) {
    return (
      <>
        {antet}
        <p className="error" data-testid="error">
          {error}
        </p>
      </>
    );
  }

  if (taskuri.length === 0) {
    return (
      <>
        {antet}
        <section className="panel">
          <p className="empty">Nu există task-uri. Adaugă unul în pagina Task-uri pentru a-i scrie o notiță.</p>
        </section>
      </>
    );
  }

  if (!activ) {
    return (
      <>
        {antet}
        <section className="panel">
          <p className="info">Task-ul cerut nu există.</p>
          <Link to="/note">Înapoi la notițe</Link>
        </section>
      </>
    );
  }

  return (
    <>
      {antet}
      <div className={styles.notes}>
        <nav className={styles.list} aria-label="Task-uri">
          <ul>
            {taskuri.map((t) => (
              <li key={t.id}>
                <Link
                  to={`/note/${t.id}`}
                  className={styles.item}
                  aria-current={t.id === activ.id ? "true" : undefined}
                >
                  <span className={t.gata ? `${styles.status} ${styles.ok}` : styles.status} aria-hidden="true" />
                  <span className={styles.itemTitle}>{t.titlu}</span>
                  {note[t.id]?.text?.trim() && <span className="dot" aria-label="are notiță" />}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={`panel ${styles.editor}`}>
          <header>
            <h2>{activ.titlu}</h2>
            <p className={styles.meta}>
              Prioritate {ETICHETE_PRIORITATE[activ.prioritate].toLowerCase()} · {activ.gata ? "Finalizat" : "În lucru"} ·{" "}
              <Link to={`/tasks/${activ.id}`}>Vezi detaliul</Link>
            </p>
          </header>

          <div className={styles.tools} role="group" aria-label="Inserări rapide">
            <button type="button" className="btn btn-sm" onClick={() => adauga("- [ ] ")}>
              Element de listă
            </button>
            <button
              type="button"
              className="btn btn-sm"
              onClick={() => adauga(new Date().toLocaleDateString("ro-RO") + ": ")}
            >
              Data de azi
            </button>
          </div>

          <label className="sr-only" htmlFor="notita">Notița pentru {activ.titlu}</label>
          <textarea
            id="notita"
            className={styles.area}
            placeholder="Scrie aici detalii, pași sau decizii pentru acest task…"
            value={text}
            onChange={(e) => salveaza(activ.id, e.target.value)}
          />

          <footer className={styles.foot}>
            <span>{notaActiva ? `Salvat automat · ${formatData(notaActiva.updated)}` : "Nicio modificare încă"}</span>
            <span>{text.length} caractere</span>
          </footer>
        </div>
      </div>
    </>
  );
}
