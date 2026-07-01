import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminShell } from "../components/admin/admin-shell";
import { useAdmin } from "./admin";
import { Search, Plus, Phone, Mail, Filter } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/admin/clients")({
  head: () => ({ meta: [{ title: "Clients — Jabamiah Admin" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: ClientsPage,
});

export type Client = {
  id: string;
  name: string;
  age: number;
  phone: string;
  email: string;
  city: string;
  sessions: number;
  lastSession: string;
  nextSession: string;
  status: "Actif" | "Fidèle" | "Nouveau" | "Inactif";
};

export const CLIENTS: Client[] = [
  { id: "1", name: "Sophie Martin", age: 42, phone: "06 12 34 56 78", email: "sophie.martin@mail.com", city: "Rouen", sessions: 12, lastSession: "18/05/2024", nextSession: "25/05/2024 · 14h00", status: "Fidèle" },
  { id: "2", name: "Julien Dupont", age: 36, phone: "06 22 45 67 89", email: "julien.dupont@mail.com", city: "Le Havre", sessions: 6, lastSession: "20/05/2024", nextSession: "04/07/2024 · 10h30", status: "Actif" },
  { id: "3", name: "Marie Leroy", age: 51, phone: "06 78 12 34 56", email: "marie.leroy@mail.com", city: "Dieppe", sessions: 1, lastSession: "—", nextSession: "04/07/2024 · 16h00", status: "Nouveau" },
  { id: "4", name: "Antoine Bernard", age: 29, phone: "06 33 44 55 66", email: "a.bernard@mail.com", city: "Rouen", sessions: 4, lastSession: "12/05/2024", nextSession: "05/07/2024 · 09h30", status: "Actif" },
  { id: "5", name: "Nora Kessab", age: 34, phone: "06 55 66 77 88", email: "nora.k@mail.com", city: "Évreux", sessions: 0, lastSession: "—", nextSession: "03/07/2024 · 16h00", status: "Nouveau" },
  { id: "6", name: "Camille Robert", age: 47, phone: "06 99 88 77 66", email: "c.robert@mail.com", city: "Rouen", sessions: 18, lastSession: "10/05/2024", nextSession: "—", status: "Fidèle" },
  { id: "7", name: "Paul Girard", age: 62, phone: "06 11 22 33 44", email: "paul.girard@mail.com", city: "Yvetot", sessions: 3, lastSession: "02/03/2024", nextSession: "—", status: "Inactif" },
];

const statusTone: Record<Client["status"], string> = {
  Actif: "bg-forest/10 text-forest",
  Fidèle: "bg-[color:var(--gold-soft)]/60 text-[color:var(--earth)]",
  Nouveau: "bg-[color:var(--rose-soft)] text-[color:var(--rose-text)]",
  Inactif: "bg-earth/10 text-earth/70",
};

function ClientsPage() {
  const { signOut } = useAdmin();
  const [q, setQ] = useState("");
  const filtered = CLIENTS.filter((c) => c.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <AdminShell
      title="Clients"
      subtitle={`${CLIENTS.length} fiches clients`}
      onSignOut={signOut}
      actions={
        <button className="inline-flex items-center gap-2 rounded-md bg-forest px-4 py-2.5 text-xs uppercase tracking-[0.15em] text-cream hover:bg-forest-soft">
          <Plus className="h-3.5 w-3.5" /> Nouveau client
        </button>
      }
    >
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-earth/50" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Rechercher un client…"
            className="w-full rounded-md border border-gold/20 bg-card py-2.5 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </div>
        <button className="inline-flex items-center gap-2 rounded-md border border-gold/30 bg-card px-4 py-2.5 text-xs uppercase tracking-[0.15em] text-forest hover:bg-cream-warm">
          <Filter className="h-3.5 w-3.5" /> Filtres
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl bg-card ring-1 ring-gold/15">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-cream-warm/60 text-left text-xs uppercase tracking-[0.15em] text-forest">
            <tr>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Ville</th>
              <th className="px-4 py-3">Séances</th>
              <th className="px-4 py-3">Prochaine séance</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gold/10">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-cream-warm/30">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-forest text-xs font-medium text-cream">
                      {c.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-medium text-forest">{c.name}</p>
                      <p className="text-xs text-earth/60">{c.age} ans</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-earth/70">
                  <p className="flex items-center gap-1"><Phone className="h-3 w-3" />{c.phone}</p>
                  <p className="flex items-center gap-1 mt-1"><Mail className="h-3 w-3" />{c.email}</p>
                </td>
                <td className="px-4 py-3 text-earth/80">{c.city}</td>
                <td className="px-4 py-3 text-forest font-medium">{c.sessions}</td>
                <td className="px-4 py-3 text-xs text-earth/70">{c.nextSession}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-[10px] uppercase tracking-widest ${statusTone[c.status]}`}>
                    {c.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link to="/admin/clients/$id" params={{ id: c.id }} className="text-xs uppercase tracking-[0.15em] text-gold hover:text-forest">
                    Ouvrir →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
