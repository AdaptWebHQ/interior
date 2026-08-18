"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════════════════════════════════════
   KTM-STYLE REEL SLAM-DROP PHYSICS CONSTANTS
   ═══════════════════════════════════════════════════════════════════════════ */
const PHASE1_END   = 0.65;   // scroll progress where fall ends / bounce begins
const PHASE2_START = PHASE1_END;

// Fall
const TILT_START   = 9;      // degrees initial 3D tilt at top of fall

// Bounce — decaying sinusoidal oscillation
const BOUNCE_AMP   = 45;     // px maximum first-bounce height (upward)
const BOUNCE_FREQ  = 16;     // rad / normalised-unit
const BOUNCE_DECAY = 4.8;    // exponential decay rate

// Squash & stretch on each ground impact
const SQUASH_AMP   = 0.06;   // 6% scale pulse per impact

// Rotational wobble during bounce
const WOBBLE_AMP   = 2.2;    // degrees

/* ═══════════════════════════════════════════════════════════════════════════
   EASING HELPERS
   ═══════════════════════════════════════════════════════════════════════════ */
function power2In(t: number): number { return t * t; }

function mapRange(
  inMin: number, inMax: number,
  outMin: number, outMax: number,
  v: number
): number {
  return outMin + ((v - inMin) / (inMax - inMin)) * (outMax - outMin);
}

/* ═══════════════════════════════════════════════════════════════════════════
   PER-FRAME STATE computed from a single progress value 0 → 1
   ═══════════════════════════════════════════════════════════════════════════ */
interface FlipData { x: number; y: number; scale: number }

interface FrameState {
  x: number; y: number; scale: number; scaleX: number; scaleY: number; rotate: number; opacity: number;
  shadowScaleX: number; shadowScaleY: number; shadowOpacity: number;
}

function computeFrame(p: number, flip: FlipData): FrameState {
  /* ── PHASE 1: ACCELERATING FALL ───────────────────────────────────── */
  if (p <= PHASE1_END) {
    const p1  = p / PHASE1_END;          // 0 → 1 within phase
    const ep1 = power2In(p1);             // power2.in — slow start, speeds up

    // Image travels from full hero canvas position → portfolio card rect
    const x      = flip.x * (1 - ep1);
    const y      = flip.y * (1 - ep1);
    const scale  = 1 + (flip.scale - 1) * (1 - ep1);
    const scaleY = 1.04 - 0.04 * ep1;
    const scaleX = 1.0;
    const rotate = TILT_START * (1 - ep1); // tilt straightens as it lands

    // Shadow: faint/tiny while high, grows as image approaches card floor
    const shadowScaleX  = 0.2 + 0.8 * ep1;
    const shadowScaleY  = 0.2 + 0.8 * ep1;
    const shadowOpacity = 0.85 * ep1;

    return { x, y, scale, scaleX, scaleY, rotate, opacity: 1, shadowScaleX, shadowScaleY, shadowOpacity };
  }

  /* ── PHASE 2: IMPACT & REBOUND BOUNCE ─────────────────────────────── */
  const p2 = (p - PHASE2_START) / (1 - PHASE2_START); // 0 → 1 within phase

  // Decaying sinusoidal bounce (negative = upward in CSS)
  const decay   = Math.exp(-BOUNCE_DECAY * p2);
  const bounceY = -BOUNCE_AMP * Math.sin(BOUNCE_FREQ * p2) * decay;

  // Impact signal: peaks at ground-contact moments
  const impactSignal = Math.max(0, Math.cos(BOUNCE_FREQ * p2)) * Math.exp(-3.5 * p2);
  const squash = SQUASH_AMP * impactSignal;
  const scaleY = 1 - squash;
  const scaleX = 1 + squash * 0.6;

  // Rotational wobble: decaying oscillation
  const rotate = WOBBLE_AMP * Math.sin(WOBBLE_AMP * Math.PI * p2) * decay;

  // Opacity: fully visible until 95%, then fades to hand off smoothly to portfolio
  const opacity = p < 0.95 ? 1 : mapRange(0.95, 1.0, 1, 0, p);

  // Shadow: squashes outward on each impact, settles as image docks
  const shadowFade  = Math.max(0, 1 - p2 * 0.1);
  const shadowScaleX = (1 + 0.4 * impactSignal) * shadowFade;
  const shadowScaleY = Math.max(0.2, 1 - 0.3 * impactSignal) * shadowFade;
  const shadowOpacity = (0.75 + 0.2 * impactSignal) * (p < 0.95 ? 1 : mapRange(0.95, 1.0, 1, 0, p));

  return {
    x: 0,
    y: bounceY,
    scale: 1,
    scaleX,
    scaleY,
    rotate,
    opacity,
    shadowScaleX,
    shadowScaleY,
    shadowOpacity,
  };
}

