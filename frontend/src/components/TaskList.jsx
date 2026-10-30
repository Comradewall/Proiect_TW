import TaskCard from "./TaskCard.jsx";

// Primește lista și funcțiile și le transmite fiecărui card.
export default function TaskList({ taskuri, onToggle, onDelete }) {
  if (taskuri.length === 0) {
    return <p className="empty">Nu există niciun task.</p>;
  }

  return (
    <ul className="task-list">
      {taskuri.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}