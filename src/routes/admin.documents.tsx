import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "../components/admin/admin-shell";
import { UploadDocumentDrawer } from "../components/admin/upload-document-drawer";
import { useAdmin } from "../lib/admin-context";
import { FileText, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  adminDeleteDocument,
  adminGetDocumentSignedUrl,
  adminListDocuments,
} from "../lib/documents.functions";
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

export const Route = createFileRoute("/admin/documents")({
  head: () => ({
    meta: [
      { title: "Documents — Jabamiah Admin" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: DocumentsPage,
});

function formatSize(bytes: number | null) {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR");
}

function DocumentsPage() {
  const { signOut } = useAdmin();
  const [q, setQ] = useState("");
  const queryClient = useQueryClient();

  const listDocuments = useServerFn(adminListDocuments);
  const { data: documents, isLoading } = useQuery({
    queryKey: ["admin-documents"],
    queryFn: () => listDocuments(),
  });

  const rows = documents ?? [];
  const filtered = useMemo(() => {
    const query = q.toLowerCase();
    return rows.filter((d) => {
      const clientName = (d.clients as { full_name: string } | null)?.full_name ?? "";
      return d.title.toLowerCase().includes(query) || clientName.toLowerCase().includes(query);
    });
  }, [rows, q]);

  const getSignedUrl = useServerFn(adminGetDocumentSignedUrl);
  const openMutation = useMutation({
    mutationFn: (storagePath: string) => getSignedUrl({ data: { storage_path: storagePath } }),
    onSuccess: ({ url }) => window.open(url, "_blank", "noopener,noreferrer"),
  });

  const [pendingDelete, setPendingDelete] = useState<{ id: string; title: string } | null>(null);
  const deleteDocument = useServerFn(adminDeleteDocument);
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteDocument({ data: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-documents"] });
      setPendingDelete(null);
    },
  });

  return (
    <AdminShell
      title="Documents"
      subtitle={`${rows.length} documents · Modèles & comptes-rendus`}
      onSignOut={signOut}
      actions={<UploadDocumentDrawer />}
    >
      <div className="mb-4 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-earth/50" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Rechercher un document…"
            className="w-full rounded-md border border-gold/20 bg-card py-2.5 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
          />
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
                  Aucun document pour le moment.
                </td>
              </tr>
            )}
            {filtered.map((d) => (
              <tr key={d.id} className="hover:bg-cream-warm/30">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-lg bg-[color:var(--rose-soft)] text-[color:var(--rose-text)]">
                      <FileText className="h-4 w-4" />
                    </div>
                    <span className="font-medium text-forest">{d.title}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-earth/80">
                  {(d.clients as { full_name: string } | null)?.full_name ?? "—"}
                </td>
                <td className="px-4 py-3 text-earth/70">{d.doc_type ?? "—"}</td>
                <td className="px-4 py-3 text-earth/70">{formatSize(d.file_size)}</td>
                <td className="px-4 py-3 text-earth/70">{formatDate(d.created_at)}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <button
                      onClick={() => openMutation.mutate(d.storage_path)}
                      disabled={openMutation.isPending}
                      className="text-xs uppercase tracking-[0.15em] text-gold hover:text-forest"
                    >
                      Ouvrir
                    </button>
                    <button
                      onClick={() => setPendingDelete({ id: d.id, title: d.title })}
                      disabled={deleteMutation.isPending}
                      className="text-earth/50 hover:text-[color:var(--rose-text)]"
                      aria-label="Supprimer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AlertDialog open={!!pendingDelete} onOpenChange={(v) => !v && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce document ?</AlertDialogTitle>
            <AlertDialogDescription>
              « {pendingDelete?.title} » sera définitivement supprimé.
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
