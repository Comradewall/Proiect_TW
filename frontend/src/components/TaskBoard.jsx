import { useRef } from "react";
import TaskCard from "./TaskCard.jsx";
import { CARD_HEIGHT_ESTIMAT } from "../constants.js";

// Suprafața de lucru: cardurile sunt poziționate absolut și pot fi trase liber.
export default function TaskBoard({
  taskuri,
  idsPotrivite,
  idsCuNota,
  onToggle,
  onDelete,
  onMove,
  onFront,
  onOpenNotes,
}) {
  const boardRef = useRef(null);
  const inaltime = Math.max(
    520,
    ...taskuri.map((t) => t.y + CARD_HEIGHT_ESTIMAT + 48)
  );

  return (
    <section
      ref={boardRef}
      className="board"
      style={{ minHeight: inaltime }}
      aria-label="Suprafață de lucru cu task-uri"
    >
      {taskuri.length === 0 && (
        <p className="empty">Nu mai ai niciun task. Adaugă unul din bara de sus.</p>
      )}
      <ul className="board-list">
        {taskuri.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            boardRef={boardRef}
            potrivit={idsPotrivite.has(task.id)}
            areNota={idsCuNota.has(task.id)}
            onToggle={onToggle}
            onDelete={onDelete}
            onMove={onMove}
            onFront={onFront}
            onOpenNotes={onOpenNotes}
          />
        ))}
      </ul>
    </section>
  );
}
