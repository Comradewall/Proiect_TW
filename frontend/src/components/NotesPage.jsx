const ETICHETE_PRIORITATE = { mica: "mică", medie: "medie", mare: "mare" };

function formatData(ts) {
  return new Date(ts).toLocaleString("ro-RO", { dateStyle: "medium", timeStyle: "short" });
}

export default function NotesPage({ taskuri, note, idSelectat, onSelect, onSave }) {
  if (taskuri.length === 0) {
    return (
      <section className="panel">
        <p className="empty">Nu există task-uri. Adaugă unul pe Board pentru a-i scrie o notiță.</p>
      </section>
    );
  }

  const activ = taskuri.find((t) => t.id === idSelectat) ?? taskuri[0];
  const notaActiva = note[activ.id];
  const text = notaActiva?.text ?? "";

  function adauga(fragment) {
    const separator = text && !text.endsWith("\n") ? "\n" : "";
    onSave(activ.id, text + separator + fragment);
  }

  return (
    <section className="notes">
      <nav className="panel notes-list" aria-label="Task-uri">
        <ul>
          {taskuri.map((t) => (
            <li key={t.id}>
              <button
                className="notes-item"
                aria-current={t.id === activ.id ? "true" : undefined}
                onClick={() => onSelect(t.id)}
              >
                <span className={`status-dot${t.gata ? " ok" : ""}`} aria-hidden="true" />
                <span className="notes-item-title">{t.titlu}</span>
                {note[t.id]?.text.trim() && <span className="dot" aria-label="are notiță" />}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="panel editor">
        <header className="editor-head">
          <div>
            <h2>{activ.titlu}</h2>
            <p>
              Prioritate {ETICHETE_PRIORITATE[activ.prioritate]} · {activ.gata ? "Finalizat" : "În lucru"}
            </p>
          </div>
        </header>

        <div className="editor-tools" role="group" aria-label="Inserări rapide">
          <button className="btn btn-sm" onClick={() => adauga("- [ ] ")}>Element de listă</button>
          <button
            className="btn btn-sm"
            onClick={() => adauga(new Date().toLocaleDateString("ro-RO") + ": ")}
          >
            Data de azi
          </button>
        </div>

        <label className="sr-only" htmlFor="notita">Notița pentru {activ.titlu}</label>
        <textarea
          id="notita"
          className="editor-area"
          placeholder="Scrie aici detalii, pași sau decizii pentru acest task…"
          value={text}
          onChange={(e) => onSave(activ.id, e.target.value)}
        />

        <footer className="editor-foot">
          <span>{notaActiva ? `Salvat automat · ${formatData(notaActiva.updated)}` : "Nicio modificare încă"}</span>
          <span>{text.length} caractere</span>
        </footer>
      </div>
    </section>
  );
}
