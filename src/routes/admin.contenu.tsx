import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { AdminShell } from "../components/admin/admin-shell";
import { useAdmin } from "../lib/admin-context";
import { adminDeletePost, adminListPosts } from "../lib/posts.functions";
import { Plus, FileText } from "lucide-react";
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

export const Route = createFileRoute("/admin/contenu")({
  head: () => ({
    meta: [{ title: "Contenu — Jabamiah Admin" }, { name: "robots", content: "noindex,nofollow" }],
  }),
  component: ContenuPage,
});

function ContenuPage() {
  const { signOut } = useAdmin();
  const qc = useQueryClient();
  const list = useServerFn(adminListPosts);
  const del = useServerFn(adminDeletePost);

  const { data: posts, isLoading } = useQuery({ queryKey: ["admin-posts"], queryFn: () => list() });
  const [pendingDelete, setPendingDelete] = useState<{ id: string; title: string } | null>(null);
  const delMut = useMutation({
    mutationFn: (id: string) => del({ data: { id } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-posts"] });
      setPendingDelete(null);
    },
  });

  return (
    <AdminShell
      title="Contenu"
      subtitle="Éditeur de blog · articles multilingues"
      onSignOut={signOut}
      actions={
        <Link
          to="/admin/posts/$id"
          params={{ id: "new" }}
          className="inline-flex items-center gap-2 rounded-md bg-forest px-4 py-2.5 text-xs uppercase tracking-[0.15em] text-cream hover:bg-forest-soft"
        >
          <Plus className="h-3.5 w-3.5" /> Nouvel article
        </Link>
      }
    >
      <div className="overflow-hidden rounded-xl bg-card ring-1 ring-gold/15">
        {isLoading ? (
          <div className="p-10 text-center text-earth/60">Chargement…</div>
        ) : !posts || posts.length === 0 ? (
          <div className="p-10 text-center text-earth/60">
            <FileText className="mx-auto mb-3 h-6 w-6 opacity-60" />
            Aucun article. Créez le premier.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-cream-warm/60 text-left text-xs uppercase tracking-[0.15em] text-forest">
              <tr>
                <th className="px-4 py-3">Titre</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/10">
              {posts.map((p) => {
                const fr = (
                  p.post_translations as Array<{ title: string; locale: string }> | null
                )?.find((x) => x.locale === "fr");
                return (
                  <tr key={p.id} className="hover:bg-cream-warm/30">
                    <td className="px-4 py-3 text-forest">{fr?.title ?? p.slug}</td>
                    <td className="px-4 py-3 font-mono text-xs text-earth/70">{p.slug}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-xs ${p.status === "published" ? "bg-forest text-cream" : "bg-cream-warm text-earth"}`}
                      >
                        {p.status === "published" ? "Publié" : "Brouillon"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        to="/admin/posts/$id"
                        params={{ id: p.id }}
                        className="text-xs uppercase tracking-[0.15em] text-gold hover:text-forest"
                      >
                        Éditer
                      </Link>
                      <button
                        onClick={() => setPendingDelete({ id: p.id, title: fr?.title ?? p.slug })}
                        className="ml-4 text-xs uppercase tracking-[0.15em] text-red-700 hover:text-red-900"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <AlertDialog open={!!pendingDelete} onOpenChange={(v) => !v && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cet article ?</AlertDialogTitle>
            <AlertDialogDescription>
              « {pendingDelete?.title} » sera définitivement supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => pendingDelete && delMut.mutate(pendingDelete.id)}
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
