// src/components/sections/accommodation_facility_cinematic/Nav.tsx
"use client";

import { SectionContentMap } from "@/types/sections/index";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface NavProps {
  content: SectionContentMap["navigation"];
}

export function Nav({ content: { siteName, logo, linkLogo = "#top", links, cta } }: NavProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Scroll detection for header style
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // Dynamic colors based on scroll state
  const textColor = isScrolled ? "text-foreground" : "text-primary-foreground";
  const bgColor = isScrolled
    ? "bg-background/95 backdrop-blur-md shadow-sm"
    : "bg-transparent";

  // Logo rendering
  const logoContent = logo ? (
    <Image src={logo} alt={siteName} width={32} height={32} className="h-8 w-auto" />
  ) : (
    <span className="text-gradient-gold font-serif text-2xl leading-none">
      {siteName.charAt(0)}
    </span>
  );

  // Handle anchor link clicks with smooth scroll
  const handleAnchorLink = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, "", href);
      }
    }
  };

  return (
    <>
      {/* Desktop + Mobile Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${bgColor} ${isScrolled ? "py-4" : "py-7"
          }`}
      >
        <div className="mx-auto max-w-[1600px] px-6 md:px-10 flex items-center justify-between">
          {/* Logo */}
          <Link
            href={linkLogo}
            className={`group flex items-center gap-3 ${textColor}`}
            onClick={(e) => {
              if (linkLogo.startsWith("#")) {
                handleAnchorLink(e, linkLogo);
              }
            }}
          >
            {logoContent}
            <span className="tracking-luxury text-[10px] uppercase opacity-80">
              {siteName}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-10 tracking-editorial text-[11px] uppercase opacity-90">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`story-link hover:text-accent transition-colors ${textColor}`}
                onClick={(e) => handleAnchorLink(e, link.href)}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          {cta && (
            <Link
              href={cta.href}
              onClick={(e) => handleAnchorLink(e, cta.href)}
              className={`hidden lg:inline-flex group relative items-center gap-2 px-5 py-2.5 tracking-editorial text-[10px] uppercase transition-all duration-500 ${cta.variant === "primary"
                ? "bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground"
                : "border border-accent/60 text-foreground hover:bg-accent hover:text-accent-foreground"
                } ${textColor}`}
            >
              <span>{cta.text}</span>
              <span aria-hidden className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          )}

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
      <div
        className={`fixed inset-0 z-[100] bg-background transition-transform duration-500 lg:hidden ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="container mx-auto px-6 py-6 flex flex-col h-full">
          {/* Mobile Header */}
          <div className="flex items-center justify-between">
            <Link
              href={linkLogo}
              className="font-serif text-2xl font-medium text-foreground"
              onClick={() => {
                setIsMobileMenuOpen(false);
                if (linkLogo.startsWith("#")) {
                  const element = document.querySelector(linkLogo);
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                  }
                }
              }}
            >
              {siteName}
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 text-foreground cursor-pointer"
              aria-label="Close menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Mobile Navigation Links */}
          <nav className="flex-1 flex flex-col justify-center gap-6">
            {links.map((link, index) => (
              <Link
                key={`mobile-${link.label}`}
                href={link.href}
                onClick={(e) => {
                  setIsMobileMenuOpen(false);
                  handleAnchorLink(e, link.href);
                }}
                className="font-serif text-4xl text-foreground hover:text-accent transition-colors"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile CTA Footer */}
          {cta && (
            <div className="py-8 border-t border-border">
              <Link
                href={cta.href}
                onClick={(e) => {
                  setIsMobileMenuOpen(false);
                  handleAnchorLink(e, cta.href);
                }}
                className="inline-flex w-full justify-center bg-primary text-primary-foreground px-8 py-4 text-sm uppercase tracking-wider rounded-md hover:bg-primary/90 transition-colors"
              >
                {cta.text}
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}