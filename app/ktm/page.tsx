"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

interface SpecDetail {
  title: string;
  subtitle: string;
  description: string;
  metrics: { label: string; value: string }[];
  coords: { x: string; y: string }; // Position of the hotspot
}

const SPECS_DATA: Record<string, SpecDetail> = {
  engine: {
    title: "LC8 V-TWIN ENGINE",
    subtitle: "1301cc / 180 HP / 140 Nm",
    description: "The benchmark of V-twin performance. A lightweight masterpiece packing massive torque and lightning-fast throttle response. Features titanium valves, sand-cast crankcases, and resonators for maximum thermal efficiency.",
    metrics: [
      { label: "Displacement", value: "1,301 cc" },
      { label: "Power Output", value: "180 HP @ 9,500 rpm" },
      { label: "Torque", value: "140 Nm @ 8,000 rpm" },
      { label: "Compression Ratio", value: "13.5:1" }
    ],
    coords: { x: "50%", y: "65%" }
  },
  suspension: {
    title: "WP APEX PRO SUSPENSION",
    subtitle: "Semi-Active Damping Technology",
    description: "Fully adjustable WP APEX front forks and rear shock absorber. Utilizes magnetic valves to adjust damping rates in milliseconds based on road conditions, lean angles, and rider mode.",
    metrics: [
      { label: "Fork Diameter", value: "48 mm" },
      { label: "Suspension Travel Front", value: "125 mm" },
      { label: "Suspension Travel Rear", value: "140 mm" },
      { label: "Damping Adjustment", value: "Auto / Custom Mode" }
    ],
    coords: { x: "27%", y: "45%" }
  },
  brakes: {
    title: "BREMBO STYLEMA MONOBLOCS",
    subtitle: "Ultimate Stopping Power & Control",
    description: "Dual Brembo Stylema four-piston radial calipers clamping down on 320mm floating discs. Offers immediate bite, linear feedback, and exceptional fade resistance under extreme track conditions.",
    metrics: [
      { label: "Front Calipers", value: "Brembo Stylema 4-Piston" },
      { label: "Discs Front", value: "Twin 320 mm Floating" },
      { label: "ABS Type", value: "Cornering ABS / Supermoto Mode" },
      { label: "Master Cylinder", value: "Radial PR16/21" }
    ],
    coords: { x: "23%", y: "73%" }
  },
  chassis: {
    title: "TRELLIS STEEL FRAME",
    subtitle: "Chrome-Moly Alloy Construction",
    description: "Laser-cut chrome-molybdenum steel trellis frame optimized for stiffness, feedback, and ultra-light weight. Uses the engine as a stressed member, delivering razor-sharp cornering stability.",
    metrics: [
      { label: "Frame Type", value: "Choly Steel Trellis" },
      { label: "Dry Weight", value: "189 kg" },
      { label: "Wheelbase", value: "1,497 mm" },
      { label: "Steering Head Angle", value: "64.8°" }
    ],
    coords: { x: "53%", y: "42%" }
  }
};

