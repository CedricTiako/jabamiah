import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { AdminShell } from "../components/admin/admin-shell";
import { useAdmin } from "./admin";
import { adminListContactMessages } from "../lib/posts.functions";
import { Mail } from "lucide-react";

export const Route = createFileRoute("/admin/messages")({
  head: () => ({ meta: [{ title: "Messages — Jabamiah Admin" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: MessagesPage,
});

function MessagesPage() {
  const { signOut } = useAdmin();
  const list = useServerFn(adminListContactMessages);
  const { data: messages, isLoading } = useQuery({ queryKey: ["admin-messages"], queryFn: () => list() });

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
              <li key={m.id} className="p-5 hover:bg-cream-warm/30">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div>
                    <p className="font-medium text-forest">
                      {m.name} — <a href={`mailto:${m.email}`} className="text-gold hover:underline">{m.email}</a>
                    </p>
                    {m.subject && <p className="text-xs text-earth/70">{m.subject}</p>}
                  </div>
                  <time className="text-xs text-earth/60">{new Date(m.created_at).toLocaleString()}</time>
                </div>
                <p className="mt-3 whitespace-pre-wrap text-sm text-earth/85">{m.message}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AdminShell>
  );
}
