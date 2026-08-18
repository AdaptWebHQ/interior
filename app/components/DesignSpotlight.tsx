"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface DesignSpotlightProps {
  isLoaded?: boolean;
}

export default function DesignSpotlight({ isLoaded = true }: DesignSpotlightProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const shadowRef = useRef<HTMLDivElement | null>(null);
  const editorialRef = useRef<HTMLDivElement | null>(null);
  const badgeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isLoaded || !sectionRef.current) return;

    const section = sectionRef.current;
    const card = cardRef.current;
    const shadow = shadowRef.current;
    const editorial = editorialRef.current;
    const badge = badgeRef.current;

    let ctx: gsap.Context;

    // Delayed trigger initialization guarantees top-to-bottom DOM trigger order
    const timer = setTimeout(() => {
      ctx = gsap.context(() => {
        ScrollTrigger.create({
          id: "designSpotlightTrigger",
          trigger: section,
          start: "top top",
          end: "+=200%",
          pin: true,
          pinSpacing: true,
          scrub: 0.4,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress; // 0.0 to 1.0
            const vh = window.innerHeight;

            // ── STAGE 1: POP-OUT & FREE-FALL GRAVITY DROP (0.00 -> 0.70) ──
            if (p <= 0.70) {
              const dropP = p / 0.70; // 0.0 to 1.0
              const easeP = gsap.parseEase("power2.inOut")(dropP);

              // 3D Air Travel: Pops out from elevated sky (-45vh), pitched, and descends into center
              const dropY = -vh * 0.45 * (1 - easeP);
              const dropScale = 1 + 0.15 * (1 - easeP);
              const dropRotateX = (1 - easeP) * 7;
              const dropRadius = 28 * easeP;

              if (card) {
                gsap.set(card, {
                  y: dropY,
                  scale: dropScale,
                  rotationX: dropRotateX,
                  borderRadius: `${dropRadius}px`,
                  opacity: 1,
                  boxShadow: `0 ${30 * easeP + 10}px ${70 * easeP + 20}px rgba(0,0,0,${0.6 + 0.35 * easeP})`,
                  border: `1px solid rgba(200, 149, 106, ${0.4 - 0.2 * easeP})`,
                });
              }

              // Dynamic Floor Contact Shadow: expands and deepens as the image nears the plane
              if (shadow) {
                const shadowOpacity = gsap.utils.interpolate(0.1, 0.9, dropP);
                const shadowScale = gsap.utils.interpolate(0.3, 1.0, dropP);
                gsap.set(shadow, {
                  y: dropY + 30,
                  scale: shadowScale,
                  opacity: shadowOpacity,
                });
              }

              // Side Editorial Details fade in during descent
              const editEase = gsap.parseEase("power1.out")(Math.min(dropP * 1.3, 1));
              if (editorial) {
                gsap.set(editorial, {
                  opacity: editEase,
                  y: (1 - editEase) * 35,
                });
              }

              if (badge) {
                gsap.set(badge, {
                  opacity: editEase,
                  scale: 0.9 + 0.1 * editEase,
                });
              }
            } else {
              // ── STAGE 2: LOCKED SPOTLIGHT PLACEMENT & ADMIRATION (0.70 -> 1.00) ──
              if (card) {
                gsap.set(card, {
                  y: 0,
                  scale: 1,
                  rotationX: 0,
                  borderRadius: "28px",
                  opacity: 1,
                  boxShadow: "0 40px 90px rgba(0,0,0,0.95)",
                  border: "1px solid rgba(200, 149, 106, 0.2)",
                });
              }

              if (shadow) {
                gsap.set(shadow, {
                  y: 30,
                  scale: 1,
                  opacity: 0.9,
                });
              }

              if (editorial) {
                gsap.set(editorial, { opacity: 1, y: 0 });
              }

              if (badge) {
                gsap.set(badge, { opacity: 1, scale: 1 });
              }
            }
          },
        });
        ScrollTrigger.sort();
        ScrollTrigger.refresh();
      }, section);
    }, 40);

    return () => {
      clearTimeout(timer);
      if (ctx) ctx.revert();
    };
  }, [isLoaded]);

  return (
    <section
      id="design-spotlight"
      ref={sectionRef}
      className="relative w-full h-screen bg-[#070709] border-t border-white/5 overflow-hidden flex flex-col justify-center px-6 md:px-14 lg:px-20"
      style={{ perspective: "1400px" }}
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#C8956A]/5 rounded-full blur-[200px] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col justify-center">
        
        {/* Header Eyebrow */}
        <div ref={badgeRef} className="flex items-center justify-between mb-6 opacity-0 will-change-transform">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#C8956A] animate-ping" />
            <span className="text-[#C8956A] text-[10px] md:text-xs tracking-[0.45em] font-mono font-semibold uppercase">
              02 / SANCTUARY SPOTLIGHT // SPATIAL ARCHITECTURE
            </span>
          </div>
          <span className="text-[10px] font-mono text-white/40 tracking-widest hidden sm:inline-block">
            STAGE II • SPATIAL PLACEMENT
          </span>
        </div>

        {/* Central Stage: Left Dropping Frame | Right Editorial Narrative */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* Left Column: Popping & Dropping Frame */}
          <div className="col-span-1 lg:col-span-7 flex flex-col items-center relative">
            
            {/* Dynamic Floor Contact Shadow */}
            <div
              ref={shadowRef}
              className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[85%] h-14 bg-black/95 rounded-full blur-2xl pointer-events-none will-change-transform opacity-0"
              style={{ transformOrigin: "center center" }}
            />

            {/* Popped-Up Image Card */}
            <div
              ref={cardRef}
              className="relative w-full aspect-[16/10] bg-[#111114] rounded-3xl overflow-hidden will-change-transform"
            >
              <Image
                src="/interio-animation/ezgif-frame-300.jpg"
                alt="The Japandi Sanctuary - Completed Residence"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 60vw"
                priority
              />

              {/* Ambient Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

              {/* Top Floating Badge */}
              <div className="absolute top-5 left-5 z-20 flex items-center gap-2">
                <span className="bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 text-[9px] font-mono tracking-widest text-[#C8956A] uppercase font-semibold">
                  Residential Masterpiece • 2025
                </span>
                <span className="bg-black/50 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-white/10 text-[9px] font-mono tracking-widest text-white/70">
                  420 m²
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Interior Design Specifications */}
          <div
            ref={editorialRef}
            className="col-span-1 lg:col-span-5 flex flex-col justify-center opacity-0 will-change-transform"
          >
            <div className="bg-[#111115]/90 backdrop-blur-2xl border border-white/10 p-7 md:p-8 rounded-3xl shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#C8956A] to-transparent" />

              <div className="flex items-center gap-2 text-[10px] font-mono text-[#C8956A] tracking-[0.3em] uppercase mb-2">
                <span>Kyoto, Japan</span>
                <span>•</span>
                <span>Completed 2025</span>
              </div>

              <h3 className="text-3xl md:text-4xl font-serif text-white font-light tracking-wide mb-4">
                The Japandi Sanctuary
              </h3>

              <p className="text-xs md:text-sm text-white/75 font-light leading-relaxed mb-6">
                A harmonious fusion of Japanese minimalism and Scandinavian warmth. Centered around natural Kyoto cedar, textured virgin bouclé fabrics, and a serene, decluttered layout that invites meditative mindfulness and restorative rest.
              </p>

              {/* Spatial Specifications */}
              <div className="space-y-3 border-t border-white/10 pt-5 text-xs">
                <div className="flex items-start gap-2">
                  <span className="text-[9px] uppercase tracking-widest font-mono text-white/40 shrink-0 mt-0.5">
                    Materials:
                  </span>
                  <span className="text-[#C8956A] font-serif italic text-xs leading-tight">
                    Quarter-sawn White Oak • Virgin Bouclé • Vals Basalt Stone
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] uppercase tracking-widest font-mono text-white/40">
                    Volume:
                  </span>
                  <span className="text-white/80 font-mono text-[10px]">
                    420 m² // Master Suite & Private Spa
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[9px] font-mono text-[#C8956A] uppercase tracking-widest">
                  <span>Scroll down to enter Project Showcase</span>
                  <span className="animate-bounce">↓</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
