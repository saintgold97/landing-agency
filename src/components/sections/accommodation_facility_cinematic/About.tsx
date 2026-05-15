"use client";

import { SectionContentMap } from "@/types/sections/index";
import { motion } from "framer-motion";
import Image from "next/image";

interface AboutProps { content: SectionContentMap["about"] }

export function About({ content: { title, subtitle, description, features } }: AboutProps) {
  return (
    <section id="about" className="relative bg-bone text-ink py-32 md:py-48 overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8 }}
          className="tracking-luxury text-[11px] uppercase text-gold mb-8"
        >
          — {title}
        </motion.p>

        <div className="grid grid-cols-12 gap-6 md:gap-12">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1, ease: [0.7, 0, 0.2, 1] }}
            className="col-span-12 md:col-span-8 font-serif text-[clamp(2.5rem,6.5vw,6.5rem)] leading-[0.95] text-balance"
          >
            {subtitle}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="col-span-12 md:col-span-4 text-pretty text-[15px] leading-relaxed text-muted-foreground"
          >
            {description}
          </motion.p>
        </div>

        {features && (
          <div className="mt-24 grid grid-cols-12 gap-6 md:gap-10">
            <motion.figure
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1.1, ease: [0.7, 0, 0.2, 1] }}
              className="col-span-12 md:col-span-7 md:translate-y-12"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                <Image
                  src={features[0]?.image?.src ?? ""}
                  alt={features[0]?.image?.alt ?? "feature"}
                  loading="lazy"
                  width={1200}
                  height={1500}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[2000ms] hover:scale-105"
                />
              </div>
              <figcaption className="mt-4 tracking-editorial text-[10px] uppercase text-muted-foreground">
                No. 01 — {features[0]?.title}
              </figcaption>
            </motion.figure>

            <motion.figure
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1.1, delay: 0.15, ease: [0.7, 0, 0.2, 1] }}
              className="col-span-12 md:col-span-5"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                <Image
                  src={features[1]?.image?.src ?? ""}
                  alt={features[1]?.image?.alt ?? "feature"}
                  loading="lazy"
                  width={1200}
                  height={1500}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[2000ms] hover:scale-105"
                />
              </div>
              <figcaption className="mt-4 tracking-editorial text-[10px] uppercase text-muted-foreground">
                No. 02 — {features[1]?.title}
              </figcaption>

              {/* <div className="mt-12 hairline text-ink" />
              <div className="mt-8 grid grid-cols-3 gap-6">
                {[
                  ["12", "Suites"],
                  ["1923", "Est."],
                  ["98%", "Returners"],
                ].map(([n, l]) => (
                  <div key={l}>
                    <div className="font-serif text-4xl text-gradient-gold">{n}</div>
                    <div className="mt-1 tracking-editorial text-[10px] uppercase text-muted-foreground">{l}</div>
                  </div>
                ))}
              </div> */}
            </motion.figure>
          </div>
        )}
      </div>
    </section>
  );
}