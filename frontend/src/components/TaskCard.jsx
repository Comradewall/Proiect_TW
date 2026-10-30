// ADAPT: câmpurile entității din tema proprie
const ETICHETE_PRIORITATE = { mica: "mică", medie: "medie", mare: "mare" };

export default function TaskCard({ task, onToggle, onDelete }) {
  return (
    <li className={task.gata ? "task-card done" : "task-card"}>
      <label className="task-main">
        <input
          type="checkbox"
          checked={task.gata}
          onChange={() => onToggle(task.id)}
        />
        <div>
          <h3>{task.titlu}</h3>
          <span className={`badge badge-${task.prioritate}`}>
            Prioritate {ETICHETE_PRIORITATE[task.prioritate]}
          </span>
        </div>
      </label>
      <button
        className="btn-danger"
        onClick={() => onDelete(task.id)}
        aria-label={`Șterge ${task.titlu}`}
      >
        Șterge
      </button>
    </li>
  );
}