import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import { ArrowRight, MessageCircle, Package, ShieldCheck, Sparkles } from "lucide-react";
import { IMG, PRODUCTS, SITE } from "@/lib/site";
import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Products — Zesto Foods Halal Snacks" },
      { name: "description", content: "Explore our complete range of premium halal snacks: nimko, potato chips, corn snacks, masala and salted snacks." },
      { property: "og:title", content: "Zesto Foods Products" },
      { property: "og:description", content: "Premium halal snacks — nimko, chips, corn snacks and more." },
      { property: "og:url", content: "/products" },
    ],
    links: [{ rel: "canonical", href: "/products" }],
  }),
  component: ProductsPage,
});

/* ------------------------- 3D TILT PRIMITIVE ----------------------- */
/** Same tactile tilt-on-hover language used across the site, kept local
 *  to this route so the page has no cross-file component dependency. */
function TiltCard({
  children,
  className = "",
  maxTilt = 8,
  glare = true,
}: {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  glare?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const springX = useSpring(px, { stiffness: 220, damping: 20, mass: 0.6 });
  const springY = useSpring(py, { stiffness: 220, damping: 20, mass: 0.6 });
  const rotateX = useTransform(springY, [0, 1], [maxTilt, -maxTilt]);
  const rotateY = useTransform(springX, [0, 1], [-maxTilt, maxTilt]);
  const glareX = useTransform(springX, [0, 1], ["0%", "100%"]);
  const glareY = useTransform(springY, [0, 1], ["0%", "100%"]);

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
    <motion.div ref={ref} onMouseMove={handleMove} onMouseLeave={handleLeave} style={{ perspective: 900 }} className={className}>
      <motion.div style={{ rotateX, rotateY, transformStyle: "preserve-3d" }} className="relative h-full">
        {children}
        {glare && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{ background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.35), transparent 55%)` }}
          />
        )}
      </motion.div>
    </motion.div>
  );
}

function ProductsPage() {
  const categories = useMemo(() => ["All", ...Array.from(new Set(PRODUCTS.map((p) => p.tag)))], []);
  const [active, setActive] = useState("All");
  const filtered = active === "All" ? PRODUCTS : PRODUCTS.filter((p) => p.tag === active);

  return (
    <>
      {/* ------------------------------ HERO ------------------------------ */}
      <section className="relative pt-40 pb-20 overflow-hidden">
        <div className="absolute inset-0 gradient-warm" />
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="container-x relative grid gap-10 lg:grid-cols-[1.4fr_1fr] items-end">
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 text-primary px-4 py-1.5 text-xs font-semibold tracking-[0.14em] uppercase">
                <Package size={14} /> Product Range
              </span>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="mt-6 font-display text-5xl md:text-7xl font-black text-brand-ink leading-[1.02] text-balance">
                A snack for every <span className="text-gradient">moment</span>.
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-xl text-lg text-muted-foreground leading-relaxed">
                {PRODUCTS.length} SKUs across {categories.length - 1} categories — all halal, all crafted at our
                Gujranwala facility, all sealed fresh for wholesale and retail.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-brand-ink/70">
                <span className="inline-flex items-center gap-2">
                  <ShieldCheck size={16} className="text-primary" /> 100% Halal Certified
                </span>
                <span className="inline-flex items-center gap-2">
                  <Sparkles size={16} className="text-primary" /> Freshly sealed, every batch
                </span>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.15}>
            <TiltCard maxTilt={6} className="group">
              <div className="rounded-3xl overflow-hidden aspect-[4/3] shadow-elev">
                <img src={IMG.hero[1]} alt="Zesto Foods product range" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
            </TiltCard>
          </Reveal>
        </div>
      </section>

      {/* --------------------------- CATEGORY FILTER --------------------------- */}
      <section className="sticky top-16 z-30 border-y border-border bg-white/90 backdrop-blur-md py-4">
        <div className="container-x">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {categories.map((c) => {
              const isActive = active === c;
              return (
                <button
                  key={c}
                  onClick={() => setActive(c)}
                  aria-pressed={isActive}
                  className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
                    isActive
                      ? "gradient-primary text-white shadow-soft"
                      : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
                  }`}
                >
                  {c}
                </button>
              );
            })}
            <span className="ml-auto hidden sm:inline shrink-0 text-xs uppercase tracking-[0.14em] text-muted-foreground">
              {filtered.length} {filtered.length === 1 ? "product" : "products"}
            </span>
          </div>
        </div>
      </section>

      {/* ------------------------------ GRID ------------------------------ */}
      <section className="py-20">
        <div className="container-x">
          <Stagger key={active} className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <StaggerItem key={p.slug}>
                <TiltCard maxTilt={6} className="group h-full">
                  <article className="h-full flex flex-col rounded-3xl bg-white border border-border shadow-soft transition-shadow duration-500 group-hover:shadow-[0_35px_60px_-25px_rgba(0,0,0,0.3)] overflow-hidden">
                    <div className="relative overflow-hidden aspect-[4/3]" style={{ transform: "translateZ(25px)" }}>
                      <img src={p.image} alt={p.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <span className="absolute top-4 left-4 rounded-full glass px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-brand-ink">{p.tag}</span>
                    </div>
                    <div className="p-7 flex flex-col flex-1" style={{ transform: "translateZ(15px)" }}>
                      <h3 className="font-display text-2xl font-bold text-brand-ink">{p.name}</h3>
                      <p className="mt-3 text-sm text-muted-foreground leading-relaxed flex-1">{p.desc}</p>
                      <div className="mt-5">
                        <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground font-semibold mb-2">Packaging</p>
                        <div className="flex flex-wrap gap-2">
                          {p.packs.map((pk) => (
                            <span key={pk} className="text-xs rounded-full bg-muted px-3 py-1.5 text-brand-ink font-medium">{pk}</span>
                          ))}
                        </div>
                      </div>
                      <div className="mt-6 grid grid-cols-2 gap-2">
                        <Link
                          to="/contact"
                          className="inline-flex items-center justify-center gap-1.5 rounded-full gradient-primary text-white text-sm font-semibold px-4 py-3 shadow-sm transition-shadow hover:shadow-[0_15px_35px_-12px_rgba(255,107,0,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                        >
                          Enquire <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                        </Link>
                        <a
                          href={`https://wa.me/${SITE.phones[0].wa}?text=Hi, I'm interested in ${p.name} wholesale pricing.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-1.5 rounded-full border border-border text-sm font-semibold px-4 py-3 hover:bg-muted hover:border-primary/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                        >
                          <MessageCircle size={14} /> WhatsApp
                        </a>
                      </div>
                    </div>
                  </article>
                </TiltCard>
              </StaggerItem>
            ))}
          </Stagger>

          {filtered.length === 0 && (
            <div className="py-24 text-center text-muted-foreground">
              No products found in this category yet.
            </div>
          )}
        </div>
      </section>

      {/* ------------------------------ CTA ------------------------------ */}
      <section className="pb-28">
        <div className="container-x">
          <div className="rounded-[2.5rem] gradient-primary p-10 md:p-14 text-white relative overflow-hidden">
            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/20 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-secondary/30 blur-3xl" />
            <div className="relative">
              <SectionHeader
                light
                eyebrow="Custom Requirements"
                title="Need a custom pack size or private label?"
                description="Talk to our team about private-label opportunities, tailored pack sizes and export enquiries."
              />
              <div className="mt-8 flex flex-wrap justify-center gap-4" style={{ perspective: 600 }}>
                <motion.div whileHover={{ rotateX: -6, y: -3 }} style={{ transformStyle: "preserve-3d" }}>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 rounded-full bg-white text-brand-ink font-semibold px-7 py-4 shadow-elev focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
                  >
                    Contact our team <ArrowRight size={16} />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ rotateX: -6, y: -3 }} style={{ transformStyle: "preserve-3d" }}>
                  <a
                    href={`https://wa.me/${SITE.phones[0].wa}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full glass px-7 py-4 font-semibold text-white hover:bg-white/25 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
                  >
                    <MessageCircle size={16} /> Chat on WhatsApp
                  </a>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}