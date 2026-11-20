import { useRef } from "react";
import TaskCard from "./TaskCard.jsx";
import { CARD_HEIGHT_ESTIMAT } from "../constants.js";
import styles from "./TaskList.module.css";

// Suprafața de lucru: cardurile sunt poziționate absolut și pot fi trase liber.
// Primește lista și funcțiile și le transmite fiecărui card.
export default function TaskList({
  taskuri,
  idsPotrivite,
  idsCuNota,
  onToggle,
  onDelete,
  onMove,
  onFront,
}) {
  const boardRef = useRef(null);
  const inaltime = Math.max(520, ...taskuri.map((t) => t.y + CARD_HEIGHT_ESTIMAT + 48));

  return (
    <section
      ref={boardRef}
      className={styles.board}
      style={{ minHeight: inaltime }}
      aria-label="Suprafață de lucru cu task-uri"
    >
      {taskuri.length === 0 && (
        <p className="empty" data-testid="empty">
          Nu există niciun task. Adaugă unul din formularul de sus.
        </p>
      )}
      <ul className={styles.list}>
        {taskuri.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            boardRef={boardRef}
            potrivit={idsPotrivite.has(task.id)}
            areNota={idsCuNota.has(String(task.id))}
            onToggle={onToggle}
            onDelete={onDelete}
            onMove={onMove}
            onFront={onFront}
          />
        ))}
      </ul>
    </section>
  );
}
