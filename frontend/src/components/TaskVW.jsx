
const ETICHETE_PRIORITATE = { mica: "mică", medie: "medie", mare: "mare" };

export default function TaskVW({ task }) {
  return (
    <li className={task.gata ? "task-card done" : "task-card"}>
      <div>
        <h3>{task.titlu}</h3>
        <span className={`badge badge-${task.prioritate}`}>
          Prioritate {ETICHETE_PRIORITATE[task.prioritate]}
        </span>
      </div>
      <span className="status">{task.gata ? "Gata" : "Activ"}</span>
    </li>
  );
}