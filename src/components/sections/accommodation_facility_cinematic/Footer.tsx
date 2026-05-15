"use client"

import type { SectionContentMap } from "@/types/sections/index"
import { BaseSectionProps } from "."

interface FooterProps extends BaseSectionProps {
  content: SectionContentMap["footer"]
}

export function Footer({
  content: { siteName, contact, description, socialLinks, legalLinks, copyright }
}: FooterProps) {
  return (
    <footer id="contact" className="relative bg-ink text-bone pt-20 pb-8 px-6 md:px-12">

      {/* Decorative top gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-bone/20 to-transparent" />

      <div className="mx-auto max-w-[1500px]">

        {/* ==================================================================
            MAIN GRID: Brand + Contacts + Social
            ================================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 pb-16 border-b border-bone/10">

          {/* 🏷️ Brand & Description */}
          <div className="md:col-span-1">
            <p className="text-champagne text-lg md:text-xl uppercase tracking-[0.2em] font-medium opacity-90">
              {siteName}
            </p>
            <p className="mt-5 text-bone/70 text-[14px] md:text-[15px] leading-relaxed max-w-full text-pretty break-words hyphens-auto">
              {description}
            </p>
          </div>

          {/* 📞 Contacts */}
          <div className="md:col-span-1">
            <h3 className="tracking-editorial text-[10px] uppercase text-champagne/90 mb-5 font-medium">
              Contatti
            </h3>
            <address className="not-italic space-y-3 text-[14px] text-bone/70">
              {contact?.email && (
                <p>
                  <a
                    href={`mailto:${contact.email}`}
                    className="inline-flex hover:text-champagne transition-colors duration-200 focus:outline-none focus-visible:text-champagne focus-visible:underline underline-offset-4"
                  >
                    {contact.email}
                  </a>
                </p>
              )}

              {contact?.phone && (
                <p>
                  <a
                    href={`tel:${contact.phone.replace(/\s/g, "")}`}
                    className="inline-flex hover:text-champagne transition-colors duration-200 focus:outline-none focus-visible:text-champagne focus-visible:underline underline-offset-4"
                  >
                    {contact.phone}
                  </a>
                </p>
              )}

              {contact?.address && (
                <p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex hover:text-champagne transition-colors duration-200 focus:outline-none focus-visible:text-champagne focus-visible:underline underline-offset-4 break-words"
                  >
                    {contact.address}
                  </a>
                </p>
              )}
            </address>
          </div>

          {/* 🔗 Social Links */}
          <div className="md:col-span-1">
            <h3 className="tracking-editorial text-[10px] uppercase text-champagne/90 mb-5 font-medium">
              Follow
            </h3>
            <ul className="space-y-2.5 text-[14px] text-bone/70">
              {socialLinks?.map((link) => (
                <li key={link.platform}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex hover:text-champagne transition-colors duration-200 focus:outline-none focus-visible:text-champagne focus-visible:underline underline-offset-4"
                    aria-label={`Seguici su ${link.platform}`}
                  >
                    {link.platform}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ==================================================================
            BOTTOM BAR: Copyright + Legal Links
            ================================================================== */}
        <div className="pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 tracking-editorial text-[10px] uppercase text-bone/40">

          {/* Copyright */}
          <p className="text-center md:text-left">{copyright}</p>

          {/* Legal Links */}
          <nav aria-label="Legal links">
            <ul className="flex flex-wrap items-center justify-center md:justify-end gap-6 md:gap-8">
              {legalLinks?.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="hover:text-champagne transition-colors duration-200 focus:outline-none focus-visible:text-champagne focus-visible:underline underline-offset-4"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Decorative bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-ink to-transparent pointer-events-none" />
    </footer>
  )
}