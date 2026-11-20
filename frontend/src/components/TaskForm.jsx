import { useState } from "react";
import { PRIORITATI } from "../constants.js";
import styles from "./TaskForm.module.css";

// IMPORTANT: ghidul nu arată tabelul 7.3 (atributele data-testid din Etapa 7), deci aici lipsesc
// atributele formularului: <form>, câmpul de titlu, selectul de prioritate, butonul și mesajul de
// eroare. Copiază-le din TaskForm.jsx-ul tău din Etapa 7 sau, mai simplu, păstrează fișierul
// acela și schimbă în el doar importul PRIORITATI și clasele (styles.form, btn).
export default function TaskForm({ onAdd }) {
  const [titlu, setTitlu] = useState("");
  const [prioritate, setPrioritate] = useState("medie");
  const [eroare, setEroare] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    const curat = titlu.trim();
    // ADAPT: regulile de validare din Etapa 7
    if (curat.length < 3) {
      setEroare("Titlul trebuie să aibă cel puțin 3 caractere.");
      return;
    }
    try {
      await onAdd({ titlu: curat, gata: false, prioritate });
      setTitlu("");
      setEroare(null);
    } catch (err) {
      setEroare(err.message);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.row}>
        <label className="sr-only" htmlFor="task-nou">Titlu task nou</label>
        <input
          id="task-nou"
          className={`input ${styles.titlu}`}
          placeholder="Adaugă un task nou…"
          value={titlu}
          onChange={(e) => setTitlu(e.target.value)}
          aria-invalid={eroare ? "true" : undefined}
        />
        <label className="sr-only" htmlFor="prio-noua">Prioritate</label>
        <select
          id="prio-noua"
          className="input"
          value={prioritate}
          onChange={(e) => setPrioritate(e.target.value)}
        >
          {PRIORITATI.map((p) => (
            <option key={p.value} value={p.value}>
              Prioritate {p.label.toLowerCase()}
            </option>
          ))}
        </select>
        <button type="submit" className="btn btn-primary">
          Adaugă task
        </button>
      </div>
      {eroare && (
        <p className="error" role="alert">
          {eroare}
        </p>
      )}
    </form>
  );
}
