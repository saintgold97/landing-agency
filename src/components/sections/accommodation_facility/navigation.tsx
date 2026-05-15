// src/components/sections/navigation.tsx
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { SectionContentMap } from "@/types/sections/index"

interface NavigationProps {
  content: SectionContentMap['navigation']
}

export function Navigation({ content }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const { siteName, logo, links, cta, linkLogo } = content

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [isMobileMenuOpen])

  // Colori dinamici dal theme
  const textColor = isScrolled
    ? ("text-foreground")
    : ("text-primary-foreground")

  const bgColor = isScrolled
    ? "bg-background/95 backdrop-blur-md shadow-sm"
    : "bg-transparent"

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${bgColor} ${isScrolled ? "py-4" : "py-6"}`}>
        <div className="container mx-auto px-6 flex items-center justify-between">

          {/* Logo */}
          <Link href={linkLogo ?? "/"} className={`font-serif text-2xl md:text-3xl font-medium transition-colors duration-300 ${textColor}`}>
            {logo ? (
              <Image src={logo} alt={siteName || "logo"} width={16} height={16} loading="eager" className="h-8 w-auto" />
            ) : (
              siteName
            )}
          </Link>

          {/* Desktop Navigation + CTA */}
          <div className="hidden lg:flex items-center gap-8">
            <nav className="flex items-center gap-6">
              {links.map((link, index) => (
                <Link
                  key={`nav-link-${index}`}
                  href={link.href}
                  className={`text-xs uppercase tracking-wider transition-colors duration-300 hover:opacity-70 ${textColor}`}
                  onClick={(e) => {
                    if (link.href.startsWith("#")) {
                      e.preventDefault()

                      const element = document.querySelector(link.href)

                      if (element) {
                        element.scrollIntoView({
                          behavior: "smooth",
                        })

                        window.history.pushState(
                          null,
                          "",
                          link.href
                        )
                      }
                    }
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* CTA Button (se presente) */}
            {cta && (
              <Link
                href={cta.href}
                className={`inline-flex text-xs uppercase tracking-wider px-5 py-2.5 transition-all duration-300 rounded-md ${isScrolled
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                  }`}
              >
                {cta.text}
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className={`lg:hidden p-2 transition-colors cursor-pointer ${textColor}`}
            aria-label="Open menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-[100] bg-background transition-transform duration-500 lg:hidden ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="container mx-auto px-6 py-6 flex flex-col h-full">

          {/* Header */}
          <div className="flex items-center justify-between">
            <Link href="/" className="font-serif text-2xl font-medium text-foreground" onClick={() => setIsMobileMenuOpen(false)}>
              {siteName}
            </Link>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-foreground cursor-pointer" aria-label="Close menu">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 flex flex-col justify-center gap-6">
            {links.map((link, index) => (
              <Link
                key={`mobile-nav-link-${index}`}
                href={link.href}
                onClick={(e) => {
                  setIsMobileMenuOpen(false)

                  if (link.href.startsWith("#")) {
                    e.preventDefault()

                    const element = document.querySelector(link.href)

                    if (element) {
                      element.scrollIntoView({
                        behavior: "smooth",
                      })

                      window.history.pushState(
                        null,
                        "",
                        link.href
                      )
                    }
                  }
                }}
                className="font-serif text-4xl text-foreground hover:text-accent transition-colors"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA Footer */}
          {cta && (
            <div className="py-8 border-t border-border">
              <Link
                href={cta.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="inline-flex w-full justify-center bg-primary text-primary-foreground px-8 py-4 text-sm uppercase tracking-wider rounded-md"
              >
                {cta.text}
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
}