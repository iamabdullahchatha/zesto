import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { ASSETS, SITE } from "@/lib/site";

const QUICK_LINKS = [
  ["/", "Home"],
  ["/about", "About"],
  ["/products", "Products"],
  ["/faqs", "FAQs"],
  ["/contact", "Contact"],
] as const;

const PRODUCT_LINKS = [
  "Nimko",
  "Potato Chips",
  "Corn Snacks",
  "Masala Snacks",
  "Salted Snacks",
] as const;

const SOCIALS = [
  { Icon: Facebook, label: "Facebook", href: "#" },
  { Icon: Instagram, label: "Instagram", href: "#" },
  { Icon: Linkedin, label: "LinkedIn", href: "#" },
] as const;

/**
 * 3D flip-text: the current word sits on a card that folds backward and
 * away on hover (rotateX around its bottom edge) while a colored duplicate
 * folds in from the top edge to take its place. Parent needs `group`.
 */
function FlipText({ children, className = "" }: { children: string; className?: string }) {
  return (
    <span
      className={`relative inline-block overflow-hidden align-bottom [perspective:400px] ${className}`}
    >
      {/* Invisible sizer keeps the box the right width/height */}
      <span className="invisible block">{children}</span>

      <span
        className="absolute inset-0 block [backface-visibility:hidden] [transform-style:preserve-3d] [transform-origin:50%_100%] transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:[transform:rotateX(-90deg)]"
      >
        {children}
      </span>
      <span
        aria-hidden="true"
        className="absolute inset-0 block text-primary [backface-visibility:hidden] [transform-style:preserve-3d] [transform-origin:50%_0%] [transform:rotateX(90deg)] transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:[transform:rotateX(0deg)]"
      >
        {children}
      </span>
    </span>
  );
}

export function Footer() {
  return (
    <footer className="relative gradient-ink text-white/70 overflow-hidden">
      <div className="container-x relative pt-16 pb-12 grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        {/* Brand */}
        <div>
          <Link to="/">
            <img src={ASSETS.logo} alt="Zesto Foods" className="h-11 w-auto object-contain" />
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-white/60 max-w-xs">
            {SITE.description}
          </p>
          <div className="mt-5 flex gap-3">
            {SOCIALS.map(({ Icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-white/60 transition-all duration-300 hover:border-primary hover:text-primary hover:-translate-y-0.5"
              >
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <nav aria-label="Quick links">
          <h4 className="font-display text-white font-semibold text-sm mb-4">Quick Links</h4>
          <ul className="space-y-3 text-sm">
            {QUICK_LINKS.map(([href, label]) => (
              <li key={href}>
                <Link to={href} className="group inline-block text-white/60">
                  <FlipText>{label}</FlipText>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Products */}
        <nav aria-label="Products">
          <h4 className="font-display text-white font-semibold text-sm mb-4">Products</h4>
          <ul className="space-y-3 text-sm">
            {PRODUCT_LINKS.map((p) => (
              <li key={p}>
                <Link to="/products" className="group inline-block text-white/60">
                  <FlipText>{p}</FlipText>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contact */}
        <div>
          <h4 className="font-display text-white font-semibold text-sm mb-4">Contact</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-2.5">
              <MapPin size={16} className="shrink-0 text-primary mt-0.5" />
              <span className="text-white/60">
                {SITE.address.line1}
                <br />
                {SITE.address.city}, {SITE.address.country}
              </span>
            </li>
            {SITE.phones.map((p) => (
              <li key={p.tel} className="flex gap-2.5">
                <Phone size={16} className="shrink-0 text-primary mt-0.5" />
                <a href={`tel:${p.tel}`} className="text-white/60 hover:text-primary transition-colors">
                  {p.display}
                </a>
              </li>
            ))}
            <li className="flex gap-2.5">
              <Mail size={16} className="shrink-0 text-primary mt-0.5" />
              <Link to="/contact" className="group inline-block text-white/60">
                <FlipText>Send us a message</FlipText>
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="container-x relative py-5 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/45">
        <p>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
        <p className="flex items-center gap-5">
          <Link to="/privacy" className="group inline-block">
            <FlipText>Privacy Policy</FlipText>
          </Link>
          <Link to="/terms" className="group inline-block">
            <FlipText>Terms & Conditions</FlipText>
          </Link>
        </p>
      </div>

      {/* Signature element: large tone-on-tone wordmark */}
      <div className="pointer-events-none select-none relative overflow-hidden" aria-hidden>
        <span
          className="block whitespace-nowrap text-center font-display font-extrabold text-white/[0.05] leading-none py-2"
          style={{ fontSize: "clamp(3.5rem, 11vw, 8rem)" }}
        >
          Zesto Foods
        </span>
      </div>
    </footer>
  );
}