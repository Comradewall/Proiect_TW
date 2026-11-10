import { useRef, useState } from "react";
import { CARD_WIDTH } from "../constants.js";

const ETICHETE_PRIORITATE = { mica: "Mică", medie: "Medie", mare: "Mare" };
const PAS_TASTATURA = 16;

export default function TaskCard({
  task,
  boardRef,
  potrivit,
  areNota,
  onToggle,
  onDelete,
  onMove,
  onFront,
  onOpenNotes,
}) {
  const [seTrage, setSeTrage] = useState(false);
  const start = useRef(null);

  // Cardul rămâne în interiorul suprafeței pe orizontală și nu urcă peste marginea de sus
  function limiteaza(x, y) {
    const latime = boardRef.current ? boardRef.current.clientWidth : 960;
    return {
      x: Math.min(Math.max(0, x), Math.max(0, latime - CARD_WIDTH)),
      y: Math.max(0, y),
    };
  }

  function handlePointerDown(e) {
    if (e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    start.current = { px: e.clientX, py: e.clientY, x: task.x, y: task.y };
    setSeTrage(true);
    onFront(task.id);
  }

  function handlePointerMove(e) {
    if (!start.current) return;
    const { x, y } = limiteaza(
      start.current.x + (e.clientX - start.current.px),
      start.current.y + (e.clientY - start.current.py)
    );
    onMove(task.id, x, y);
  }

  function handlePointerUp() {
    start.current = null;
    setSeTrage(false);
  }

  // Alternativă de la tastatură: săgeți pentru mutare
  function handleKeyDown(e) {
    const delta = {
      ArrowLeft: [-PAS_TASTATURA, 0],
      ArrowRight: [PAS_TASTATURA, 0],
      ArrowUp: [0, -PAS_TASTATURA],
      ArrowDown: [0, PAS_TASTATURA],
    }[e.key];
    if (!delta) return;
    e.preventDefault();
    onFront(task.id);
    const { x, y } = limiteaza(task.x + delta[0], task.y + delta[1]);
    onMove(task.id, x, y);
  }

  const clase = ["task-card"];
  if (task.gata) clase.push("done");
  if (seTrage) clase.push("dragging");

  return (
    <li
      className={`task-slot${potrivit ? "" : " dimmed"}`}
      style={{ transform: `translate3d(${task.x}px, ${task.y}px, 0)`, zIndex: task.z }}
    >
      <article className={clase.join(" ")}>
        <button
          type="button"
          className="card-handle"
          aria-label={`Mută „${task.titlu}”. Folosește tastele săgeată.`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onKeyDown={handleKeyDown}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
            <circle cx="4" cy="3" r="1.3" /><circle cx="10" cy="3" r="1.3" />
            <circle cx="4" cy="7" r="1.3" /><circle cx="10" cy="7" r="1.3" />
            <circle cx="4" cy="11" r="1.3" /><circle cx="10" cy="11" r="1.3" />
          </svg>
          <span className={`tag tag-${task.prioritate}`}>
            Prioritate {ETICHETE_PRIORITATE[task.prioritate].toLowerCase()}
          </span>
        </button>

        <label className="task-main">
          <input type="checkbox" checked={task.gata} onChange={() => onToggle(task.id)} />
          <h3>{task.titlu}</h3>
        </label>

        <div className="card-actions">
          <button className="btn btn-sm" onClick={() => onOpenNotes(task.id)}>
            {areNota ? "Deschide notița" : "Adaugă notiță"}
            {areNota && <span className="dot" aria-label="are notiță" />}
          </button>
          <button
            className="btn btn-sm btn-danger"
            onClick={() => onDelete(task.id)}
            aria-label={`Șterge ${task.titlu}`}
          >
            Șterge
          </button>
        </div>
      </article>
    </li>
  );
}
