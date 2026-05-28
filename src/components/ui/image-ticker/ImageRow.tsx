"use client"

import Image from "next/image"
import { motion } from "framer-motion"

import { ImageInterface } from "@/types/sections/shared"

interface TickerRowProps {
  items: ImageInterface[]
  speed?: number
  direction?: "left" | "right"
  rowIndex?: number
  onClick?: (index: number) => void
}

export function TickerRow({
  items,
  speed = 30,
  direction = "left",
  rowIndex = 0,
  onClick,
}: TickerRowProps) {
  const duplicated = [...items, ...items]

  return (
    <div className="relative overflow-hidden">
      <motion.div
        id={`ticker-row-${rowIndex}`}
        className="flex w-max gap-5"
        animate={{
          x:
            direction === "left"
              ? ["0%", "-50%"]
              : ["-50%", "0%"],
        }}
        transition={{
          ease: "linear",
          duration: speed,
          repeat: Infinity,
        }}
      >
        {duplicated.map((item, index) => {
          const originalIndex = index % items.length

          return (
            <button
              key={`${item.src}-${index}`}
              onClick={() => onClick?.(originalIndex)}
              className="
                group
                relative
                h-[220px]
                w-[320px]
                shrink-0
                overflow-hidden
                rounded-[28px]
                cursor-pointer
              "
            >
              <Image
                src={item.src}
                alt={item.alt || ""}
                fill
                className="
                  object-cover
                  transition-transform
                  duration-[1800ms]
                  ease-out
                  group-hover:scale-105
                "
              />

              {/* Overlay */}
              <div
                className="
                  absolute inset-0
                  bg-black/10
                  transition-opacity
                  duration-500
                  group-hover:bg-black/30
                "
              />

              {/* Caption */}
              {item.alt && (
                <div
                  className="
                    absolute bottom-4 left-4
                    translate-y-4
                    opacity-0
                    transition-all
                    duration-500
                    group-hover:translate-y-0
                    group-hover:opacity-100
                  "
                >
                  <p className="text-xs uppercase tracking-[0.3em] text-white/90">
                    {item.alt}
                  </p>
                </div>
              )}
            </button>
          )
        })}
      </motion.div>
    </div>
  )
}