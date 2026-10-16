const taskuri = [
 { id: 1, titlu: "Tema la Baze de date", gata: false, prioritate: "mare" },
 { id: 2, titlu: "Citit capitolul 3", gata: true, prioritate: "medie" },
 { id: 3, titlu: "Cumpărat cafea", gata: false, prioritate: "mica" },
];

export default function App() {
  const active = taskuri.filter((t) => !t.gata).length;
 return (
 <>
     <header class="app-header">
    <div class="header-content">
      <h1>KanbanBoard</h1>
      <p>Management vizual al proiectelor și sarcinilor.</p>
    </div>
    <p class="app-count">3 sarcini, dintre care 2 active</p>
  </header>

  <main class="container">
    <section class="panel form-panel">
      <h2>Adaugă un task nou</h2>
      <form class="item-form">
        <div class="form-group">
          <label>Titlu task
            <input type="text" name="titlu" placeholder="Ex: Integrare API..." />
          </label>
        </div>
        <div class="form-group">
          <label>Prioritate
            <select name="eticheta">
              <option value="mica">Mică</option>
              <option value="medie">Medie</option>
              <option value="mare">Mare</option>
            </select>
          </label>
        </div>
        <button type="submit">Adaugă pe Board</button>
      </form>
    </section>
    <section class="kanban-board">
      <div class="kanban-column">
        <div class="column-header">
          <h2>De făcut</h2>
          <span class="task-counter">1</span>
        </div>
        <ul class="item-list">
          <li class="item-card">
            <div class="card-badges">
              <span class="badge badge-mare">Prioritate Mare</span>
            </div>
            <h3>Creare mockup interfață HTML/CSS</h3>
            <span class="status">Activ</span>
          </li>
        </ul>
      </div>
      <div class="kanban-column">
        <div class="column-header">
          <h2>În lucru</h2>
          <span class="task-counter">1</span>
        </div>
        <ul class="item-list">
          <li class="item-card">
            <div class="card-badges">
              <span class="badge badge-mica">Prioritate Mică</span>
            </div>
            <h3>Documentare componente React</h3>
            <span class="status">Activ</span>
          </li>
        </ul>
      </div>
      <div class="kanban-column">
        <div class="column-header">
          <h2>Finalizate</h2>
          <span class="task-counter">1</span>
        </div>
        <ul class="item-list">
          <li class="item-card done">
            <div class="card-badges">
              <span class="badge badge-medie">Prioritate Medie</span>
            </div>
            <h3>Configurare mediu GitHub și Git</h3>
            <span class="status">Finalizat</span>
          </li>
        </ul>
      </div>

    </section>
  </main>

  <footer class="app-footer">
    Proiect Tehnologii Web - Etapa 1
  </footer>
 </>
 );
}