import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

// ============================================================================
// 🧱 Sub-component: ServiceCard (isolato e riutilizzabile)
// ============================================================================

interface ServiceCardProps {
    name: string;
    duration: string;
    price?: string;
    icon: LucideIcon;
    index: number;
}

export function ServiceCard({ name, duration, price, icon: Icon, index }: ServiceCardProps) {
    return (
        <motion.article
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: (index % 4) * 0.08 }}
            className="group relative p-8 md:p-10 border border-border
                transition-colors duration-700 hover:bg-card"
        >
            {/* Icona con hover effect */}
            <div className="text-gold mb-8 transition-transform duration-700 group-hover:-translate-y-1">
                <Icon className="h-7 w-7" strokeWidth={1} aria-hidden="true" />
            </div>

            {/* Titolo servizio */}
            <h3 className="font-serif text-2xl mb-3">{name}</h3>

            {/* Meta: durata + prezzo opzionale */}
            <dl className="flex items-baseline gap-2 text-[14px] text-muted-foreground">
                <dt className="sr-only">Durata</dt>
                <dd>{duration}</dd>

                {price && (
                    <>
                        <span aria-hidden>·</span>
                        <dt className="sr-only">Price</dt>
                        <dd className="font-medium text-ink">{price}</dd>
                    </>
                )}
            </dl>

            {/* Hover underline effect */}
            <span
                className="absolute inset-x-0 bottom-0 h-px gradient-gold opacity-0 
                    group-hover:opacity-100 transition-opacity duration-700"
                aria-hidden
            />
        </motion.article>
    );
}