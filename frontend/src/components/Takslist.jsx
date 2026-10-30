import TaskVW from "./TaskVW.jsx";

export default function TaskList({ taskuri }) {
  if (taskuri.length === 0) {
    return <p className="empty">Nu există niciun task.</p>;
  }

  return (
    <ul className="task-list">
      {taskuri.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </ul>
  );
}