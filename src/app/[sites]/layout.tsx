// src/app/[sites]/layout.tsx

import { Geist, Geist_Mono } from "next/font/google"
import "@/app/globals.css"

import { getSiteData } from "@/lib/data/loader"
import { SmoothScroll } from "@/components/ui/SmoothScroll"
import hexToRgb from "@/lib/utils/hexToRgb"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ sites: string }>;
}) {
  const { sites } = await params;
  const config = getSiteData(sites);

  const colors = config?.theme?.colors
  const fonts = config?.theme?.fonts

  const cssVariables: React.CSSProperties & {
    [key: `--${string}`]: string | undefined
  } = {
    "--color-primary": colors?.primary,
    "--color-primary-foreground":
      colors?.primaryForeground ?? "#FFFFFF",

    "--color-accent":
      colors?.accent ?? colors?.primary,

    "--color-accent-foreground":
      colors?.accentForeground ?? "#FFFFFF",

    "--color-background":
      colors?.background,

    "--color-foreground":
      colors?.foreground,

    "--color-muted":
      colors?.muted ?? "#F5F5F5",

    "--color-muted-foreground":
      colors?.mutedForeground ?? "#6B7280",

    "--color-border":
      colors?.border ?? "#E5E7EB",

    "--color-background-rgb": hexToRgb(colors?.background ?? "#ede3d6"),
    "--color-foreground-rgb": hexToRgb(colors?.foreground ?? "#1a1a1a"),
    "--color-border-rgb": hexToRgb(colors?.border ?? "#e5e7eb"),
    "--color-accent-rgb": hexToRgb(colors?.accent ?? colors?.primary ?? "#c4a77d"),

    "--font-heading":
      fonts?.heading,

    "--font-body":
      fonts?.body,

    "--font-mono":
      fonts?.mono ?? "monospace",
  }

  const fontClass = fonts?.heading
    ? fonts.heading
    : geistSans.className

  return (
    <main
      className={`bg-background text-foreground font-body ${fontClass} ${geistMono.variable}`}
      style={cssVariables}
    >
      <SmoothScroll />
      {children}
    </main>
  )
}