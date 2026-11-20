// Toate cererile HTTP într-un singur loc.
// Dacă ai deja un api.js din etapele anterioare, păstrează-l și adaugă doar fetchTask.
const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`Eroare server: ${res.status}`);
  return res.status === 204 ? null : res.json();
}

export function fetchTasks() {
  return request("/tasks");
}

export function fetchTask(id) {
  return request(`/tasks/${id}`);
}

export function createTask(task) {
  return request("/tasks", { method: "POST", body: JSON.stringify(task) });
}

export function updateTask(id, patch) {
  return request(`/tasks/${id}`, { method: "PATCH", body: JSON.stringify(patch) });
}

export function deleteTask(id) {
  return request(`/tasks/${id}`, { method: "DELETE" });
}
