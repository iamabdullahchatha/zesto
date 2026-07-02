import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Award,
  ChevronDown,
  Factory,
  Leaf,
  Package,
  Phone,
  ShieldCheck,
  Sparkles,
  Truck,
  Utensils,
  Beaker,
  MessageCircle,
  Plus,
  Minus,
  Quote,
} from "lucide-react";
import halalImg from "@/assets/halal.webp";
import hygieneImg from "@/assets/hygine.webp";
import { IMG, PRODUCTS, FAQS, SITE } from "@/lib/site";
import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Zesto Foods — Premium Halal Snacks Manufacturer" },
      { property: "og:title", content: "Zesto Foods — Premium Halal Snacks" },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <AboutBrief />
      <ProductsSection />
      <WhyChooseUs />
      <SafetyHygiene />
      <Wholesale />
      <FAQSection />
      <ContactCTA />
    </>
  );
}

/* ------------------------- 3D TILT PRIMITIVE ----------------------- */
/**
 * Wraps its children in a perspective card that tilts toward the cursor
 * in real 3D (rotateX/rotateY), with a spring for a physical, weighty feel.
 * A synthetic drop shadow moves opposite the tilt to sell the illusion of
 * a real object catching light, and children can read the shared motion
 * values via the exposed `--tilt-x` / `--tilt-y` custom properties.
 */
