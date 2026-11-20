import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { CARD_WIDTH, ETICHETE_PRIORITATE } from "../constants.js";
import styles from "./TaskCard.module.css";

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

  const clase = [styles.card];
  if (task.gata) clase.push(styles.done);
  if (seTrage) clase.push(styles.dragging);

  return (
    <li
      className={potrivit ? styles.slot : `${styles.slot} ${styles.dimmed}`}
      style={{ transform: `translate3d(${task.x}px, ${task.y}px, 0)`, zIndex: task.z }}
      data-testid="item"
      data-id={task.id}
    >
      <article className={clase.join(" ")}>
        <button
          type="button"
          className={styles.handle}
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
          <span className={`badge badge-${task.prioritate} ${styles.prio}`}>
            Prioritate {ETICHETE_PRIORITATE[task.prioritate].toLowerCase()}
          </span>
        </button>

        <div className={styles.main}>
          <input
            type="checkbox"
            checked={task.gata}
            onChange={() => onToggle(task.id)}
            aria-label={`Marchează ${task.titlu}`}
            data-testid="item-toggle"
          />
          <h3>
            <Link to={`/tasks/${task.id}`} className={styles.title} data-testid="item-link">
              {task.titlu}
            </Link>
          </h3>
        </div>

        <div className={styles.actions}>
          <Link to={`/note/${task.id}`} className="btn btn-sm">
            {areNota ? "Deschide notița" : "Adaugă notiță"}
            {areNota && <span className="dot" aria-label="are notiță" />}
          </Link>
          <button
            type="button"
            className="btn btn-sm btn-danger"
            onClick={() => onDelete(task.id)}
            aria-label={`Șterge ${task.titlu}`}
            data-testid="item-delete"
          >
            Șterge
          </button>
        </div>
      </article>
    </li>
  );
}
