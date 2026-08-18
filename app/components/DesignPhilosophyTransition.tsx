"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PHILOSOPHY_STEPS = [
  {
    tag: "THE PHILOSOPHY OF SPACE",
    headline: "Architecture builds the walls.\nInterior design gives it a soul.",
    caption:
      "A house is merely geometry until proportion, ambient light, and tactile materials transform cold structures into an intimate sanctuary.",
  },
  {
    tag: "TACTILE HARMONY",
    headline: "Every texture dictates\nhow you live and feel.",
    caption:
      "From the warmth of natural white oak to the quiet weight of basalt stone, we craft sensory environments that calm the mind and elevate everyday rituals.",
  },
  {
    tag: "BESPOKE EXECUTION",
    headline: "Where blueprint vision\nbecomes a living masterpiece.",
    caption:
      "Explore how our holistic design process turns architectural blueprints into timeless living environments tailored to your lifestyle.",
  },
];

export default function DesignPhilosophyTransition() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardFrameRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const cardFrame = cardFrameRef.current;
    const shadow = shadowRef.current;
    if (!section || !cardFrame || !shadow) return;

    // 3.5x viewport height of scroll travel for cinematic drop
    const scrollTravel = window.innerHeight * 3.5;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: `+=${scrollTravel}`,
        pin: true,
        pinSpacing: true,
        scrub: 0.5,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress; // 0 to 1

          // Step index (0, 1, 2)
          const stepIndex = Math.min(
            Math.floor(p * PHILOSOPHY_STEPS.length),
            PHILOSOPHY_STEPS.length - 1
          );
          setActiveStep(stepIndex >= 0 ? stepIndex : 0);

          const vh = window.innerHeight;

          // ── 1. POP OUT & LIFT OFF (p: 0 -> 0.20) ──
          // Image lifts off screen toward viewer (scale: 1.0 -> 1.15)
          // Shadow darkens and spreads out to sell 3D depth
          const popP = gsap.utils.clamp(0, 1, p / 0.2);
          const popEase = gsap.parseEase("power2.out")(popP);
          const popScale = 1.0 + 0.12 * popEase;

          // ── 2. CONTINUOUS CENTER DOWNWARD DROP (p: 0 -> 1.0) ──
          // Frame travels from high up (-28vh) straight down through center to (+28vh)
          const dropEase = gsap.parseEase("power1.inOut")(p);
          const startY = -vh * 0.28;
          const endY = vh * 0.26;
          const curY = startY + (endY - startY) * dropEase;

          // Scale settles from popped size (1.12) down to framed card size (0.92)
          const curScale = gsap.utils.interpolate(popScale, 0.92, dropEase);

          // Border radius curves from sharp (0px) to luxury card (32px)
          const curRadius = gsap.utils.interpolate(4, 32, dropEase);

          // Subtle 3D tilt as it drops through air
          const curRotateX = gsap.utils.interpolate(6, -2, dropEase);

          gsap.set(cardFrame, {
            y: curY,
            scale: curScale,
            rotationX: curRotateX,
            borderRadius: `${curRadius}px`,
            transformOrigin: "center center",
            willChange: "transform, border-radius",
          });

          // ── 3. DYNAMIC AMBIENT CAST SHADOW ──
          // Cast shadow tracks beneath the frame, spreading and softening as it drops
          const shadowOpacity = gsap.utils.interpolate(0.3, 0.85, popEase) * (1 - p * 0.2);
          const shadowScale = gsap.utils.interpolate(0.8, 1.25, dropEase);

          gsap.set(shadow, {
            y: curY + 60,
            scale: shadowScale,
            opacity: shadowOpacity,
          });
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="philosophy"
      ref={sectionRef}
      className="relative w-full h-screen bg-[#08080a] border-t border-white/5 overflow-hidden flex flex-col items-center justify-center"
      style={{ perspective: "1200px" }}
    >
      {/* Ambient background atmosphere */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#C8956A]/6 rounded-full blur-[160px] pointer-events-none" />

      {/* ── TOP HEADLINE / STORYTELLING OVERLAY ──────────────────────────── */}
      <div className="absolute top-8 md:top-12 left-0 w-full px-6 md:px-12 text-center z-30 pointer-events-none">
        <div className="max-w-3xl mx-auto">
          {PHILOSOPHY_STEPS.map((step, index) => {
            const isActive = index === activeStep;
            return (
              <div
                key={index}
                className={`transition-all duration-700 transform ${
                  isActive
                    ? "opacity-100 translate-y-0 filter blur-none relative pointer-events-auto"
                    : "opacity-0 -translate-y-4 filter blur-xs absolute inset-x-0 pointer-events-none"
                }`}
              >
                <span className="text-[10px] md:text-xs font-mono tracking-[0.45em] text-[#C8956A] font-bold uppercase mb-2 block">
                  {step.tag}
                </span>

                <h2 className="text-xl md:text-3xl lg:text-4xl font-serif text-white font-light tracking-wide leading-snug mb-2 whitespace-pre-line">
                  {step.headline}
                </h2>

                <p className="text-xs md:text-sm text-white/60 leading-relaxed font-light max-w-xl mx-auto hidden md:block">
                  {step.caption}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── CENTER: POP-OUT & DOWNWARD DROPPING IMAGE ────────────────────── */}
      <div className="relative z-20 flex flex-col items-center justify-center w-full max-w-4xl px-6">
        
        {/* Dynamic ambient cast shadow beneath the dropping canvas */}
        <div
          ref={shadowRef}
          className="absolute w-[80%] h-36 bg-black/90 rounded-full blur-2xl pointer-events-none will-change-transform"
          style={{ transformOrigin: "center center" }}
        />

        {/* The Popping & Dropping Canvas Frame */}
        <div
          ref={cardFrameRef}
          className="relative w-full aspect-[16/9] md:aspect-[16/10] bg-[#111114] overflow-hidden border border-[#C8956A]/25 shadow-[0_35px_90px_rgba(0,0,0,0.9),0_0_40px_rgba(200,149,106,0.12)] will-change-transform"
          style={{
            borderRadius: "16px",
            transformStyle: "preserve-3d",
          }}
        >
          <Image
            src="/interio-animation/ezgif-frame-300.jpg"
            alt="Bespoke Luxury Interior Sanctuary"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 95vw, 1000px"
          />
          
          {/* Subtle cinematic gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

          {/* Luxury frame corner accents */}
          <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-[#C8956A]/60 pointer-events-none" />
          <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-[#C8956A]/60 pointer-events-none" />
          <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-[#C8956A]/60 pointer-events-none" />
          <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-[#C8956A]/60 pointer-events-none" />

          {/* Status pill on image */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5 bg-black/70 backdrop-blur-md px-4 py-1.5 rounded-full border border-[#C8956A]/30 text-[9px] font-mono tracking-widest text-[#C8956A] uppercase shadow-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C8956A] animate-pulse" />
            <span>The Completed Sanctuary</span>
            <span>•</span>
            <span>0{activeStep + 1}/03</span>
          </div>
        </div>
      </div>

      {/* ── BOTTOM: DESCENT PROGRESS & SCROLL CUE ───────────────────────── */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 pointer-events-none">
        <div className="flex items-center gap-2">
          {PHILOSOPHY_STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-500 ${
                i === activeStep ? "w-8 bg-[#C8956A]" : "w-2 bg-white/20"
              }`}
            />
          ))}
        </div>
        <span className="text-white/30 text-[9px] uppercase tracking-[0.35em] font-mono mt-1">
          Dropping to Project Showcase
        </span>
      </div>
    </section>
  );
}
