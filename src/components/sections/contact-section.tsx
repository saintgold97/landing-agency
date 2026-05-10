"use client"

import { SectionContentMap } from "@/types/sections"
import { useState, useRef, useEffect } from "react"
import { BaseSectionProps } from "."

interface ContactSectionProps extends BaseSectionProps {
  content: SectionContentMap['contact']
}

export function ContactSection({ content }: ContactSectionProps) {
  const { contactInfo } = content

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    checkIn: "",
    checkOut: "",
    guests: "2",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [activeField, setActiveField] = useState<string | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setIsSubmitted(true)

    // Reset form after delay
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({
        name: "",
        email: "",
        phone: "",
        checkIn: "",
        checkOut: "",
        guests: "2",
        message: "",
      })
    }, 3000)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "instagram":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        )
      case "facebook":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        )
      case "pinterest":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="py-24 md:py-32 lg:py-40 bg-beige relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div
          className={`text-center max-w-3xl mx-auto mb-16 md:mb-20 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
        >
          <p className="text-accent text-sm uppercase tracking-[0.3em] mb-4">
            Contattaci
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground font-medium text-balance mb-6">
            Siamo Qui per Te
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Per richieste di prenotazione, informazioni speciali o semplicemente per salutarci,
            il nostro team è a tua disposizione.
          </p>
        </div>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* 📱 Container principale - FIX MOBILE OVERFLOW */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 w-full px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">

          {/* Contact Info */}
          <div
            className={`transition-all duration-1000 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
          >
            <div className="space-y-6 sm:space-y-8">

              {/* Contact Cards */}
              <div className="bg-background p-6 sm:p-8 space-y-6">

                {/* Phone */}
                <div className="flex items-start gap-4 sm:gap-5 min-w-0"> {/* ← min-w-0 previene overflow */}
                  <div className="w-11 h-11 sm:w-12 sm:h-12 bg-primary/10 flex items-center justify-center flex-shrink-0 rounded-sm">
                    <svg className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1"> {/* ← flex-1 + min-w-0 per word-wrap */}
                    <h3 className="text-xs sm:text-sm uppercase tracking-wider text-muted-foreground mb-1">
                      Telefono
                    </h3>
                    <a
                      href={`tel:${contactInfo!.phone}`}
                      className="text-lg sm:text-xl font-serif text-foreground hover:text-accent transition-colors break-words overflow-wrap-break-word"
                    >
                      {contactInfo!.phone}
                    </a>
                    <p className="text-sm text-muted-foreground mt-1">
                      Disponibili tutti i giorni, 9:00 - 20:00
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4 sm:gap-5 min-w-0">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 bg-primary/10 flex items-center justify-center flex-shrink-0 rounded-sm">
                    <svg className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs sm:text-sm uppercase tracking-wider text-muted-foreground mb-1">
                      Email
                    </h3>
                    <a
                      href={`mailto:${contactInfo!.email}`}
                      className="text-lg sm:text-xl font-serif text-foreground hover:text-accent transition-colors break-words overflow-wrap-break-word hyphens-auto"
                    >
                      {contactInfo!.email}
                    </a>
                    <p className="text-sm text-muted-foreground mt-1">
                      Rispondiamo entro 24 ore
                    </p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-4 sm:gap-5 min-w-0">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 bg-primary/10 flex items-center justify-center flex-shrink-0 rounded-sm">
                    <svg className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs sm:text-sm uppercase tracking-wider text-muted-foreground mb-1">
                      Indirizzo
                    </h3>
                    <p className="text-lg sm:text-xl font-serif text-foreground break-words overflow-wrap-break-word hyphens-auto">
                      {contactInfo!.address}
                    </p>
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(contactInfo!.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-accent hover:text-accent/80 transition-colors mt-2 break-words"
                    >
                      Apri in Google Maps
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="bg-background p-6 sm:p-8">
                <h3 className="text-xs sm:text-sm uppercase tracking-wider text-muted-foreground mb-4 sm:mb-5">
                  Seguici
                </h3>
                <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                  {contactInfo!.socialLinks!.map((social, index) => (
                    <a
                      key={`contact-social-${index}`}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-11 h-11 sm:w-12 sm:h-12 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all duration-300 rounded-sm flex-shrink-0"
                      aria-label={social.platform}
                    >
                      {getSocialIcon(social.platform)}
                    </a>
                  ))}
                </div>
              </div>

              {/* Quick Info - mobile padding */}
              <div className="bg-primary text-primary-foreground p-6 sm:p-8">
                <h3 className="font-serif text-xl sm:text-2xl mb-3 sm:mb-4">
                  Perché prenotare direttamente?
                </h3>
                <ul className="space-y-2.5 sm:space-y-3">
                  {[
                    "Miglior tariffa garantita",
                    "Check-in anticipato e check-out posticipato",
                    "Welcome drink di benvenuto incluso",
                    "Cancellazione flessibile"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="break-words">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div
            className={`transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8" /* ← FIX: era opacityconsole.-0 */
              }`}
          >
            <div className="bg-background p-6 sm:p-8 md:p-10">
              <h3 className="font-serif text-2xl text-foreground mb-2">
                Richiedi Informazioni
              </h3>
              <p className="text-muted-foreground text-sm mb-6 sm:mb-8">
                Compila il modulo e ti risponderemo al più presto
              </p>

              {isSubmitted ? (
                <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center px-4">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mb-5 sm:mb-6">
                    <svg className="w-7 h-7 sm:w-8 sm:h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="font-serif text-xl sm:text-2xl text-foreground mb-2">
                    Messaggio Inviato!
                  </h4>
                  <p className="text-muted-foreground text-sm sm:text-base">
                    Ti contatteremo entro 24 ore.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">

                  {/* Name & Email Row - stacked on mobile */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                    <div className="relative">
                      <label htmlFor="name" className={`absolute left-0 transition-all duration-300 pointer-events-none text-sm ${activeField === "name" || formData.name ? "-top-6 text-xs text-accent" : "top-3 text-muted-foreground"}`}>
                        Nome Completo *
                      </label>
                      <input
                        type="text" id="name" name="name" required
                        value={formData.name} onChange={handleChange}
                        onFocus={() => setActiveField("name")} onBlur={() => setActiveField(null)}
                        className="w-full border-b border-border bg-transparent py-3 text-foreground focus:border-accent focus:outline-none transition-colors max-w-full"
                      />
                    </div>
                    <div className="relative">
                      <label htmlFor="email" className={`absolute left-0 transition-all duration-300 pointer-events-none text-sm ${activeField === "email" || formData.email ? "-top-6 text-xs text-accent" : "top-3 text-muted-foreground"}`}>
                        Email *
                      </label>
                      <input
                        type="email" id="email" name="email" required
                        value={formData.email} onChange={handleChange}
                        onFocus={() => setActiveField("email")} onBlur={() => setActiveField(null)}
                        className="w-full border-b border-border bg-transparent py-3 text-foreground focus:border-accent focus:outline-none transition-colors max-w-full break-words"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="relative">
                    <label htmlFor="phone" className={`absolute left-0 transition-all duration-300 pointer-events-none text-sm ${activeField === "phone" || formData.phone ? "-top-6 text-xs text-accent" : "top-3 text-muted-foreground"}`}>
                      Telefono
                    </label>
                    <input
                      type="tel" id="phone" name="phone"
                      value={formData.phone} onChange={handleChange}
                      onFocus={() => setActiveField("phone")} onBlur={() => setActiveField(null)}
                      className="w-full border-b border-border bg-transparent py-3 text-foreground focus:border-accent focus:outline-none transition-colors max-w-full"
                    />
                  </div>

                  {/* Check-in & Check-out - stacked on mobile */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                    <div>
                      <label htmlFor="checkIn" className="block text-xs text-muted-foreground mb-2">
                        Data Check-in
                      </label>
                      <input
                        type="date" id="checkIn" name="checkIn"
                        value={formData.checkIn} onChange={handleChange}
                        className="w-full border-b border-border bg-transparent py-3 text-foreground focus:border-accent focus:outline-none transition-colors [color-scheme:light] dark:[color-scheme:dark]"
                      />
                    </div>
                    <div>
                      <label htmlFor="checkOut" className="block text-xs text-muted-foreground mb-2">
                        Data Check-out
                      </label>
                      <input
                        type="date" id="checkOut" name="checkOut"
                        value={formData.checkOut} onChange={handleChange}
                        className="w-full border-b border-border bg-transparent py-3 text-foreground focus:border-accent focus:outline-none transition-colors [color-scheme:light] dark:[color-scheme:dark]"
                      />
                    </div>
                  </div>

                  {/* Guests */}
                  <div>
                    <label htmlFor="guests" className="block text-xs text-muted-foreground mb-2">
                      Numero Ospiti
                    </label>
                    <select
                      id="guests" name="guests"
                      value={formData.guests} onChange={handleChange}
                      className="w-full border-b border-border bg-transparent py-3 text-foreground focus:border-accent focus:outline-none transition-colors appearance-none"
                    >
                      <option value="1">1 Ospite</option>
                      <option value="2">2 Ospiti</option>
                      <option value="3">3 Ospiti</option>
                      <option value="4">4 Ospiti</option>
                      <option value="5+">5+ Ospiti</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div className="relative">
                    <label htmlFor="message" className={`absolute left-0 transition-all duration-300 pointer-events-none text-sm ${activeField === "message" || formData.message ? "-top-6 text-xs text-accent" : "top-3 text-muted-foreground"}`}>
                      Messaggio
                    </label>
                    <textarea
                      id="message" name="message" rows={4}
                      value={formData.message} onChange={handleChange}
                      onFocus={() => setActiveField("message")} onBlur={() => setActiveField(null)}
                      className="w-full border-b border-border bg-transparent py-3 text-foreground focus:border-accent focus:outline-none transition-colors resize-none max-w-full"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit" disabled={isSubmitting}
                    className="w-full bg-primary text-primary-foreground py-4 text-sm uppercase tracking-wider hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 rounded-sm"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Invio in corso...
                      </>
                    ) : (
                      "Invia Richiesta"
                    )}
                  </button>

                  <p className="text-xs text-muted-foreground text-center px-2">
                    Inviando questo modulo, accetti la nostra{" "}
                    <a href="#privacy" className="underline hover:text-accent break-words">
                      Privacy Policy
                    </a>
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
