"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MATERIAL_THEMES } from "./InteriorModel";

gsap.registerPlugin(ScrollTrigger);

interface SectionsProps {
  activeTheme: keyof typeof MATERIAL_THEMES;
  setTheme: (t: keyof typeof MATERIAL_THEMES) => void;
  scrollProgress: number;
}

export default function Sections({ activeTheme, setTheme, scrollProgress }: SectionsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Word-by-word reveal animations for all headlines in sections
    const headings = containerRef.current?.querySelectorAll(".split-reveal");
    if (!headings) return;

    headings.forEach((heading) => {
      const words = heading.textContent?.split(" ") || [];
      heading.innerHTML = words
        .map(
          (word) =>
            `<span class="inline-block overflow-hidden mr-3"><span class="reveal-word inline-block translate-y-[110%]">${word}</span></span>`
        )
        .join("");

      gsap.fromTo(
        heading.querySelectorAll(".reveal-word"),
        { translateY: "110%" },
        {
          translateY: "0%",
          stagger: 0.06,
          duration: 0.8,
          ease: "power4.out",
          scrollTrigger: {
            trigger: heading,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    // Animate stats counter triggers
    const countElements = containerRef.current?.querySelectorAll(".counter-stat");
    countElements?.forEach((el) => {
      const targetVal = parseInt(el.getAttribute("data-target") || "0", 10);
      const isKelvin = el.getAttribute("data-unit") === "K";
      const obj = { val: 0 };
      
      gsap.to(obj, {
        val: targetVal,
        duration: 2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
        },
        onUpdate: () => {
          el.textContent = Math.round(obj.val).toLocaleString() + (isKelvin ? "K" : "");
        },
      });
    });
  }, []);

  return (
    <div ref={containerRef} className="relative z-10 w-full">
      
      {/* 1. HERO */}
      <section className="min-h-screen w-full flex flex-col justify-center items-start px-6 md:px-16 lg:px-28 relative">
        <div className="max-w-4xl">
          <span className="text-[#D39E82] text-xs font-bold tracking-[0.4em] uppercase mb-6 block animate-pulse">
            THE OBSIDIAN LOUNGE
          </span>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-sans font-black tracking-tight text-white uppercase leading-[0.95] mb-8">
            <span className="split-reveal block">FORM &</span>
            <span className="split-reveal block text-transparent stroke-text">SILENCE</span>
          </h1>
          <p className="max-w-xl text-sm md:text-base text-white/50 font-light leading-relaxed mb-10">
            A sanctuary designed at the intersection of raw material expression and absolute minimal architecture. Experience a living canvas that transforms with the sun.
          </p>
          <div className="flex gap-6 items-center">
            <span className="h-[1px] w-12 bg-white/20" />
            <span className="text-[10px] tracking-[0.3em] uppercase text-white/40">
              Scroll down to enter
            </span>
          </div>
        </div>
      </section>

      {/* 2. LIGHTING & AMBIANCE */}
      <section className="min-h-screen w-full flex flex-col justify-center items-end px-6 md:px-16 lg:px-28 relative text-right">
        <div className="max-w-xl bg-black/40 backdrop-blur-md p-8 md:p-12 rounded-3xl border border-white/5 shadow-2xl">
          <span className="text-[#D39E82] text-[10px] tracking-[0.3em] font-semibold uppercase mb-4 block">
            CHAPTER 01 / ILLUMINATION
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-6 split-reveal">
            LIGHT AS SCULPTURE
          </h2>
          <p className="text-xs md:text-sm text-white/60 leading-relaxed font-light mb-8">
            An engineered pendant fixture casts a soft, rhythmic dome of ambient light, contrasting starkly with deep architectural shadows to sculpt physical volume.
          </p>

          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/10 text-left">
            <div>
              <span className="text-[9px] uppercase tracking-wider text-white/40 block mb-1">
                Luminous Output
              </span>
              <span className="counter-stat text-lg md:text-xl font-bold text-white" data-target="2400">
                0
              </span>
              <span className="text-[10px] text-[#D39E82] font-semibold ml-1">LM</span>
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-wider text-white/40 block mb-1">
                Color Temp
              </span>
              <span className="counter-stat text-lg md:text-xl font-bold text-white" data-target="2700" data-unit="K">
                0
              </span>
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-wider text-white/40 block mb-1">
                Smart Zones
              </span>
              <span className="counter-stat text-lg md:text-xl font-bold text-white" data-target="4">
                0
              </span>
              <span className="text-[10px] text-[#D39E82] font-semibold ml-1">ZONES</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MATERIALS & LAYOUT */}
      <section className="min-h-screen w-full flex flex-col justify-center items-start px-6 md:px-16 lg:px-28 relative">
        <div className="max-w-xl bg-black/40 backdrop-blur-md p-8 md:p-12 rounded-3xl border border-white/5 shadow-2xl">
          <span className="text-[#D39E82] text-[10px] tracking-[0.3em] font-semibold uppercase mb-4 block">
            CHAPTER 02 / STRUCTURE
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-6 split-reveal">
            TACTILE HONESTY
          </h2>
          <p className="text-xs md:text-sm text-white/60 leading-relaxed font-light mb-8">
            An aerial perspective of the layout exposes the interface of raw material textures: linear wood partitions, cast concrete slabs, and polished stone layers.
          </p>

          {/* Graphical Specs with leader lines */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between group cursor-help">
              <span className="text-xs text-white/70 font-medium">01. Trellis Partition</span>
              <span className="w-12 h-[1px] bg-white/20 group-hover:w-20 transition-all duration-300" />
              <span className="text-xs text-[#D39E82]">Japandi Oak</span>
            </div>
            <div className="flex items-center justify-between group cursor-help">
              <span className="text-xs text-white/70 font-medium">02. Floor Foundation</span>
              <span className="w-12 h-[1px] bg-white/20 group-hover:w-20 transition-all duration-300" />
              <span className="text-xs text-[#D39E82]">Polished Stone</span>
            </div>
            <div className="flex items-center justify-between group cursor-help">
              <span className="text-xs text-white/70 font-medium">03. Suspended Slab</span>
              <span className="w-12 h-[1px] bg-white/20 group-hover:w-20 transition-all duration-300" />
              <span className="text-xs text-[#D39E82]">Brutalist Concrete</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. METICULOUS DETAIL */}
      <section className="min-h-screen w-full flex flex-col justify-center items-end px-6 md:px-16 lg:px-28 relative text-right">
        <div className="max-w-xl bg-black/40 backdrop-blur-md p-8 md:p-12 rounded-3xl border border-white/5 shadow-2xl">
          <span className="text-[#D39E82] text-[10px] tracking-[0.3em] font-semibold uppercase mb-4 block">
            CHAPTER 03 / COMFORT
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-6 split-reveal">
            LOW-PROFILE COMFORT
          </h2>
          <p className="text-xs md:text-sm text-white/60 leading-relaxed font-light mb-6">
            Bespoke low lounge seating paired with monolith coffee tables provides a grounded weight to the space, directing eyesight outward into empty room frames.
          </p>
          <div className="text-left bg-white/5 border border-white/5 p-4 rounded-xl">
            <span className="text-[10px] text-[#D39E82] uppercase tracking-wider font-bold block mb-1">
              Ergonomics & Frame
            </span>
            <p className="text-[11px] text-white/40 leading-relaxed">
              Crafted from continuous solid metal frame cores supporting premium bouclé cushions with high-density foam filling.
            </p>
          </div>
        </div>
      </section>

      {/* 5. COLORWAY CONFIGURATOR */}
      <section className="min-h-screen w-full flex flex-col justify-center items-start px-6 md:px-16 lg:px-28 relative">
        <div className="max-w-xl bg-black/40 backdrop-blur-md p-8 md:p-12 rounded-3xl border border-white/5 shadow-2xl">
          <span className="text-[#D39E82] text-[10px] tracking-[0.3em] font-semibold uppercase mb-4 block">
            CHAPTER 04 / INTERACTION
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-4 split-reveal">
            CHOOSE FINISH
          </h2>
          <p className="text-xs md:text-sm text-white/60 leading-relaxed font-light mb-8">
            Adapt the Obsidian Lounge to your aesthetic preference. Instantly switch colors to shift the room&apos;s mood from bright organic warmth to dark brutalism.
          </p>

          {/* Colorway Swatches */}
          <div className="flex gap-6 items-center">
            {(["walnut", "concrete", "obsidian"] as const).map((key) => {
              const active = activeTheme === key;
              return (
                <button
                  key={key}
                  onClick={() => setTheme(key)}
                  className={`relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                    active ? "border-[#D39E82] scale-110" : "border-white/10 hover:border-white/40"
                  }`}
                >
                  <span
                    className="w-8 h-8 rounded-full shadow-inner"
                    style={{
                      backgroundColor:
                        key === "walnut"
                          ? "#7D5C43"
                          : key === "concrete"
                          ? "#9CA3AF"
                          : "#1A1A1A",
                    }}
                  />
                </button>
              );
            })}
          </div>
          <span className="text-[10px] tracking-widest uppercase text-white/30 mt-4 block font-mono">
            Active: {activeTheme.toUpperCase()}
          </span>
        </div>
      </section>

      {/* 6. SPECS + CTA */}
      <section className="min-h-screen w-full flex flex-col justify-center items-center px-6 md:px-16 relative">
        <div className="max-w-3xl w-full bg-black/60 backdrop-blur-xl border border-white/5 p-8 md:p-14 rounded-3xl shadow-2xl text-center">
          <span className="text-[#D39E82] text-xs font-bold tracking-[0.4em] uppercase mb-4 block">
            PROJECT SPECS & TOUR
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-10">
            THE SYSTEM SUMMARY
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-left mb-12 border-b border-white/5 pb-10">
            <div>
              <span className="text-[9px] uppercase tracking-wider text-white/30 block mb-1">
                Area
              </span>
              <span className="text-sm font-bold text-white">1,240 SQ FT</span>
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-wider text-white/30 block mb-1">
                Wood Type
              </span>
              <span className="text-sm font-bold text-white">Solid Walnut</span>
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-wider text-white/30 block mb-1">
                Ceiling Height
              </span>
              <span className="text-sm font-bold text-white">12.5 FT</span>
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-wider text-white/30 block mb-1">
                Controls
              </span>
              <span className="text-sm font-bold text-white">Smart Home IP</span>
            </div>
          </div>

          <a
            href="mailto:design@theobsidianlounge.com"
            className="inline-block px-10 py-5 bg-[#D39E82] hover:bg-[#c28e73] text-black text-xs font-bold tracking-[0.25em] uppercase rounded-full shadow-lg transition-all duration-300 hover:scale-105"
          >
            Schedule a Private Tour
          </a>
        </div>
      </section>

      {/* Right Edge Scroll Progress Line */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 w-[1px] h-48 bg-white/10 z-50 pointer-events-none hidden md:block">
        <div
          className="w-full bg-[#D39E82] transition-all duration-100 ease-out"
          style={{ height: `${scrollProgress * 100}%` }}
        />
      </div>

      <style jsx>{`
        .stroke-text {
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.4);
        }
      `}</style>
    </div>
  );
}
