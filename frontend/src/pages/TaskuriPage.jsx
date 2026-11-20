import { useCallback, useEffect, useMemo, useState } from "react";
import PageHeader from "../components/PageHeader.jsx";
import StatsBar from "../components/StatsBar.jsx";
import TaskForm from "../components/TaskForm.jsx";
import TaskFilters from "../components/TaskFilters.jsx";
import TaskList from "../components/TaskList.jsx";
import Toast from "../components/Toast.jsx";
import { createTask, deleteTask, fetchTasks, updateTask } from "../api.js";
import { pozitieInGrila } from "../constants.js";
import { incarcaNote, incarcaPozitii, salveazaPozitii } from "../storage.js";
import styles from "./TaskuriPage.module.css";

export default function TaskuriPage() {
  const [taskuri, setTaskuri] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Doar interfață (în browser): pozițiile cardurilor, filtrele, mesajul „Anulează”
  const [pozitii, setPozitii] = useState(incarcaPozitii);
  const [cautare, setCautare] = useState("");
  const [filtru, setFiltru] = useState("toate");
  const [toast, setToast] = useState(null);
  const [note] = useState(incarcaNote);

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const data = await fetchTasks();
        if (!ignore) setTaskuri(data);
      } catch (err) {
        if (!ignore) setError(err.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    salveazaPozitii(pozitii);
  }, [pozitii]);

  const inchideToast = useCallback(() => setToast(null), []);

  // Fiecare task primește poziția salvată sau un loc liber în grilă
  const taskuriPoz = useMemo(
    () =>
      taskuri.map((t, i) => ({
        ...t,
        ...(pozitii[t.id] ?? { ...pozitieInGrila(i), z: i + 1 }),
      })),
    [taskuri, pozitii]
  );

  // --- Date de la server ---
  async function handleAdd(task) {
    const creat = await createTask(task);
    const top = taskuriPoz.reduce((m, t) => Math.max(m, t.z), 0);
    setTaskuri((prev) => [...prev, creat]);
    setPozitii((prev) => ({
      ...prev,
      [creat.id]: { ...pozitieInGrila(taskuri.length), z: top + 1 },
    }));
  }

  async function handleToggle(id) {
    const task = taskuri.find((t) => t.id === id);
    try {
      const actualizat = await updateTask(id, { gata: !task.gata });
      setTaskuri((prev) => prev.map((t) => (t.id === id ? actualizat : t)));
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    const sters = taskuri.find((t) => t.id === id);
    const poz = taskuriPoz.find((t) => t.id === id);
    try {
      await deleteTask(id);
      setTaskuri((prev) => prev.filter((t) => t.id !== id));
      setToast({
        mesaj: `„${sters.titlu}” a fost șters.`,
        actiune: "Anulează",
        onAction: async () => {
          setToast(null);
          try {
            // Serverul dă un id nou; cardul revine pe locul lui
            const { titlu, gata, prioritate } = sters;
            const recreat = await createTask({ titlu, gata, prioritate });
            setTaskuri((prev) => [...prev, recreat]);
            setPozitii((prev) => ({ ...prev, [recreat.id]: { x: poz.x, y: poz.y, z: poz.z } }));
          } catch (err) {
            setError(err.message);
          }
        },
      });
    } catch (err) {
      setError(err.message);
    }
  }

  // --- Pozițiile cardurilor ---
  function handleMove(id, x, y) {
    setPozitii((prev) => ({
      ...prev,
      [id]: { x, y, z: prev[id]?.z ?? taskuriPoz.find((t) => t.id === id)?.z ?? 1 },
    }));
  }

  function handleFront(id) {
    const top = taskuriPoz.reduce((m, t) => Math.max(m, t.z), 0);
    const curent = taskuriPoz.find((t) => t.id === id);
    if (!curent || curent.z === top) return;
    setPozitii((prev) => ({ ...prev, [id]: { x: curent.x, y: curent.y, z: top + 1 } }));
  }

  function handleArrange() {
    const latime = window.innerWidth <= 860 ? window.innerWidth - 32 : window.innerWidth - 232 - 64;
    setPozitii(
      Object.fromEntries(
        taskuriPoz.map((t, i) => [t.id, { ...pozitieInGrila(i, Math.min(latime, 1400)), z: i + 1 }])
      )
    );
  }

  // --- Valori derivate ---
  const total = taskuri.length;
  const finalizate = taskuri.filter((t) => t.gata).length;

  const idsCuNota = useMemo(
    () => new Set(Object.keys(note).filter((k) => note[k].text?.trim())),
    [note]
  );

  const idsPotrivite = useMemo(() => {
    const q = cautare.trim().toLowerCase();
    return new Set(
      taskuri
        .filter((t) => (filtru === "toate" || t.prioritate === filtru) && t.titlu.toLowerCase().includes(q))
        .map((t) => t.id)
    );
  }, [taskuri, cautare, filtru]);

  return (
    <>
      <PageHeader
        titlu="Board de sarcini"
        subtitlu="Trage cardurile oriunde pe suprafața de lucru pentru a le organiza după cum preferi."
      />
      <StatsBar total={total} finalizate={finalizate} />

      <section className={styles.toolbar} aria-label="Instrumente">
        <TaskForm onAdd={handleAdd} />
        <TaskFilters
          cautare={cautare}
          onCautare={setCautare}
          filtru={filtru}
          onFiltru={setFiltru}
          onArrange={handleArrange}
        />
      </section>

      {loading && (
        <p className="info" data-testid="loading">
          Se încarcă...
        </p>
      )}
      {error && (
        <p className="error" data-testid="error">
          {error}
        </p>
      )}
      {!loading && (
        <TaskList
          taskuri={taskuriPoz}
          idsPotrivite={idsPotrivite}
          idsCuNota={idsCuNota}
          onToggle={handleToggle}
          onDelete={handleDelete}
          onMove={handleMove}
          onFront={handleFront}
        />
      )}

      {toast && (
        <Toast
          mesaj={toast.mesaj}
          actiune={toast.actiune}
          onAction={toast.onAction}
          onClose={inchideToast}
        />
      )}
    </>
  );
}
