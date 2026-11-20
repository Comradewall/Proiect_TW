// Valorile fixe și etichetele lor, într-un singur loc.
// ADAPT: câmpul cu valori fixe al temei proprii.
export const PRIORITATI = [
  { value: "mica", label: "Mică" },
  { value: "medie", label: "Medie" },
  { value: "mare", label: "Mare" },
];

export const ETICHETE_PRIORITATE = Object.fromEntries(
  PRIORITATI.map((p) => [p.value, p.label])
);

// --- Cardurile plutitoare (trebuie să corespundă cu --card-w din TaskCard.module.css) ---
export const CARD_WIDTH = 288;
export const CARD_HEIGHT_ESTIMAT = 176;

const GAP = 24;
const RAND_INALTIME = 200;

// Poziția implicită a unui card într-o grilă fără suprapuneri
export function pozitieInGrila(index, latimeBoard = 960) {
  const coloane = Math.max(1, Math.floor((latimeBoard - GAP) / (CARD_WIDTH + GAP)));
  return {
    x: GAP + (index % coloane) * (CARD_WIDTH + GAP),
    y: GAP + Math.floor(index / coloane) * RAND_INALTIME,
  };
}
