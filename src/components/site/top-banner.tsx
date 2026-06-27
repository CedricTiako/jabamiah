import { Heart } from "lucide-react";

export function TopBanner() {
  return (
    <div className="bg-forest-deep text-cream/90 text-xs tracking-[0.15em] uppercase">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-2.5 md:flex-row">
        <div className="flex items-center gap-2">
          <Heart className="size-3.5 text-gold" aria-hidden="true" />
          <span>Consultations énergétiques gratuites sur rendez-vous</span>
        </div>
        <div className="flex items-center gap-2">
          <Heart className="size-3.5 text-gold" aria-hidden="true" />
          <span>Gagnote solidaire : vos dons soutiennent ceux qui en ont besoin</span>
          <Heart className="size-3.5 text-gold" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
