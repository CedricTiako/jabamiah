import { useState } from "react";
import { Plus } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "../ui/drawer";
import { supabase } from "../../integrations/supabase/client";
import { adminCreateDocument } from "../../lib/documents.functions";
import { adminListClients } from "../../lib/clients.functions";

const DOC_TYPES = [
  { value: "compte-rendu", label: "Compte-rendu" },
  { value: "bilan", label: "Bilan" },
  { value: "ordonnance", label: "Ordonnance" },
  { value: "modele", label: "Modèle" },
  { value: "autre", label: "Autre" },
];

const EMPTY = {
  file: null as File | null,
  title: "",
  doc_type: "compte-rendu",
  client_id: "",
  description: "",
};

function sanitizeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
}

export function UploadDocumentDrawer({ defaultClientId, onCreated }: { defaultClientId?: string; onCreated?: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ ...EMPTY, client_id: defaultClientId ?? "" });
  const [uploadError, setUploadError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const listClients = useServerFn(adminListClients);
  const { data: clients } = useQuery({
    queryKey: ["admin-clients"],
    queryFn: () => listClients(),
    enabled: open && defaultClientId === undefined,
  });

  const createDocument = useServerFn(adminCreateDocument);
  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!form.file) throw new Error("Aucun fichier sélectionné.");
      setUploadError(null);
      const path = `${form.client_id || "general"}/${Date.now()}-${sanitizeFileName(form.file.name)}`;
      const { error: uploadErr } = await supabase.storage.from("client-documents").upload(path, form.file, {
        contentType: form.file.type || undefined,
      });
      if (uploadErr) throw uploadErr;

      return createDocument({
        data: {
          client_id: form.client_id || null,
          title: form.title,
          doc_type: form.doc_type || null,
          description: form.description || null,
          storage_path: path,
          mime_type: form.file.type || null,
          file_size: form.file.size,
        },
      });
    },
    onSuccess: ({ id }) => {
      queryClient.invalidateQueries({ queryKey: ["admin-documents"] });
      queryClient.invalidateQueries({ queryKey: ["admin-documents-by-client", form.client_id] });
      setForm({ ...EMPTY, client_id: defaultClientId ?? "" });
      setOpen(false);
      onCreated?.(id);
    },
    onError: (err: Error) => setUploadError(err.message),
  });

  const field = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((s) => ({ ...s, [key]: value }));

  const canSubmit = form.file && form.title.trim();

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-md bg-forest px-4 py-2.5 text-xs uppercase tracking-[0.15em] text-cream hover:bg-forest-soft"
      >
        <Plus className="h-3.5 w-3.5" /> Importer un document
      </button>
      <DrawerContent className="bg-cream">
        <div className="mx-auto w-full max-w-2xl">
          <DrawerHeader>
            <DrawerTitle className="font-serif text-2xl text-forest">Importer un document</DrawerTitle>
            <DrawerDescription>PDF, image ou modèle réutilisable.</DrawerDescription>
          </DrawerHeader>

          <div className="grid gap-4 px-4 pb-4 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="text-xs uppercase tracking-[0.15em] text-forest">Fichier *</span>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                onChange={(e) => field("file", e.target.files?.[0] ?? null)}
                className="mt-1.5 block w-full cursor-pointer rounded-lg border border-dashed border-gold/35 bg-cream-warm/40 px-3 py-6 text-xs text-earth/70 file:mr-3 file:rounded-full file:border-0 file:bg-forest file:px-4 file:py-2 file:text-[10px] file:font-medium file:uppercase file:tracking-[0.15em] file:text-cream hover:bg-cream-warm/60"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-xs uppercase tracking-[0.15em] text-forest">Titre du document *</span>
              <input
                value={form.title}
                onChange={(e) => field("title", e.target.value)}
                className="mt-1 w-full rounded-md border border-gold/30 bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-[0.15em] text-forest">Type</span>
              <select
                value={form.doc_type}
                onChange={(e) => field("doc_type", e.target.value)}
                className="mt-1 w-full rounded-md border border-gold/30 bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
              >
                {DOC_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </label>
            {defaultClientId === undefined && (
              <label className="block">
                <span className="text-xs uppercase tracking-[0.15em] text-forest">Client associé</span>
                <select
                  value={form.client_id}
                  onChange={(e) => field("client_id", e.target.value)}
                  className="mt-1 w-full rounded-md border border-gold/30 bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                >
                  <option value="">Aucun (document général)</option>
                  {(clients ?? []).map((c) => (
                    <option key={c.id} value={c.id}>{c.full_name}</option>
                  ))}
                </select>
              </label>
            )}
            <label className="block sm:col-span-2">
              <span className="text-xs uppercase tracking-[0.15em] text-forest">Description</span>
              <textarea
                rows={2}
                value={form.description}
                onChange={(e) => field("description", e.target.value)}
                className="mt-1 w-full rounded-md border border-gold/30 bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </label>
          </div>

          <div className="flex items-center gap-4 border-t border-gold/15 px-4 py-4">
            <button
              onClick={() => uploadMutation.mutate()}
              disabled={uploadMutation.isPending || !canSubmit}
              className="rounded-md bg-forest px-6 py-2.5 text-xs uppercase tracking-[0.15em] text-cream hover:bg-forest-soft disabled:opacity-50"
            >
              {uploadMutation.isPending ? "Import…" : "Importer"}
            </button>
            <button
              onClick={() => setOpen(false)}
              className="rounded-md border border-gold/30 px-6 py-2.5 text-xs uppercase tracking-[0.15em] text-forest hover:bg-cream-warm"
            >
              Annuler
            </button>
            {uploadError && <span className="text-sm text-red-700">Erreur : {uploadError}</span>}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
