import { createFileRoute } from "@tanstack/react-router";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef } from "react";
import { Award, Compass, Factory, Heart, Leaf, ShieldCheck, Sparkles, Target } from "lucide-react";
import { IMG, SITE } from "@/lib/site";
import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Zesto Foods — Premium Halal Snack Manufacturer" },
      { name: "description", content: "The story, mission and manufacturing excellence behind Zesto Foods, Pakistan's premium halal snack manufacturer based in Gujranwala." },
      { property: "og:title", content: "About Zesto Foods" },
      { property: "og:description", content: "The story, mission and manufacturing excellence behind Zesto Foods." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <AboutHero />
      <Timeline />
      <MissionVisionValues />
      <ExcellencePillars />
      <AboutCTA />
    </>
  );
}

/* ------------------------- 3D TILT PRIMITIVE ----------------------- */
/**
 * Same tilt-card language used across the site: a spring-driven 3D tilt
 * with a light-responsive shadow, so cards feel like objects on a shelf
 * rather than flat panels. Kept local to this route to avoid a cross-file
 * dependency — consider lifting to a shared `@/components/Tilt` module
 * if a third page needs it.
 */
function TiltCard({
  children,
  className = "",
  maxTilt = 8,
  glare = false,
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
  const shadowX = useTransform(springX, [0, 1], [14, -14]);
  const shadowY = useTransform(springY, [0, 1], [8, -8]);

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
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ perspective: 900 }}
      className={className}
    >
      <motion.div
        aria-hidden
        style={{ x: shadowX, y: shadowY }}
        className="pointer-events-none absolute inset-3 -z-10 rounded-[inherit] bg-black/20 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />
      <motion.div style={{ rotateX, rotateY, transformStyle: "preserve-3d" }} className="relative h-full">
        {children}
        {glare && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.4), transparent 55%)`,
            }}
          />
        )}
      </motion.div>
    </motion.div>
  );
}

/** Buttons that pull gently toward the cursor. Mirrors the homepage's Magnetic component. */
function Magnetic({ children, strength = 12 }: { children: React.ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 20, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 300, damping: 20, mass: 0.4 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set(((e.clientX - (rect.left + rect.width / 2)) / rect.width) * strength);
    y.set(((e.clientY - (rect.top + rect.height / 2)) / rect.height) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div ref={ref} onMouseMove={handleMove} onMouseLeave={reset} style={{ x: sx, y: sy }} className="inline-block">
      {children}
    </motion.div>
  );
}

/* ------------------------------ HERO ------------------------------ */
function AboutHero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.2]);

  return (
    <section ref={ref} className="relative pt-40 pb-28 overflow-hidden gradient-warm">
      <div className="absolute inset-0 opacity-40">
        <motion.img
          style={{ y: imgY, scale: imgScale }}
          src={IMG.about[0]}
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white/60 to-white" />
      </div>
      {/* Ambient depth shapes, quieter than the homepage since this page is text-led */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-10 left-[8%] h-48 w-48 rounded-full bg-primary/10 blur-3xl animate-float-slow" />
        <div className="absolute bottom-0 right-[10%] h-56 w-56 rounded-full bg-secondary/10 blur-3xl animate-float" />
      </div>

      <div className="container-x relative text-center max-w-4xl mx-auto">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 text-primary px-4 py-1.5 text-xs font-semibold tracking-[0.14em] uppercase">
            <Sparkles size={14} /> Our Story
          </span>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="mt-6 font-display text-5xl md:text-7xl font-black leading-[1.02] text-brand-ink">
            Snacks made with <span className="text-gradient">care</span>, delivered with trust.
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Zesto Foods was built to raise the bar for locally manufactured halal snacks — combining trusted flavours with the hygiene and consistency you'd expect from a global brand.
          </p>
        </Reveal>

        {/* Quiet credential row — grounds the "trust" claim in the headline without inventing numbers */}
        <Reveal delay={0.18}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {[
              { icon: ShieldCheck, label: "Halal Certified" },
              { icon: Factory, label: "Gujranwala Facility" },
              { icon: Award, label: "Quality Assured" },
            ].map((b) => (
              <div key={b.label} className="flex items-center gap-2 text-brand-ink/70">
                <b.icon size={15} className="text-primary" />
                <span className="text-xs font-semibold uppercase tracking-[0.1em]">{b.label}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ----------------------------- TIMELINE ---------------------------- */
function Timeline() {
  const milestones = [
    { year: "Foundation", title: "A small family workshop", desc: "Zesto Foods begins with a family recipe for nimko and a commitment to using only quality ingredients.", icon: Heart },
    { year: "Growth", title: "A modern facility in Gujranwala", desc: "We move into our current facility on Gill Road, adding automated frying and packing lines.", icon: Factory },
    { year: "Range", title: "A complete snack portfolio", desc: "Chips, corn snacks, masala mixes and salted snacks join our range — all fully halal.", icon: Sparkles },
    { year: "Today", title: "Trusted by wholesalers nationwide", desc: "Distribution partners across Pakistan rely on Zesto Foods for consistent quality and supply.", icon: Award },
  ];
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.4"] });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section className="py-24 md:py-32">
      <div className="container-x">
        <SectionHeader eyebrow="Our Journey" title="Milestones that shaped us." />
        <div ref={ref} className="mt-16 relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border" />
          {/* Coloured progress line draws itself in as the reader scrolls the timeline —
              reinforces that this is a chronological path, not a static list. */}
          <motion.div
            style={{ height: lineHeight }}
            className="absolute left-4 md:left-1/2 top-0 w-px gradient-primary origin-top"
          />
          <div className="space-y-14">
            {milestones.map((m, i) => (
              <Reveal key={m.title} delay={i * 0.05}>
                <div className={`relative grid md:grid-cols-2 gap-6 md:gap-16 items-center ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}>
                  <div className={`pl-12 md:pl-0 ${i % 2 ? "md:text-left" : "md:text-right"}`}>
                    <TiltCard maxTilt={4} className="group inline-block w-full">
                      <div
                        className={`rounded-2xl border border-border bg-white p-6 shadow-soft transition-shadow duration-300 group-hover:shadow-elev ${
                          i % 2 ? "md:mr-auto" : "md:ml-auto"
                        }`}
                      >
                        <span className="text-xs uppercase tracking-[0.2em] font-bold text-primary">{m.year}</span>
                        <h3 className="mt-2 font-display text-2xl md:text-3xl font-bold text-brand-ink">{m.title}</h3>
                        <p className="mt-3 text-muted-foreground leading-relaxed">{m.desc}</p>
                      </div>
                    </TiltCard>
                  </div>
                  <div className="hidden md:block" />
                  <span className="absolute left-4 md:left-1/2 top-6 -translate-x-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-full gradient-primary shadow-elev ring-4 ring-white">
                    <m.icon size={15} className="text-white" />
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------ MISSION / VISION / VALUES ----------------- */
function MissionVisionValues() {
  const items = [
    { icon: Target, title: "Our Mission", desc: "To manufacture premium halal snacks that delight every generation — with honest ingredients and world-class hygiene." },
    { icon: Compass, title: "Our Vision", desc: "To be the most trusted snack manufacturing partner in Pakistan, and a proudly halal name recognised beyond." },
    { icon: Heart, title: "Our Values", desc: "Quality without compromise. Care for our people. Respect for our partners. Halal integrity in every pack." },
  ];
  return (
    <section className="py-24 md:py-32 gradient-warm">
      <div className="container-x">
        <Stagger className="grid gap-6 md:grid-cols-3">
          {items.map((c) => (
            <StaggerItem key={c.title}>
              <TiltCard maxTilt={7} glare className="group h-full relative">
                <div className="relative h-full rounded-3xl bg-white border border-border p-8 shadow-soft overflow-hidden transition-shadow duration-500 group-hover:shadow-[0_30px_55px_-25px_rgba(0,0,0,0.3)]">
                  <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-primary/5 group-hover:bg-primary/20 blur-2xl transition-colors duration-500" />
                  <div className="relative" style={{ transform: "translateZ(20px)" }}>
                    <div className="grid h-14 w-14 place-items-center rounded-2xl gradient-primary text-white shadow-soft transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3">
                      <c.icon size={24} />
                    </div>
                    <h3 className="mt-6 font-display text-2xl font-bold text-brand-ink">{c.title}</h3>
                    <p className="mt-3 text-muted-foreground leading-relaxed">{c.desc}</p>
                  </div>
                </div>
              </TiltCard>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* --------------------------- EXCELLENCE PILLARS --------------------- */
function ExcellencePillars() {
  const pillars = [
    { icon: Leaf, title: "Cleanliness", desc: "Sanitised zones, colour-coded tools and strict PPE discipline." },
    { icon: ShieldCheck, title: "Food Safety", desc: "HACCP-aligned monitoring, metal detection and lot tracking." },
    { icon: Award, title: "Quality Assurance", desc: "Sensory audits, moisture checks and seal-integrity testing." },
    { icon: Factory, title: "Modern Equipment", desc: "Automated frying, coating and packing lines with in-line QC." },
  ];
  return (
    <section className="py-24 md:py-32">
      <div className="container-x">
        <SectionHeader eyebrow="Manufacturing Excellence" title="The four pillars behind every pack." />
        <Stagger className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {pillars.map((c) => (
            <StaggerItem key={c.title}>
              <TiltCard maxTilt={6} className="group h-full relative">
                <div className="relative h-full rounded-3xl border border-border bg-white p-7 transition-shadow duration-300 group-hover:shadow-soft overflow-hidden">
                  <div className="relative" style={{ transform: "translateZ(15px)" }}>
                    <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:gradient-primary group-hover:text-white">
                      <c.icon size={22} />
                    </div>
                    <h3 className="mt-5 font-display text-lg font-bold text-brand-ink">{c.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
                  </div>
                </div>
              </TiltCard>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* -------------------------------- CTA ------------------------------- */
function AboutCTA() {
  return (
    <section className="pb-24">
      <div className="container-x">
        <div className="rounded-[2.5rem] gradient-ink text-white p-12 md:p-16 text-center relative overflow-hidden">
          <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-primary/30 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-secondary/20 blur-3xl" />
          <div className="relative max-w-2xl mx-auto">
            <Reveal>
              <h2 className="font-display text-3xl md:text-5xl font-bold">Let's build something delicious together.</h2>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="mt-4 text-white/70">Wholesalers, distributors and retail partners — reach out to explore our range.</p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-8 inline-block" style={{ perspective: 600 }}>
                <Magnetic>
                  <motion.a
                    href="/contact"
                    whileHover={{ rotateX: -8, y: -3 }}
                    style={{ transformStyle: "preserve-3d" }}
                    className="inline-flex items-center gap-2 rounded-full gradient-primary px-7 py-4 font-semibold shadow-elev transition-shadow hover:shadow-[0_20px_45px_-15px_rgba(255,107,0,0.55)]"
                  >
                    Get in touch
                  </motion.a>
                </Magnetic>
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mt-6 text-sm text-white/60">
                {SITE.address.line1}, {SITE.address.city}, {SITE.address.country}
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}