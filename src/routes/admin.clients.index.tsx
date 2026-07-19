import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminShell } from "../components/admin/admin-shell";
import { NewClientDrawer, type ClientRecord } from "../components/admin/new-client-drawer";
import { useAdmin } from "../lib/admin-context";
import { Search, Phone, Mail, Filter, Edit3, Trash2, Lock } from "lucide-react";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { adminDeleteClient, adminListClients } from "../lib/clients.functions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";

export const Route = createFileRoute("/admin/clients/")({
  head: () => ({
    meta: [{ title: "Clients — Jabamiah Admin" }, { name: "robots", content: "noindex,nofollow" }],
  }),
  component: ClientsPage,
});

export type ClientStatus = "Actif" | "Fidèle" | "Nouveau" | "Inactif";

const statusTone: Record<ClientStatus, string> = {
  Actif: "bg-forest/10 text-forest",
  Fidèle: "bg-[color:var(--gold-soft)]/60 text-[color:var(--earth)]",
  Nouveau: "bg-[color:var(--rose-soft)] text-[color:var(--rose-text)]",
  Inactif: "bg-earth/10 text-earth/70",
};

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function ageFromBirthDate(birthDate: string | null) {
  if (!birthDate) return null;
  const d = new Date(birthDate);
  const diff = Date.now() - d.getTime();
  return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
}

function ClientsPage() {
  const { signOut } = useAdmin();
  const queryClient = useQueryClient();
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<ClientRecord | null>(null);
  const [pendingDelete, setPendingDelete] = useState<{ id: string; name: string } | null>(null);

  const listClients = useServerFn(adminListClients);
  const { data: clients, isLoading } = useQuery({
    queryKey: ["admin-clients"],
    queryFn: () => listClients(),
  });

  const del = useServerFn(adminDeleteClient);
  const deleteMutation = useMutation({
    mutationFn: (id: string) => del({ data: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-clients"] });
      setPendingDelete(null);
    },
  });

  const rows = useMemo(() => clients ?? [], [clients]);
  const filtered = useMemo(
    () => rows.filter((c) => c.full_name.toLowerCase().includes(q.toLowerCase())),
    [rows, q],
  );

  return (
    <AdminShell
      title="Clients"
      subtitle={`${rows.length} fiches clients`}
      onSignOut={signOut}
      actions={<NewClientDrawer />}
    >
      <NewClientDrawer
        client={editing ?? undefined}
        open={!!editing}
        onOpenChange={(v) => !v && setEditing(null)}
      />
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
              <th className="px-4 py-3">Motif</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gold/10">
            {isLoading && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-earth/60">
                  Chargement…
                </td>
              </tr>
            )}
            {!isLoading && filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-earth/60">
                  Aucun client pour le moment.
                </td>
              </tr>
            )}
            {filtered.map((c) => {
              const age = ageFromBirthDate(c.birth_date);
              const status = (c.status as ClientStatus) ?? "Nouveau";
              return (
                <tr key={c.id} className="hover:bg-cream-warm/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-full bg-forest text-xs font-medium text-cream">
                        {initials(c.full_name)}
                      </div>
                      <div>
                        <p className="font-medium text-forest">{c.full_name}</p>
                        {age !== null && <p className="text-xs text-earth/60">{age} ans</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-earth/70">
                    {c.phone && (
                      <p className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {c.phone}
                      </p>
                    )}
                    {c.email && (
                      <p className="flex items-center gap-1 mt-1">
                        <Mail className="h-3 w-3" />
                        {c.email}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-earth/80">{c.city ?? "—"}</td>
                  <td className="px-4 py-3 text-earth/80">{c.reason ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] uppercase tracking-widest ${statusTone[status]}`}
                      >
                        {status}
                      </span>
                      {(c as unknown as { status_locked?: boolean }).status_locked && (
                        <Lock className="h-3 w-3 text-earth/40" aria-label="Fixé manuellement" />
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        to="/admin/clients/$id"
                        params={{ id: c.id }}
                        className="text-xs uppercase tracking-[0.15em] text-gold hover:text-forest"
                      >
                        Ouvrir →
                      </Link>
                      <button
                        onClick={() => setEditing(c as ClientRecord)}
                        className="rounded-md p-1.5 text-earth/40 hover:bg-cream-warm hover:text-forest"
                        aria-label="Modifier"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setPendingDelete({ id: c.id, name: c.full_name })}
                        className="rounded-md p-1.5 text-earth/40 hover:bg-cream-warm hover:text-red-700"
                        aria-label="Supprimer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <AlertDialog open={!!pendingDelete} onOpenChange={(v) => !v && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce client ?</AlertDialogTitle>
            <AlertDialogDescription>
              « {pendingDelete?.name} » et toutes ses données associées (consultations, documents,
              bilans) seront définitivement supprimés. Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => pendingDelete && deleteMutation.mutate(pendingDelete.id)}
              className="bg-red-700 text-white hover:bg-red-800"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminShell>
  );
}
