import styles from "./StatsBar.module.css";

export default function StatsBar({ total, finalizate }) {
  const active = total - finalizate;
  const procent = total > 0 ? Math.round((finalizate / total) * 100) : 0;

  return (
    <section className={`panel ${styles.stats}`} aria-label="Progres">
      <dl className={styles.values}>
        <div>
          <dt>Total</dt>
          <dd>{total}</dd>
        </div>
        <div>
          <dt>Active</dt>
          <dd>{active}</dd>
        </div>
        <div>
          <dt>Finalizate</dt>
          <dd>{finalizate}</dd>
        </div>
      </dl>
      <div className={styles.progressWrap}>
        <div className={styles.progressLabel}>
          <span>Progres general</span>
          <strong>{procent}%</strong>
        </div>
        <div
          className={styles.progress}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={procent}
        >
          <div className={styles.fill} style={{ width: `${procent}%` }} />
        </div>
      </div>
    </section>
  );
}
