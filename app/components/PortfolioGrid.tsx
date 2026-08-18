"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export interface PortfolioProject {
  id: string;
  title: string;
  type: string;
  location: string;
  imgSrc: string;
  description: string;
  materials: string;
  year: string;
  sqm: string;
  tagline: string;
}

const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    id: "japandi-sanctuary",
    title: "The Japandi Sanctuary",
    type: "Residential Masterpiece",
    location: "Kyoto, Japan",
    imgSrc: "/interio-animation/ezgif-frame-300.jpg",
    tagline: "SPATIAL PURITY & MEDITATIVE STILLNESS",
    description:
      "A harmonious fusion of Japanese minimalism and Scandinavian warmth. Centered around natural Kyoto cedar, textured virgin bouclé fabrics, and a serene, decluttered layout that invites mindful contemplation and restorative rest.",
    materials: "Quarter-sawn White Oak, Unbleached Bouclé, Basalt Stone",
    year: "2025",
    sqm: "420 m²",
  },
  {
    id: "monolithic-culinary",
    title: "Monolithic Culinary Studio",
    type: "Architectural Kitchen",
    location: "Milan, Italy",
    imgSrc: "/portfolio-images/marble_kitchen.jpg",
    tagline: "OBSIDIAN MARBLE & LINEAR ILLUMINATION",
    description:
      "An architectural culinary environment featuring dark, dramatic marble islands, seamless handleless millwork, and warm recessed linear lighting. Designed for high-end gastronomy and spatial elegance.",
    materials: "Nero Marquina Marble, Matte Charcoal, Patinated Brass",
    year: "2024",
    sqm: "280 m²",
  },
  {
    id: "brutalist-awakening",
    title: "Alpine Brutalist Penthouse",
    type: "Master Suite Sanctuary",
    location: "Zurich, Switzerland",
    imgSrc: "/portfolio-images/brutalist_bedroom.jpg",
    tagline: "RAW BOARD-FORMED CONCRETE & SMOKED WALNUT",
    description:
      "Raw concrete architecture meets warm luxury. This master suite balances cool brutalist walls with plush bespoke textiles, custom walnut acoustic partitions, and soft ambient circadian uplighting.",
    materials: "Raw Concrete, Smoked Walnut, Brushed Steel",
    year: "2024",
    sqm: "310 m²",
  },
  {
    id: "mid-century-refined",
    title: "Mid-Century Pavilion",
    type: "Dining & Reception",
    location: "California, USA",
    imgSrc: "/portfolio-images/midcentury_dining.jpg",
    tagline: "ORGANIC TIMBER & PANORAMIC LIGHT",
    description:
      "A mid-century modern pavilion centered around a handcrafted walnut dining table. Floor-to-ceiling panoramic glass connects the interior with vibrant nature, accented by iconic sculptural illumination.",
    materials: "American Walnut, Bouclé, Brushed Gold",
    year: "2023",
    sqm: "390 m²",
  },
  {
    id: "biophilic-oasis",
    title: "Biophilic Light Sanctuary",
    type: "Sunroom & Lounge",
    location: "Portland, USA",
    imgSrc: "/portfolio-images/biophilic_oasis.jpg",
    tagline: "INDOOR-OUTDOOR BOTANICAL LIVING",
    description:
      "An indoor-outdoor glass sunroom brimming with architectural foliage. Organic linen loungers, high exposed timber beams, and unfiltered sunlight create a peaceful retreat for reflection and renewal.",
    materials: "Teak Wood, Organic Linen, Hand-rubbed Bronze",
    year: "2024",
    sqm: "220 m²",
  },
  {
    id: "minimalist-ritual",
    title: "Minimalist Ritual Bath",
    type: "Wellness Suite",
    location: "Tokyo, Japan",
    imgSrc: "/portfolio-images/minimalist_bathroom.jpg",
    tagline: "BASALT STONE & RESTORATIVE WATER",
    description:
      "A dark stone wellness bath featuring a freestanding white soaking tub, brushed brass fixtures, and a glass-enclosed private garden view that elevates daily bathing into restorative rituals.",
    materials: "Thermal-flamed Basalt, Brushed Gold, Ceramic",
    year: "2025",
    sqm: "185 m²",
  },
];



