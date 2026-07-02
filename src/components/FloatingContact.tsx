import { motion } from "framer-motion";
import { MessageCircle, Phone } from "lucide-react";
import { SITE } from "@/lib/site";

export function FloatingContact() {
  const first = SITE.phones[0];
  return (
    <div className="fixed z-40 right-4 bottom-4 md:right-6 md:bottom-6 flex flex-col gap-3">
      <motion.a
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, type: "spring" }}
        href={`https://wa.me/${first.wa}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        className="group grid h-14 w-14 place-items-center rounded-full bg-whatsapp text-white shadow-elev hover:scale-110 transition"
      >
        <MessageCircle size={22} />
        <span className="absolute inset-0 rounded-full animate-ping bg-whatsapp/40" aria-hidden />
      </motion.a>
      <motion.a
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.9, type: "spring" }}
        href={`tel:${first.tel}`}
        aria-label="Call"
        className="grid h-14 w-14 place-items-center rounded-full gradient-primary text-white shadow-elev hover:scale-110 transition"
      >
        <Phone size={22} />
      </motion.a>
    </div>
  );
}
