// Dynamically loads every image in src/assets regardless of its extension,
// so we never have to guess .webp vs .png vs .jpg again.
const assetModules = import.meta.glob<string>("/src/assets/*.{webp,png,jpg,jpeg,svg}", {
  eager: true,
  import: "default",
});

function findAsset(partialName: string): string {
  const key = Object.keys(assetModules).find((k) =>
    k.toLowerCase().includes(partialName.toLowerCase())
  );
  if (!key) {
    console.warn(`[site.ts] No asset found matching "${partialName}" in src/assets/`);
    return "";
  }
  return assetModules[key];
}

const logoImg = findAsset("logo");
const nimkoImg = findAsset("nimko-bowl");
const potatoChipsImg = findAsset("snacks-bowl");
const cornSnacksImg = findAsset("variety");
const masalaSnacksImg = findAsset("masala");
const saltedSnacksImg = findAsset("snack");

export const SITE = {
  name: "Zesto Foods",
  tagline: "Premium Halal Snacks Crafted with Quality & Care",
  description:
    "Zesto Foods manufactures premium halal snacks - chips, nimko, corn snacks and more - with hygienic processes and trusted quality for wholesalers and distributors across Pakistan.",
  address: {
    line1: "Civil Lines, Gill Road",
    city: "Gujranwala",
    country: "Pakistan",
  },
  phones: [
    { display: "0321-5924784", tel: "+923215924784", wa: "923215924784" },
    { display: "0300-8720331", tel: "+923008720331", wa: "923008720331" },
  ],
  hours: [
    { day: "Monday - Saturday", time: "9:00 AM - 7:00 PM" },
    { day: "Sunday", time: "Closed" },
  ],
} as const;

export const IMG = {
  hero: [
    "https://images.unsplash.com/photo-1613919113640-25732ec5e61f?auto=format&fit=crop&w=2000&q=80",
    "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?auto=format&fit=crop&w=2000&q=80",
    "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&w=2000&q=80",
    "https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&w=2000&q=80",
    "https://images.unsplash.com/photo-1626196340104-90dd44de4a34?auto=format&fit=crop&w=2000&q=80",
  ],
  about: [
    "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1565895405138-6c3a1555da6a?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1556910633-5099dc3971e8?auto=format&fit=crop&w=1600&q=80",
  ],
  process: [
    "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1516546453174-5e1098a4b4af?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1579113800032-c38bd7635818?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1400&q=80",
  ],
  quality: [
    "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1615486363973-f79d875780cf?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1581091012184-7a1f5a4f6c1b?auto=format&fit=crop&w=1600&q=80",
  ],
  wholesale: "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=2000&q=80",
  packaging: "https://images.unsplash.com/photo-1626196340104-90dd44de4a34?auto=format&fit=crop&w=2000&q=80",
  hygiene: "https://images.unsplash.com/photo-1615486363973-f79d875780cf?auto=format&fit=crop&w=2000&q=80",
  gallery: [
    "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1565895405138-6c3a1555da6a?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1516546453174-5e1098a4b4af?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1579113800032-c38bd7635818?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1400&q=80",
  ],
  contact: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=2000&q=80",
} as const;

export const ASSETS = {
  // Real Vite-resolved imports pointing at the actual files in src/assets.
  logo: logoImg,
  products: {
    nimko: nimkoImg,
    potatoChips: potatoChipsImg,
    cornSnacks: cornSnacksImg,
    masalaSnacks: masalaSnacksImg,
    saltedSnacks: saltedSnacksImg,
  },
} as const;

export const PRODUCTS = [
  {
    slug: "nimko",
    name: "Nimko",
    tag: "Traditional Mix",
    desc: "Crunchy sev, roasted chana, peanuts and curry leaves in a rich, savoury blend - our signature nimko.",
    image: ASSETS.products.nimko,
    packs: ["10g Sachet", "40g Pouch", "200g Family Pack"],
  },
  {
    slug: "potato-chips",
    name: "Potato Chips",
    tag: "Crisp & Golden",
    desc: "Kettle-cooked from hand-picked potatoes, seasoned to a perfectly balanced crunch.",
    image: ASSETS.products.potatoChips,
    packs: ["15g Sachet", "50g Pouch", "150g Sharing Pack"],
  },
  {
    slug: "corn-snacks",
    name: "Corn Snacks",
    tag: "Puffed & Airy",
    desc: "Light, puffed corn crisps with bold seasoning - a modern favourite for every age group.",
    image: ASSETS.products.cornSnacks,
    packs: ["12g Sachet", "35g Pouch"],
  },
  {
    slug: "masala-snacks",
    name: "Masala Snacks",
    tag: "Spice & Zing",
    desc: "A signature masala blend of chilli, cumin and citrus - for those who love an unmistakable kick.",
    image: ASSETS.products.masalaSnacks,
    packs: ["12g Sachet", "45g Pouch"],
  },
  {
    slug: "salted-snacks",
    name: "Salted Snacks",
    tag: "Classic Crunch",
    desc: "A timeless, lightly salted crunch - the everyday snack that never goes out of style.",
    image: ASSETS.products.saltedSnacks,
    packs: ["15g Sachet", "50g Pouch"],
  },
] as const;

export const FAQS = [
  {
    q: "Are all Zesto Foods products halal?",
    a: "Yes. Every Zesto Foods product is 100% halal, produced in a facility dedicated to halal manufacturing from ingredient sourcing to final packaging.",
  },
  {
    q: "Do you supply to wholesalers and distributors?",
    a: "Absolutely. Wholesale and distribution partnerships are at the core of our business. Reach out through the contact form or WhatsApp to discuss pricing, MOQs and territory.",
  },
  {
    q: "What pack sizes are available?",
    a: "Most products are available in sachet, pouch and family/sharing packs. Custom pack sizes are available for larger distribution orders.",
  },
  {
    q: "Where is your manufacturing facility located?",
    a: "Our facility is in Civil Lines, Gill Road, Gujranwala, Pakistan. Site visits can be arranged for serious distribution partners on request.",
  },
  {
    q: "How do you maintain product hygiene?",
    a: "We follow strict hygiene protocols across every stage - controlled ingredient intake, sanitised production zones, gloved handling and sealed packaging on modern equipment.",
  },
  {
    q: "Can I request a distributor sample?",
    a: "Yes. Genuine distributor and wholesale enquiries are welcome to request assorted product samples through our contact page.",
  },
] as const;