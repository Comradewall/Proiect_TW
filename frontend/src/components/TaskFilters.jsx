import { PRIORITATI } from "../constants.js";
import styles from "./TaskFilters.module.css";

const FILTRE = [{ value: "toate", label: "Toate" }, ...PRIORITATI];

export default function TaskFilters({ cautare, onCautare, filtru, onFiltru, onArrange }) {
  return (
    <div className={styles.filters}>
      <label className="sr-only" htmlFor="cautare">Caută în task-uri</label>
      <input
        id="cautare"
        type="search"
        className={`input ${styles.search}`}
        placeholder="Caută în task-uri"
        value={cautare}
        onChange={(e) => onCautare(e.target.value)}
      />
      <div className={styles.chips} role="group" aria-label="Filtrează după prioritate">
        {FILTRE.map((f) => (
          <button
            key={f.value}
            type="button"
            className={styles.chip}
            aria-pressed={filtru === f.value}
            onClick={() => onFiltru(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>
      <button type="button" className="btn" onClick={onArrange}>
        Aranjează în grilă
      </button>
    </div>
  );
}
