import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "../components/admin/admin-shell";
import { UploadDocumentDrawer } from "../components/admin/forms";
import { useAdmin } from "./admin";
import { FileText, Upload, Search } from "lucide-react";

export const Route = createFileRoute("/admin/documents")({
  head: () => ({ meta: [{ title: "Documents — Jabamiah Admin" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: DocumentsPage,
});

const docs = [
  { name: "Compte-rendu — Sophie M.", type: "PDF", size: "128 Ko", client: "Sophie Martin", date: "18/05/2024" },
  { name: "Bilan initial — Julien D.", type: "PDF", size: "204 Ko", client: "Julien Dupont", date: "12/04/2024" },
  { name: "Ordonnance plantes — Marie L.", type: "PDF", size: "84 Ko", client: "Marie Leroy", date: "10/05/2024" },
  { name: "Analyse sanguine — Antoine B.", type: "PDF", size: "312 Ko", client: "Antoine Bernard", date: "05/05/2024" },
  { name: "Protocole méditation", type: "DOCX", size: "42 Ko", client: "—", date: "01/05/2024" },
  { name: "Feuille de suivi énergétique", type: "PDF", size: "68 Ko", client: "—", date: "28/04/2024" },
];

function DocumentsPage() {
  const { signOut } = useAdmin();
  return (
    <AdminShell
      title="Documents"
      subtitle={`${docs.length} documents · Modèles & comptes-rendus`}
      onSignOut={signOut}
      actions={
        <UploadDocumentDrawer>
          {(open) => (
            <button
              onClick={open}
              className="inline-flex items-center gap-2 rounded-md bg-forest px-4 py-2.5 text-xs uppercase tracking-[0.15em] text-cream hover:bg-forest-soft"
            >
              <Upload className="h-3.5 w-3.5" /> Importer
            </button>
          )}
        </UploadDocumentDrawer>
      }
    >
      <div className="mb-4 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-earth/50" />
          <input placeholder="Rechercher un document…" className="w-full rounded-md border border-gold/20 bg-card py-2.5 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold" />
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl bg-card ring-1 ring-gold/15">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-cream-warm/60 text-left text-xs uppercase tracking-[0.15em] text-forest">
            <tr>
              <th className="px-4 py-3">Document</th>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Taille</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gold/10">
            {docs.map((d) => (
              <tr key={d.name} className="hover:bg-cream-warm/30">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-lg bg-[color:var(--rose-soft)] text-[color:var(--rose-text)]">
                      <FileText className="h-4 w-4" />
                    </div>
                    <span className="font-medium text-forest">{d.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-earth/80">{d.client}</td>
                <td className="px-4 py-3 text-earth/70">{d.type}</td>
                <td className="px-4 py-3 text-earth/70">{d.size}</td>
                <td className="px-4 py-3 text-earth/70">{d.date}</td>
                <td className="px-4 py-3 text-right">
                  <button className="text-xs uppercase tracking-[0.15em] text-gold hover:text-forest">Ouvrir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
