import PageHeader from "../components/PageHeader.jsx";

// ADAPT: descrierea aplicației proprii și tehnologiile folosite.
export default function DesprePage() {
  return (
    <>
      <PageHeader titlu="Despre FlowLess" />
      <section className="panel">
        <h2>Despre aplicație</h2>
        <p>
          FlowLess este un task manager construit pas cu pas, pe parcursul
          semestrului, în cadrul proiectului de Tehnologii Web. Task-urile sunt
          carduri plutitoare pe care le poți aranja liber, iar fiecare are o
          notiță proprie.
        </p>
        <p>Stack: React, Vite, React Router, Node.js, Express, MariaDB, Docker.</p>
      </section>
    </>
  );
}