export default function PortfolioGrid({ isLoaded = true }: { isLoaded?: boolean }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const mainCardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const shadowRef = useRef<HTMLDivElement | null>(null);
  const shockwaveRef = useRef<HTMLDivElement | null>(null);
  const headerBarRef = useRef<HTMLDivElement | null>(null);
  const sideDescriptionRef = useRef<HTMLDivElement | null>(null);
  const queueRailRef = useRef<HTMLDivElement | null>(null);
  const telemetryHudRef = useRef<HTMLDivElement | null>(null);
  const telemetryAltitudeRef = useRef<HTMLSpanElement | null>(null);

  const [activeIndex, setActiveIndex] = useState<number>(0);

  // Manual Click Selection
  const jumpToProject = useCallback((idx: number) => {
    setActiveIndex(idx);
  }, []);

  /* ─────────────────────────────────────────────────────────────────────────
     MASTER GSAP SCROLLTRIGGER:
     1. IMAGE FIRST: Physical free-fall drop down the viewport (Project UI hidden)
     2. GROUND SLAM & REBOUND BOUNCE
     3. THEN PROJECT SECTION ENTERS: Header & specs smoothly fade in around picture
     4. CONTINUOUS SEQUENTIAL RESIDENCE CAROUSEL
     ───────────────────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (!isLoaded) return;

    const section = sectionRef.current;
    const cards = mainCardsRef.current;
    const shadow = shadowRef.current;
    const shockwave = shockwaveRef.current;
    const headerBar = headerBarRef.current;
    const sideDesc = sideDescriptionRef.current;
    const queueRail = queueRailRef.current;
    const telemetryHud = telemetryHudRef.current;
    const altText = telemetryAltitudeRef.current;

    if (!section || !cards.length) return;

    let ctx: gsap.Context;

    const timer = setTimeout(() => {
      // ── PRE-SET: Before ScrollTrigger even fires, hide everything ──
      // Card 0 starts 100% INVISIBLE so the portfolio frame slot is empty while the hero image drops!
      if (cards[0]) {
        gsap.set(cards[0], {
          y: 0,
          scale: 1,
          borderRadius: "28px",
          opacity: 0,
          zIndex: 30,
        });
      }
      // All other cards start off-screen right
      for (let i = 1; i < cards.length; i++) {
        if (cards[i]) gsap.set(cards[i], { x: "140%", opacity: 0, zIndex: 10 });
      }
      // All UI starts hidden
      if (headerBarRef.current) gsap.set(headerBarRef.current, { opacity: 0, y: -20 });
      if (sideDescriptionRef.current) gsap.set(sideDescriptionRef.current, { opacity: 0, y: 30 });
      if (queueRailRef.current) gsap.set(queueRailRef.current, { opacity: 0, x: 30 });
      if (shadowRef.current) gsap.set(shadowRef.current, { opacity: 0, scaleX: 0.15, scaleY: 0.15 });

      ctx = gsap.context(() => {
        ScrollTrigger.create({
          id: "portfolioTrigger",
          trigger: section,
          start: "top top",
          end: "+=500%",
          pin: true,
          pinSpacing: true,
          scrub: 0.35,
          onLeaveBack: () => {
            // When user scrolls back up into hero, hide card 0 so slot is empty again
            if (cards[0]) {
              gsap.set(cards[0], { opacity: 0 });
            }
          },
          onUpdate: (self) => {
            const p = self.progress; // 0.0 to 1.0 across 500vh

            // ── STAGE 1: DOCKED PROJECT SHOWCASE & UI REVEAL (0.00 -> 0.15) ──
            const REVEAL_END = 0.15;

            if (p <= REVEAL_END) {
              const revealP = gsap.parseEase("power2.out")(p / REVEAL_END);

              // Reveal Project UI elements around the landed picture
              if (headerBar) gsap.set(headerBar, { opacity: revealP, y: (1 - revealP) * -20 });
              if (sideDesc) gsap.set(sideDesc, { opacity: revealP, y: (1 - revealP) * 30 });
              if (queueRail) gsap.set(queueRail, { opacity: revealP, x: (1 - revealP) * 30 });

              if (altText) {
                altText.textContent = `ATELIER SPEC 01 // RESIDENCE ACTIVE`;
              }

              // Card 0 owns the frame with 100% opacity, rock-solid in place
              if (cards[0]) {
                gsap.set(cards[0], {
                  x: 0,
                  y: 0,
                  scale: 1,
                  scaleX: 1,
                  scaleY: 1,
                  rotationX: 0,
                  rotation: 0,
                  borderRadius: "28px",
                  opacity: 1,
                  zIndex: 30,
                  boxShadow: `0 30px 70px rgba(0,0,0,0.85)`,
                  border: `1px solid rgba(200, 149, 106, 0.3)`,
                });
              }

              // Other cards remain off-screen to the right
              for (let i = 1; i < cards.length; i++) {
                if (cards[i]) {
                  gsap.set(cards[i], {
                    x: "140%",
                    y: 0,
                    scale: 0.9,
                    opacity: 0,
                    zIndex: 10,
                  });
                }
              }

              // Floor Contact Shadow
              if (shadow) {
                gsap.set(shadow, {
                  x: 0,
                  y: 25,
                  scaleX: 1,
                  scaleY: 1,
                  opacity: 0.85,
                });
              }

              // Impact Shockwave
              if (shockwave) {
                gsap.set(shockwave, {
                  opacity: 0,
                  scale: 1,
                });
              }

              // Telemetry HUD visible while dropping
              if (telemetryHud) {
                const stageP = p / REVEAL_END;
                if (stageP < 0.88) {
                  gsap.set(telemetryHud, { opacity: 1, y: 0 });
                } else {
                  const fadeOut = (stageP - 0.88) / 0.12;
                  gsap.set(telemetryHud, { opacity: 1 - fadeOut, y: -15 * fadeOut });
                }
              }

              setActiveIndex(0);
            } else {
              // ── STAGE 2: SEQUENTIAL PROJECT SHOWCASE CAROUSEL (0.15 -> 1.00) ──
              if (telemetryHud) gsap.set(telemetryHud, { opacity: 0 });
              if (shockwave) gsap.set(shockwave, { opacity: 0 });
              if (headerBar) gsap.set(headerBar, { opacity: 1, y: 0 });
              if (shadow) gsap.set(shadow, { x: 0, y: 15, scaleX: 1, scaleY: 1, opacity: 0.85 });
              if (sideDesc) gsap.set(sideDesc, { opacity: 1, y: 0 });
              if (queueRail) gsap.set(queueRail, { opacity: 1, x: 0 });

              const carouselP = (p - REVEAL_END) / (1 - REVEAL_END);
              const totalProjects = PORTFOLIO_PROJECTS.length;
              const floatPos = carouselP * (totalProjects - 1);
              const activeIdx = Math.min(Math.round(floatPos), totalProjects - 1);
              setActiveIndex(activeIdx);

              cards.forEach((card, idx) => {
                if (!card) return;

                const diff = idx - floatPos;

                if (diff < -0.1) {
                  // Past Project: Exits to Left
                  const exitP = Math.min(Math.abs(diff), 1.5);
                  const exitX = -exitP * 135;
                  const exitOpacity = Math.max(0, 1 - (exitP - 0.1) * 1.8);
                  const exitScale = Math.max(0.85, 1 - exitP * 0.1);

                  gsap.set(card, {
                    x: `${exitX}%`,
                    y: 0,
                    scale: exitScale,
                    scaleX: 1,
                    scaleY: 1,
                    rotationX: 0,
                    rotation: 0,
                    borderRadius: "28px",
                    opacity: exitOpacity,
                    zIndex: 10,
                    pointerEvents: "none",
                  });
                } else if (diff <= 0.1) {
                  // Active Project: Center Stage
                  gsap.set(card, {
                    x: "0%",
                    y: 0,
                    scale: 1,
                    scaleX: 1,
                    scaleY: 1,
                    rotationX: 0,
                    rotation: 0,
                    borderRadius: "28px",
                    opacity: 1,
                    zIndex: 30,
                    pointerEvents: "auto",
                  });
                } else {
                  // Upcoming Project: Enters from Right
                  const enterX = diff * 135;
                  const enterOpacity = Math.max(0, 1 - (diff - 0.1) * 1.5);
                  const enterScale = Math.max(0.9, 1 - diff * 0.08);

                  gsap.set(card, {
                    x: `${enterX}%`,
                    y: 0,
                    scale: enterScale,
                    scaleX: 1,
                    scaleY: 1,
                    rotationX: 0,
                    rotation: 0,
                    borderRadius: "28px",
                    opacity: enterOpacity,
                    zIndex: 20,
                    pointerEvents: "none",
                  });
                }
              });
            }
          },
        });
        ScrollTrigger.sort();
        ScrollTrigger.refresh();
      }, section);
    }, 60);

    return () => {
      clearTimeout(timer);
      if (ctx) ctx.revert();
    };
  }, [isLoaded]);

  const currentProject = PORTFOLIO_PROJECTS[activeIndex];
  const upcomingQueue = PORTFOLIO_PROJECTS.slice(activeIndex + 1);

  return (
    <section
      id="portfolio"
      ref={sectionRef}
      className="relative w-full h-screen bg-[#070709] border-t border-white/5"
    >
      {/* ── Pinned Full-Viewport Stage ─────────────────────────────────── */}
      <div
        ref={stageRef}
        data-portfolio-sticky="true"
        className="relative w-full h-screen flex flex-col justify-center bg-[#070709] px-6 md:px-14 lg:px-20"
        style={{ perspective: "1600px" }}
      >
        {/* Deep Black Architectural Interior Design Blueprint Backdrop */}
        <div className="absolute inset-0 bg-[#070709] pointer-events-none overflow-hidden">
          {/* Architectural Drafting Grid */}
          <div 
            className="absolute inset-0 opacity-[0.06]" 
            style={{
              backgroundImage: `linear-gradient(to right, #C8956A 1px, transparent 1px), linear-gradient(to bottom, #C8956A 1px, transparent 1px)`,
              backgroundSize: "60px 60px"
            }}
          />

          {/* Spotlight Ambient Illumination */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-[#C8956A]/10 rounded-full blur-[240px]" />
        </div>

        {/* ── Floating Architectural Telemetry HUD (Active during travel & drop) ── */}
        <div
          ref={telemetryHudRef}
          className="absolute top-8 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 px-4 py-2 rounded-full bg-black/80 backdrop-blur-xl border border-[#C8956A]/40 shadow-2xl pointer-events-none will-change-transform opacity-0"
        >
          <span className="w-2 h-2 rounded-full bg-[#C8956A] animate-ping" />
          <span
            ref={telemetryAltitudeRef}
            className="text-[9px] font-mono font-bold tracking-[0.25em] text-[#C8956A] uppercase"
          >
            ALT: 750 PX // FREE-FALL DESCENT
          </span>
          <span className="text-[9px] font-mono text-white/40 tracking-widest hidden sm:inline-block">
            STAGE II • SLAM DOCKING
          </span>
        </div>

        <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col justify-between">
          
          {/* ── Header Bar (Initially Hidden, Fades In After Picture Lands) ── */}
          <div
            ref={headerBarRef}
            className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 md:mb-8 gap-4 will-change-transform opacity-0"
          >
            <div>
              <span className="text-[#C8956A] text-[10px] md:text-xs tracking-[0.45em] font-mono font-semibold uppercase mb-1 block">
                02 / ARCHITECTURAL PORTFOLIO
              </span>
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-serif text-white font-light tracking-tight">
                Selected <em className="italic font-normal text-[#C8956A]">Sanctuaries</em>
              </h2>
            </div>

            {/* Active Counter */}
            <div className="flex items-center gap-3">
              <div className="text-xs font-mono tracking-widest text-white/40 flex items-baseline gap-1.5">
                <span className="text-[#C8956A] font-bold text-lg">0{activeIndex + 1}</span>
                <span className="text-white/20">/</span>
                <span>0{PORTFOLIO_PROJECTS.length}</span>
              </div>
            </div>
          </div>

          {/* ── Main Showcase Stage + Right-Side Details & Queue ────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* ── Left Column: Main Project Showcase (Unclipped container so drop from top is fully visible!) ── */}
            <div className="col-span-1 lg:col-span-7 flex flex-col relative overflow-visible">
              
              {/* Radial Shockwave Pulse on Ground Strike */}
              <div
                ref={shockwaveRef}
                className="absolute inset-0 -m-8 rounded-full border border-[#C8956A]/60 pointer-events-none opacity-0 will-change-transform"
                style={{ transformOrigin: "center center" }}
              />

              {/* Image Frame Container */}
              <div className="relative w-full overflow-visible">
                {/* Dynamic Bottom Contact Shadow */}
                <div
                  ref={shadowRef}
                  className="absolute -bottom-7 left-1/2 -translate-x-1/2 w-[85%] h-14 bg-black/95 rounded-full blur-2xl pointer-events-none will-change-transform opacity-0"
                  style={{ transformOrigin: "center center" }}
                />

                {/* Main Card Frame Slot */}
                <div
                  id="portfolio-image-frame"
                  className="relative w-full aspect-[16/10] bg-[#0d0d10] rounded-[28px] overflow-visible border border-[#C8956A]/30 shadow-[0_0_90px_rgba(200,149,106,0.18),0_35px_80px_rgba(0,0,0,0.95)] transition-shadow duration-500"
                >
                  {/* Corner Architectural Brackets */}
                  <div className="absolute -top-1 -left-1 w-5 h-5 border-t-2 border-l-2 border-[#C8956A] rounded-tl-lg pointer-events-none z-40" />
                  <div className="absolute -top-1 -right-1 w-5 h-5 border-t-2 border-r-2 border-[#C8956A] rounded-tr-lg pointer-events-none z-40" />
                  <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-2 border-l-2 border-[#C8956A] rounded-bl-lg pointer-events-none z-40" />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-2 border-r-2 border-[#C8956A] rounded-br-lg pointer-events-none z-40" />

                  {PORTFOLIO_PROJECTS.map((project, index) => (
                    <div
                      key={project.id}
                      ref={(el) => {
                        mainCardsRef.current[index] = el;
                      }}
                      className="absolute inset-0 will-change-transform overflow-hidden rounded-[28px]"
                      style={index === 0 ? {} : { transform: "translateX(140%)", opacity: 0 }}
                    >
                      <Image
                        src={project.imgSrc}
                        alt={project.title}
                        fill
                        className="object-cover"
                        priority={index === 0}
                        sizes="(max-width: 1024px) 100vw, 60vw"
                      />

                      {/* Luxury Ambient Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                      {/* Glass Sheen Accent */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />

                      {/* Corner Crosshairs HUD */}
                      <div className="absolute top-4 left-4 text-[10px] font-mono text-[#C8956A]/60 select-none pointer-events-none">
                        +
                      </div>
                      <div className="absolute top-4 right-4 text-[10px] font-mono text-[#C8956A]/60 select-none pointer-events-none">
                        +
                      </div>
                      <div className="absolute bottom-4 left-4 text-[10px] font-mono text-[#C8956A]/60 select-none pointer-events-none">
                        +
                      </div>
                      <div className="absolute bottom-4 right-4 text-[10px] font-mono text-[#C8956A]/60 select-none pointer-events-none">
                        +
                      </div>

                      {/* Floating Badge */}
                      <div className="absolute top-5 left-5 z-20 flex items-center gap-2">
                        <span className="bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 text-[9px] font-mono tracking-widest text-[#C8956A] uppercase font-semibold">
                          {project.type} • {project.year}
                        </span>
                        <span className="bg-black/50 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-white/10 text-[9px] font-mono tracking-widest text-white/70">
                          {project.sqm}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Quick Controls under image */}
              <div className="mt-4 flex items-center justify-between">
                <span className="text-[9px] font-mono tracking-[0.25em] text-[#C8956A] uppercase">
                  {currentProject.tagline}
                </span>

                {/* Pagination Pills */}
                <div className="flex items-center gap-2">
                  {PORTFOLIO_PROJECTS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => jumpToProject(i)}
                      className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                        i === activeIndex
                          ? "w-8 bg-[#C8956A]"
                          : "w-2 bg-white/20 hover:bg-white/40"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* ── Right Column: Side Interior Design Narrative & Project Queue (Initially Hidden) ── */}
            <div
              ref={sideDescriptionRef}
              className="col-span-1 lg:col-span-5 flex flex-col justify-between gap-6 will-change-transform opacity-0"
            >
              {/* Detailed Interior Architecture Narrative Card */}
              <div className="bg-[#111115]/90 backdrop-blur-xl border border-white/10 p-6 md:p-7 rounded-3xl shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C8956A]/60 to-transparent" />

                <div className="flex items-center gap-2 text-[10px] font-mono text-[#C8956A] tracking-[0.3em] uppercase mb-2">
                  <span>{currentProject.location}</span>
                  <span>•</span>
                  <span>{currentProject.year}</span>
                </div>

                <h3 className="text-2xl md:text-3xl font-serif text-white font-light tracking-wide mb-3">
                  {currentProject.title}
                </h3>

                <p className="text-xs text-white/75 font-light leading-relaxed mb-5">
                  {currentProject.description}
                </p>

                <div className="space-y-2 border-t border-white/10 pt-4 text-xs">
                  <div className="flex items-start gap-2">
                    <span className="text-[9px] uppercase tracking-widest font-mono text-white/40 shrink-0 mt-0.5">
                      Materials:
                    </span>
                    <span className="text-[#C8956A] font-serif italic text-xs leading-tight">
                      {currentProject.materials}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] uppercase tracking-widest font-mono text-white/40">
                      Volume:
                    </span>
                    <span className="text-white/80 font-mono text-[10px]">
                      {currentProject.sqm} • Private Commission
                    </span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
                  <a
                    href="#inquire"
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#C8956A] text-black text-[10px] font-semibold uppercase tracking-widest hover:bg-white transition-colors duration-300 cursor-pointer"
                  >
                    <span>Request Catalog</span>
                    <span>→</span>
                  </a>
                  <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest">
                    ATELIER SPEC 0{activeIndex + 1}
                  </span>
                </div>
              </div>

              {/* Upcoming Project Queue Thumbnails */}
              <div
                ref={queueRailRef}
                className="hidden lg:flex flex-col will-change-transform opacity-0"
              >
                <div className="flex items-center justify-between mb-2 pb-1 border-b border-white/10">
                  <span className="text-[8px] font-mono tracking-[0.3em] text-[#C8956A] uppercase font-semibold">
                    PROJECT QUEUE
                  </span>
                  <span className="text-[8px] font-mono text-white/40">
                    {upcomingQueue.length} NEXT
                  </span>
                </div>

                {/* Queue Cards */}
                <div className="flex gap-2.5 overflow-x-auto pb-1">
                  {PORTFOLIO_PROJECTS.map((proj, idx) => {
                    const isCurrent = idx === activeIndex;

                    return (
                      <button
                        key={proj.id}
                        onClick={() => jumpToProject(idx)}
                        className={`group relative rounded-xl overflow-hidden border transition-all duration-300 cursor-pointer p-1.5 flex flex-col gap-1.5 shrink-0 w-[110px] text-left focus:outline-none ${
                          isCurrent
                            ? "bg-[#18181D] border-[#C8956A] shadow-md shadow-[#C8956A]/10"
                            : "bg-[#111114]/60 border-white/10 hover:border-white/30 opacity-60 hover:opacity-100"
                        }`}
                      >
                        <div className="relative w-full aspect-[16/10] rounded-lg overflow-hidden bg-black/60">
                          <Image
                            src={proj.imgSrc}
                            alt={proj.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="110px"
                          />
                          {isCurrent && (
                            <div className="absolute inset-0 bg-[#C8956A]/20 flex items-center justify-center">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#C8956A] animate-ping" />
                            </div>
                          )}
                        </div>
                        <span className="text-[8px] font-serif font-light text-white truncate w-full block">
                          {proj.title}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Bottom scroll cue */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 text-white/25 text-[8px] uppercase tracking-[0.3em] font-mono pointer-events-none">
          <span>Scroll down to advance through residences</span>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-bounce">
            <line x1="12" y1="5" x2="12" y2="19" />
            <polyline points="19 12 12 19 5 12" />
          </svg>
        </div>
      </div>
    </section>
  );
}
