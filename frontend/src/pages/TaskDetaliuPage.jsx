import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";
import { fetchTask } from "../api.js";
import { ETICHETE_PRIORITATE } from "../constants.js";
import { incarcaNote } from "../storage.js";
import styles from "./TaskDetaliuPage.module.css";

export default function TaskDetaliuPage() {
  const { id } = useParams(); // text din URL, de exemplu "3"
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Se reîncarcă dacă se schimbă id-ul din adresă
  useEffect(() => {
    let ignore = false;
    fetchTask(id)
      .then((data) => {
        if (!ignore) {
          setTask(data);
          setError(null); // o eroare de la un id anterior nu mai este valabilă
        }
      })
      .catch((err) => {
        if (!ignore) setError(err.message);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [id]);

  // Notița vine din browser; apare doar aici și în pagina Notițe
  const nota = useMemo(() => incarcaNote()[id]?.text?.trim() ?? "", [id]);

  if (loading) {
    return (
      <p className="info" data-testid="loading">
        Se încarcă...
      </p>
    );
  }

  if (error) {
    return (
      <>
        <PageHeader titlu="Detaliu task" />
        <section className="panel">
          <p className="error" data-testid="error">
            Task-ul nu a putut fi încărcat: {error}
          </p>
          <Link to="/" className={styles.back}>
            Înapoi la listă
          </Link>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHeader titlu="Detaliu task" subtitlu="Informațiile complete ale task-ului selectat." />
      <section className={`panel ${styles.detail}`} data-testid="detail">
        <Link to="/" className={styles.back}>
          Înapoi la listă
        </Link>
        <h2 className={task.gata ? styles.done : undefined} data-testid="detail-title">
          {task.titlu}
        </h2>
        <dl className={styles.fields}>
          <dt>Prioritate</dt>
          <dd>
            <span className={`badge badge-${task.prioritate}`}>
              {ETICHETE_PRIORITATE[task.prioritate]}
            </span>
          </dd>
          <dt>Status</dt>
          <dd>{task.gata ? "Gata" : "Activ"}</dd>
          <dt>ID</dt>
          <dd>{task.id}</dd>
          <dt>Notiță</dt>
          <dd>
            {nota ? <p className={styles.note}>{nota}</p> : <span className="info">Nicio notiță încă.</span>}
            <Link to={`/note/${task.id}`}>{nota ? "Editează notița" : "Adaugă o notiță"}</Link>
          </dd>
        </dl>
      </section>
    </>
  );
}
