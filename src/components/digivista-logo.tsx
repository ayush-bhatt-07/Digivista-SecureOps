import { cn } from "@/lib/utils";

export function DigivistaLogo({
  className,
  variant = "dark",
}: {
  className?: string;
  variant?: "dark" | "light";
}) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <svg viewBox="0 0 48 40" className="h-8 w-9 shrink-0" aria-hidden="true">
        <path d="M4 4h14c10 0 17 7 17 16s-7 16-17 16H4z" fill="none" stroke="currentColor" strokeWidth="6" className="text-accent" />
        <path d="M26 4l10 32 10-32" fill="none" stroke="currentColor" strokeWidth="6" className={variant === "dark" ? "text-sidebar-foreground" : "text-primary"} />
      </svg>
      <div className="leading-none">
        <div
          className={cn(
            "text-[15px] font-bold tracking-tight",
            variant === "dark" ? "text-sidebar-accent-foreground" : "text-primary",
          )}
        >
          DIGIVISTA
        </div>
        <div className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.18em] text-accent">
          SecureOps
        </div>
      </div>
    </div>
  );
}