export default function KtmShowcase() {
  const [dropState, setDropState] = useState<"falling" | "landed" | "idle">("falling");
  const [activeTab, setActiveTab] = useState<string>("none");
  const [assemblyProgress, setAssemblyProgress] = useState<number>(0);
  const scrollSectionRef = useRef<HTMLDivElement>(null);

  // Trigger drop animation on load or reset
  const triggerDrop = () => {
    setDropState("idle");
    setTimeout(() => {
      setDropState("falling");
    }, 50);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDropState("falling");
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  // Scroll handler for assembly progress
  useEffect(() => {
    const handleScroll = () => {
      if (!scrollSectionRef.current) return;
      const rect = scrollSectionRef.current.getBoundingClientRect();
      const sectionHeight = rect.height - window.innerHeight;
      const scrolled = -rect.top;
      
      if (scrolled >= 0 && scrolled <= sectionHeight) {
        const progress = Math.min(Math.max(scrolled / sectionHeight, 0), 1);
        setAssemblyProgress(progress);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0d0d0c] text-white font-sans selection:bg-[#ff6600] selection:text-black">
      {/* Premium Navbar */}
      <header className="sticky top-0 z-50 bg-[#0d0d0c]/85 backdrop-blur-md border-b border-white/5 py-4 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xs tracking-[0.2em] text-white/50 hover:text-white uppercase transition-colors">
              ← Back to Studio
            </Link>
            <span className="h-4 w-[1px] bg-white/10" />
            <span className="text-xl font-black tracking-tighter text-[#ff6600]">
              KTM <span className="text-white font-light font-serif italic">LABS</span>
            </span>
          </div>
          <nav className="flex items-center gap-6">
            <span className="text-[10px] text-white/40 tracking-widest uppercase hidden sm:inline">
              Super Duke R Prototype
            </span>
            <button
              onClick={triggerDrop}
              className="px-4 py-1.5 border border-[#ff6600] text-[#ff6600] hover:bg-[#ff6600] hover:text-black text-xs font-semibold tracking-wider uppercase rounded-full transition-all duration-300"
            >
              Reset Drop
            </button>
          </nav>
        </div>
      </header>

      {/* Hero: Physical Drop Showcase Section */}
      <section className="relative w-full min-h-[85vh] flex flex-col justify-center items-center overflow-hidden py-12 px-6">
        {/* Subtle orange ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#ff6600]/10 rounded-full filter blur-[120px] pointer-events-none" />

        <div className="max-w-5xl w-full text-center z-10 flex flex-col items-center">
          <span className="text-[#ff6600] text-xs font-semibold tracking-[0.4em] uppercase mb-4 animate-pulse">
            01 / INTERACTIVE DYNAMICS
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight mb-8">
            PHYSICAL DROP <br className="hidden sm:inline" />
            <span className="text-[#ff6600]">EXPERIENCE</span>
          </h1>

          {/* Canvas-like animation stage */}
          <div className="relative w-full max-w-4xl h-[350px] md:h-[450px] flex items-center justify-center mt-6">
            {/* Spotlight shadow that scales with gravity bounce */}
            <div
              className={`absolute bottom-[10%] w-[70%] md:w-[60%] h-[15px] bg-black/80 rounded-full blur-[8px] transition-all duration-[2000ms] ${
                dropState === "falling"
                  ? "animate-shadow-drop"
                  : "scale-100 opacity-90"
              }`}
            />

            {/* Motorcycle Image container with spring-like drop animation */}
            <div
              className={`relative w-[90%] md:w-[80%] h-full flex items-center justify-center ${
                dropState === "falling"
                  ? "animate-bike-drop"
                  : ""
              }`}
              onAnimationEnd={() => setDropState("landed")}
            >
              <img
                src="/ktm-assembled.jpg"
                alt="KTM Assembled Bike"
                className="w-full h-auto object-contain select-none pointer-events-none drop-shadow-2xl"
              />
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center gap-3">
            <p className="text-white/60 text-xs tracking-wider max-w-md uppercase font-light">
              Observe the landing impact, suspension compression, and proportional casting shadow.
            </p>
            <button
              id="btn-re-drop"
              onClick={triggerDrop}
              className="text-[#ff6600] hover:text-[#ff8533] text-[10px] tracking-[0.3em] font-semibold uppercase flex items-center gap-2 mt-2 group"
            >
              <span>Replay Gravity Drop</span>
              <span className="group-hover:translate-y-0.5 transition-transform">↓</span>
            </button>
          </div>
        </div>
      </section>

      {/* Specs Explorer: Product Showcase / Exploded View Section */}
      <section className="border-t border-white/5 py-24 px-6 md:px-12 bg-[#0a0a09]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-12">
            <div className="max-w-xl">
              <span className="text-[#ff6600] text-xs font-semibold tracking-[0.4em] uppercase mb-4 block">
                02 / EXPLODED PARTS SCHEMATIC
              </span>
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight">
                INTERACTIVE <br />
                <span className="text-[#ff6600]">SPECIFICATIONS</span>
              </h2>
            </div>
            
            {/* Interactive Tabs */}
            <div className="flex flex-wrap gap-3 w-full lg:w-auto">
              {Object.keys(SPECS_DATA).map((key) => {
                const isActive = activeTab === key;
                return (
                  <button
                    key={key}
                    onClick={() => setActiveTab(isActive ? "none" : key)}
                    className={`px-5 py-3 border text-xs font-bold tracking-widest uppercase transition-all duration-300 ${
                      isActive
                        ? "bg-[#ff6600] border-[#ff6600] text-black"
                        : "bg-transparent border-white/10 hover:border-[#ff6600] hover:text-[#ff6600]"
                    }`}
                  >
                    {key.replace("-", " ")}
                  </button>
                );
              })}
              {activeTab !== "none" && (
                <button
                  onClick={() => setActiveTab("none")}
                  className="px-5 py-3 text-xs font-bold text-white/50 hover:text-white uppercase tracking-widest"
                >
                  Assembled View
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            {/* Main Interactive Image Frame (Columns 1 & 2) */}
            <div className="lg:col-span-2 relative aspect-[16/9] w-full bg-[#111110] border border-white/5 rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center p-4">
              
              {/* Assembled Image */}
              <div
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  activeTab === "none" ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
              >
                <img
                  src="/ktm-assembled.jpg"
                  alt="KTM Assembled"
                  className="w-full h-full object-contain p-4"
                />
              </div>

              {/* Exploded Image */}
              <div
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  activeTab !== "none" ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
              >
                <img
                  src="/ktm-exploded.jpg"
                  alt="KTM Exploded view"
                  className="w-full h-full object-contain p-4"
                />
              </div>

              {/* Hotspot Indicators */}
              {activeTab !== "none" && (
                <div
                  className="absolute z-20 pointer-events-none transition-all duration-500 ease-out"
                  style={{
                    left: SPECS_DATA[activeTab].coords.x,
                    top: SPECS_DATA[activeTab].coords.y,
                  }}
                >
                  <span className="flex h-5 w-5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff6600] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-5 w-5 bg-[#ff6600] border-2 border-white"></span>
                  </span>
                </div>
              )}
            </div>

            {/* Specifications Card (Column 3) */}
            <div className="relative min-h-[300px] flex flex-col justify-center">
              <div className="absolute inset-0 bg-[#ff6600]/5 border border-[#ff6600]/20 rounded-2xl p-8 backdrop-blur-sm pointer-events-none" />
              
              {activeTab === "none" ? (
                <div className="relative z-10 p-8 text-center lg:text-left">
                  <h3 className="text-xl font-bold tracking-wider text-white mb-3">
                    SELECT A COMPONENT
                  </h3>
                  <p className="text-white/50 text-xs leading-relaxed font-light">
                    Click any tab at the top to split the fairings and view individual core assemblies, chassis stiffeners, or high-performance metrics.
                  </p>
                </div>
              ) : (
                <div className="relative z-10 p-8 animate-fade-in">
                  <span className="text-[#ff6600] text-[10px] tracking-[0.3em] font-bold block mb-2">
                    COMPONENT SPECIFICATIONS
                  </span>
                  <h3 className="text-2xl font-black uppercase text-white mb-1">
                    {SPECS_DATA[activeTab].title}
                  </h3>
                  <p className="text-xs text-white/50 tracking-wider mb-4 font-mono font-semibold">
                    {SPECS_DATA[activeTab].subtitle}
                  </p>
                  <p className="text-xs text-white/70 leading-relaxed font-light mb-6">
                    {SPECS_DATA[activeTab].description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
                    {SPECS_DATA[activeTab].metrics.map((m, idx) => (
                      <div key={idx} className="flex flex-col">
                        <span className="text-[9px] uppercase tracking-wider text-white/40">
                          {m.label}
                        </span>
                        <span className="text-xs font-bold text-white tracking-wide mt-0.5">
                          {m.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Assembly Slider / Scroll Section */}
      <section ref={scrollSectionRef} className="relative w-full h-[300vh] bg-black">
        {/* Sticky visualization canvas */}
        <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex flex-col justify-center items-center px-6">
          <div className="max-w-3xl text-center mb-6 z-10">
            <span className="text-[#ff6600] text-xs font-semibold tracking-[0.4em] uppercase mb-3 block">
              03 / ASSEMBLY CONTROL
            </span>
            <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-2">
              EXPLOSION CONTROL
            </h3>
            <p className="text-xs text-white/50 tracking-wide">
              Scroll down or drag the slider below to control the body panels&apos; alignment.
            </p>
          </div>

          {/* Layered assembly viewer */}
          <div className="relative w-full max-w-4xl aspect-[16/9] flex items-center justify-center rounded-2xl overflow-hidden border border-white/5 bg-[#0a0a09] p-4">
            
            {/* Base frame (Exploded components always underneath) */}
            <div className="absolute inset-0 z-0">
              <img
                src="/ktm-exploded.jpg"
                alt="Exploded Layout"
                className="w-full h-full object-contain p-4 opacity-80"
              />
            </div>

            {/* Assembled components layered on top with opacity/clip-path mapping */}
            <div 
              className="absolute inset-0 z-10 transition-opacity duration-300"
              style={{
                opacity: Math.max(0, 1 - assemblyProgress),
                filter: `blur(${assemblyProgress * 5}px)`
              }}
            >
              <img
                src="/ktm-assembled.jpg"
                alt="Assembled Layout"
                className="w-full h-full object-contain p-4"
              />
            </div>
            
            {/* Center crosshair design elements */}
            <div className="absolute inset-4 border border-white/5 pointer-events-none rounded-xl" />
            <div className="absolute top-1/2 left-4 right-4 h-[1px] bg-white/5 pointer-events-none" />
            <div className="absolute left-1/2 top-4 bottom-4 w-[1px] bg-white/5 pointer-events-none" />
          </div>

          {/* Manual control slider container */}
          <div className="max-w-md w-full mt-8 z-10 flex flex-col items-center gap-2">
            <div className="w-full flex justify-between text-[10px] tracking-widest text-white/50 uppercase font-mono">
              <span>Assembled (0%)</span>
              <span className="text-[#ff6600] font-bold">
                {Math.round(assemblyProgress * 100)}% Exploded
              </span>
              <span>Exploded (100%)</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={assemblyProgress}
              onChange={(e) => setAssemblyProgress(parseFloat(e.target.value))}
              className="w-full accent-[#ff6600] bg-white/10 h-1 rounded-full cursor-pointer transition-all focus:outline-none"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#080807] py-12 px-6 md:px-12 text-center text-white/40 text-xs">
        <p className="tracking-widest uppercase">
          KTM SHOWCASE DEMO • POWERED BY ANTIGRAVITY & NEXT.JS
        </p>
      </footer>

      {/* Custom Styles */}
      <style jsx global>{`
        @keyframes shadow-drop {
          0% {
            transform: scale(0.1);
            opacity: 0.1;
            filter: blur(16px);
          }
          70% {
            transform: scale(1.05);
            opacity: 0.95;
            filter: blur(6px);
          }
          85% {
            transform: scale(0.95);
            opacity: 0.85;
            filter: blur(9px);
          }
          100% {
            transform: scale(1);
            opacity: 0.9;
            filter: blur(8px);
          }
        }

        @keyframes bike-drop {
          0% {
            transform: translateY(-80vh) scaleY(1.05);
            animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
          }
          65% {
            transform: translateY(0) scaleY(1);
            animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
          }
          72% {
            transform: translateY(-80px) scaleY(1.03);
            animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
          }
          82% {
            transform: translateY(0) scaleY(0.93); /* Tire Squish / land compression */
            animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
          }
          90% {
            transform: translateY(-20px) scaleY(1.01);
            animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
          }
          96% {
            transform: translateY(0) scaleY(0.97); /* Minor second bounce compression */
            animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
          }
          100% {
            transform: translateY(0) scaleY(1);
          }
        }

        .animate-shadow-drop {
          animation: shadow-drop 2.2s forwards;
        }

        .animate-bike-drop {
          animation: bike-drop 2.2s forwards;
        }

        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
