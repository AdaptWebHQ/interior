"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ServiceItem {
  id: string;
  number: string;
  title: string;
  description: string;
  tags: string[];
}

const SERVICES_DATA: ServiceItem[] = [
  {
    id: "residential",
    number: "01",
    title: "Residential",
    description:
      "Full-scope residential design for private homes and apartments. From architectural interventions to the final cushion — every detail considered, every material chosen with purpose.",
    tags: [
      "SPACE PLANNING",
      "MATERIAL SOURCING",
      "FF&E PROCUREMENT",
      "PROJECT MANAGEMENT",
    ],
  },
  {
    id: "commercial",
    number: "02",
    title: "Commercial",
    description:
      "Workplace and retail environments that balance brand identity with human experience. We design offices, showrooms, and studios that inspire the people who inhabit them daily.",
    tags: [
      "BRAND INTEGRATION",
      "ERGONOMIC PLANNING",
      "CUSTOM MILLWORK",
      "LIGHTING DESIGN",
    ],
  },
  {
    id: "curation",
    number: "03",
    title: "Architectural Curation",
    description:
      "Bespoke spatial interventions, custom furniture joinery, and circadian lighting systems tailored to elevate tranquility and acoustic serenity in high-end living spaces.",
    tags: [
      "BESPOKE JOINERY",
      "CIRCADIAN LIGHTING",
      "ACOUSTIC ENGINEERING",
      "TURNKEY ATELIER",
    ],
  },
];

