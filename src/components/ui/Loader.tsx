"use client";

import { MergedSiteData } from "@/lib/data/loader";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

type LoaderProps = Pick<MergedSiteData, "business">;

export function Loader({ business }: LoaderProps) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setVisible(false);
        }, 1800);

        return () => clearTimeout(timeout);
    }, []);

    const titleParts = business?.name?.split(" ") ?? [];
    const highlighted = titleParts.slice(-1).join(" ");
    const normal = titleParts.slice(0, -1).join(" ");


    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{
                        opacity: 0,
                        transition: {
                            duration: 1,
                            ease: [0.22, 1, 0.36, 1],
                        },
                    }}
                    className="fixed inset-0 z-[999] overflow-hidden bg-ink grain"
                >
                    {/* glow */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 0.6, scale: 1.2 }}
                        transition={{ duration: 2 }}
                        className="absolute left-1/2 top-1/2 h-[40vw] w-[40vw] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
                        style={{
                            background:
                                "radial-gradient(circle, oklch(0.78 0.12 75 / 0.35), transparent 70%)",
                        }}
                    />

                    <div className="relative flex h-full flex-col items-center justify-center px-6 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 1.2,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                        >
                            <p className="mb-6 tracking-[0.35em] text-[10px] uppercase text-champagne/70">
                                {business?.tagline}
                            </p>

                            <h1 className="font-serif text-[clamp(3rem,8vw,7rem)] leading-none text-bone">
                                {normal}
                                <span className="ml-4 italic font-extralight text-gradient-gold">
                                    {highlighted}
                                </span>
                            </h1>
                        </motion.div>

                        <motion.div
                            initial={{ scaleX: 0, opacity: 0 }}
                            animate={{ scaleX: 1, opacity: 1 }}
                            transition={{
                                duration: 1.4,
                                delay: 0.4,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                            className="mt-10 h-px w-32 origin-left bg-gradient-to-r from-champagne via-champagne/40 to-transparent"
                        />

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{
                                delay: 0.8,
                                duration: 1,
                            }}
                            className="mt-6 max-w-sm tracking-editorial text-[10px] uppercase text-bone/50"
                        >
                            {business?.description}
                        </motion.p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}