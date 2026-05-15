"use client";

import { toRoman } from "@/lib/utils/toRoman";
import { SectionContentMap } from "@/types/sections/index";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface RoomsProps { content: SectionContentMap["rooms"] };

export function Rooms({ content: { title, subtitle, showPrices, showAmenities, layout = "list", items } }: RoomsProps) {
  return (
    <section id="rooms" className="relative bg-ink text-bone py-32 md:py-48 overflow-hidden">
      <div className="mx-auto max-w-[1500px] px-6 md:px-12">
        <div className="flex items-end justify-between mb-20">
          <div>
            <p className="tracking-luxury text-[11px] uppercase text-champagne mb-6">- {subtitle}</p>
            <h2 className="font-serif text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.95] max-w-3xl">{title}</h2>
          </div>
          {/* <Link href="#book" className="hidden md:inline tracking-editorial text-[10px] uppercase text-champagne story-link">
            Guarda le nostre suite →
          </Link> */}
        </div>

        <div className={layout === "grid" ? "grid md:grid-cols-2 gap-8" : "space-y-32 md:space-y-44"}>
          {items.map((r, i) => (
            <motion.article
              key={r.id}
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 1.1, ease: [0.7, 0, 0.2, 1] }}
              className={`grid grid-cols-12 gap-6 md:gap-12 items-center ${layout === "list" ? (i % 2 ? "md:[&>*:first-child]:order-2" : "") : ""}`}
            >
              <div className={`col-span-12 group relative overflow-hidden ${layout === "grid" ? "md:col-span-12" : "md:col-span-7"}`}>
                <div className={`relative overflow-hidden ${layout === "grid" ? "aspect-video" : "aspect-[5/5] md:aspect-[6/6]"}`}>
                  <Image src={r.image.src} alt={r.image.alt} loading="eager" width={r.image.width! ?? 1080} height={r.image.height! ?? 1600} className="absolute inset-0 h-full w-full object-cover transition-transform duration-[2200ms] ease-out group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
                  <div className="absolute top-6 left-6 font-serif text-7xl italic text-primary">{toRoman(i + 1)}</div>
                </div>
              </div>

              <div className={`col-span-12 ${layout === "grid" ? "md:col-span-12 text-center md:text-left" : "md:col-span-5 md:px-6"}`}>
                <p className="tracking-luxury text-[11px] uppercase text-champagne mb-5">Suite No. {i +1}</p>
                <h3 className="font-serif text-5xl md:text-6xl mb-6">{r.name}</h3>
                <p className="text-bone/75 leading-relaxed text-[15px] mb-8 max-w-md">{r.description}</p>

                {showAmenities && (
                  <ul className={`grid gap-x-6 gap-y-3 mb-10 max-w-md ${layout === "grid" ? "grid-cols-2 justify-center md:justify-start" : "grid-cols-2"}`}>
                    {r.amenities.map((a) => (
                      <li key={a} className="flex items-center gap-3 text-[13px] text-bone/70">
                        <span className="h-px w-4 bg-champagne" />
                        {a}
                      </li>
                    ))}
                  </ul>
                )}

                {showPrices && (
                  <div className="flex items-center justify-between border-t border-bone/15 pt-6 max-w-md">
                    <span className="tracking-editorial text-[11px] uppercase text-champagne">{r.price}</span>
                    <Link href="#cta" className="group inline-flex items-center gap-2 tracking-editorial text-[10px] uppercase">
                      Reserve <span className="transition-transform group-hover:translate-x-1">→</span>
                    </Link>
                  </div>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}