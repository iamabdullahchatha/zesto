import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Zesto Foods" },
      { name: "description", content: "How Zesto Foods collects, uses and protects information submitted through our website." },
      { property: "og:url", content: "/privacy" },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <section className="pt-40 pb-24">
      <div className="container-x max-w-3xl">
        <h1 className="font-display text-4xl md:text-5xl font-black text-brand-ink">Privacy Policy</h1>
        <div className="prose prose-neutral mt-8 space-y-6 text-brand-ink/85 leading-relaxed">
          <p>This Privacy Policy explains how Zesto Foods ("we", "our", "us") handles information submitted through our website and communication channels.</p>
          <h2 className="font-display text-2xl font-bold text-brand-ink">Information we collect</h2>
          <p>When you contact us via our website form, WhatsApp or phone, we collect the information you provide — such as your name, email address, phone number and message — solely to respond to your enquiry.</p>
          <h2 className="font-display text-2xl font-bold text-brand-ink">How we use information</h2>
          <p>We use submitted information to reply to enquiries, share product information, discuss wholesale or distribution opportunities and improve our services. We do not sell your data.</p>
          <h2 className="font-display text-2xl font-bold text-brand-ink">Data retention</h2>
          <p>We retain enquiry data only for as long as needed to serve the purpose it was submitted for, or as required by law.</p>
          <h2 className="font-display text-2xl font-bold text-brand-ink">Cookies</h2>
          <p>Our website may use minimal cookies for essential site functionality. No advertising cookies are used.</p>
          <h2 className="font-display text-2xl font-bold text-brand-ink">Contact</h2>
          <p>For privacy-related requests, please contact us via the Contact page.</p>
        </div>
      </div>
    </section>
  );
}
