import { useEffect } from "react";
import styles from "./Toast.module.css";

export default function Toast({ mesaj, actiune, onAction, onClose }) {
  // Dispare singur după 6 secunde
  useEffect(() => {
    const t = setTimeout(onClose, 6000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className={styles.toast} role="status">
      <span>{mesaj}</span>
      <button type="button" onClick={onAction}>{actiune}</button>
    </div>
  );
}
