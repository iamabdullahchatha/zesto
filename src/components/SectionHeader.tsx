import { Reveal } from "./Reveal";

export function SectionHeader({
  eyebrow,
  title,
  description,
  center = true,
  light = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  center?: boolean;
  light?: boolean;
}) {
  return (
    <div className={`max-w-3xl ${center ? "mx-auto text-center" : ""}`}>
      {eyebrow && (
        <Reveal>
          <span
            className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold tracking-[0.14em] uppercase ${
              light
                ? "bg-white/10 text-white/90 border border-white/15"
                : "bg-primary/10 text-primary border border-primary/20"
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary" /> {eyebrow}
          </span>
        </Reveal>
      )}
      <Reveal delay={0.05}>
        <h2
          className={`mt-5 font-display text-4xl md:text-5xl font-bold leading-[1.05] ${
            light ? "text-white" : "text-brand-ink"
          }`}
        >
          {title}
        </h2>
      </Reveal>
      {description && (
        <Reveal delay={0.1}>
          <p className={`mt-5 text-base md:text-lg leading-relaxed ${light ? "text-white/70" : "text-muted-foreground"}`}>
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}
