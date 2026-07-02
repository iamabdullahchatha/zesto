import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — Zesto Foods" },
      { name: "description", content: "Terms and conditions governing the use of the Zesto Foods website and communications." },
      { property: "og:url", content: "/terms" },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <section className="pt-40 pb-24">
      <div className="container-x max-w-3xl">
        <h1 className="font-display text-4xl md:text-5xl font-black text-brand-ink">Terms &amp; Conditions</h1>
        <div className="mt-8 space-y-6 text-brand-ink/85 leading-relaxed">
          <p>By accessing the Zesto Foods website you agree to these Terms &amp; Conditions.</p>
          <h2 className="font-display text-2xl font-bold text-brand-ink">Use of the site</h2>
          <p>Content on this website is provided for informational purposes about Zesto Foods products and services. It may not be reproduced or redistributed without written permission.</p>
          <h2 className="font-display text-2xl font-bold text-brand-ink">Product information</h2>
          <p>Product images, packaging and specifications shown on the website are representative. Actual products, packaging sizes and availability may vary; final specifications are confirmed at the point of order.</p>
          <h2 className="font-display text-2xl font-bold text-brand-ink">Enquiries &amp; quotations</h2>
          <p>Any pricing, lead time or availability discussed through our contact channels is indicative and subject to formal confirmation.</p>
          <h2 className="font-display text-2xl font-bold text-brand-ink">Intellectual property</h2>
          <p>The Zesto Foods name, logo and site content are the property of Zesto Foods and protected by applicable laws.</p>
          <h2 className="font-display text-2xl font-bold text-brand-ink">Contact</h2>
          <p>Questions about these terms can be sent via the Contact page.</p>
        </div>
      </div>
    </section>
  );
}
