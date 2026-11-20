import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";

export default function NotFoundPage() {
  return (
    <>
      <PageHeader titlu="Pagina nu există" />
      <section className="panel" data-testid="not-found">
        <p className="info">Adresa cerută nu duce nicăieri.</p>
        <Link to="/">Înapoi la task-uri</Link>
      </section>
    </>
  );
}
