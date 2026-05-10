"use client"

import { useRef, useEffect, useState } from "react"
import Image from "next/image"
import { SectionContentMap } from "@/types/sections"

interface RoomsSectionProps {
  content: SectionContentMap["rooms"]
}

export function RoomsSection({ content }: RoomsSectionProps) {
  const { items } = content
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)


  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="rooms"
      className="py-24 md:py-32 lg:py-40 text-muted"
    >
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div
          className={`text-center max-w-2xl mx-auto mb-16 md:mb-20 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-accent text-sm uppercase tracking-[0.3em] mb-4">
            {content.subtitle}
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground font-medium text-balance">
            {content.title}
          </h2>
        </div>

        {/* Rooms Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((room, index) => (
            <RoomCard
              key={room.id || `room-${index}`}
              room={{
                id: room.id,
                name: room.name,
                description: room.description,
                image: room.image,
                price: room.price,
                amenities: room.amenities,
                capacity: 2,
              }}
              isVisible={isVisible}
              delay={index * 150}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

interface RoomCardProps {
  room: {
    id: string
    name: string
    description: string
    image: string
    price: string
    amenities: string[]
    capacity: number
  }
  isVisible: boolean
  delay: number
}

function RoomCard({ room, isVisible, delay }: RoomCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <article
      className={`group cursor-pointer transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] mb-6 overflow-hidden bg-muted">
        <Image
          src={room.image}
          alt={room.name || "Room Image"}
          fill
          className={`object-cover transition-transform duration-700 ${
            isHovered ? "scale-105" : "scale-100"
          }`}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-foreground/20 transition-opacity duration-500 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        />
        {/* Quick View Button */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <span className="bg-background text-foreground px-6 py-3 text-sm uppercase tracking-wider">
            Scopri di Più
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3">
        {/* Title & Price */}
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-serif text-2xl text-foreground group-hover:text-accent transition-colors">
            {room.name}
          </h3>
          <span className="text-accent text-sm font-medium whitespace-nowrap">
            {room.price}
          </span>
        </div>

        {/* Description */}
        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
          {room.description}
        </p>

        {/* Amenities */}
        <div className="flex flex-wrap gap-2 pt-2">
          {room.amenities.slice(0, 3).map((amenity, index) => (
            <span
              key={`room-${room.id}-amenity-${index}`}
              className="text-xs text-muted-foreground border border-border px-2 py-1"
            >
              {amenity}
            </span>
          ))}
          {room.amenities.length > 3 && (
            <span className="text-xs text-muted-foreground border border-border px-2 py-1">
              +{room.amenities.length - 3} altri
            </span>
          )}
        </div>

        {/* Capacity */}
        <p className="text-xs text-muted-foreground pt-1">
          <span className="inline-flex items-center gap-1">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            {room.capacity}
          </span>
        </p>
      </div>
    </article>
  )
}
