"use client"


import { ImageInterface } from "@/types/sections/shared"
import { TickerRow } from "./ImageRow"

interface TickerRowConfig {
    speed?: number
    direction?: "left" | "right"
    items?: ImageInterface[]
}

interface ImageTickerProps {
    items: ImageInterface[]
    rows?: TickerRowConfig[]
    onClick?: (index: number) => void
    className?: string
}

export function ImageTicker({
    items,
    rows,
    onClick,
    className,
}: ImageTickerProps) {
    const defaultRows: TickerRowConfig[] = [
        {
            direction: "left",
            speed: 28,
        },
        {
            direction: "right",
            speed: 35,
        },
        {
            direction: "left",
            speed: 22,
        },
    ]

    const tickerRows = rows || defaultRows

    return (
        <div
            className={`relative flex flex-col gap-6 overflow-hidden ${className || ""}`}
        >
            {/* Fade Top */}
            <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-24 bg-gradient-to-b from-black to-transparent" />

            {/* Fade Bottom */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-24 bg-gradient-to-t from-black to-transparent" />

            {tickerRows.map((row, rowIndex) => (
                <TickerRow
                    key={rowIndex}
                    items={row.items || items}
                    direction={row.direction}
                    speed={row.speed}
                    rowIndex={rowIndex}
                    onClick={onClick}
                />
            ))}
        </div>
    )
}