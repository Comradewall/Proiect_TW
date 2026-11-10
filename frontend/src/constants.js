// Dimensiuni comune pentru carduri (trebuie să corespundă cu --card-w din App.css)
export const CARD_WIDTH = 288;
export const CARD_HEIGHT_ESTIMAT = 176;

const GAP = 24;
const RAND_INALTIME = 200;

// Poziția unui card într-o grilă simplă, folosită la start și la „Aranjează”
export function pozitieInGrila(index, latimeBoard = 960) {
  const coloane = Math.max(1, Math.floor((latimeBoard - GAP) / (CARD_WIDTH + GAP)));
  return {
    x: GAP + (index % coloane) * (CARD_WIDTH + GAP),
    y: GAP + Math.floor(index / coloane) * RAND_INALTIME,
  };
}
