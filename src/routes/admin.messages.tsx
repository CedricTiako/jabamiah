import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { AdminShell } from "../components/admin/admin-shell";
import { useAdmin } from "../lib/admin-context";
import { adminListContactMessages, adminReplyToMessage } from "../lib/posts.functions";
import { adminMarkMessagesRead } from "../lib/notifications.functions";
import { Mail, Send } from "lucide-react";

export const Route = createFileRoute("/admin/messages")({
  head: () => ({ meta: [{ title: "Messages — Jabamiah Admin" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: MessagesPage,
});

function MessagesPage() {
  const { signOut } = useAdmin();
  const queryClient = useQueryClient();
  const list = useServerFn(adminListContactMessages);
  const { data: messages, isLoading } = useQuery({ queryKey: ["admin-messages"], queryFn: () => list() });

  const markRead = useServerFn(adminMarkMessagesRead);
  const markReadMutation = useMutation({
    mutationFn: () => markRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-messages"] });
      queryClient.invalidateQueries({ queryKey: ["admin-notifications"] });
    },
  });

  useEffect(() => {
    if (messages && messages.some((m) => !m.read_at)) markReadMutation.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  return (
    <AdminShell
      title="Messages"
      subtitle={`${messages?.length ?? 0} messages reçus via le formulaire de contact`}
      onSignOut={signOut}
    >
      <div className="rounded-xl bg-card ring-1 ring-gold/15">
        {isLoading ? (
          <div className="p-10 text-center text-earth/60">Chargement…</div>
        ) : !messages || messages.length === 0 ? (
          <div className="p-10 text-center text-earth/60">
            <Mail className="mx-auto mb-3 h-6 w-6 opacity-60" />
            Aucun message pour le moment.
          </div>
        ) : (
          <ul className="divide-y divide-gold/10">
            {messages.map((m) => (
              <MessageRow key={m.id} message={m} />
            ))}
          </ul>
        )}
      </div>
    </AdminShell>
  );
}

type Message = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  created_at: string;
  read_at: string | null;
  reply_message: string | null;
  replied_at: string | null;
};

function MessageRow({ message: m }: { message: Message }) {
  const queryClient = useQueryClient();
  const [replying, setReplying] = useState(false);
  const [reply, setReply] = useState("");

  const replyFn = useServerFn(adminReplyToMessage);
  const replyMutation = useMutation({
    mutationFn: () => replyFn({ data: { id: m.id, reply: reply.trim() } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-messages"] });
      setReplying(false);
      setReply("");
    },
  });

  return (
    <li className={`p-5 hover:bg-cream-warm/30 ${!m.read_at ? "bg-gold/5" : ""}`}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div className="flex items-center gap-2">
          {!m.read_at && <span className="h-2 w-2 shrink-0 rounded-full bg-rose-text" aria-label="Non lu" />}
          <p className="font-medium text-forest">
            {m.name} — <a href={`mailto:${m.email}`} className="text-gold hover:underline">{m.email}</a>
          </p>
          {m.subject && <p className="text-xs text-earth/70">{m.subject}</p>}
        </div>
        <time className="text-xs text-earth/60">{new Date(m.created_at).toLocaleString()}</time>
      </div>
      <p className="mt-3 whitespace-pre-wrap text-sm text-earth/85">{m.message}</p>

      {m.replied_at && (
        <div className="mt-3 rounded-md bg-forest/5 px-3 py-2">
          <p className="text-xs uppercase tracking-[0.15em] text-forest/70">
            Répondu le {new Date(m.replied_at).toLocaleString()}
          </p>
          <p className="mt-1 whitespace-pre-wrap text-sm text-earth/80">{m.reply_message}</p>
        </div>
      )}

      {replying ? (
        <div className="mt-3 space-y-2">
          <textarea
            rows={4}
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder={`Votre réponse à ${m.name}…`}
            className="w-full rounded-md border border-gold/30 bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
          />
          <div className="flex items-center gap-3">
            <button
              onClick={() => replyMutation.mutate()}
              disabled={replyMutation.isPending || !reply.trim()}
              className="inline-flex items-center gap-2 rounded-md bg-forest px-4 py-2 text-xs uppercase tracking-[0.15em] text-cream hover:bg-forest-soft disabled:opacity-50"
            >
              <Send className="h-3.5 w-3.5" />
              {replyMutation.isPending ? "Envoi…" : "Envoyer la réponse"}
            </button>
            <button
              onClick={() => { setReplying(false); setReply(""); }}
              className="rounded-md border border-gold/30 px-4 py-2 text-xs uppercase tracking-[0.15em] text-forest hover:bg-cream-warm"
            >
              Annuler
            </button>
            {replyMutation.isError && <span className="text-xs text-red-700">Erreur lors de l'envoi.</span>}
          </div>
        </div>
      ) : (
        <button
          onClick={() => setReplying(true)}
          className="mt-3 inline-flex items-center gap-2 rounded-md border border-gold/30 px-3 py-1.5 text-xs uppercase tracking-[0.15em] text-forest hover:bg-cream-warm"
        >
          <Send className="h-3.5 w-3.5" /> {m.replied_at ? "Répondre à nouveau" : "Répondre"}
        </button>
      )}
    </li>
  );
}
