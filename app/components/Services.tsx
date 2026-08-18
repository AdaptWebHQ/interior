"use client";

import React from "react";

const SERVICES = [
  {
    num: "01",
    title: "Residential Sanctuaries",
    description: "Personalized Bedroom & Living room designs, custom wardrobes, and custom sofas. We draft bespoke floor plans and select textiles to form intimate home experiences.",
  },
  {
    num: "02",
    title: "Commercial & Office Spaces",
    description: "High-end retail showrooms, modern office layouts, and commercial developments. Custom steel furniture and structural fixtures crafted to elevate workspace productivity.",
  },
  {
    num: "03",
    title: "Architectural & Kitchen Planning",
    description: "Complete room planning, interior architectural design, and modern kitchen curations. Detailed space optimization paired with custom luxury decorator finishes.",
  },
];

export default function Services() {
  return (
    <section id="services" className="py-24 md:py-32 bg-background border-t border-[#e2e2e2]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-24 gap-6">
          <div className="max-w-xl">
            <span className="text-xs font-semibold tracking-[0.25em] text-accent uppercase mb-3 block">
              OUR EXPERTISE
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-foreground leading-tight font-normal">
              Shaping Space, Defining Atmosphere.
            </h2>
          </div>
          <p className="max-w-md text-sm md:text-base text-muted font-light leading-relaxed">
            We operate at the intersection of architecture, interior styling, and human emotion, creating environments that are visually breathtaking yet deeply personal.
          </p>
        </div>

        {/* Services List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SERVICES.map((service, index) => (
            <div
              key={index}
              className="group relative p-8 md:p-10 bg-[#f9f9f9] border border-[#e2e2e2] hover:border-accent rounded-3xl transition-all duration-500 hover:bg-[#f2f2f2]"
            >
              {/* Number */}
              <div className="text-xs font-mono text-accent mb-8 tracking-widest">
                [{service.num}]
              </div>

              {/* Title */}
              <h3 className="text-xl md:text-2xl font-serif text-foreground font-medium mb-4 group-hover:text-accent transition-colors duration-300">
                {service.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-muted leading-relaxed font-light font-sans">
                {service.description}
              </p>

              {/* Subtle hover line decorator */}
              <div className="absolute bottom-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-accent/35 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