function TiltCard({
  children,
  className = "",
  maxTilt = 10,
  glare = false,
  liftShadow = true,
}: {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  glare?: boolean;
  liftShadow?: boolean;
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
  // Shadow moves opposite the tilt direction, like a real object under a fixed light.
  const shadowX = useTransform(springX, [0, 1], [16, -16]);
  const shadowY = useTransform(springY, [0, 1], [10, -10]);

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
      {liftShadow && (
        <motion.div
          aria-hidden
          style={{ x: shadowX, y: shadowY }}
          className="pointer-events-none absolute inset-3 -z-10 rounded-[inherit] bg-black/25 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />
      )}
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative h-full"
      >
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

/* --------------------------- MAGNETIC CTA -------------------------- */
/** Buttons that pull slightly toward the cursor for a tactile, premium feel. */
function Magnetic({ children, strength = 14 }: { children: React.ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 20, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 300, damping: 20, mass: 0.4 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    x.set((relX / rect.width) * strength);
    y.set((relY / rect.height) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy }}
      className="inline-block"
    >
      {children}
    </motion.div>
  );
}

/* ----------------------------- HERO ----------------------------- */
function Hero() {
  const [i, setI] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 120]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const imgScale = useTransform(scrollY, [0, 600], [1, 1.15]);

  // Gentle mouse-parallax on the floating ambient shapes for a 3D sense of depth
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const smx = useSpring(mx, { stiffness: 60, damping: 20 });
  const smy = useSpring(my, { stiffness: 60, damping: 20 });
  const shapeX = useTransform(smx, [0, 1], [-24, 24]);
  const shapeY = useTransform(smy, [0, 1], [-24, 24]);
  const shapeX2 = useTransform(smx, [0, 1], [18, -18]);
  const shapeY2 = useTransform(smy, [0, 1], [18, -18]);
  // Headline gets a whisper of parallax too, for depth against the backdrop
  const headX = useTransform(smx, [0, 1], [-6, 6]);
  const headY = useTransform(smy, [0, 1], [-4, 4]);

  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % IMG.hero.length), 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      ref={ref}
      onMouseMove={(e) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        mx.set((e.clientX - rect.left) / rect.width);
        my.set((e.clientY - rect.top) / rect.height);
      }}
      className="relative h-[100svh] min-h-[680px] w-full overflow-hidden"
    >
      <AnimatePresence>
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.6, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <motion.img
            style={{ scale: imgScale }}
            src={IMG.hero[i]}
            alt="Premium snacks"
            className="h-full w-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/50 to-black/85" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/20" />
      <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_20%_20%,rgba(255,107,0,0.35),transparent_60%)]" />
      {/* Fine grain for a less "flat digital" premium texture */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Floating shapes with subtle 3D parallax */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          style={{ x: shapeX, y: shapeY }}
          className="absolute top-24 left-8 h-40 w-40 rounded-full bg-primary/30 blur-3xl animate-float"
        />
        <motion.div
          style={{ x: shapeX2, y: shapeY2 }}
          className="absolute bottom-32 right-10 h-56 w-56 rounded-full bg-secondary/25 blur-3xl animate-float-slow"
        />
        <motion.div
          style={{ x: shapeX, y: shapeY2 }}
          className="absolute top-1/3 right-1/4 h-24 w-24 rounded-full bg-accent/30 blur-2xl animate-float-x"
        />
      </div>

      <motion.div style={{ y, opacity }} className="relative z-10 container-x h-full flex items-center pt-20">
        <motion.div style={{ x: headX, y: headY }} className="max-w-4xl">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-xs font-semibold tracking-[0.14em] uppercase text-white"
          >
            <Sparkles size={14} className="text-secondary" /> 100% Halal • Made in Pakistan
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.9 }}
            className="mt-6 font-display font-black text-white text-5xl md:text-7xl lg:text-[5.5rem] leading-[1.02] tracking-tight"
          >
            Premium Halal Snacks{" "}
            <span className="inline-block">
              <span className="text-gradient bg-clip-text">Crafted</span>
            </span>{" "}
            with Quality &amp; Care
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="mt-6 max-w-2xl text-lg md:text-xl text-white/85 leading-relaxed"
          >
            Manufacturing delicious snacks with premium ingredients, hygienic processes, and trusted quality for wholesalers and distributors across Pakistan.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75 }}
            className="mt-10 flex flex-wrap items-center gap-4"
            style={{ perspective: 600 }}
          >
            <Magnetic>
              <motion.div whileHover={{ rotateX: -8, translateZ: 20, y: -3 }} style={{ transformStyle: "preserve-3d" }}>
                <Link
                  to="/products"
                  className="group inline-flex items-center gap-2 rounded-full gradient-primary px-7 py-4 text-sm font-semibold text-white shadow-elev transition-shadow hover:shadow-[0_20px_45px_-15px_rgba(255,107,0,0.55)]"
                >
                  Explore Products <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
            </Magnetic>
            <Magnetic strength={10}>
              <motion.div whileHover={{ rotateX: -8, translateZ: 20, y: -3 }} style={{ transformStyle: "preserve-3d" }}>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 rounded-full glass px-7 py-4 text-sm font-semibold text-white hover:bg-white/25 transition-colors"
                >
                  Become a Distributor
                </Link>
              </motion.div>
            </Magnetic>
            <Magnetic strength={10}>
              <motion.div whileHover={{ rotateX: -8, translateZ: 20, y: -3 }} style={{ transformStyle: "preserve-3d" }}>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 rounded-full border border-white/40 px-7 py-4 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
                >
                  Contact Us
                </Link>
              </motion.div>
            </Magnetic>
          </motion.div>

          {/* Slider dots */}
          <div className="mt-14 flex items-center gap-3">
            {IMG.hero.map((_, idx) => (
              <button
                key={idx}
                aria-label={`Slide ${idx + 1}`}
                onClick={() => setI(idx)}
                className={`h-1.5 rounded-full transition-all duration-500 ${idx === i ? "w-10 bg-primary" : "w-5 bg-white/40 hover:bg-white/60"}`}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>

      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-white/80 flex flex-col items-center gap-2 text-xs uppercase tracking-[0.3em] hover:text-white transition-colors"
      >
        Scroll
        <motion.span animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.8 }}>
          <ChevronDown size={22} />
        </motion.span>
      </motion.a>
    </section>
  );
}

/* ----------------------------- TRUST BAR ---------------------------- */
/**
 * A quiet credibility strip directly under the hero. Keeps the same
 * language register as the hero badge instead of inventing statistics —
 * update the `marks` copy with real certifications / client names when available.
 */
