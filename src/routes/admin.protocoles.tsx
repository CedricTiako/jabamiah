import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { AdminShell } from "../components/admin/admin-shell";
import { NewProtocolDrawer, type ProtocolRecord } from "../components/admin/new-protocol-drawer";
import { adminDeleteProtocol, adminListProtocols } from "../lib/protocols.functions";
import { useAdmin } from "../lib/admin-context";
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
import { Plus, Layers, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/protocoles")({
  head: () => ({ meta: [{ title: "Protocoles — Jabamiah Admin" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: ProtocolesPage,
});

const CATEGORY_LABELS: Record<string, string> = {
  energetique: "Énergétique",
  meditation: "Méditation",
  respiration: "Respiration",
  harmonisation: "Harmonisation",
  purification: "Purification",
};

function ProtocolesPage() {
  const { signOut } = useAdmin();
  const queryClient = useQueryClient();
  const list = useServerFn(adminListProtocols);
  const del = useServerFn(adminDeleteProtocol);

  const { data: protocols, isLoading } = useQuery({
    queryKey: ["admin-protocols"],
    queryFn: () => list(),
  });

  const [newOpen, setNewOpen] = useState(false);
  const [editing, setEditing] = useState<ProtocolRecord | null>(null);
  const [pendingDelete, setPendingDelete] = useState<ProtocolRecord | null>(null);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => del({ data: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-protocols"] });
      setPendingDelete(null);
    },
  });

  return (
    <AdminShell
      title="Protocoles"
      subtitle="Bibliothèque de protocoles thérapeutiques"
      onSignOut={signOut}
      actions={
        <button
          onClick={() => setNewOpen(true)}
          className="inline-flex items-center gap-2 rounded-md bg-forest px-4 py-2.5 text-xs uppercase tracking-[0.15em] text-cream hover:bg-forest-soft"
        >
          <Plus className="h-3.5 w-3.5" /> Nouveau protocole
        </button>
      }
    >
      <NewProtocolDrawer open={newOpen} onOpenChange={setNewOpen} />
      <NewProtocolDrawer protocol={editing ?? undefined} open={!!editing} onOpenChange={(v) => !v && setEditing(null)} />

      {isLoading && <p className="text-sm text-earth/60">Chargement…</p>}

      {!isLoading && (protocols?.length ?? 0) === 0 && (
        <p className="text-sm text-earth/60">Aucun protocole pour le moment. Créez le premier avec le bouton ci-dessus.</p>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {protocols?.map((p) => (
          <div key={p.id} className="flex flex-col rounded-xl bg-card p-6 ring-1 ring-gold/15">
            <div className="flex items-start justify-between">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-forest/10 text-forest">
                <Layers className="h-5 w-5" />
              </div>
              <button
                onClick={() => setPendingDelete(p as ProtocolRecord)}
                className="rounded-md p-1.5 text-earth/40 hover:bg-cream-warm hover:text-red-700"
                aria-label="Supprimer"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <h3 className="mt-4 font-serif text-lg text-forest">{p.name}</h3>
            <p className="mt-1 flex-1 text-sm text-earth/70">{p.description}</p>
            <div className="mt-4 flex items-center justify-between text-xs text-earth/60">
              <span>{p.category ? CATEGORY_LABELS[p.category] ?? p.category : "—"}</span>
              <span>{p.duration_minutes ? `${p.duration_minutes} min` : "—"}</span>
            </div>
            <button
              onClick={() => setEditing(p as ProtocolRecord)}
              className="mt-4 w-full rounded-md border border-gold/30 px-3 py-2 text-xs uppercase tracking-[0.15em] text-forest hover:bg-cream-warm"
            >
              Consulter
            </button>
          </div>
        ))}
      </div>

      <AlertDialog open={!!pendingDelete} onOpenChange={(v) => !v && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce protocole ?</AlertDialogTitle>
            <AlertDialogDescription>
              « {pendingDelete?.name} » sera définitivement supprimé de la bibliothèque. Cette action est irréversible.
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