export default function AboutServices() {
  const [activeTab, setActiveTab] = useState<number>(0);
  const sectionRef = useRef<HTMLElement | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // ScrollTrigger reveal one-by-one as user scrolls through items
      itemRefs.current.forEach((el, index) => {
        if (!el) return;

        ScrollTrigger.create({
          trigger: el,
          start: "top 70%",
          end: "bottom 30%",
          onEnter: () => setActiveTab(index),
          onEnterBack: () => setActiveTab(index),
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative w-full py-32 md:py-48 bg-[#070709] text-[#F3F3F5] overflow-hidden"
    >
      {/* ── BORDERLESS FULL-SECTION BACKGROUND IMAGE (Man Architect Planning Blueprints) ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <Image
          src="/man-architect-planning.jpg"
          alt="Male architect designing interior space through large blueprint paper plans"
          fill
          className="object-cover object-left opacity-70 brightness-[1.15] contrast-[1.05] scale-105 transition-all duration-1000"
          priority
        />

        {/* Ambient Dark Gradient Vignettes for Visually Stunning Text Contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#070709] via-[#070709]/60 to-[#070709]/20" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#070709] via-transparent to-[#070709]" />
        
        {/* Subtle Ambient Gold Spotlight */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[800px] h-[800px] bg-[#C8956A]/15 rounded-full blur-[240px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 px-6 md:px-14 lg:px-20">
        
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-20 pb-8 border-b border-white/10 gap-6">
          <div>
            <span className="text-[#C8956A] text-[10px] md:text-xs tracking-[0.45em] font-mono font-semibold uppercase mb-2 block flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C8956A] animate-ping inline-block" />
              03 / STUDIO DISCIPLINE & SERVICES
            </span>
            <h2 className="text-3xl md:text-6xl font-serif text-white font-light tracking-tight">
              About Our <em className="italic font-normal text-[#C8956A]">Practice</em>
            </h2>
          </div>

          <div className="flex items-center gap-6">
            {/* Action CTA Button */}
            <a
              href="#contact"
              className="px-6 py-3 rounded-md bg-[#C8956A] text-black font-semibold text-xs tracking-widest uppercase hover:bg-[#d4a377] transition-all duration-300 shadow-[0_10px_25px_rgba(200,149,106,0.3)] flex items-center gap-2 group"
            >
              <span>Book Consultation</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </a>

            {/* Social handles */}
            <div className="hidden lg:flex items-center gap-4 text-[10px] font-mono tracking-widest text-white/40 uppercase">
              <span className="hover:text-[#C8956A] transition-colors cursor-pointer">INSTAGRAM</span>
              <span>•</span>
              <span className="hover:text-[#C8956A] transition-colors cursor-pointer">PINTEREST</span>
              <span>•</span>
              <span className="hover:text-[#C8956A] transition-colors cursor-pointer">LINKEDIN</span>
            </div>
          </div>
        </div>

        {/* ── BORDERLESS TYPOGRAPHY LAYOUT — REVEALS ONE BY ONE ON SCROLL ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          
          {/* Left Column Metadata Callout (4 of 12 columns) */}
          <div className="col-span-1 lg:col-span-4 lg:sticky lg:top-36 space-y-6">
            <div className="space-y-3">
              <span className="text-[10px] font-mono tracking-[0.4em] text-[#C8956A] uppercase font-semibold block">
                ARCHITECT AT WORK // BLUEPRINT DRAFTING
              </span>
              <h3 className="text-3xl lg:text-4xl font-serif text-white font-light leading-snug">
                Architectural <br />
                <em className="italic font-normal text-[#C8956A]">Blueprint</em> Planning
              </h3>
              <p className="text-xs md:text-sm text-white/70 font-light leading-relaxed max-w-sm">
                Sculpting spatial layouts on large blueprint paper long before physical construction begins.
              </p>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center gap-4 text-[10px] font-mono text-[#C8956A]/80 tracking-widest uppercase">
              <span>KYOTO & MILAN ATELIER</span>
              <span>•</span>
              <span>2025</span>
            </div>
          </div>

          {/* Right Column Numbered Disciplines List — Revealed One by One on Scroll (8 of 12 columns) */}
          <div className="col-span-1 lg:col-span-8 space-y-16 md:space-y-24">
            {SERVICES_DATA.map((service, index) => {
              const isActive = activeTab === index;
              return (
                <div
                  key={service.id}
                  ref={(el) => {
                    if (el) itemRefs.current[index] = el;
                  }}
                  onClick={() => setActiveTab(index)}
                  className={`group relative pb-12 border-b border-white/10 transition-all duration-700 cursor-pointer ${
                    isActive
                      ? "opacity-100 scale-100 translate-x-0"
                      : "opacity-35 scale-[0.98] -translate-x-2 hover:opacity-60"
                  }`}
                >
                  <div className="flex items-start gap-6 md:gap-10">
                    {/* Big Champagne Gold Numbering */}
                    <div
                      className={`text-6xl md:text-8xl lg:text-9xl font-serif font-thin select-none transition-colors duration-500 ${
                        isActive ? "text-[#C8956A]" : "text-white/15"
                      }`}
                    >
                      {service.number}
                    </div>

                    <div className="flex-1 pt-3">
                      <div className="flex items-center justify-between mb-5">
                        <h3 className="text-3xl md:text-5xl font-serif text-white font-light group-hover:text-[#C8956A] transition-colors flex items-center gap-3">
                          <span className={isActive ? "italic font-normal text-[#C8956A]" : ""}>
                            {service.title}
                          </span>
                        </h3>

                        {/* Arrow Action Circle Icon */}
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-500 ${
                            isActive
                              ? "bg-[#C8956A] border-[#C8956A] text-black shadow-[0_0_25px_rgba(200,149,106,0.5)] scale-110"
                              : "border-white/20 text-white/50 group-hover:border-[#C8956A] group-hover:text-[#C8956A]"
                          }`}
                        >
                          <span className="text-base font-bold">↗</span>
                        </div>
                      </div>

                      <p
                        className={`text-sm md:text-base font-light leading-relaxed mb-8 max-w-2xl transition-colors duration-500 ${
                          isActive ? "text-white/90" : "text-white/50"
                        }`}
                      >
                        {service.description}
                      </p>

                      {/* Interactive Service Pill Badges */}
                      <div className="flex flex-wrap gap-3">
                        {service.tags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className={`px-4 py-2 rounded-md text-[9px] md:text-[10px] font-mono tracking-[0.2em] uppercase transition-all duration-500 ${
                              isActive
                                ? "bg-[#C8956A]/20 border border-[#C8956A] text-white shadow-[0_4px_15px_rgba(200,149,106,0.2)]"
                                : "bg-white/5 border border-white/10 text-white/40 group-hover:border-white/20"
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
