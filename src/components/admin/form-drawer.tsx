import type { FormEvent, ReactNode } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "../ui/sheet";

/**
 * Reusable admin form drawer.
 * Wraps a Sheet with brand styling + primitives for consistent forms.
 */

type FormDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  submitLabel?: string;
  onSubmit: (formData: FormData) => void | Promise<void>;
  children: ReactNode;
};

export function FormDrawer({
  open,
  onOpenChange,
  title,
  description,
  submitLabel = "Enregistrer",
  onSubmit,
  children,
}: FormDrawerProps) {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    void onSubmit(new FormData(e.currentTarget));
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto bg-cream sm:max-w-lg">
        <SheetHeader className="text-left">
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-earth/55">
            Nouveau
          </p>
          <SheetTitle className="font-serif text-2xl text-forest">{title}</SheetTitle>
          {description ? (
            <SheetDescription className="text-sm text-earth/70">{description}</SheetDescription>
          ) : null}
        </SheetHeader>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {children}
          <div className="flex items-center justify-end gap-2 border-t border-gold/15 pt-5">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-full border border-gold/30 px-5 py-2.5 text-[11px] uppercase tracking-[0.18em] text-forest hover:bg-cream-warm"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="rounded-full bg-forest px-6 py-2.5 text-[11px] uppercase tracking-[0.18em] text-cream hover:bg-forest-soft"
            >
              {submitLabel}
            </button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}

/* ---------- Form field primitives ---------- */

type FieldProps = {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string | number;
  hint?: string;
};

export function Field({ label, name, type = "text", required, placeholder, defaultValue, hint }: FieldProps) {
  return (
    <label className="block">
      <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-forest">
        {label}
        {required ? <span className="text-[color:var(--rose-text)]"> *</span> : null}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="mt-1.5 w-full rounded-lg border border-gold/25 bg-card px-3 py-2.5 text-sm text-earth placeholder:text-earth/40 focus:outline-none focus:ring-2 focus:ring-gold"
      />
      {hint ? <span className="mt-1 block text-xs text-earth/55">{hint}</span> : null}
    </label>
  );
}

type SelectProps = {
  label: string;
  name: string;
  options: { value: string; label: string }[];
  required?: boolean;
  defaultValue?: string;
};

export function FieldSelect({ label, name, options, required, defaultValue }: SelectProps) {
  return (
    <label className="block">
      <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-forest">
        {label}
        {required ? <span className="text-[color:var(--rose-text)]"> *</span> : null}
      </span>
      <select
        name={name}
        required={required}
        defaultValue={defaultValue}
        className="mt-1.5 w-full rounded-lg border border-gold/25 bg-card px-3 py-2.5 text-sm text-earth focus:outline-none focus:ring-2 focus:ring-gold"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

type TextareaProps = {
  label: string;
  name: string;
  rows?: number;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string;
};

export function FieldTextarea({ label, name, rows = 4, required, placeholder, defaultValue }: TextareaProps) {
  return (
    <label className="block">
      <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-forest">
        {label}
        {required ? <span className="text-[color:var(--rose-text)]"> *</span> : null}
      </span>
      <textarea
        name={name}
        rows={rows}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="mt-1.5 w-full rounded-lg border border-gold/25 bg-card px-3 py-2.5 text-sm text-earth placeholder:text-earth/40 focus:outline-none focus:ring-2 focus:ring-gold"
      />
    </label>
  );
}

export function FieldRow({ children }: { children: ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}

export function FieldFile({ label, name, accept, required }: { label: string; name: string; accept?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-forest">
        {label}
        {required ? <span className="text-[color:var(--rose-text)]"> *</span> : null}
      </span>
      <input
        name={name}
        type="file"
        accept={accept}
        required={required}
        className="mt-1.5 block w-full cursor-pointer rounded-lg border border-dashed border-gold/35 bg-cream-warm/40 px-3 py-6 text-xs text-earth/70 file:mr-3 file:rounded-full file:border-0 file:bg-forest file:px-4 file:py-2 file:text-[10px] file:font-medium file:uppercase file:tracking-[0.15em] file:text-cream hover:bg-cream-warm/60"
      />
    </label>
  );
}
