import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "../components/admin/admin-shell";
import { useAdmin } from "./admin";
import { Heart, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/admin/paiements")({
  head: () => ({ meta: [{ title: "Paiements & Dons — Jabamiah Admin" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: PaiementsPage,
});

const rows = [
  { date: "18/05/2024", donor: "Sophie Martin", amount: 50, method: "PayPal", ref: "TXN-4821" },
  { date: "16/05/2024", donor: "Anonyme", amount: 25, method: "PayPal", ref: "TXN-4820" },
  { date: "12/05/2024", donor: "Julien Dupont", amount: 30, method: "Virement", ref: "VIR-104" },
  { date: "08/05/2024", donor: "Camille Robert", amount: 100, method: "PayPal", ref: "TXN-4815" },
  { date: "02/05/2024", donor: "Anonyme", amount: 10, method: "PayPal", ref: "TXN-4810" },
];

function PaiementsPage() {
  const { signOut } = useAdmin();
  const total = rows.reduce((s, r) => s + r.amount, 0);
  return (
    <AdminShell title="Paiements & Dons" subtitle="Gagnote solidaire · Suivi des contributions" onSignOut={signOut}>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-gradient-to-br from-[color:var(--rose-soft)] to-cream p-6 ring-1 ring-gold/15">
          <Heart className="h-5 w-5 text-[color:var(--rose-text)]" />
          <p className="mt-3 text-xs uppercase tracking-[0.15em] text-earth/70">Ce mois</p>
          <p className="font-serif text-4xl text-[color:var(--rose-text)]">{total} €</p>
          <p className="mt-1 flex items-center gap-1 text-xs text-earth/70"><TrendingUp className="h-3 w-3" /> +18% vs mois dernier</p>
        </div>
        <div className="rounded-2xl bg-card p-6 ring-1 ring-gold/15">
          <p className="text-xs uppercase tracking-[0.15em] text-earth/60">Total 2024</p>
          <p className="mt-3 font-serif text-4xl text-forest">3 820 €</p>
          <p className="mt-1 text-xs text-earth/60">64 dons reçus</p>
        </div>
        <div className="rounded-2xl bg-card p-6 ring-1 ring-gold/15">
          <p className="text-xs uppercase tracking-[0.15em] text-earth/60">Don moyen</p>
          <p className="mt-3 font-serif text-4xl text-forest">42 €</p>
          <p className="mt-1 text-xs text-earth/60">min. 5 € · max. 200 €</p>
        </div>
      </div>

      <div className="mt-8 overflow-x-auto rounded-xl bg-card ring-1 ring-gold/15">
        <table className="w-full min-w-[560px] text-sm">
          <thead className="bg-cream-warm/60 text-left text-xs uppercase tracking-[0.15em] text-forest">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Donateur</th>
              <th className="px-4 py-3">Montant</th>
              <th className="px-4 py-3">Moyen</th>
              <th className="px-4 py-3">Référence</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gold/10">
            {rows.map((r) => (
              <tr key={r.ref}>
                <td className="px-4 py-3 text-earth/80">{r.date}</td>
                <td className="px-4 py-3 font-medium text-forest">{r.donor}</td>
                <td className="px-4 py-3 text-forest">{r.amount} €</td>
                <td className="px-4 py-3 text-earth/70">{r.method}</td>
                <td className="px-4 py-3 font-mono text-xs text-earth/60">{r.ref}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
