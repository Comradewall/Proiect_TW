const ICON_BOARD = "M3 3h7v7H3V3zm11 0h7v7h-7V3zM3 14h7v7H3v-7zm11 0h7v7h-7v-7z";
const ICON_NOTE = "M6 2h9l5 5v15H6V2zm8 1.5V8h4.5L14 3.5zM9 12h8v1.5H9V12zm0 4h8v1.5H9V16z";
const ICON_SUN = "M12 7a5 5 0 100 10 5 5 0 000-10zM11 1h2v3h-2V1zm0 19h2v3h-2v-3zM1 11h3v2H1v-2zm19 0h3v2h-3v-2z";
const ICON_MOON = "M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z";

function Icon({ d }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

export default function Sidebar({ pagina, onNavigate, tema, onTema, nrNote }) {
  const elemente = [
    { id: "board", eticheta: "Board", icon: ICON_BOARD },
    { id: "note", eticheta: "Notițe", icon: ICON_NOTE, nr: nrNote },
  ];

  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark" aria-hidden="true">F</span>
        <span className="brand-name">FlowLess</span>
      </div>

      <nav className="nav" aria-label="Navigare principală">
        {elemente.map((el) => (
          <button
            key={el.id}
            className="nav-item"
            aria-current={pagina === el.id ? "page" : undefined}
            onClick={() => onNavigate(el.id)}
          >
            <Icon d={el.icon} />
            <span>{el.eticheta}</span>
            {el.nr > 0 && <span className="nav-count">{el.nr}</span>}
          </button>
        ))}
      </nav>

      <button className="nav-item theme-btn" onClick={onTema} aria-pressed={tema === "dark"}>
        <Icon d={tema === "dark" ? ICON_SUN : ICON_MOON} />
        <span>{tema === "dark" ? "Mod luminos" : "Mod întunecat"}</span>
      </button>
    </aside>
  );
}
