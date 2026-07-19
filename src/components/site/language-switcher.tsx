import { Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from "../../i18n";

type Props = {
  variant?: "light" | "dark";
};

export function LanguageSwitcher({ variant = "light" }: Props) {
  const { i18n, t } = useTranslation();
  const current = (i18n.resolvedLanguage ?? i18n.language ?? "fr").slice(0, 2) as SupportedLanguage;

  const tone =
    variant === "dark"
      ? "border-gold/30 bg-forest-deep/40 text-cream hover:bg-forest-deep/60"
      : "border-gold/30 bg-cream-warm/40 text-forest hover:bg-cream-warm";

  return (
    <label
      className={`flex items-center gap-2 rounded-md border px-3 py-2 text-xs uppercase tracking-[0.15em] ${tone}`}
    >
      <Globe className="size-3.5 text-gold" aria-hidden="true" />
      <span className="sr-only">{t("nav.languageLabel")}</span>
      <select
        value={current}
        onChange={(event) => {
          const code = event.target.value;
          void i18n.changeLanguage(code);
          document.cookie = `i18nextLng=${code};path=/;max-age=${365 * 24 * 3600};SameSite=Lax`;
        }}
        className="cursor-pointer bg-transparent pr-1 text-xs uppercase tracking-[0.15em] outline-none"
      >
        {SUPPORTED_LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code} className="text-earth">
            {lang.code.toUpperCase()}
          </option>
        ))}
      </select>
    </label>
  );
}
