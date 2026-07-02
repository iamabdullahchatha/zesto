import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { HelpCircle, Minus, Plus, MessageCircle, Search, ArrowRight, SearchX } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { FAQS, SITE } from "@/lib/site";
import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";

export const Route = createFileRoute("/faqs")({
  head: () => ({
    meta: [
      { title: "FAQs — Zesto Foods" },
      { name: "description", content: "Answers to common questions about Zesto Foods products, halal certification, wholesale and distribution." },
      { property: "og:title", content: "Zesto Foods — FAQs" },
      { property: "og:url", content: "/faqs" },
    ],
    links: [{ rel: "canonical", href: "/faqs" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: FAQPage,
});

/* ------------------------- 3D TILT PRIMITIVE ----------------------- */
/** The site's signature cursor-tilt, kept subtle here (small maxTilt) so
 *  it reads as depth rather than getting in the way of reading/clicking. */
function TiltCard({
  children,
  className = "",
  maxTilt = 3,
}: {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const springX = useSpring(px, { stiffness: 240, damping: 22, mass: 0.6 });
  const springY = useSpring(py, { stiffness: 240, damping: 22, mass: 0.6 });
  const rotateX = useTransform(springY, [0, 1], [maxTilt, -maxTilt]);
  const rotateY = useTransform(springX, [0, 1], [-maxTilt, maxTilt]);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  };
  const handleLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <motion.div ref={ref} onMouseMove={handleMove} onMouseLeave={handleLeave} style={{ perspective: 1000 }} className={className}>
      <motion.div style={{ rotateX, rotateY, transformStyle: "preserve-3d" }} className="relative">
        {children}
      </motion.div>
    </motion.div>
  );
}

function FAQPage() {
  const [open, setOpen] = useState<number | null>(0);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return FAQS;
    return FAQS.filter((f) => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q));
  }, [query]);

  return (
    <section className="relative pt-40 pb-24 min-h-screen gradient-warm overflow-hidden">
      {/* Ambient depth shapes, matching the homepage hero's parallax language */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-10 -left-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl animate-float-slow" />
        <div className="absolute bottom-0 -right-24 h-80 w-80 rounded-full bg-secondary/15 blur-3xl animate-float" />
      </div>

      <div className="container-x max-w-4xl relative">
        <div className="text-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 text-primary px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em]">
              <HelpCircle size={14} /> Support
            </span>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="mt-6 font-display text-5xl md:text-6xl font-black text-brand-ink leading-[1.05] text-balance">
              Frequently asked <span className="text-gradient">questions</span>.
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 text-muted-foreground text-lg">Everything you need to know before working with Zesto Foods.</p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-9 mx-auto max-w-md" style={{ perspective: 800 }}>
              <div className="relative flex items-center rounded-full bg-white border border-border shadow-soft focus-within:border-primary/40 focus-within:shadow-elev focus-within:-translate-y-0.5 transition-all">
                <Search size={18} className="ml-5 text-muted-foreground shrink-0" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search questions — e.g. halal, wholesale, shipping…"
                  className="w-full bg-transparent px-4 py-4 text-sm text-brand-ink placeholder:text-muted-foreground focus:outline-none"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    aria-label="Clear search"
                    className="mr-4 shrink-0 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </Reveal>
        </div>

        <Stagger key={query} className="mt-14 space-y-4">
          {filtered.map((f, idx) => {
            const isOpen = open === idx;
            return (
              <StaggerItem key={f.q}>
                <TiltCard maxTilt={2.5}>
                  <div className={`rounded-2xl border bg-white transition-all duration-300 ${isOpen ? "border-primary/40 shadow-elev" : "border-border shadow-soft/0 hover:shadow-soft"}`}>
                    <button
                      onClick={() => setOpen(isOpen ? null : idx)}
                      aria-expanded={isOpen}
                      className="w-full text-left px-6 py-5 flex items-center justify-between gap-6 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    >
                      <span className="font-display font-semibold text-brand-ink text-lg">{f.q}</span>
                      <motion.span
                        animate={{ rotateY: isOpen ? 180 : 0, scale: isOpen ? 1.06 : 1 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        style={{ transformStyle: "preserve-3d" }}
                        className={`grid h-10 w-10 place-items-center rounded-full shrink-0 transition-colors duration-300 ${isOpen ? "gradient-primary text-white shadow-soft" : "bg-muted text-brand-ink"}`}
                      >
                        {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <p className="px-6 pb-6 text-muted-foreground leading-relaxed">{f.a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </TiltCard>
              </StaggerItem>
            );
          })}
        </Stagger>

        {filtered.length === 0 && (
          <Reveal>
            <div className="mt-14 flex flex-col items-center gap-3 text-center py-16 rounded-3xl border border-dashed border-border bg-white/60">
              <SearchX size={28} className="text-muted-foreground" />
              <p className="font-display font-semibold text-brand-ink">No questions match "{query}"</p>
              <p className="text-sm text-muted-foreground max-w-sm">Try a different word, or reach out directly — our team can answer anything not covered here.</p>
              <button
                onClick={() => setQuery("")}
                className="mt-2 text-sm font-semibold text-primary hover:underline focus-visible:outline-none"
              >
                Clear search
              </button>
            </div>
          </Reveal>
        )}

        {/* Still-need-help CTA */}
        <Reveal delay={0.1}>
          <div className="mt-16 relative overflow-hidden rounded-[2rem] gradient-primary p-8 md:p-10 text-white text-center" style={{ perspective: 600 }}>
            <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-white/15 blur-3xl" />
            <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-secondary/30 blur-3xl" />
            <div className="relative">
              <h2 className="font-display text-2xl md:text-3xl font-bold">Still have a question?</h2>
              <p className="mt-2 text-white/85">Our team typically replies within the same business day.</p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                <motion.div whileHover={{ rotateX: -6, y: -3 }} style={{ transformStyle: "preserve-3d" }}>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 rounded-full bg-white text-brand-ink font-semibold px-6 py-3.5 shadow-elev focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
                  >
                    Contact us <ArrowRight size={16} />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ rotateX: -6, y: -3 }} style={{ transformStyle: "preserve-3d" }}>
                  <a
                    href={`https://wa.me/${SITE.phones[0].wa}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full glass px-6 py-3.5 font-semibold text-white hover:bg-white/25 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
                  >
                    <MessageCircle size={16} /> WhatsApp
                  </a>
                </motion.div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}