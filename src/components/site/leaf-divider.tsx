type LeafDividerProps = {
  className?: string;
};

export function LeafDivider({ className }: LeafDividerProps) {
  return (
    <div
      className={`flex items-center justify-center gap-3 text-gold/70 ${className ?? ""}`}
      aria-hidden="true"
    >
      <span className="h-px w-12 bg-gold/40" />
      <svg viewBox="0 0 24 24" fill="none" className="size-4">
        <path
          d="M12 3c-3 2-5 5-5 8 0 4 3 7 5 10 2-3 5-6 5-10 0-3-2-6-5-8z"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M12 6v15" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
      </svg>
      <span className="h-px w-12 bg-gold/40" />
    </div>
  );
}