/* ═══════════════════════════════════════════════════════════════════════════
   HERO-TO-PORTFOLIO TRUE CONTINUOUS FLIP COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */
export default function FrameDropTransition() {
  const zoneRef    = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const shadowRef  = useRef<HTMLDivElement>(null);
  const ctxRef     = useRef<gsap.Context | null>(null);

  useEffect(() => {
    const zone    = zoneRef.current;
    const overlay = overlayRef.current;
    const shadow  = shadowRef.current;
    if (!zone || !overlay || !shadow) return;

    /* ── Measure hero canvas image rect ──────────────────────────────── */
    function getHeroRect() {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const ar = 16 / 9;
      const wr = vw / vh;
      let w: number, h: number;
      if (wr > ar) { h = vh; w = h * ar; }
      else         { w = vw; h = w / ar; }
      return { cx: vw / 2, cy: vh / 2, w };
    }

    /* ── Measure card position when portfolio sticky is active ───────── */
    function getCardRect() {
      const sticky = document.querySelector<HTMLElement>("[data-portfolio-sticky]");
      const card   = document.getElementById("portfolio-image-frame");
      if (!sticky || !card) return null;

      const sr = sticky.getBoundingClientRect();
      const cr = card.getBoundingClientRect();

      return {
        left  : cr.left,
        top   : cr.top - sr.top,
        width : cr.width,
        height: cr.height,
        cx    : cr.left + cr.width  / 2,
        cy    : cr.top  - sr.top   + cr.height / 2,
      };
    }

    /* ── FLIP geometry ───────────────────────────────────────────────── */
    let flip: FlipData | null = null;

    function buildFlip(hero: ReturnType<typeof getHeroRect>, card: NonNullable<ReturnType<typeof getCardRect>>): FlipData {
      return {
        x    : hero.cx - card.cx,
        y    : hero.cy - card.cy,
        scale: hero.w  / card.width,
      };
    }

    /* ── Apply card geometry ─────────────────────────────────────────── */
    function applyCardGeometry(card: NonNullable<ReturnType<typeof getCardRect>>) {
      gsap.set(overlay, {
        left  : card.left,
        top   : card.top,
        width : card.width,
        height: card.height,
      });
      gsap.set(shadow, {
        left  : card.left   + card.width  * 0.1,
        top   : card.top    + card.height * 0.75,
        width : card.width  * 0.8,
        height: card.height * 0.35,
      });
    }

    function refresh() {
      const hero = getHeroRect();
      const card = getCardRect();
      if (!card) return;
      applyCardGeometry(card);
      flip = buildFlip(hero, card);
    }

    /* ── Initial hidden state ───────────────────────────────────────── */
    gsap.set(overlay, { zIndex: -1, opacity: 0 });
    gsap.set(shadow,  { zIndex: -2, opacity: 0, scale: 0 });

    /* ── ScrollTrigger factory ──────────────────────────────────────── */
    function initScrollTrigger() {
      refresh();

      ctxRef.current = gsap.context(() => {
        ScrollTrigger.create({
          trigger            : zone,
          start              : "top top",
          end                : "+=120%",
          pin                : true,
          pinSpacing         : true,
          scrub              : 0.35,
          invalidateOnRefresh: true,

          onRefresh: refresh,

          onEnter: () => {
            refresh();
            if (!flip) return;
            const { x, y, scale, rotate } = computeFrame(0, flip);
            gsap.set(overlay, { x, y, scale, rotation: rotate, borderRadius: 0, opacity: 1, zIndex: 40 });
            gsap.set(shadow,  { scale: 0, scaleX: 1, scaleY: 1, opacity: 0, zIndex: 39 });
          },

          onLeave: () => {
            gsap.set(overlay, { zIndex: -1, opacity: 0 });
            gsap.set(shadow,  { zIndex: -2, opacity: 0 });
          },

          onEnterBack: () => {
            if (!flip) { refresh(); }
            gsap.set(overlay, { zIndex: 40, opacity: 1 });
            gsap.set(shadow,  { zIndex: 39, opacity: 1 });
          },

          onLeaveBack: () => {
            gsap.set(overlay, { zIndex: -1, opacity: 0 });
            gsap.set(shadow,  { zIndex: -2, opacity: 0 });
          },

          onUpdate: (self) => {
            if (!flip) return;
            const p = self.progress;
            const f = computeFrame(p, flip);

            gsap.set(overlay, {
              x           : f.x,
              y           : f.y,
              scale       : f.scale,
              scaleX      : f.scaleX,
              scaleY      : f.scaleY,
              rotation    : f.rotate,
              borderRadius: `${28 * (p <= PHASE1_END ? power2In(p / PHASE1_END) : 1)}px`,
              opacity     : f.opacity,
            });

            gsap.set(shadow, {
              scaleX : f.shadowScaleX,
              scaleY : f.shadowScaleY,
              opacity: f.shadowOpacity,
            });
          },
        });
      }, zone ?? undefined);
    }

    /* ── Gate on hero-pin-ready signal ──────────────────────────────── */
    const win = window as Window & { __auraHeroPinReady?: boolean };

    if (win.__auraHeroPinReady) {
      initScrollTrigger();
    } else {
      window.addEventListener("aura-hero-pin-ready", initScrollTrigger, { once: true });
    }

    return () => {
      window.removeEventListener("aura-hero-pin-ready", initScrollTrigger);
      ctxRef.current?.revert();
    };
  }, []);

  return (
    <>
      {/* Pinned 120vh scroll zone for the continuous drop transition */}
      <div
        ref={zoneRef}
        aria-hidden="true"
        className="relative w-full h-screen bg-[#070709] overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#070709] via-black to-[#070709]" />
        
        {/* Subtle Ambient HUD Guidance */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[9px] font-mono text-[#C8956A] uppercase tracking-widest pointer-events-none">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C8956A] animate-ping" />
          <span>SPATIAL TRANSITION // HERO → ARCHITECTURAL SHOWCASE</span>
        </div>
      </div>

      {/*
       * Dynamic Contact Shadow (fixed in viewport during FLIP travel)
       */}
      <div
        ref={shadowRef}
        style={{
          position       : "fixed",
          borderRadius   : "50%",
          background     :
            "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.55) 45%, transparent 70%)",
          filter         : "blur(22px)",
          transformOrigin: "center center",
          willChange     : "transform, opacity",
          pointerEvents  : "none",
        }}
      />

      {/*
       * FLIP Overlay — Starts at 100vw x 100vh Hero Canvas and drops into Portfolio card
       */}
      <div
        ref={overlayRef}
        style={{
          position       : "fixed",
          overflow       : "hidden",
          transformOrigin: "center center",
          willChange     : "transform, opacity",
          pointerEvents  : "none",
          background     : "#0a0a0a",
          border         : "1px solid rgba(200, 149, 106, 0.3)",
          boxShadow      : "0 30px 80px rgba(0,0,0,0.9)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/interio-animation/ezgif-frame-300.jpg"
          alt="Completed Sanctuary"
          style={{
            width         : "100%",
            height        : "100%",
            objectFit     : "cover",
            objectPosition: "center",
            display       : "block",
          }}
        />
      </div>
    </>
  );
}
