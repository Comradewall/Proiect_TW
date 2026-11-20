import styles from "./PageHeader.module.css";

export default function PageHeader({ titlu, subtitlu }) {
  return (
    <header className={styles.header}>
      <h1>{titlu}</h1>
      {subtitlu && <p>{subtitlu}</p>}
    </header>
  );
}
