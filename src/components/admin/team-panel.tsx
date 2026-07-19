import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { UserPlus, Trash2 } from "lucide-react";
import {
  adminListTeam,
  adminInviteTeamMember,
  adminRevokeTeamMember,
} from "../../lib/team.functions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

export function TeamPanel() {
  const queryClient = useQueryClient();
  const listTeam = useServerFn(adminListTeam);
  const invite = useServerFn(adminInviteTeamMember);
  const revoke = useServerFn(adminRevokeTeamMember);

  const {
    data: members,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["admin-team"],
    queryFn: () => listTeam(),
    retry: 1,
  });

  const [email, setEmail] = useState("");
  const [pendingRevoke, setPendingRevoke] = useState<{ user_id: string; email: string } | null>(
    null,
  );

  const inviteMutation = useMutation({
    mutationFn: () => invite({ data: { email: email.trim() } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-team"] });
      setEmail("");
    },
  });

  const revokeMutation = useMutation({
    mutationFn: (user_id: string) => revoke({ data: { user_id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-team"] });
      setPendingRevoke(null);
    },
  });

  return (
    <div className="mt-4">
      {isLoading && <p className="text-sm text-earth/60">Chargement…</p>}
      {isError && (
        <p className="text-sm text-red-700">
          Impossible de charger l'équipe. Vérifiez que la variable d'environnement
          SUPABASE_SERVICE_ROLE_KEY est configurée sur le serveur.
        </p>
      )}
      <ul className="divide-y divide-gold/10">
        {members?.map((m) => (
          <li key={m.user_id} className="flex items-center justify-between gap-4 py-3">
            <div>
              <p className="text-sm font-medium text-forest">{m.email}</p>
              <p className="text-xs text-earth/60">
                Membre depuis {new Date(m.member_since).toLocaleDateString("fr-FR")}
                {m.is_self && " · vous"}
              </p>
            </div>
            {!m.is_self && (
              <button
                onClick={() => setPendingRevoke({ user_id: m.user_id, email: m.email })}
                className="rounded-md p-1.5 text-earth/40 hover:bg-cream-warm hover:text-red-700"
                aria-label="Révoquer"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </li>
        ))}
      </ul>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@exemple.com"
          className="flex-1 rounded-md border border-gold/30 bg-cream-warm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
        />
        <button
          type="button"
          onClick={() => inviteMutation.mutate()}
          disabled={inviteMutation.isPending || !email.trim()}
          className="inline-flex items-center gap-2 rounded-md bg-forest px-4 py-2.5 text-xs uppercase tracking-[0.15em] text-cream hover:bg-forest-soft disabled:opacity-60"
        >
          <UserPlus className="h-3.5 w-3.5" />{" "}
          {inviteMutation.isPending ? "Invitation…" : "Inviter"}
        </button>
      </div>
      {inviteMutation.isError && (
        <p className="mt-2 text-sm text-red-700">Erreur lors de l'invitation.</p>
      )}
      {inviteMutation.isSuccess && <p className="mt-2 text-sm text-forest">Invitation envoyée ✓</p>}

      <AlertDialog open={!!pendingRevoke} onOpenChange={(v) => !v && setPendingRevoke(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Révoquer l'accès admin ?</AlertDialogTitle>
            <AlertDialogDescription>
              « {pendingRevoke?.email} » n'aura plus accès au tableau de bord admin. Son compte
              n'est pas supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => pendingRevoke && revokeMutation.mutate(pendingRevoke.user_id)}
              className="bg-red-700 text-white hover:bg-red-800"
            >
              Révoquer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
