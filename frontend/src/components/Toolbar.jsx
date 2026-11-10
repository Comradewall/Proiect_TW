import { useState } from "react";

const FILTRE = [
  { id: "toate", eticheta: "Toate" },
  { id: "mare", eticheta: "Prioritate mare" },
  { id: "medie", eticheta: "Medie" },
  { id: "mica", eticheta: "Mică" },
];

export default function Toolbar({ cautare, onCautare, filtru, onFiltru, onAdd, onArrange }) {
  const [titlu, setTitlu] = useState("");
  const [prioritate, setPrioritate] = useState("medie");

  function handleSubmit(e) {
    e.preventDefault();
    const curat = titlu.trim();
    if (!curat) return;
    onAdd(curat, prioritate);
    setTitlu("");
  }

  return (
    <section className="toolbar" aria-label="Instrumente">
      <form className="add-form" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="task-nou">Titlu task nou</label>
        <input
          id="task-nou"
          className="input grow"
          placeholder="Adaugă un task nou…"
          value={titlu}
          onChange={(e) => setTitlu(e.target.value)}
        />
        <label className="sr-only" htmlFor="prio-noua">Prioritate</label>
        <select
          id="prio-noua"
          className="input"
          value={prioritate}
          onChange={(e) => setPrioritate(e.target.value)}
        >
          <option value="mica">Prioritate mică</option>
          <option value="medie">Prioritate medie</option>
          <option value="mare">Prioritate mare</option>
        </select>
        <button type="submit" className="btn btn-primary" disabled={!titlu.trim()}>
          Adaugă task
        </button>
      </form>

      <div className="filters">
        <label className="sr-only" htmlFor="cautare">Caută în task-uri</label>
        <input
          id="cautare"
          type="search"
          className="input search"
          placeholder="Caută în task-uri"
          value={cautare}
          onChange={(e) => onCautare(e.target.value)}
        />
        <div className="chips" role="group" aria-label="Filtrează după prioritate">
          {FILTRE.map((f) => (
            <button
              key={f.id}
              className="chip"
              aria-pressed={filtru === f.id}
              onClick={() => onFiltru(f.id)}
            >
              {f.eticheta}
            </button>
          ))}
        </div>
        <button className="btn" onClick={onArrange}>Aranjează în grilă</button>
      </div>
    </section>
  );
}
