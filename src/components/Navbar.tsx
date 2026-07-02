import { Link, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ASSETS } from "@/lib/site";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/products", label: "Products" },
  { to: "/faqs", label: "FAQs" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const { location } = useRouterState();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  // Close mobile menu on Escape and on outside click for better UX/accessibility
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => {
      if (open && menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    // Lock body scroll while mobile menu is open
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
      document.body.style.overflow = "";
    };
  }, [open]);

  const solid = scrolled || open || location.pathname !== "/";

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        solid
          ? "bg-white/85 backdrop-blur-xl border-b border-border shadow-[0_4px_30px_-15px_rgba(0,0,0,0.15)]"
          : "bg-transparent"
      }`}
    >
      <div className="container-x flex h-20 items-center justify-between">
        {/* Logo — falls back to a text wordmark if the image asset fails to load */}
        <Link
          to="/"
          className="flex items-center gap-3 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 rounded-lg"
        >
          {!logoError ? (
            <img
              src={ASSETS.logo}
              alt="Zesto Foods"
              className="h-11 w-auto object-contain select-none"
              draggable={false}
              onError={() => setLogoError(true)}
            />
          ) : (
            <span
              className={`text-2xl font-extrabold tracking-tight transition-colors ${
                solid ? "text-primary" : "text-white"
              }`}
            >
              Zesto <span className="font-light">Foods</span>
            </span>
          )}
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {LINKS.map((l) => {
            const active = location.pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                aria-current={active ? "page" : undefined}
                className={`group relative px-4 py-2 text-sm font-medium transition-colors rounded-full ${
                  solid
                    ? active
                      ? "text-primary"
                      : "text-brand-ink/80 hover:text-primary"
                    : active
                      ? "text-white"
                      : "text-white/90 hover:text-white"
                }`}
              >
                {l.label}
                <span
                  className={`absolute left-4 right-4 -bottom-0.5 h-0.5 origin-left scale-x-0 rounded-full bg-primary transition-transform duration-300 ease-out group-hover:scale-x-100 ${
                    active ? "scale-x-100" : ""
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/contact"
            className="hidden md:inline-flex items-center rounded-full gradient-primary px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/25 active:translate-y-0"
          >
            Become a Distributor
          </Link>
          <button
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className={`lg:hidden inline-flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-300 ${
              solid
                ? "border-border text-brand-ink hover:bg-brand-ink/5"
                : "border-white/40 text-white hover:bg-white/10"
            }`}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={open ? "close" : "menu"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex"
              >
                {open ? <X size={20} /> : <Menu size={20} />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            ref={menuRef}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden overflow-hidden bg-white border-t border-border shadow-[0_20px_40px_-20px_rgba(0,0,0,0.25)]"
          >
            <div className="container-x flex flex-col py-2">
              {LINKS.map((l, i) => {
                const active = location.pathname === l.to;
                return (
                  <motion.div
                    key={l.to}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, delay: i * 0.04 }}
                  >
                    <Link
                      to={l.to}
                      className={`flex items-center justify-between py-3.5 text-base font-medium border-b border-border/60 transition-colors ${
                        active ? "text-primary" : "text-brand-ink hover:text-primary"
                      }`}
                    >
                      {l.label}
                      {active && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                    </Link>
                  </motion.div>
                );
              })}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: LINKS.length * 0.04 }}
              >
                <Link
                  to="/contact"
                  className="mt-4 mb-2 inline-flex w-full justify-center rounded-full gradient-primary px-5 py-3.5 text-sm font-semibold text-white shadow-soft transition-transform active:scale-[0.98]"
                >
                  Become a Distributor
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}