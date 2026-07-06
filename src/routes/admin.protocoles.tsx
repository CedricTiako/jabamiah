import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "../components/admin/admin-shell";
import { NewProtocolDrawer } from "../components/admin/forms";
import { useAdmin } from "./admin";
import { Plus, Layers } from "lucide-react";

export const Route = createFileRoute("/admin/protocoles")({
  head: () => ({ meta: [{ title: "Protocoles — Jabamiah Admin" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: ProtocolesPage,
});

const protocoles = [
  { name: "Nettoyage énergétique", desc: "Rituel de purification en 4 étapes", used: 42, duration: "45 min" },
  { name: "Harmonisation des chakras", desc: "Rééquilibrage des 7 centres énergétiques", used: 68, duration: "1h" },
  { name: "Protection énergétique", desc: "Bouclier vibratoire personnalisé", used: 31, duration: "30 min" },
  { name: "Méditation guidée — ancrage", desc: "Reconnexion à la terre et au corps", used: 55, duration: "20 min" },
  { name: "Respiration cohérente", desc: "Séquence 5-5 sur 10 min", used: 47, duration: "10 min" },
  { name: "Libération émotionnelle", desc: "Dénouement des mémoires cellulaires", used: 22, duration: "1h30" },
];

function ProtocolesPage() {
  const { signOut } = useAdmin();
  return (
    <AdminShell
      title="Protocoles"
      subtitle="Bibliothèque de protocoles thérapeutiques"
      onSignOut={signOut}
      actions={
        <button className="inline-flex items-center gap-2 rounded-md bg-forest px-4 py-2.5 text-xs uppercase tracking-[0.15em] text-cream hover:bg-forest-soft">
          <Plus className="h-3.5 w-3.5" /> Nouveau protocole
        </button>
      }
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {protocoles.map((p) => (
          <div key={p.name} className="rounded-xl bg-card p-6 ring-1 ring-gold/15">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-forest/10 text-forest">
              <Layers className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-serif text-lg text-forest">{p.name}</h3>
            <p className="mt-1 text-sm text-earth/70">{p.desc}</p>
            <div className="mt-4 flex items-center justify-between text-xs text-earth/60">
              <span>Utilisé {p.used}×</span>
              <span>{p.duration}</span>
            </div>
            <button className="mt-4 w-full rounded-md border border-gold/30 px-3 py-2 text-xs uppercase tracking-[0.15em] text-forest hover:bg-cream-warm">
              Consulter
            </button>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
