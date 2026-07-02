import { createFileRoute } from "@tanstack/react-router";
import { createServerFn, useServerFn } from "@tanstack/react-start";
import {
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Gift,
  HelpCircle,
  Mail,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
  Truck,
  User,
  Users,
} from "lucide-react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { z } from "zod";
import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";
import { SITE } from "@/lib/site";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name.").max(120),
  email: z.string().trim().email("Please enter a valid email address.").max(160),
  phone: z.string().trim().max(40).optional(),
  subject: z.string().trim().min(2).max(120),
  message: z.string().trim().min(10, "Please add a little more detail.").max(2000),
});

type ContactFormValues = z.infer<typeof contactSchema>;
type ContactStatus = "idle" | "sending" | "sent" | "error";

const sendContactMessage = createServerFn({ method: "POST" })
  .validator(contactSchema)
  .handler(async ({ data }) => {
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.RESEND_FROM_EMAIL;
    const to = (process.env.CONTACT_TO_EMAIL ?? "")
      .split(",")
      .map((email) => email.trim())
      .filter(Boolean);

    if (!apiKey || !from || to.length === 0) {
      throw new Error("Email delivery is not configured. Add RESEND_API_KEY, RESEND_FROM_EMAIL, and CONTACT_TO_EMAIL.");
    }

    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    const submittedAt = new Date().toLocaleString("en-PK", {
      timeZone: "Asia/Karachi",
      dateStyle: "medium",
      timeStyle: "short",
    });

    const plainText = [
      "New Zesto Foods contact enquiry",
      "",
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Phone: ${data.phone || "Not provided"}`,
      `Subject: ${data.subject}`,
      `Submitted: ${submittedAt}`,
      "",
      data.message,
    ].join("\n");

    const html = `
      <div style="font-family:Inter,Arial,sans-serif;background:#fff7ed;padding:24px;color:#24140b">
        <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #f0d2b8;border-radius:14px;overflow:hidden">
          <div style="background:#ff6b00;color:#ffffff;padding:20px 24px">
            <h1 style="margin:0;font-size:22px;line-height:1.25">New Zesto Foods enquiry</h1>
            <p style="margin:6px 0 0;color:#fff2e6">${escapeHtml(data.subject)}</p>
          </div>
          <div style="padding:24px">
            <table style="width:100%;border-collapse:collapse;font-size:14px">
              ${emailRow("Name", data.name)}
              ${emailRow("Email", data.email)}
              ${emailRow("Phone", data.phone || "Not provided")}
              ${emailRow("Submitted", submittedAt)}
            </table>
            <div style="margin-top:22px;padding:18px;border-radius:12px;background:#fff7ed;white-space:pre-wrap;line-height:1.65">${escapeHtml(data.message)}</div>
          </div>
        </div>
      </div>
    `;

    const { data: sent, error } = await resend.emails.send({
      from,
      to,
      replyTo: data.email,
      subject: `Zesto Foods enquiry: ${data.subject}`,
      text: plainText,
      html,
    });

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, id: sent?.id ?? null };
  });

function emailRow(label: string, value: string) {
  return `
    <tr>
      <td style="padding:10px 0;width:110px;color:#8a5a36;font-weight:700">${escapeHtml(label)}</td>
      <td style="padding:10px 0;color:#24140b">${escapeHtml(value)}</td>
    </tr>
  `;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[char];
  });
}

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Zesto Foods - Wholesale & Distribution Enquiries" },
      {
        name: "description",
        content: "Contact Zesto Foods for wholesale, distribution and product enquiries. Call, WhatsApp or send us a message.",
      },
      { property: "og:title", content: "Contact Zesto Foods" },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

/* ------------------------- 3D TILT PRIMITIVE ----------------------- */
function TiltCard({
  children,
  className = "",
  maxTilt = 4,
  glare = false,
}: {
  children: ReactNode;
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
    <motion.div ref={ref} onMouseMove={handleMove} onMouseLeave={handleLeave} style={{ perspective: 1000 }} className={className}>
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

/* --------------------------- SIGNATURE SEAL ------------------------ */
/** The recurring rotating trust-stamp used across the site's pages. */
function CertSeal({
  size = 110,
  ringClassName = "text-white/55",
  label = "100% HALAL  •  TRUSTED BY 500+ PARTNERS  •  ",
}: {
  size?: number;
  ringClassName?: string;
  label?: string;
}) {
  const pathId = useId();
  return (
    <div className="relative" style={{ width: size, height: size }} aria-hidden>
      <motion.svg
        viewBox="0 0 100 100"
        className={`h-full w-full ${ringClassName}`}
        animate={{ rotate: 360 }}
        transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
      >
        <defs>
          <path id={pathId} d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
        </defs>
        <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1" />
        <text fontSize="6.6" letterSpacing="1.5" fill="currentColor">
          <textPath href={`#${pathId}`} startOffset="0%">
            {label}
          </textPath>
        </text>
      </motion.svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="grid place-items-center rounded-full gradient-primary text-white shadow-elev" style={{ width: size * 0.34, height: size * 0.34 }}>
          <ShieldCheck size={size * 0.16} />
        </div>
      </div>
    </div>
  );
}

const SUBJECTS = [
  { label: "Wholesale enquiry", icon: Package },
  { label: "Distributor enquiry", icon: Truck },
  { label: "Product sample request", icon: Gift },
  { label: "General enquiry", icon: HelpCircle },
] as const;

const STATS = [
  { icon: Clock, value: "1", label: "Business Day Avg. Reply" },
  { icon: Users, value: "500+", label: "Wholesale Partners" },
  { icon: MessageCircle, value: "24/7", label: "WhatsApp Availability" },
];

function ContactPage() {
  const sendMessage = useServerFn(sendContactMessage);
  const [status, setStatus] = useState<ContactStatus>("idle");
  const [feedback, setFeedback] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof ContactFormValues, string>>>({});
  const [values, setValues] = useState<ContactFormValues>({
    name: "",
    email: "",
    phone: "",
    subject: "Wholesale enquiry",
    message: "",
  });

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 80]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.4]);

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const smx = useSpring(mx, { stiffness: 60, damping: 20 });
  const smy = useSpring(my, { stiffness: 60, damping: 20 });
  const shapeX = useTransform(smx, [0, 1], [-30, 30]);
  const shapeY = useTransform(smy, [0, 1], [-30, 30]);
  const shapeX2 = useTransform(smx, [0, 1], [22, -22]);
  const shapeY2 = useTransform(smy, [0, 1], [22, -22]);

  const directionsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${SITE.address.line1}, ${SITE.address.city}, ${SITE.address.country}`
  )}`;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const parsed = contactSchema.safeParse(values);
    if (!parsed.success) {
      const errors: Partial<Record<keyof ContactFormValues, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof ContactFormValues;
        if (!errors[key]) errors[key] = issue.message;
      }
      setFieldErrors(errors);
      setStatus("error");
      setFeedback("Please fix the highlighted fields and try again.");
      return;
    }

    setFieldErrors({});
    setStatus("sending");
    setFeedback("");

    try {
      await sendMessage({ data: parsed.data });
      setStatus("sent");
      setFeedback("Message sent. Our team will reply within one business day.");
      setValues({
        name: "",
        email: "",
        phone: "",
        subject: "Wholesale enquiry",
        message: "",
      });
    } catch (error) {
      console.error(error);
      setStatus("error");
      setFeedback("We couldn't send the email right now. Please call or WhatsApp our team directly.");
    }
  };

  const resetForm = () => {
    setStatus("idle");
    setFeedback("");
  };

  return (
    <>
      {/* ------------------------------ HERO ------------------------------ */}
      <section
        ref={heroRef}
        onMouseMove={(e) => {
          const rect = heroRef.current?.getBoundingClientRect();
          if (!rect) return;
          mx.set((e.clientX - rect.left) / rect.width);
          my.set((e.clientY - rect.top) / rect.height);
        }}
        className="relative pt-44 pb-28 md:pb-36 gradient-warm overflow-hidden"
      >
        <div className="pointer-events-none absolute inset-0">
          <motion.div style={{ x: shapeX, y: shapeY }} className="absolute -top-10 -left-16 h-80 w-80 rounded-full bg-primary/10 blur-3xl animate-float-slow" />
          <motion.div style={{ x: shapeX2, y: shapeY2 }} className="absolute bottom-0 -right-20 h-96 w-96 rounded-full bg-secondary/15 blur-3xl animate-float" />
          <motion.div style={{ x: shapeX, y: shapeY2 }} className="absolute top-1/3 right-1/4 h-32 w-32 rounded-full bg-accent/15 blur-2xl animate-float-x" />
        </div>

        {/* Signature rotating seal, desktop only */}
        <div className="hidden xl:block absolute top-40 right-20 z-10">
          <CertSeal size={126} ringClassName="text-primary/40" />
        </div>

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="container-x relative text-center max-w-3xl mx-auto">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 text-primary px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em]">
              <Sparkles size={14} /> Get in touch
            </span>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="mt-7 font-display text-5xl md:text-7xl font-black text-brand-ink leading-[1.02] text-balance">
              Let's talk <span className="text-gradient">snacks</span>.
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed">
              Wholesale, distribution or product enquiries — our team is ready to help, on whichever
              channel works best for you.
            </p>
          </Reveal>
        </motion.div>

        {/* Trust stats */}
        <div className="container-x relative mt-16">
          <Stagger className="mx-auto max-w-3xl grid grid-cols-3 gap-4 md:gap-8">
            {STATS.map((s) => (
              <StaggerItem key={s.label}>
                <TiltCard maxTilt={5}>
                  <div className="rounded-3xl bg-white/80 backdrop-blur-md border border-white shadow-soft px-5 py-7 text-center h-full">
                    <div className="mx-auto grid h-11 w-11 place-items-center rounded-2xl gradient-primary text-white shadow-soft">
                      <s.icon size={20} />
                    </div>
                    <p className="mt-4 font-display text-3xl md:text-4xl font-black text-brand-ink">{s.value}</p>
                    <p className="mt-1 text-[11px] md:text-xs uppercase tracking-[0.1em] text-muted-foreground leading-tight">{s.label}</p>
                  </div>
                </TiltCard>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ---------------------------- CONTENT ---------------------------- */}
      <section className="py-24 md:py-32">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.35fr] items-start">
          <Reveal className="space-y-6 lg:sticky lg:top-28">
            <TiltCard>
              <div className="rounded-[2rem] bg-white border border-border shadow-soft p-8 h-full">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/10 text-primary">
                    <MapPin size={20} />
                  </div>
                  <h3 className="font-display text-xl font-bold text-brand-ink">Factory Address</h3>
                </div>
                <p className="mt-5 text-muted-foreground leading-relaxed pl-1">
                  {SITE.address.line1}
                  <br />
                  {SITE.address.city}, {SITE.address.country}
                </p>
                <a
                  href={directionsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded"
                >
                  Get directions <ArrowUpRight size={14} />
                </a>
              </div>
            </TiltCard>

            <TiltCard>
              <div className="rounded-[2rem] bg-white border border-border shadow-soft p-8 h-full">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/10 text-primary">
                    <Phone size={20} />
                  </div>
                  <h3 className="font-display text-xl font-bold text-brand-ink">Phone & WhatsApp</h3>
                </div>
                <div className="mt-5 space-y-3">
                  {SITE.phones.map((p) => (
                    <div key={p.tel} className="grid grid-cols-2 gap-2">
                      <a
                        href={`tel:${p.tel}`}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-3.5 text-sm font-semibold transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                      >
                        <Phone size={14} /> {p.display}
                      </a>
                      <a
                        href={`https://wa.me/${p.wa}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-whatsapp text-white px-4 py-3.5 text-sm font-semibold transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                      >
                        <MessageCircle size={14} /> WhatsApp
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </TiltCard>

            <TiltCard>
              <div className="rounded-[2rem] bg-white border border-border shadow-soft p-8 h-full">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/10 text-primary">
                    <Clock size={20} />
                  </div>
                  <h3 className="font-display text-xl font-bold text-brand-ink">Business Hours</h3>
                </div>
                <div className="mt-5 space-y-3.5">
                  {SITE.hours.map((h) => (
                    <div key={h.day} className="flex items-center justify-between gap-3 text-sm border-b border-border/60 pb-3 last:border-0 last:pb-0">
                      <span className="text-brand-ink font-medium">{h.day}</span>
                      <span className="text-muted-foreground">{h.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TiltCard>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="relative">
              <div className="hidden md:block absolute -top-10 -right-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
              <div className="relative rounded-[2.5rem] bg-white border border-border shadow-elev p-8 md:p-12 overflow-hidden">
                <AnimatePresence mode="wait">
                  {status === "sent" ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                      className="flex flex-col items-center text-center py-14"
                    >
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.1, type: "spring", stiffness: 240, damping: 16 }}
                        className="grid h-20 w-20 place-items-center rounded-full gradient-primary text-white shadow-elev"
                      >
                        <CheckCircle2 size={36} />
                      </motion.div>
                      <h3 className="mt-7 font-display text-3xl font-bold text-brand-ink">Message sent</h3>
                      <p className="mt-2 text-muted-foreground max-w-sm">{feedback}</p>
                      <button
                        onClick={resetForm}
                        className="mt-8 inline-flex items-center gap-2 rounded-full border border-border px-6 py-3.5 text-sm font-semibold text-brand-ink hover:border-primary hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                      >
                        Send another message
                      </button>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      onSubmit={onSubmit}
                      noValidate
                    >
                      <div className="flex items-center gap-4 mb-8">
                        <div className="grid h-14 w-14 place-items-center rounded-2xl gradient-primary text-white shadow-soft">
                          <Mail size={24} />
                        </div>
                        <div>
                          <h3 className="font-display text-2xl md:text-3xl font-bold text-brand-ink">Send us a message</h3>
                          <p className="text-sm text-muted-foreground mt-0.5">We usually reply within one business day.</p>
                        </div>
                      </div>

                      <div>
                        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-ink/70">
                          What's this about? <span className="text-primary">*</span>
                        </span>
                        <div className="mt-2.5 grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {SUBJECTS.map((s) => {
                            const isActive = values.subject === s.label;
                            return (
                              <button
                                key={s.label}
                                type="button"
                                onClick={() => setValues({ ...values, subject: s.label })}
                                aria-pressed={isActive}
                                className={`flex flex-col items-center justify-center gap-1.5 rounded-2xl border px-3 py-3.5 text-center transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
                                  isActive
                                    ? "gradient-primary text-white border-transparent shadow-soft"
                                    : "border-border text-muted-foreground hover:border-primary/40 hover:text-primary"
                                }`}
                              >
                                <s.icon size={18} />
                                <span className="text-[11px] font-semibold leading-tight">{s.label.replace(" enquiry", "").replace(" request", "")}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="mt-6 grid gap-5 sm:grid-cols-2">
                        <Field label="Full name" required icon={User} error={fieldErrors.name}>
                          <input
                            value={values.name}
                            onChange={(e) => setValues({ ...values, name: e.target.value })}
                            className="input"
                            placeholder="Your name"
                            aria-invalid={Boolean(fieldErrors.name)}
                          />
                        </Field>
                        <Field label="Email" required icon={Mail} error={fieldErrors.email}>
                          <input
                            type="email"
                            value={values.email}
                            onChange={(e) => setValues({ ...values, email: e.target.value })}
                            className="input"
                            placeholder="you@company.com"
                            aria-invalid={Boolean(fieldErrors.email)}
                          />
                        </Field>
                        <Field label="Phone" icon={Phone} error={fieldErrors.phone} className="sm:col-span-2">
                          <input
                            value={values.phone}
                            onChange={(e) => setValues({ ...values, phone: e.target.value })}
                            className="input"
                            placeholder="+92 3xx xxxxxxx"
                          />
                        </Field>
                      </div>

                      <Field label="Message" required error={fieldErrors.message} className="mt-5">
                        <textarea
                          rows={6}
                          maxLength={2000}
                          value={values.message}
                          onChange={(e) => setValues({ ...values, message: e.target.value })}
                          className="input resize-none"
                          placeholder="Tell us about your requirements..."
                          aria-invalid={Boolean(fieldErrors.message)}
                        />
                      </Field>
                      <div className="mt-1.5 text-right text-xs text-muted-foreground">{values.message.length}/2000</div>

                      <motion.button
                        type="submit"
                        disabled={status === "sending"}
                        whileHover={status === "sending" ? undefined : { y: -2 }}
                        whileTap={status === "sending" ? undefined : { scale: 0.98 }}
                        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full gradient-primary text-white font-semibold px-6 py-4.5 text-base shadow-soft transition-shadow hover:shadow-[0_20px_45px_-15px_rgba(255,107,0,0.55)] disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
                      >
                        {status === "sending" ? (
                          <>
                            <motion.span
                              animate={{ rotate: 360 }}
                              transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                              className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white"
                            />
                            Sending…
                          </>
                        ) : (
                          <>
                            <Send size={17} /> Send Message
                          </>
                        )}
                      </motion.button>

                      {feedback && status === "error" && (
                        <motion.p
                          role="alert"
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-3 flex items-center justify-center gap-1.5 text-xs text-center text-primary"
                        >
                          <AlertCircle size={13} /> {feedback}
                        </motion.p>
                      )}
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function Field({
  label,
  required,
  children,
  className,
  icon: Icon,
  error,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
  icon?: typeof User;
  error?: string;
}) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-ink/70">
        {label} {required && <span className="text-primary">*</span>}
      </span>
      <div className={`mt-1.5 relative ${Icon ? "field-with-icon" : ""}`}>
        {Icon && <Icon size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />}
        {children}
      </div>
      {error && (
        <span className="mt-1.5 flex items-center gap-1 text-xs text-primary">
          <AlertCircle size={12} /> {error}
        </span>
      )}
      <style>{`
        .input{width:100%;border:1px solid ${error ? "var(--primary)" : "var(--border)"};background:white;border-radius:14px;padding:13px 16px;font-size:14px;color:var(--brand-ink);outline:none;transition:border-color .2s, box-shadow .2s}
        .input:focus{border-color:var(--primary);box-shadow:0 0 0 4px color-mix(in oklab, var(--primary) 15%, transparent)}
        .field-with-icon .input{padding-left:42px}
      `}</style>
    </label>
  );
}