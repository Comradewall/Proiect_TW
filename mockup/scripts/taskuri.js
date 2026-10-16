
const taskuri = [
  { id: 1, titlu: "Creare mockup interfață HTML/CSS", finalizat: false, prioritate: "mare" },
  { id: 2, titlu: "Configurare mediu GitHub și Git", finalizat: true, prioritate: "medie" },
  { id: 3, titlu: "Documentare componente React", finalizat: false, prioritate: "mica" }
];

const PRIORITATI = ["mica", "medie", "mare"];

function listeazaTitluri(lista) {
  return lista.map((t) => t.titlu);
}

function numaraActive(lista) {
  return lista.filter((t) => !t.finalizat).length;
}

function cautaDupaTitlu(lista, text) {
  const textMic = text.toLowerCase();
  return lista.filter((t) => t.titlu.toLowerCase().includes(textMic));
}

function nextId(lista) {
  return lista.reduce((max, t) => Math.max(max, t.id), 0) + 1;
}

function adaugaTask(lista, titlu, prioritate = "medie") {
  const titluCurat = titlu.trim();
  
  if (!titluCurat) {
    console.error("Eroare: Titlul nu poate fi gol.");
    return lista;
  }

  if (!PRIORITATI.includes(prioritate)) {
    console.error(`Eroare: Prioritate invalidă: ${prioritate}`);
    return lista;
  }

  const nouTask = {
    id: nextId(lista),
    titlu: titluCurat,
    finalizat: false,
    prioritate: prioritate
  };
  
  return [...lista, nouTask];
}

function comutaFinalizat(lista, id) {
  return lista.map((t) => 
    t.id === id ? { ...t, finalizat: !t.finalizat } : t
  );
}

function stergeTask(lista, id) {
  return lista.filter((t) => t.id !== id);
}

console.log("--- Citire ---");
console.log("Titluri:", listeazaTitluri(taskuri).join(", "));
console.log("Active:", numaraActive(taskuri));
console.log("Căutare 'react':", listeazaTitluri(cautaDupaTitlu(taskuri, "react")).join(", "));

console.log("--- Adăugare ---");
let lista = adaugaTask(taskuri, "Design arhitectură bază de date", "mare");
console.log("Lista nouă:", lista.length, "sarcini");
console.log("Originalul a rămas cu:", taskuri.length, "sarcini");

console.log("--- Modificare și ștergere ---");
lista = comutaFinalizat(lista, 1);
console.log("După bifarea id 1, active:", numaraActive(lista));

lista = stergeTask(lista, 3);
console.log("După ștergerea id 3:", listeazaTitluri(lista).join(", "));

console.log("--- Validare ---");
adaugaTask(lista, "   "); // Titlu gol
adaugaTask(lista, "Cumpărat cafea", "urgenta"); // Prioritate invalida