function TrustBar() {
  const marks = [
    { icon: ShieldCheck, label: "Halal Certified" },
    { icon: Factory, label: "HACCP-Aligned Facility" },
    { icon: Leaf, label: "Quality-Checked Ingredients" },
    { icon: Truck, label: "Nationwide Distribution" },
    { icon: Award, label: "Trusted Wholesale Partner" },
  ];
  return (
    <section className="relative border-b border-border bg-white py-6">
      <div className="container-x">
        <Stagger className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {marks.map((m) => (
            <StaggerItem key={m.label}>
              <div className="flex items-center gap-2.5 text-brand-ink/70">
                <m.icon size={16} className="text-primary" />
                <span className="text-xs font-semibold uppercase tracking-[0.12em]">{m.label}</span>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* --------------------------- ABOUT BRIEF -------------------------- */
function AboutBrief() {
  return (
    <section id="about" className="relative py-24 md:py-32 overflow-hidden">
      <div className="container-x grid gap-14 lg:grid-cols-2 items-center">
        <Reveal className="relative">
          <TiltCard maxTilt={6} className="group relative">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-elev">
              <img src={halalImg} alt="Zesto Foods halal-certified snack manufacturing" className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 via-transparent to-transparent" />
              <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-3xl" />
            </div>
          </TiltCard>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden md:block absolute -bottom-8 -right-6 w-56 rounded-2xl overflow-hidden shadow-elev border-4 border-white"
          >
            <img src={IMG.about[1]} alt="Quality inspection" className="h-full w-full object-cover" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="hidden md:flex absolute -top-8 -left-6 items-center gap-3 rounded-2xl bg-white shadow-elev p-4 pr-6 border border-border"
          >
            <div className="grid h-12 w-12 place-items-center rounded-xl gradient-primary text-white">
              <Award size={22} />
            </div>
            <div>
              <p className="font-display font-bold text-brand-ink">100% Halal</p>
              <p className="text-xs text-muted-foreground">Certified process</p>
            </div>
          </motion.div>
        </Reveal>

        <div>
          <SectionHeader
            center={false}
            eyebrow="About Zesto Foods"
            title="A modern snack manufacturer built on trust."
            description="From our facility in Gujranwala, we produce a full range of halal snacks — nimko, chips, corn snacks, masala mixes and more — combining traditional recipes with modern manufacturing and rigorous quality control."
          />
          <Stagger className="mt-10 grid sm:grid-cols-2 gap-5">
            {[
              { icon: ShieldCheck, title: "Halal & Hygienic", desc: "Fully halal-compliant, sanitised production zones." },
              { icon: Leaf, title: "Fresh Ingredients", desc: "Carefully sourced, quality-checked at intake." },
              { icon: Factory, title: "Modern Equipment", desc: "Automated lines and sealed packaging." },
              { icon: Truck, title: "Nationwide Supply", desc: "Trusted by wholesalers across Pakistan." },
            ].map((f) => (
              <StaggerItem key={f.title}>
                <div className="group h-full rounded-2xl bg-white border border-border p-6 hover:border-primary/40 hover:shadow-soft transition-all duration-300 hover:-translate-y-1">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:gradient-primary group-hover:text-white group-hover:rotate-6">
                    <f.icon size={20} />
                  </div>
                  <h3 className="mt-4 font-display font-semibold text-lg text-brand-ink">{f.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
          <div className="mt-10">
            <Link to="/about" className="group inline-flex items-center gap-2 font-semibold text-primary">
              Read our full story
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------- PRODUCTS ---------------------------- */
function ProductsSection() {
  return (
    <section className="relative py-24 md:py-32 gradient-warm">
      <div className="container-x">
        <SectionHeader
          eyebrow="Our Products"
          title="Snacks crafted for every moment."
          description="A complete range of halal snacks in sachets, pouches and family packs — ready for wholesale and distribution."
        />
        <Stagger className="mt-16 grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCTS.map((p) => (
            <StaggerItem key={p.slug}>
              <TiltCard maxTilt={8} glare className="group h-full relative">
                <article className="relative overflow-hidden rounded-3xl bg-white border border-border shadow-soft transition-shadow duration-500 group-hover:shadow-[0_35px_60px_-25px_rgba(0,0,0,0.35)] h-full flex flex-col">
                  <div className="relative aspect-square overflow-hidden" style={{ transform: "translateZ(30px)" }}>
                    <img
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <span className="absolute top-4 left-4 rounded-full glass px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-brand-ink">
                      {p.tag}
                    </span>
                  </div>
                  <div className="p-6 flex flex-col flex-1" style={{ transform: "translateZ(15px)" }}>
                    <h3 className="font-display text-xl font-bold text-brand-ink">{p.name}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed flex-1">{p.desc}</p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {p.packs.map((pk) => (
                        <span key={pk} className="text-[11px] rounded-full bg-muted px-2.5 py-1 text-muted-foreground">
                          {pk}
                        </span>
                      ))}
                    </div>
                    <Link
                      to="/contact"
                      className="mt-5 inline-flex items-center justify-between text-sm font-semibold text-primary group/link"
                    >
                      Wholesale enquiry
                      <ArrowRight size={16} className="transition-transform group-hover/link:translate-x-1" />
                    </Link>
                  </div>
                </article>
              </TiltCard>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* --------------------------- WHY CHOOSE US ------------------------ */
function WhyChooseUs() {
  const items = [
    { icon: ShieldCheck, title: "Halal Integrity", desc: "Every ingredient sourced and every product produced under strict halal protocols." },
    { icon: Beaker, title: "Quality Assurance", desc: "Consistent flavour, texture and freshness — checked at every stage." },
    { icon: Leaf, title: "Premium Ingredients", desc: "Only the finest raw materials make it into a Zesto Foods pack." },
    { icon: Factory, title: "Modern Manufacturing", desc: "Automated lines with strong hygiene and food-safety practices." },
    { icon: Package, title: "Sealed Freshness", desc: "Multi-layer, moisture-resistant packaging preserves every crunch." },
    { icon: Truck, title: "Reliable Supply", desc: "Consistent lead times for our wholesale and distribution partners." },
  ];
  return (
    <section className="relative py-24 md:py-32">
      <div className="container-x">
        <SectionHeader eyebrow="Why Zesto Foods" title="Six reasons partners choose us." />
        <Stagger className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => (
            <StaggerItem key={it.title}>
              <TiltCard maxTilt={7} className="group h-full relative">
                <div className="relative h-full rounded-3xl border border-border bg-white p-8 transition-shadow duration-500 group-hover:shadow-[0_30px_55px_-25px_rgba(0,0,0,0.3)] overflow-hidden">
                  <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-primary/5 group-hover:bg-primary/20 blur-2xl transition-colors duration-500" />
                  <div className="relative" style={{ transform: "translateZ(25px)" }}>
                    <div className="grid h-14 w-14 place-items-center rounded-2xl gradient-primary text-white shadow-soft transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3">
                      <it.icon size={24} />
                    </div>
                    <h3 className="mt-6 font-display text-xl font-bold text-brand-ink">{it.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{it.desc}</p>
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

/* -------------------------- MANUFACTURING ------------------------- */
function Process() {
  const steps = [
    { icon: Leaf, title: "Sourcing", desc: "Premium potatoes, corn, pulses and spices selected from trusted suppliers." },
    { icon: Utensils, title: "Preparation", desc: "Cleaning, sizing and seasoning with our signature masala blends." },
    { icon: Factory, title: "Cooking", desc: "Precision frying and roasting on modern lines for the perfect crunch." },
    { icon: Package, title: "Packaging", desc: "Sealed in nitrogen-flushed, multi-layer packs for freshness." },
  ];
  return (
    <section className="relative py-24 md:py-32 gradient-ink text-white overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <img src={IMG.process[1]} alt="" className="h-full w-full object-cover" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/90" />
      <div className="container-x relative">
        <SectionHeader
          light
          eyebrow="Manufacturing Process"
          title="From raw ingredient to sealed pack."
          description="A four-stage process built on precision, consistency and hygiene."
        />
        <div className="relative mt-16">
          {/* Connective line encodes that this is a real, ordered sequence */}
          <div className="hidden lg:block absolute top-[3.25rem] left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <Stagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, idx) => (
              <StaggerItem key={s.title}>
                <div className="relative h-full rounded-3xl glass-dark p-8">
                  <span className="absolute -top-4 -left-4 grid h-12 w-12 place-items-center rounded-2xl gradient-primary font-display font-black text-white shadow-elev">
                    0{idx + 1}
                  </span>
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-white/10 text-secondary">
                    <s.icon size={22} />
                  </div>
                  <h3 className="mt-6 font-display text-xl font-bold">{s.title}</h3>
                  <p className="mt-2 text-sm text-white/70 leading-relaxed">{s.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}

/* ---------------------- QUALITY + SAFETY ------------------------ */
function Quality() {
  return (
    <section className="py-24 md:py-32">
      <div className="container-x grid gap-14 lg:grid-cols-2 items-center">
        <div>
          <SectionHeader
            center={false}
            eyebrow="Quality Assurance"
            title="Every pack tastes the way it should."
            description="Our QA team inspects raw materials, monitors production parameters and audits finished goods before dispatch. Consistency is our promise to every partner."
          />
          <Stagger className="mt-8 space-y-4">
            {[
              "Ingredient-intake inspection & lot tracking",
              "Controlled frying temperature and moisture checks",
              "Random-sample sensory and weight audits",
              "Sealed-pack integrity and shelf-life validation",
            ].map((t) => (
              <StaggerItem key={t}>
                <div className="flex gap-4 items-start">
                  <div className="mt-1 grid h-6 w-6 place-items-center rounded-full gradient-primary text-white shrink-0">
                    <ShieldCheck size={13} />
                  </div>
                  <p className="text-brand-ink/90">{t}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
        <Reveal>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-3xl overflow-hidden aspect-[3/4] shadow-soft">
              <img src={IMG.quality[0]} alt="" className="h-full w-full object-cover" />
            </div>
            <div className="rounded-3xl overflow-hidden aspect-[3/4] shadow-soft translate-y-8">
              <img src={IMG.quality[1]} alt="" className="h-full w-full object-cover" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function SafetyHygiene() {
  return (
    <section className="relative py-24 md:py-32 bg-gradient-to-b from-white to-muted overflow-hidden">
      <div className="container-x grid gap-14 lg:grid-cols-2 items-center">
        <Reveal className="lg:order-2">
          <TiltCard maxTilt={5} className="group relative">
            <div className="relative aspect-[5/4] rounded-3xl overflow-hidden shadow-elev">
              <img src={hygieneImg} alt="Food safety and hygiene standards" className="h-full w-full object-cover object-center" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 flex items-center gap-3 rounded-2xl glass px-4 py-3">
                <ShieldCheck className="text-primary" />
                <p className="text-sm font-semibold text-brand-ink">Sanitised zones, gloved handling, sealed lines.</p>
              </div>
            </div>
          </TiltCard>
        </Reveal>
        <div className="lg:order-1">
          <SectionHeader
            center={false}
            eyebrow="Food Safety & Hygiene"
            title="Uncompromised standards from floor to finish."
            description="Colour-coded zones, dedicated staff PPE, routine sanitisation, pest control and finished-goods segregation — every practice designed to protect the product and the people who enjoy it."
          />
          <Stagger className="mt-8 grid sm:grid-cols-2 gap-4">
            {[
              "Daily sanitisation of production lines",
              "PPE, hairnets and gloved handling",
              "Segregated raw & packed goods storage",
              "Metal detection on packing lines",
            ].map((t) => (
              <StaggerItem key={t}>
                <div className="rounded-2xl bg-white border border-border p-5 flex gap-3 items-start transition-all duration-300 hover:border-primary/30 hover:shadow-soft hover:-translate-y-0.5">
                  <ShieldCheck className="text-accent shrink-0" size={20} />
                  <p className="text-sm text-brand-ink/90">{t}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}

/* --------------------------- PACKAGING --------------------------- */
function PackagingSection() {
  return (
    <section className="py-24 md:py-32">
      <div className="container-x">
        <SectionHeader
          eyebrow="Packaging"
          title="Freshness sealed in every pack."
          description="Multi-layer laminates, precise sealing and vibrant print — engineered for shelf life and shelf presence."
        />
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {[
            { title: "Sachet", size: "10 – 20g", img: IMG.process[2], desc: "Perfect for retail hangers and impulse-buy racks." },
            { title: "Pouch", size: "35 – 60g", img: IMG.packaging, desc: "Balanced pack for personal snacking on the go." },
            { title: "Family Pack", size: "150 – 200g", img: IMG.gallery[0], desc: "Sharing size for households and canteens." },
          ].map((c, idx) => (
            <Reveal key={c.title} delay={idx * 0.08}>
              <div className="group relative rounded-3xl overflow-hidden aspect-[4/5] shadow-soft">
                <img src={c.img} alt={c.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-7 text-white">
                  <span className="text-xs uppercase tracking-[0.2em] text-secondary">{c.size}</span>
                  <h3 className="font-display text-2xl font-bold mt-1">{c.title}</h3>
                  <p className="mt-2 text-sm text-white/80">{c.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------- WHOLESALE --------------------------- */
function Wholesale() {
  return (
    <section className="relative py-28 overflow-hidden">
      <div className="absolute inset-0">
        <img src={IMG.wholesale} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-black/50" />
      </div>
      <div className="container-x relative">
        <div className="max-w-2xl text-white">
          <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em]">
            <Truck size={14} className="text-secondary" /> Wholesale & Distribution
          </span>
          <h2 className="mt-6 font-display text-4xl md:text-6xl font-bold leading-tight">
            Partner with a snack brand built for scale.
          </h2>
          <p className="mt-5 text-white/80 text-lg leading-relaxed">
            Consistent quality, reliable lead times and pricing designed for wholesalers, distributors and retail chains across Pakistan.
          </p>
          <div className="mt-8 flex flex-wrap gap-4" style={{ perspective: 600 }}>
            <Magnetic>
              <motion.div whileHover={{ rotateX: -8, y: -3 }} style={{ transformStyle: "preserve-3d" }}>
                <Link to="/contact" className="inline-flex items-center gap-2 rounded-full gradient-primary px-7 py-4 font-semibold text-white shadow-elev transition-shadow hover:shadow-[0_20px_45px_-15px_rgba(255,107,0,0.55)]">
                  Request Distributor Pricing <ArrowRight size={16} />
                </Link>
              </motion.div>
            </Magnetic>
            <Magnetic strength={10}>
              <motion.div whileHover={{ rotateX: -8, y: -3 }} style={{ transformStyle: "preserve-3d" }}>
                <a href={`https://wa.me/${SITE.phones[0].wa}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full glass px-7 py-4 font-semibold text-white hover:bg-white/25 transition-colors">
                  <MessageCircle size={16} /> Chat on WhatsApp
                </a>
              </motion.div>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ FAQ ------------------------------ */
function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="py-24 md:py-32 gradient-warm">
      <div className="container-x grid gap-14 lg:grid-cols-[1fr_1.4fr] items-start">
        <div className="lg:sticky lg:top-32">
          <SectionHeader
            center={false}
            eyebrow="FAQs"
            title="Answers for wholesalers, distributors and retailers."
            description="Everything you need to know before partnering with Zesto Foods."
          />
          <Link to="/contact" className="mt-8 inline-flex items-center gap-2 font-semibold text-primary group">
            Still have questions? Contact us
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <div className="space-y-4">
          {FAQS.map((f, idx) => {
            const isOpen = open === idx;
            return (
              <Reveal key={f.q} delay={idx * 0.04}>
                <div className={`rounded-2xl border transition-all duration-300 bg-white ${isOpen ? "border-primary/40 shadow-soft" : "border-border"}`}>
                  <button
                    onClick={() => setOpen(isOpen ? null : idx)}
                    className="w-full text-left px-6 py-5 flex items-center justify-between gap-6"
                    style={{ perspective: 400 }}
                  >
                    <span className="font-display font-semibold text-brand-ink text-base md:text-lg">{f.q}</span>
                    <motion.span
                      animate={{ rotateY: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      style={{ transformStyle: "preserve-3d" }}
                      className={`grid h-9 w-9 place-items-center rounded-full shrink-0 transition-colors duration-300 ${isOpen ? "gradient-primary text-white" : "bg-muted text-brand-ink"}`}
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
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* --------------------------- CONTACT CTA -------------------------- */
function ContactCTA() {
  return (
    <section className="py-24">
      <div className="container-x">
        <div className="relative overflow-hidden rounded-[2.5rem] gradient-primary p-10 md:p-16 shadow-elev">
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-secondary/40 blur-3xl" />
          <Quote aria-hidden className="absolute top-8 right-10 h-20 w-20 text-white/10" />
          <div className="relative grid gap-8 md:grid-cols-[1.4fr_1fr] items-center">
            <div className="text-white">
              <h2 className="font-display text-4xl md:text-5xl font-black leading-tight">Ready to stock Zesto Foods?</h2>
              <p className="mt-4 text-white/90 max-w-xl text-lg">Speak to our team today for wholesale pricing, product samples and distributor terms.</p>
            </div>
            <div className="flex flex-col gap-3" style={{ perspective: 600 }}>
              {SITE.phones.map((p) => (
                <div key={p.tel} className="grid grid-cols-2 gap-3">
                  <Magnetic strength={8}>
                    <motion.a
                      href={`tel:${p.tel}`}
                      whileHover={{ rotateX: -6, y: -3 }}
                      style={{ transformStyle: "preserve-3d" }}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white text-brand-ink font-semibold px-5 py-4 shadow-sm transition-shadow hover:shadow-lg w-full"
                    >
                      <Phone size={16} /> {p.display}
                    </motion.a>
                  </Magnetic>
                  <Magnetic strength={8}>
                    <motion.a
                      href={`https://wa.me/${p.wa}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ rotateX: -6, y: -3 }}
                      style={{ transformStyle: "preserve-3d" }}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-ink text-white font-semibold px-5 py-4 shadow-sm transition-shadow hover:shadow-lg w-full"
                    >
                      <MessageCircle size={16} /> WhatsApp
                    </motion.a>
                  </Magnetic>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}