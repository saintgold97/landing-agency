"use client"
import { ServiceCard } from "@/components/ui/ServiceCard";
import { getIconByName } from "@/lib/utils/getIconByName";
import { SectionContentMap } from "@/types/sections/index";

interface ServicesProps {
  content: SectionContentMap["services"];
}

export function Services({ content: { title, subtitle, description, services } }: ServicesProps) {
  return (
    <section id="services" aria-labelledby="services-heading" className="relative bg-bone text-ink py-32 md:py-48">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12">
        {/* Header section */}
        <header className="grid grid-cols-12 gap-6 mb-20">
          <div className="col-span-12 md:col-span-7">
            <p className="tracking-luxury text-[11px] uppercase text-gold mb-6" aria-hidden>
              - {subtitle}
            </p>
            <h2 id="services-heading" className="font-serif text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.95] text-balance">
              {title}
            </h2>
            {description && (
              <p className="mt-6 max-w-lg text-muted-foreground text-[15px] leading-relaxed">
                {description}
              </p>
            )}
          </div>
        </header>

        {/* Services grid */}
        <div
          role="list"
          aria-label="Available services"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0"
        >
          {services.map((service, index) => {
            const Icon = getIconByName(service.iconName);
            return (
              <ServiceCard
                key={service.name}
                name={service.name}
                duration={service.duration}
                price={service.price}
                icon={Icon}
                index={index}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}