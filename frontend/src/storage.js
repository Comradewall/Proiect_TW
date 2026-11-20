// Date doar de interfață, păstrate în browser: pozițiile cardurilor și notițele.
// Task-urile în sine vin de la server (api.js).
const KEY_POZITII = "flowless:pozitii";
const KEY_NOTE = "flowless:note";

function citeste(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {}; // date corupte sau stocare indisponibilă
  }
}

function scrie(key, valoare) {
  try {
    localStorage.setItem(key, JSON.stringify(valoare));
  } catch {
    /* ignorăm erorile de stocare */
  }
}

export const incarcaPozitii = () => citeste(KEY_POZITII);
export const salveazaPozitii = (pozitii) => scrie(KEY_POZITII, pozitii);

// note[idTask] = { text, updated }
export const incarcaNote = () => citeste(KEY_NOTE);
export const salveazaNote = (note) => scrie(KEY_NOTE, note);

export function numarNote() {
  return Object.values(incarcaNote()).filter((n) => n.text?.trim()).length;
}
