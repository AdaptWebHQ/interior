"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PortfolioGrid from "./components/PortfolioGrid";
import AboutServices from "./components/AboutServices";

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────────────────────────────────────
   PRODUCTION DATA: STORY, PROJECTS & MATERIAL ATELIER
   ───────────────────────────────────────────────────────────────────────────── */

const TOTAL_FRAMES = 300;

interface StoryChapter {
  number: string;
  eyebrow: string;
  title: string;
  tag: string;
  spec: string;
  description: string;
}

const STORY_CHAPTERS: StoryChapter[] = [
  {
    number: "01",
    eyebrow: "Phase 01 // Conception & Architecture",
    title: "We Design\nthe Space",
    tag: "BLUEPRINT & SPATIAL FLOW",
    spec: "ORIENTATION: 35.0116° N // NATURAL ILLUMINATION CALCULATION",
    description:
      "Every masterpiece begins in silent contemplation. We sculpt volume, orient natural light, and carve spatial flow long before structural materials meet the ground.",
  },
  {
    number: "02",
    eyebrow: "Phase 02 // Structural Rigor",
    title: "We Build\nthe Foundation",
    tag: "MONOLITHIC JOINERY",
    spec: "MATERIAL: MONOLITHIC CONCRETE // ARCHITECTURAL STEEL",
    description:
      "Precision-engineered monolithic concrete, architectural steel, and raw joinery. Uncompromising structural integrity crafted to endure for generations.",
  },
  {
    number: "03",
    eyebrow: "Phase 03 // Tactile Atmosphere",
    title: "We Shape\nthe Atmosphere",
    tag: "LIME WASH & VOLCANIC STONE",
    spec: "SURFACES: HAND-TROWELED BASALT // 2700K CIRCADIAN LUMINAIRES",
    description:
      "Surfaces breathe through hand-troweled lime wash, textured basalt stone, and recessed linear luminaires tuned to natural circadian rhythms.",
  },
  {
    number: "04",
    eyebrow: "Phase 04 // Living Sanctuary",
    title: "We Bring It\nto Life",
    tag: "JAPANDI RESTORATIVE LIVING",
    spec: "CURATION: HOKKAIDO WHITE OAK // UNBLEACHED BOUCLÉ // SCULPTURAL FLORA",
    description:
      "The definitive composition. Bespoke walnut joinery, organic bouclé upholstery, and sculptural flora curated into an intimate, restorative residence.",
  },
];

interface MaterialItem {
  code: string;
  name: string;
  origin: string;
  texture: string;
  highlight: string;
  image: string;
}

const MATERIAL_ATELIER: MaterialItem[] = [
  {
    code: "MAT-01",
    name: "Kyoto White Oak",
    origin: "Hokkaido, Japan",
    texture: "Quarter-sawn, matte organic wax finish",
    highlight: "Sustainably harvested 120-year old timber with straight linear grain.",
    image: "/portfolio-images/biophilic_oasis.jpg",
  },
  {
    code: "MAT-02",
    name: "Nero Marquina",
    origin: "Markina, Spain",
    texture: "Honed velvet finish, natural calcic veining",
    highlight: "Deep obsidian marble quarried from single high-density blocks.",
    image: "/portfolio-images/marble_kitchen.jpg",
  },
  {
    code: "MAT-03",
    name: "Swiss Basalt Stone",
    origin: "Vals, Switzerland",
    texture: "Thermal-flamed and brushed stone",
    highlight: "Dense volcanic stone retaining geothermal warmth and acoustic serenity.",
    image: "/portfolio-images/minimalist_bathroom.jpg",
  },
  {
    code: "MAT-04",
    name: "Organic Bouclé",
    origin: "Biella, Italy",
    texture: "Heavyweight unbleached virgin wool",
    highlight: "Artisanal loomed loops offering extreme tactile comfort and acoustic dampening.",
    image: "/interio-animation/ezgif-frame-300.jpg",
  },
  {
    code: "MAT-05",
    name: "Architectural Bronze",
    origin: "Florence, Italy",
    texture: "Hand-rubbed patinated brass",
    highlight: "Living metal fixtures that age gracefully with atmospheric exposure.",
    image: "/portfolio-images/brutalist_bedroom.jpg",
  },
];

function padFrame(num: number): string {
  return String(num).padStart(3, "0");
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN PAGE COMPONENT (TypeScript)
   ───────────────────────────────────────────────────────────────────────────── */

export default function Home() {
  const mainRef = useRef<HTMLDivElement | null>(null);
  const preloaderTopRef = useRef<HTMLDivElement | null>(null);
  const preloaderBottomRef = useRef<HTMLDivElement | null>(null);
  const preloaderContentRef = useRef<HTMLDivElement | null>(null);

  // Custom Cursor Refs
  const cursorDotRef = useRef<HTMLDivElement | null>(null);
  const cursorLabelRef = useRef<HTMLSpanElement | null>(null);
  const mousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const cursorCurrent = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [cursorText, setCursorText] = useState<string>("");
  const [cursorExpanded, setCursorExpanded] = useState<boolean>(false);

  // Canvas & Sequence Refs
  const storySectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const targetFrameRef = useRef<number>(1);
  const currentFrameRef = useRef<number>(1);
  const rafIdRef = useRef<number | null>(null);
  const lastDrawnIdxRef = useRef<number>(-1);
  const lenisInstanceRef = useRef<Lenis | null>(null);

  // Refs for Hero Elements & Direct GSAP Orchestration
  const headerRef = useRef<HTMLElement | null>(null);
  const heroOverlayRef = useRef<HTMLDivElement | null>(null);
  const chapterRefs = useRef<(HTMLDivElement | null)[]>([]);
  const completionOverlayRef = useRef<HTMLDivElement | null>(null);
  const hudContainerRef = useRef<HTMLDivElement | null>(null);
  const hudFrameCounterRef = useRef<HTMLSpanElement | null>(null);
  const hudProgressBarRef = useRef<HTMLDivElement | null>(null);
  const hudPercentRef = useRef<HTMLSpanElement | null>(null);
  const hudPhaseTagRef = useRef<HTMLSpanElement | null>(null);
  const indicatorDotRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Hero → Portfolio shared-element exit frame (fixed overlay that peels off hero)
  const heroExitFrameRef = useRef<HTMLDivElement | null>(null);
  const bridgeTextRef = useRef<HTMLDivElement | null>(null);
  const bridgeLeftTextRef = useRef<HTMLDivElement | null>(null);
  const bridgeRightTextRef = useRef<HTMLDivElement | null>(null);

  // Horizontal Scroll Section Refs
  const horizontalSectionRef = useRef<HTMLElement | null>(null);
  const horizontalTrackRef = useRef<HTMLDivElement | null>(null);

  // State
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [loadPercent, setLoadPercent] = useState<number>(0);
  const [preloaderGone, setPreloaderGone] = useState<boolean>(false);

  /* ── 1. Lenis Smooth Scrolling Engine ───────────────────────────────────── */
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.3,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });

    lenisInstanceRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);

    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(updateTicker);
    };
  }, []);

  /* ── 2. Custom Fluid Cursor (RAF Lerp) ──────────────────────────────────── */
  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    let cursorRaf: number;
    const lerpFactor = 0.18;

    const updateCursor = () => {
      cursorCurrent.current.x += (mousePos.current.x - cursorCurrent.current.x) * lerpFactor;
      cursorCurrent.current.y += (mousePos.current.y - cursorCurrent.current.y) * lerpFactor;

      if (cursorDotRef.current) {
        gsap.set(cursorDotRef.current, {
          x: cursorCurrent.current.x,
          y: cursorCurrent.current.y,
        });
      }

      cursorRaf = requestAnimationFrame(updateCursor);
    };

    cursorRaf = requestAnimationFrame(updateCursor);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(cursorRaf);
    };
  }, []);

  /* ── 3. Magnetic Hover System (gsap.quickTo with Layered Parallax) ──────── */
  const attachMagnetic = useCallback((el: HTMLElement | null) => {
    if (!el || window.matchMedia("(pointer: coarse)").matches) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3.out" });

    const inner = el.querySelector("[data-magnetic-inner]");
    const innerXTo = inner ? gsap.quickTo(inner, "x", { duration: 0.4, ease: "power3.out" }) : null;
    const innerYTo = inner ? gsap.quickTo(inner, "y", { duration: 0.4, ease: "power3.out" }) : null;

    const onMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);

      xTo(x * 0.35);
      yTo(y * 0.35);

      if (innerXTo && innerYTo) {
        innerXTo(x * 0.5);
        innerYTo(y * 0.5);
      }
    };

    const onMouseLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.3)" });
      if (inner) {
        gsap.to(inner, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.3)" });
      }
    };

    el.addEventListener("mousemove", onMouseMove);
    el.addEventListener("mouseleave", onMouseLeave);
  }, []);

  /* ── 4. Canvas High-DPI Cover Rendering ─────────────────────────────────── */
  const renderFrame = useCallback((img: HTMLImageElement | null) => {
    const canvas = canvasRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 2);
    const W = canvas.width / dpr;
    const H = canvas.height / dpr;

    // High-Definition Fit Ratio (Slightly zoomed out at 88% scale to preserve image resolution & crispness)
    const scaleFactor = 0.88;
    const imgAspect = 16 / 9;
    const canvasAspect = W / H;

    let drawW: number, drawH: number;
    if (canvasAspect > imgAspect) {
      drawH = H * scaleFactor;
      drawW = drawH * imgAspect;
    } else {
      drawW = W * scaleFactor;
      drawH = drawW / imgAspect;
    }

    const offsetX = (W - drawW) / 2;
    const offsetY = (H - drawH) / 2;

    ctx.save();
    ctx.scale(dpr, dpr);

    // 1. Rich Radial Ambient Background Atmosphere behind canvas frame
    const bgGradient = ctx.createRadialGradient(W / 2, H / 2, 80, W / 2, H / 2, Math.max(W, H) * 0.7);
    bgGradient.addColorStop(0, "#13121a");
    bgGradient.addColorStop(0.5, "#0a090e");
    bgGradient.addColorStop(1, "#070709");
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, W, H);

    // 2. Drop Shadow under the zoomed-out frame
    ctx.shadowColor = "rgba(0, 0, 0, 0.85)";
    ctx.shadowBlur = 45;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 20;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, offsetX, offsetY, drawW, drawH);

    // 3. Reset Shadow for Crisp Outline & Architectural Corner Brackets
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;

    // 1px Gold Hairline Frame
    ctx.strokeStyle = "rgba(200, 149, 106, 0.35)";
    ctx.lineWidth = 1;
    ctx.strokeRect(offsetX, offsetY, drawW, drawH);

    // Architectural Corner Accent Brackets
    const cLen = 14;
    ctx.strokeStyle = "rgba(200, 149, 106, 0.85)";
    ctx.lineWidth = 2;
    // Top-Left
    ctx.beginPath(); ctx.moveTo(offsetX - 4, offsetY - 4 + cLen); ctx.lineTo(offsetX - 4, offsetY - 4); ctx.lineTo(offsetX - 4 + cLen, offsetY - 4); ctx.stroke();
    // Top-Right
    ctx.beginPath(); ctx.moveTo(offsetX + drawW + 4 - cLen, offsetY - 4); ctx.lineTo(offsetX + drawW + 4, offsetY - 4); ctx.lineTo(offsetX + drawW + 4, offsetY - 4 + cLen); ctx.stroke();
    // Bottom-Left
    ctx.beginPath(); ctx.moveTo(offsetX - 4, offsetY + drawH + 4 - cLen); ctx.lineTo(offsetX - 4, offsetY + drawH + 4); ctx.lineTo(offsetX - 4 + cLen, offsetY + drawH + 4); ctx.stroke();
    // Bottom-Right
    ctx.beginPath(); ctx.moveTo(offsetX + drawW + 4 - cLen, offsetY + drawH + 4); ctx.lineTo(offsetX + drawW + 4, offsetY + drawH + 4); ctx.lineTo(offsetX + drawW + 4, offsetY + drawH + 4 - cLen); ctx.stroke();

    ctx.restore();
  }, []);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof window === "undefined") return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
  }, []);

  /* ── 5. Asset Preloader & Sequence Cache ─────────────────────────────────── */
  useEffect(() => {
    let loadedCount = 0;
    const frameImages: (HTMLImageElement | null)[] = new Array(TOTAL_FRAMES).fill(null);

    // Lock scroll during preloading
    document.body.style.overflow = "hidden";

    Promise.all(
      Array.from({ length: TOTAL_FRAMES }, (_, i) =>
        new Promise<void>((resolve) => {
          const img = new window.Image();
          img.src = `/interio-animation/ezgif-frame-${padFrame(i + 1)}.jpg`;
          img.onload = () => {
            frameImages[i] = img;
            loadedCount++;
            setLoadPercent(Math.round((loadedCount / TOTAL_FRAMES) * 100));
            resolve();
          };
          img.onerror = () => {
            loadedCount++;
            setLoadPercent(Math.round((loadedCount / TOTAL_FRAMES) * 100));
            resolve();
          };
        })
      )
    ).then(() => {
      imagesRef.current = frameImages;
      setIsLoaded(true);

      // Preloader Curtain Exit Animation
      const tl = gsap.timeline({
        onComplete: () => {
          setPreloaderGone(true);
          document.body.style.overflow = "";
          ScrollTrigger.refresh();
          if (lenisInstanceRef.current) {
            lenisInstanceRef.current.resize();
          }
        },
      });

      tl.to(preloaderContentRef.current, {
        opacity: 0,
        y: -30,
        duration: 0.5,
        ease: "power3.in",
      })
        .to(
          preloaderTopRef.current,
          {
            yPercent: -100,
            duration: 0.85,
            ease: "power4.inOut",
          },
          "-=0.1"
        )
        .to(
          preloaderBottomRef.current,
          {
            yPercent: 100,
            duration: 0.85,
            ease: "power4.inOut",
          },
          "<"
        );
    });
  }, []);

  /* ── 6. Continuous RAF Frame Scrub Loop with Dirty Frame Checking ───────── */
  useEffect(() => {
    if (!isLoaded) return;
    resizeCanvas();

    // Render initial frame immediately on load
    if (imagesRef.current[0]) {
      renderFrame(imagesRef.current[0]);
      lastDrawnIdxRef.current = 0;
    }

    const handleResize = () => {
      resizeCanvas();
      const currentIdx = Math.max(0, Math.min(Math.round(currentFrameRef.current) - 1, TOTAL_FRAMES - 1));
      if (imagesRef.current[currentIdx]) {
        renderFrame(imagesRef.current[currentIdx]);
        lastDrawnIdxRef.current = currentIdx;
      }
    };

    window.addEventListener("resize", handleResize, { passive: true });

    const renderLoop = () => {
      // Smooth continuous lerp for 60/120 FPS fluid motion
      currentFrameRef.current += (targetFrameRef.current - currentFrameRef.current) * 0.16;
      const idx = Math.max(0, Math.min(Math.round(currentFrameRef.current) - 1, TOTAL_FRAMES - 1));

      if (idx !== lastDrawnIdxRef.current && imagesRef.current[idx]) {
        renderFrame(imagesRef.current[idx]);
        lastDrawnIdxRef.current = idx;
      }

      rafIdRef.current = requestAnimationFrame(renderLoop);
    };

    rafIdRef.current = requestAnimationFrame(renderLoop);

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, [isLoaded, renderFrame, resizeCanvas]);

  /* ── 7. GSAP ScrollTrigger: Story Scrub + Zero-Lag Direct Element Orchestration ── */
  useEffect(() => {
    if (!isLoaded || !mainRef.current) return;

    const ctx = gsap.context(() => {
      // Hero Story Section ScrollTrigger (Extended travel for smooth pacing)
      const scrollTravel = window.innerHeight * 4.5;
      const VIDEO_END = 0.85; // All 180 frames finish constructing the room by 85% scroll

      // Clean sequential chapter windows with distinct phases
      const chapterWindows = [
        { start: 0.08, enterEnd: 0.14, exitStart: 0.24, end: 0.28, name: "CONCEPTION" },
        { start: 0.27, enterEnd: 0.33, exitStart: 0.43, end: 0.47, name: "FOUNDATION" },
        { start: 0.46, enterEnd: 0.52, exitStart: 0.62, end: 0.66, name: "ATMOSPHERE" },
        { start: 0.65, enterEnd: 0.71, exitStart: 0.83, end: 0.87, name: "SANCTUARY" },
      ];

      ScrollTrigger.create({
        id: "heroStoryTrigger",
        trigger: storySectionRef.current,
        start: "top top",
        end: `+=${scrollTravel}`,
        pin: true,
        pinSpacing: true,
        scrub: 0.35,
        onUpdate: (self) => {
          const p = self.progress;

          // 1. Frame Scrubbing: 0.0 -> 0.85 runs frames 1 to 180; >0.85 holds rock-solid on completed frame 180
          let frameNum = 1;
          if (p <= VIDEO_END) {
            const videoP = p / VIDEO_END;
            frameNum = Math.max(1, Math.min(Math.round(videoP * (TOTAL_FRAMES - 1)) + 1, TOTAL_FRAMES));
          } else {
            frameNum = TOTAL_FRAMES;
          }
          targetFrameRef.current = frameNum;

          // 2. Direct GSAP animation for Initial Hero Viewport Overlay
          if (heroOverlayRef.current) {
            if (p <= 0.05) {
              gsap.set(heroOverlayRef.current, {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                pointerEvents: "auto",
              });
            } else if (p <= 0.12) {
              const t = (p - 0.05) / 0.07;
              gsap.set(heroOverlayRef.current, {
                opacity: 1 - t,
                y: -35 * t,
                filter: `blur(${t * 6}px)`,
                pointerEvents: "none",
              });
            } else {
              gsap.set(heroOverlayRef.current, {
                opacity: 0,
                y: -35,
                filter: "blur(6px)",
                pointerEvents: "none",
              });
            }
          }

          // 3. Direct GSAP animations for Chapter Cards (Phases 01 to 04)
          chapterWindows.forEach((win, i) => {
            const el = chapterRefs.current[i];
            if (!el) return;

            if (p < win.start || p > win.end) {
              gsap.set(el, {
                opacity: 0,
                y: p < win.start ? 35 : -35,
                filter: "blur(8px)",
                pointerEvents: "none",
              });
            } else if (p >= win.enterEnd && p <= win.exitStart) {
              gsap.set(el, {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                pointerEvents: "auto",
              });
            } else if (p < win.enterEnd) {
              const t = (p - win.start) / (win.enterEnd - win.start);
              gsap.set(el, {
                opacity: t,
                y: 35 * (1 - t),
                filter: `blur(${(1 - t) * 8}px)`,
                pointerEvents: "none",
              });
            } else {
              const t = (p - win.exitStart) / (win.end - win.exitStart);
              gsap.set(el, {
                opacity: 1 - t,
                y: -35 * t,
                filter: `blur(${t * 8}px)`,
                pointerEvents: "none",
              });
            }
          });

          // 4. Hero Completion Finale Overlay (0.85 -> 0.88: Brief title text before card exit)
          if (completionOverlayRef.current) {
            if (p < 0.83) {
              gsap.set(completionOverlayRef.current, {
                opacity: 0,
                y: 35,
                filter: "blur(8px)",
                pointerEvents: "none",
              });
            } else if (p >= 0.85 && p <= 0.87) {
              gsap.set(completionOverlayRef.current, {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                pointerEvents: "auto",
              });
            } else if (p < 0.85) {
              const t = (p - 0.83) / 0.02;
              gsap.set(completionOverlayRef.current, {
                opacity: t,
                y: 35 * (1 - t),
                filter: `blur(${(1 - t) * 8}px)`,
                pointerEvents: "none",
              });
            } else {
              const t = Math.min((p - 0.87) / 0.02, 1);
              gsap.set(completionOverlayRef.current, {
                opacity: 1 - t,
                y: -25 * t,
                filter: `blur(${t * 6}px)`,
                pointerEvents: "none",
              });
            }
          }

          // 5. Live Atelier Telemetry & Progress HUD
          if (hudContainerRef.current) {
            if (p > 0.03 && p < 0.98) {
              gsap.set(hudContainerRef.current, { opacity: 1, y: 0 });
            } else if (p <= 0.03) {
              const t = p / 0.03;
              gsap.set(hudContainerRef.current, { opacity: t, y: 15 * (1 - t) });
            } else {
              const t = (p - 0.98) / 0.02;
              gsap.set(hudContainerRef.current, { opacity: 1 - t, y: -15 * t });
            }
          }

          if (hudFrameCounterRef.current) {
            hudFrameCounterRef.current.textContent = `FRAME [ ${padFrame(frameNum)} / 300 ]`;
          }
          if (hudProgressBarRef.current) {
            hudProgressBarRef.current.style.width = `${Math.round(p * 100)}%`;
          }
          if (hudPercentRef.current) {
            hudPercentRef.current.textContent = `${Math.round(p * 100)}%`;
          }

          // Determine current phase name
          let activePhaseIdx = -1;
          chapterWindows.forEach((win, idx) => {
            if (p >= win.start && p <= win.end) activePhaseIdx = idx;
          });

          if (hudPhaseTagRef.current) {
            if (activePhaseIdx >= 0) {
              hudPhaseTagRef.current.textContent = `PHASE 0${activePhaseIdx + 1} // ${chapterWindows[activePhaseIdx].name}`;
            } else if (p >= 0.87) {
              hudPhaseTagRef.current.textContent = `SANCTUARY COMPLETED // ADMIRATION`;
            } else {
              hudPhaseTagRef.current.textContent = `ATELIER SPEC // BLUEPRINT`;
            }
          }

          // Indicator Dots state
          indicatorDotRefs.current.forEach((dot, i) => {
            if (!dot) return;
            if (i === activePhaseIdx || (i === 3 && p >= 0.87)) {
              gsap.set(dot, { height: "28px", backgroundColor: "#C8956A", opacity: 1 });
            } else {
              gsap.set(dot, { height: "6px", backgroundColor: "rgba(255,255,255,0.25)", opacity: 0.5 });
            }
          });

          // 6. Cinematic Focus Spotlight on Canvas (Hero End Phase)
          // As room finishes, screen dims into deep black cinema focus mode around the image
          if (canvasRef.current) {
            if (p > 0.88) {
              const dimP = Math.min((p - 0.88) / 0.12, 1);
              const easeDim = dimP * dimP;
              gsap.set(canvasRef.current, {
                filter: `brightness(${1 - easeDim * 0.82}) blur(${easeDim * 20}px)`,
                scale: 1 + easeDim * 0.03,
              });
            } else {
              gsap.set(canvasRef.current, { filter: "none", scale: 1 });
            }
          }

          // Hide Header Navigation & HUD during drop phase for 100% image focus!
          if (headerRef.current) {
            if (p > 0.88) {
              const fadeP = Math.min((p - 0.88) / 0.08, 1);
              gsap.set(headerRef.current, { opacity: 1 - fadeP, pointerEvents: "none" });
            } else {
              gsap.set(headerRef.current, { opacity: 1, pointerEvents: "auto" });
            }
          }

          if (hudContainerRef.current) {
            if (p > 0.88) {
              gsap.set(hudContainerRef.current, { opacity: 0 });
            }
          }

          // 7. Hero Exit Frame — 100% CINEMATIC FOCUS SPOTLIGHT CARD (Centered in Hero)
          if (heroExitFrameRef.current) {
            if (p < 0.88) {
              gsap.set(heroExitFrameRef.current, { opacity: 0, x: 0, y: 0, scale: 1, rotation: 0, pointerEvents: "none" });
            } else if (p >= 0.88 && p <= 1.0) {
              const exitP = (p - 0.88) / 0.12;
              const easeIn = 1 - Math.pow(1 - exitP, 2);
              // Card rises from 60px below centre to exactly centre
              gsap.set(heroExitFrameRef.current, {
                opacity: easeIn,
                y: 60 * (1 - easeIn),
                scale: 1,
                rotation: 0,
                pointerEvents: "none",
              });
            }
          }
        },
        onLeave: () => {
          // Keep exit frame visible for heroToPortfolioBridge travel
          if (heroExitFrameRef.current) {
            gsap.set(heroExitFrameRef.current, { opacity: 1, pointerEvents: "none" });
          }
        },
        onEnterBack: () => {
          // User scrolled back into hero — hide exit frame
          if (heroExitFrameRef.current) {
            gsap.set(heroExitFrameRef.current, { opacity: 0, pointerEvents: "none" });
          }
        },
      });


      // ── Hero → Portfolio Bridge: 2-Stage Contraction & Placement LERP Interpolation ──
      ScrollTrigger.create({
        id: "heroToPortfolioBridge",
        trigger: "#portfolio",
        start: "top bottom",  // starts when portfolio top enters viewport bottom
        end: "top top",       // ends when portfolio top reaches viewport top
        scrub: 0.35,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const exitEl = heroExitFrameRef.current;
          if (!exitEl) return;

          const p = self.progress; // 0.0 → 1.0
          const vh = window.innerHeight;
          const vw = window.innerWidth;

          // 1. HERO SOURCE RECTANGLE (Full Viewport at p = 0)
          const heroLeft = 0;
          const heroTop = 0;
          const heroWidth = vw;
          const heroHeight = vh;
          const heroRadius = 0;

          // 2. MID-STAGE FLOATING INTERIOR CARD (at p = 0.30 - contracted sleek frame)
          const midW = Math.min(560, vw * 0.80);
          const midH = midW * (10 / 16);
          const midLeft = (vw - midW) / 2;
          const midTop = (vh - midH) / 2;

          // 3. PORTFOLIO DESTINATION RECTANGLE (at p = 1.0)
          const portfolioFrame = document.getElementById("portfolio-image-frame");
          const portfolioSection = document.getElementById("portfolio");

          let portfolioLeft = vw * 0.10;
          let portfolioTop = vh * 0.20;
          let portfolioWidth = Math.min(500, vw * 0.75);
          let portfolioHeight = portfolioWidth * (10 / 16);
          const portfolioRadius = 28;

          if (portfolioFrame && portfolioSection) {
            const frameR = portfolioFrame.getBoundingClientRect();
            const sectionR = portfolioSection.getBoundingClientRect();

            portfolioLeft = frameR.left;
            // Pinned top position when portfolio section reaches top top (sectionR.top = 0)
            portfolioTop = frameR.top - sectionR.top;
            portfolioWidth = frameR.width;
            portfolioHeight = frameR.height;
          }

          let currentLeft = 0;
          let currentTop = 0;
          let currentWidth = vw;
          let currentHeight = vh;
          let currentRadius = 0;
          let easeP = p;

          if (p <= 0.30) {
            // STAGE 1: Contraction from Full Viewport to Floating Interior Card (p = 0.0 -> 0.30)
            const shrinkP = p / 0.30;
            const easeShrink = gsap.parseEase("power3.out")(shrinkP);

            currentLeft   = heroLeft   + (midLeft   - heroLeft)   * easeShrink;
            currentTop    = heroTop    + (midTop    - heroTop)    * easeShrink;
            currentWidth  = heroWidth  + (midW      - heroWidth)  * easeShrink;
            currentHeight = heroHeight + (midH      - heroHeight) * easeShrink;
            currentRadius = heroRadius + (24        - heroRadius) * easeShrink;
            easeP = easeShrink * 0.3;
          } else {
            // STAGE 2: Gliding & Placement into Portfolio Project Slot (p = 0.30 -> 1.0)
            const glideP = (p - 0.30) / 0.70;
            const easeGlide = gsap.parseEase("power2.inOut")(glideP);

            currentLeft   = midLeft + (portfolioLeft   - midLeft) * easeGlide;
            currentTop    = midTop  + (portfolioTop    - midTop)  * easeGlide;
            currentWidth  = midW    + (portfolioWidth  - midW)    * easeGlide;
            currentHeight = midH    + (portfolioHeight - midH)    * easeGlide;
            currentRadius = 24      + (portfolioRadius - 24)      * easeGlide;
            easeP = 0.3 + easeGlide * 0.7;
          }

          // Smooth opacity handoff at destination match
          const frameOpacity = p >= 0.98 ? 0 : 1;

          // RENDER INTERSTITIAL BRIDGE TEXTS ON LEFT & RIGHT WHEN IMAGE GETS SMALLER (p: 0.08 -> 0.70)
          if (bridgeTextRef.current) {
            if (p >= 0.08 && p <= 0.70) {
              let textAlpha = 0;
              if (p < 0.25) {
                textAlpha = (p - 0.08) / 0.17;
              } else if (p > 0.50) {
                textAlpha = (0.70 - p) / 0.20;
              } else {
                textAlpha = 1;
              }
              const clampedAlpha = Math.max(0, Math.min(1, textAlpha));

              gsap.set(bridgeTextRef.current, { opacity: clampedAlpha });

              if (bridgeLeftTextRef.current) {
                gsap.set(bridgeLeftTextRef.current, { x: (1 - clampedAlpha) * -35 });
              }
              if (bridgeRightTextRef.current) {
                gsap.set(bridgeRightTextRef.current, { x: (1 - clampedAlpha) * 35 });
              }
            } else {
              gsap.set(bridgeTextRef.current, { opacity: 0 });
            }
          }

          // Fade header back in near end of drop
          if (headerRef.current) {
            if (p < 0.70) {
              gsap.set(headerRef.current, { opacity: 0, pointerEvents: "none" });
            } else {
              const fadeNav = (p - 0.70) / 0.30;
              gsap.set(headerRef.current, { opacity: fadeNav, pointerEvents: "auto" });
            }
          }

          // Apply LERP RECTANGLE to transition element
          gsap.set(exitEl, {
            x: currentLeft,
            y: currentTop,
            width: currentWidth,
            height: currentHeight,
            borderRadius: `${currentRadius}px`,
            opacity: frameOpacity,
            boxShadow: `0 ${35 * easeP}px ${90 * easeP}px rgba(0,0,0,${0.95 * easeP}), 0 0 ${40 * easeP}px rgba(200, 149, 106, ${0.45 * easeP})`,
          });
        },
        onLeave: () => {
          if (heroExitFrameRef.current) {
            gsap.set(heroExitFrameRef.current, { opacity: 0, pointerEvents: "none" });
          }
        },
        onEnterBack: () => {
          if (heroExitFrameRef.current) {
            gsap.set(heroExitFrameRef.current, { opacity: 1, pointerEvents: "none" });
          }
        },
      });

      // Initialize heroExitFrameRef at full viewport dimensions
      if (heroExitFrameRef.current) {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        gsap.set(heroExitFrameRef.current, {
          x: 0,
          y: 0,
          width: vw,
          height: vh,
          borderRadius: "0px",
          opacity: 0,
        });
      }



      // 2. Site-Wide Text Reveal System (translateY(110% -> 0%) inside overflow-hidden mask)
      const textRevealGroups = gsap.utils.toArray<HTMLElement>("[data-reveal-group]");
      textRevealGroups.forEach((group) => {
        const lines = group.querySelectorAll(".mask-line-inner");
        if (!lines.length) return;

        gsap.fromTo(
          lines,
          { y: "110%", opacity: 0 },
          {
            y: "0%",
            opacity: 1,
            duration: 0.9,
            stagger: 0.07,
            ease: "power4.out",
            scrollTrigger: {
              trigger: group,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      // 3. Site-Wide Image Reveal System (clip-path inset wipe + scale settle 1.15 -> 1.0)
      const revealImages = gsap.utils.toArray<HTMLElement>("[data-reveal-image]");
      revealImages.forEach((wrap) => {
        const img = wrap.querySelector("img");
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: wrap,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });

        tl.fromTo(
          wrap,
          { clipPath: "inset(100% 0% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "power4.out" }
        );

        if (img) {
          tl.fromTo(
            img,
            { scale: 1.15 },
            { scale: 1.0, duration: 1.4, ease: "power3.out" },
            0
          );
        }
      });

      // 4. Parallax Depth Layers (elements with data-speed)
      const parallaxLayers = gsap.utils.toArray<HTMLElement>("[data-speed]");
      parallaxLayers.forEach((layer) => {
        const speed = parseFloat(layer.getAttribute("data-speed") || "1") || 1;
        const yDist = (1 - speed) * 200;

        gsap.to(layer, {
          y: yDist,
          ease: "none",
          scrollTrigger: {
            trigger: layer,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      // 5. Horizontal Scroll Atelier Section
      const track = horizontalTrackRef.current;
      if (track) {
        const totalScroll = track.scrollWidth - window.innerWidth;
        gsap.to(track, {
          x: -totalScroll,
          ease: "none",
          scrollTrigger: {
            trigger: horizontalSectionRef.current,
            start: "top top",
            end: () => `+=${totalScroll + 400}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });
      }

      // Signal that hero pin spacer is created and accurately measured
      if (typeof window !== "undefined") {
        (window as Window & { __auraHeroPinReady?: boolean }).__auraHeroPinReady = true;
        window.dispatchEvent(new CustomEvent("aura-hero-pin-ready"));
      }
    }, mainRef);

    return () => ctx.revert();
  }, [isLoaded]);

  return (
    <div
      ref={mainRef}
      className="min-h-screen bg-[#070709] text-[#F3F3F5] font-sans antialiased selection:bg-[#C8956A] selection:text-black bg-noise"
    >
      {/* ───────────────────────────────────────────────────────────────────
          1. PRELOADER INTRO WITH SPLIT-PANEL CURTAIN WIPE
          ─────────────────────────────────────────────────────────────────── */}
      {!preloaderGone && (
        <div className="fixed inset-0 z-[100] pointer-events-none">
          {/* Top Panel */}
          <div
            ref={preloaderTopRef}
            className="absolute top-0 left-0 w-full h-1/2 bg-[#070709] border-b border-white/5 will-change-transform pointer-events-auto"
          />
          {/* Bottom Panel */}
          <div
            ref={preloaderBottomRef}
            className="absolute bottom-0 left-0 w-full h-1/2 bg-[#070709] border-t border-white/5 will-change-transform pointer-events-auto"
          />

          {/* Central Typography & Metric Line */}
          <div
            ref={preloaderContentRef}
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-auto px-6"
          >
            <span className="text-[10px] tracking-[0.5em] text-[#C8956A] font-mono uppercase mb-4">
              AURA ARCHITECTURAL ATELIER
            </span>

            <h2 className="text-3xl md:text-5xl font-serif text-white font-light tracking-widest mb-10">
              AURA
            </h2>

            {/* Negative space animated progress track */}
            <div className="w-48 h-[1px] bg-white/10 relative overflow-hidden mb-4">
              <div
                className="absolute top-0 left-0 h-full bg-[#C8956A] transition-all duration-200"
                style={{ width: `${loadPercent}%` }}
              />
            </div>

            <div className="flex items-center gap-4 text-[10px] font-mono text-white/40 tracking-widest">
              <span>LOADING FRAMES</span>
              <span className="text-[#C8956A] font-semibold">{loadPercent}%</span>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────────
          2. CUSTOM FLUID FOLLOWER CURSOR
          ─────────────────────────────────────────────────────────────────── */}
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[999] hidden md:flex items-center justify-center transition-[width,height,background-color] duration-300 ease-out"
        style={{
          width: cursorExpanded ? "70px" : "10px",
          height: cursorExpanded ? "70px" : "10px",
          borderRadius: "50%",
          backgroundColor: cursorExpanded ? "rgba(200, 149, 106, 0.2)" : "#C8956A",
          backdropFilter: cursorExpanded ? "blur(4px)" : "none",
          border: cursorExpanded ? "1px solid rgba(200, 149, 106, 0.6)" : "none",
        }}
      >
        {cursorExpanded && (
          <span
            ref={cursorLabelRef}
            className="text-[9px] font-mono font-bold tracking-widest text-[#F3F3F5] uppercase text-center px-1"
          >
            {cursorText || "View"}
          </span>
        )}
      </div>

      {/* ───────────────────────────────────────────────────────────────────
          3. TYPOGRAPHIC & FRAMELESS NAVIGATION WITH MAGNETIC LINKS
          ─────────────────────────────────────────────────────────────────── */}
      <header ref={headerRef} className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 md:px-12 py-6 bg-gradient-to-b from-[#070709]/90 to-transparent backdrop-blur-sm">
        <a
          ref={attachMagnetic}
          href="#story"
          onMouseEnter={() => {
            setCursorExpanded(true);
            setCursorText("Home");
          }}
          onMouseLeave={() => setCursorExpanded(false)}
          className="group flex items-baseline gap-2 cursor-none"
        >
          <span data-magnetic-inner className="font-serif text-2xl md:text-3xl tracking-widest text-[#F3F3F5] font-light group-hover:text-[#C8956A] transition-colors duration-500">
            AURA
          </span>
          <span className="text-[9px] tracking-[0.4em] text-[#C8956A] font-medium uppercase font-sans">
            STUDIO
          </span>
        </a>

        <nav className="flex items-center gap-8 md:gap-12">
          <a
            ref={attachMagnetic}
            href="#story"
            onMouseEnter={() => {
              setCursorExpanded(true);
              setCursorText("Story");
            }}
            onMouseLeave={() => setCursorExpanded(false)}
            className="text-[11px] tracking-[0.25em] text-white/60 hover:text-white uppercase transition-colors duration-300 hidden sm:inline-block cursor-none"
          >
            <span data-magnetic-inner>Philosophy</span>
          </a>

          <a
            ref={attachMagnetic}
            href="#portfolio"
            onMouseEnter={() => {
              setCursorExpanded(true);
              setCursorText("Works");
            }}
            onMouseLeave={() => setCursorExpanded(false)}
            className="text-[11px] tracking-[0.25em] text-white/60 hover:text-white uppercase transition-colors duration-300 hidden sm:inline-block cursor-none"
          >
            <span data-magnetic-inner>Residences</span>
          </a>

          <a
            ref={attachMagnetic}
            href="#about"
            onMouseEnter={() => {
              setCursorExpanded(true);
              setCursorText("Studio");
            }}
            onMouseLeave={() => setCursorExpanded(false)}
            className="text-[11px] tracking-[0.25em] text-white/60 hover:text-white uppercase transition-colors duration-300 hidden sm:inline-block cursor-none"
          >
            <span data-magnetic-inner>About</span>
          </a>

          <a
            ref={attachMagnetic}
            href="#atelier"
            onMouseEnter={() => {
              setCursorExpanded(true);
              setCursorText("Atelier");
            }}
            onMouseLeave={() => setCursorExpanded(false)}
            className="text-[11px] tracking-[0.25em] text-white/60 hover:text-white uppercase transition-colors duration-300 hidden md:inline-block cursor-none"
          >
            <span data-magnetic-inner>Materials</span>
          </a>

          <a
            ref={attachMagnetic}
            href="#inquire"
            onMouseEnter={() => {
              setCursorExpanded(true);
              setCursorText("Contact");
            }}
            onMouseLeave={() => setCursorExpanded(false)}
            className="px-5 py-2 rounded-full border border-white/15 text-[11px] font-semibold tracking-[0.2em] text-[#C8956A] hover:bg-[#C8956A] hover:border-[#C8956A] hover:text-black uppercase transition-all duration-300 cursor-none"
          >
            <span data-magnetic-inner>Inquire</span>
          </a>
        </nav>
      </header>

      {/* ───────────────────────────────────────────────────────────────────
          HERO EXIT FRAME — Fixed overlay that peels off hero canvas and falls into portfolio
          This is the "shared element" that creates continuity between hero and portfolio
          ─────────────────────────────────────────────────────────────────── */}
      {isLoaded && (
        <div
          ref={heroExitFrameRef}
          data-hero-exit-frame="true"
          className="fixed pointer-events-none overflow-hidden border border-[#C8956A]/40 shadow-[0_0_80px_rgba(200,149,106,0.3)]"
          style={{
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            opacity: 0,
            zIndex: 60,
            borderRadius: "0px",
            willChange: "transform, width, height, opacity",
          }}
        >
          <img
            src="/interio-animation/ezgif-frame-300.jpg"
            alt="Interior sanctuary final reveal"
            className="w-full h-full object-cover"
            style={{ display: "block" }}
          />

          {/* Luxury Ambient Glass Sheen */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-black/60 pointer-events-none" />

          {/* Corner Architectural Brackets */}
          <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-[#C8956A] pointer-events-none z-50" />
          <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-[#C8956A] pointer-events-none z-50" />
          <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-[#C8956A] pointer-events-none z-50" />
          <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-[#C8956A] pointer-events-none z-50" />

          {/* Telemetry HUD Badge */}
          <div className="absolute top-6 left-6 px-3.5 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-[#C8956A]/50 flex items-center gap-2.5 z-50">
            <span className="w-2 h-2 rounded-full bg-[#C8956A] animate-pulse" />
            <span className="text-[9px] font-mono font-bold tracking-[0.25em] text-[#C8956A] uppercase">
              ATELIER MORPH // SPEC 01
            </span>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────────
          INTERSTITIAL BRIDGE TEXT OVERLAY (Fades in right when image gets smaller)
          ─────────────────────────────────────────────────────────────────── */}
      {isLoaded && (
        <div
          ref={bridgeTextRef}
          className="fixed inset-0 pointer-events-none z-[55] flex items-center justify-between px-8 md:px-16 lg:px-24 opacity-0"
        >
          {/* Left Editorial Text Group */}
          <div
            ref={bridgeLeftTextRef}
            className="max-w-xs space-y-3.5 select-none bg-black/75 backdrop-blur-2xl p-6 rounded-2xl border border-[#C8956A]/40 shadow-[0_25px_60px_rgba(0,0,0,0.9)] hidden md:block"
          >
            <span className="text-[#C8956A] text-[10px] tracking-[0.45em] font-mono uppercase block font-semibold">
              01 // SPATIAL ARCHITECTURE
            </span>
            <h3 className="text-2xl lg:text-3xl font-serif text-white font-light leading-snug tracking-tight">
              Sculpting <em className="italic font-serif text-[#C8956A] font-normal">Sanctuaries</em>
            </h3>
            <p className="text-xs font-sans text-white/70 leading-relaxed tracking-wide">
              An exploration of living illumination, acoustic stillness, and honest spatial proportions.
            </p>
            <div className="pt-2 border-t border-white/10 flex items-center gap-2 text-[9px] font-mono text-[#C8956A] tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C8956A] animate-pulse" />
              <span>CEILING: 3.8M • 2700K LIGHTING</span>
            </div>
          </div>

          {/* Right Editorial Text Group */}
          <div
            ref={bridgeRightTextRef}
            className="max-w-xs space-y-3.5 select-none text-right bg-black/75 backdrop-blur-2xl p-6 rounded-2xl border border-[#C8956A]/40 shadow-[0_25px_60px_rgba(0,0,0,0.9)] hidden md:block"
          >
            <span className="text-[#C8956A] text-[10px] tracking-[0.45em] font-mono uppercase block font-semibold">
              02 // MATERIALITY & CRAFT
            </span>
            <h3 className="text-2xl lg:text-3xl font-serif text-white font-light leading-snug tracking-tight">
              Tactile <em className="italic font-serif text-[#C8956A] font-normal">Quiet Luxury</em>
            </h3>
            <p className="text-xs font-sans text-white/70 leading-relaxed tracking-wide">
              Honed Italian travertine, smoked walnut millwork, and hand-patinated architectural bronze.
            </p>
            <div className="pt-2 border-t border-white/10 flex items-center justify-end gap-2 text-[9px] font-mono text-[#C8956A] tracking-widest uppercase">
              <span>TRAVERTINE • OAK • BRONZE</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#C8956A] animate-pulse" />
            </div>
          </div>
        </div>
      )}




      <main>
        {/* ─────────────────────────────────────────────────────────────────
            HERO STORY SECTION (<canvas> Sticky Scrub + Chapter Reveals)
            ───────────────────────────────────────────────────────────────── */}
        <section
          id="story"
          ref={storySectionRef}
          className="relative w-full h-screen overflow-hidden bg-[#070709]"
        >
          {/* Ambient Glowing Blobs & Radial Lighting */}
          <div className="absolute top-1/4 left-1/6 w-[600px] h-[600px] bg-[#C8956A]/12 rounded-full blur-[150px] pointer-events-none animate-pulse" />
          <div className="absolute bottom-1/4 right-1/6 w-[700px] h-[700px] bg-amber-600/8 rounded-full blur-[180px] pointer-events-none animate-pulse" style={{ animationDuration: '7s' }} />

          {/* Architectural Blueprint Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

          {/* Precision Axis Lines */}
          <div className="absolute top-1/2 left-8 right-8 h-[1px] border-b border-dashed border-white/10 pointer-events-none z-0" />
          <div className="absolute left-1/2 top-8 bottom-8 w-[1px] border-r border-dashed border-white/10 pointer-events-none z-0" />

          {/* Sticky <canvas> background */}
          <canvas
            ref={canvasRef}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              isLoaded ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* Cinematic Vignettes */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#070709]/85 via-transparent to-[#070709]/85 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070709]/90 via-transparent to-[#070709]/70 pointer-events-none" />

          {/* Parallax Floating Ambient Monogram Watermark */}
          <div
            data-speed="0.6"
            className="absolute top-1/3 right-10 text-[18vw] font-serif text-white/[0.03] select-none pointer-events-none leading-none font-thin tracking-tighter"
          >
            AURA
          </div>

          {/* ── Initial Hero Viewport Overlay (Mask Line Reveal) ────────── */}
          {isLoaded && (
            <div
              ref={heroOverlayRef}
              data-reveal-group
              className="absolute inset-0 z-20 flex flex-col justify-center px-6 md:px-16 lg:px-24 will-change-transform"
            >
              <span className="mask-line mb-3">
                <span className="mask-line-inner text-[#C8956A] text-[10px] md:text-xs tracking-[0.45em] font-medium uppercase font-mono flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C8956A] animate-ping inline-block" />
                  Bespoke Interior Architecture // 2025
                </span>
              </span>

              <h1 className="text-4xl md:text-7xl lg:text-8xl font-serif text-white font-light tracking-tight leading-[1.05] max-w-4xl mb-6">
                <span className="mask-line">
                  <span className="mask-line-inner">Architecture of</span>
                </span>
                <span className="mask-line">
                  <span className="mask-line-inner italic text-[#C8956A] font-normal">Living Light</span>
                </span>
              </h1>

              <p className="mask-line max-w-md mb-8">
                <span className="mask-line-inner text-xs md:text-sm text-white/70 font-light leading-relaxed">
                  Scroll to experience the progressive narrative of spatial design—from initial conceptual blueprint to furnished sanctuary.
                </span>
              </p>

              <div className="flex items-center gap-4 text-white/40 text-[10px] uppercase tracking-[0.3em] font-mono">
                <div className="w-5 h-8 rounded-full border border-white/25 flex items-start justify-center p-1.5">
                  <div className="w-1 h-2 rounded-full bg-[#C8956A] animate-bounce" />
                </div>
                <span>Scroll to scrub spatial construction</span>
              </div>
            </div>
          )}

          {/* ── Floating Live Atelier Telemetry & Progress HUD ───────────── */}
          {isLoaded && (
            <div
              ref={hudContainerRef}
              className="absolute top-24 md:top-28 right-6 md:right-12 z-20 opacity-0 pointer-events-none will-change-transform"
            >
              <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3 shadow-[0_15px_35px_rgba(0,0,0,0.6)] flex flex-col gap-2 min-w-[210px]">
                <div className="flex items-center justify-between text-[10px] font-mono text-[#C8956A] tracking-wider font-semibold">
                  <span ref={hudFrameCounterRef}>FRAME [ 001 / 300 ]</span>
                  <span ref={hudPercentRef}>0%</span>
                </div>
                <div className="w-full h-[2px] bg-white/10 rounded-full overflow-hidden">
                  <div
                    ref={hudProgressBarRef}
                    className="h-full bg-gradient-to-r from-[#C8956A] to-amber-200 w-0 transition-all duration-75"
                  />
                </div>
                <div className="flex items-center justify-between text-[8px] font-mono text-white/40 tracking-widest uppercase">
                  <span ref={hudPhaseTagRef}>ATELIER SPEC // BLUEPRINT</span>
                  <span>LIVE SCRUB</span>
                </div>
              </div>
            </div>
          )}

          {/* ── Overlaying Story Chapter Glass Cards ─────────────────────── */}
          {isLoaded &&
            STORY_CHAPTERS.map((chapter, idx) => (
              <div
                ref={(el) => {
                  if (el) chapterRefs.current[idx] = el;
                }}
                key={idx}
                className="absolute bottom-10 md:bottom-16 left-6 md:left-16 lg:left-24 max-w-xl z-20 pointer-events-none opacity-0 will-change-transform"
              >
                <div className="bg-black/55 backdrop-blur-2xl border border-white/10 p-6 md:p-8 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.85)] relative overflow-hidden group">
                  {/* Glowing Top Amber Hairline */}
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C8956A]/60 to-transparent" />

                  {/* Phase Metadata Header */}
                  <div className="flex items-center justify-between gap-4 mb-3 border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="px-2 py-0.5 rounded bg-[#C8956A]/20 text-[#C8956A] text-[10px] font-mono font-bold tracking-widest uppercase">
                        PHASE {chapter.number}
                      </span>
                      <span className="text-[10px] tracking-[0.25em] text-white/50 uppercase font-mono hidden sm:inline-block">
                        {chapter.tag}
                      </span>
                    </div>
                    <span className="text-[9px] font-mono text-white/40 tracking-wider">
                      KYOTO ATELIER
                    </span>
                  </div>

                  {/* Chapter Title */}
                  <h2 className="text-3xl md:text-5xl font-serif text-white font-light tracking-tight leading-tight mb-3 whitespace-pre-line">
                    {chapter.title}
                  </h2>

                  {/* Description */}
                  <p className="text-xs md:text-sm text-white/75 font-light leading-relaxed mb-4">
                    {chapter.description}
                  </p>

                  {/* Specification Footnote */}
                  <div className="flex items-center gap-2 pt-2 border-t border-white/5 text-[9px] font-mono text-[#C8956A]/80 tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C8956A]" />
                    <span>{chapter.spec}</span>
                  </div>
                </div>
              </div>
            ))}

          {/* ── Completion Finale Overlay (Shown when all 180 frames finish) ── */}
          {isLoaded && (
            <div
              ref={completionOverlayRef}
              className="absolute bottom-10 md:bottom-16 left-6 md:left-16 lg:left-24 max-w-xl z-20 pointer-events-none opacity-0 will-change-transform"
            >
              <div className="bg-black/65 backdrop-blur-2xl border border-[#C8956A]/40 p-6 md:p-8 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#C8956A] to-transparent" />
                <div className="flex items-center gap-2 mb-3 text-[10px] font-mono text-[#C8956A] uppercase tracking-[0.3em] font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#C8956A] animate-ping" />
                  <span>CONSTRUCTION COMPLETE // SANCTUARY ASSEMBLED</span>
                </div>
                <h3 className="text-2xl md:text-4xl font-serif text-white font-light tracking-tight mb-2">
                  The Japandi Sanctuary
                </h3>
                <p className="text-xs md:text-sm text-white/75 font-light leading-relaxed mb-4">
                  Every architectural element, ambient luminaire, and Kyoto millwork surface is fully curated. Scroll down to enter the Selected Residences portfolio.
                </p>
                <div className="flex items-center gap-2 text-[#C8956A] text-[10px] font-mono uppercase tracking-[0.25em] font-semibold">
                  <span>Continue to Curated Works</span>
                  <span className="animate-bounce">↓</span>
                </div>
              </div>
            </div>
          )}

          {/* ── Interactive Right Chapter Timeline Rail ─────────────────── */}
          {isLoaded && (
            <div className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-4">
              <div className="flex flex-col items-center gap-3">
                {STORY_CHAPTERS.map((ch, i) => (
                  <button
                    key={i}
                    ref={(el) => {
                      if (el) indicatorDotRefs.current[i] = el;
                    }}
                    onClick={() => {
                      if (lenisInstanceRef.current && storySectionRef.current) {
                        const trigger = ScrollTrigger.getById("heroStoryTrigger");
                        const start = trigger ? trigger.start : storySectionRef.current.offsetTop;
                        const travel = trigger ? trigger.end - trigger.start : window.innerHeight * 4;
                        const targetProgress = [0.18, 0.40, 0.63, 0.85][i];
                        lenisInstanceRef.current.scrollTo(start + travel * targetProgress, {
                          duration: 1.4,
                        });
                      }
                    }}
                    onMouseEnter={() => {
                      setCursorExpanded(true);
                      setCursorText(`Phase 0${i + 1}`);
                    }}
                    onMouseLeave={() => setCursorExpanded(false)}
                    className="group relative flex items-center justify-center p-1.5 cursor-none focus:outline-none"
                    title={ch.eyebrow}
                  >
                    <div className="w-1.5 rounded-full transition-all duration-300 bg-white/20 h-2 group-hover:bg-[#C8956A] group-hover:h-5" />
                    {/* Tooltip on Hover */}
                    <span className="absolute right-7 px-2.5 py-1 rounded bg-black/90 backdrop-blur-md border border-white/10 text-[9px] font-mono text-white uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl">
                      0{i + 1} • {ch.tag.split(" ")[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* ─────────────────────────────────────────────────────────────────
            PORTFOLIO SHOWCASE (Continuous Hero-Frame Drop & Sequential Exploration)
            ───────────────────────────────────────────────────────────────── */}
        <PortfolioGrid isLoaded={isLoaded} />

        {/* ─────────────────────────────────────────────────────────────────
            ABOUT & SERVICES SECTION (2-Column Split: Numbered Disciplines + Drafting Card)
            ───────────────────────────────────────────────────────────────── */}
        <AboutServices />

        {/* ─────────────────────────────────────────────────────────────────
            7. HORIZONTAL SCROLL MOMENT: MATERIAL & SPATIAL MASTERY ATELIER
            ───────────────────────────────────────────────────────────────── */}
        <section
          id="atelier"
          ref={horizontalSectionRef}
          className="relative w-full h-screen overflow-hidden bg-[#0a0a0d] border-t border-white/5 flex flex-col justify-center"
        >
          {/* Header Bar */}
          <div className="px-6 md:px-16 lg:px-24 mb-6 flex items-end justify-between">
            <div data-reveal-group>
              <span className="mask-line">
                <span className="mask-line-inner text-[10px] font-mono tracking-[0.4em] text-[#C8956A] uppercase">
                  Spatial Taxonomy
                </span>
              </span>
              <h2 className="text-2xl md:text-5xl font-serif text-white font-light tracking-tight">
                <span className="mask-line">
                  <span className="mask-line-inner">
                    Material <em className="italic text-[#C8956A]">Atelier</em>
                  </span>
                </span>
              </h2>
            </div>
            <div className="text-white/40 font-mono text-[10px] tracking-widest hidden sm:block">
              HORIZONTAL DISCOVERY [SCROLL ↓]
            </div>
          </div>

          {/* Horizontal Track Container */}
          <div className="w-full overflow-hidden">
            <div
              ref={horizontalTrackRef}
              className="flex gap-8 px-6 md:px-16 lg:px-24 w-max will-change-transform"
            >
              {MATERIAL_ATELIER.map((mat) => (
                <div
                  key={mat.code}
                  onMouseEnter={() => {
                    setCursorExpanded(true);
                    setCursorText("Inspect");
                  }}
                  onMouseLeave={() => setCursorExpanded(false)}
                  className="w-[320px] md:w-[420px] bg-[#111115] border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col justify-between shrink-0 shadow-2xl transition-transform duration-500 hover:-translate-y-2 cursor-none"
                >
                  <div>
                    <div className="flex justify-between items-center text-[10px] font-mono text-white/40 tracking-widest mb-6">
                      <span className="text-[#C8956A] font-bold">{mat.code}</span>
                      <span>{mat.origin}</span>
                    </div>

                    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-6 border border-white/5">
                      <Image
                        src={mat.image}
                        alt={mat.name}
                        fill
                        className="object-cover transition-transform duration-700 hover:scale-105"
                        sizes="400px"
                      />
                    </div>

                    <h3 className="text-xl md:text-2xl font-serif text-white font-light mb-2">
                      {mat.name}
                    </h3>
                    <p className="text-xs font-mono text-white/50 tracking-wider mb-4">
                      {mat.texture}
                    </p>
                  </div>

                  <p className="text-xs text-white/70 font-light leading-relaxed border-t border-white/10 pt-4">
                    {mat.highlight}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────────
            FOOTER & INTEGRATED COMMISSION INQUIRY
            ───────────────────────────────────────────────────────────────── */}
        <footer
          id="inquire"
          className="relative w-full py-24 md:py-36 bg-[#050507] border-t border-white/5 px-6 md:px-16 lg:px-24"
        >
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* Left: Studio Vision & Typography */}
            <div data-reveal-group className="col-span-1 lg:col-span-6">
              <span className="mask-line mb-3">
                <span className="mask-line-inner text-[#C8956A] text-[10px] tracking-[0.4em] font-bold uppercase">
                  Private Commission
                </span>
              </span>

              <h2 className="text-3xl md:text-6xl font-serif text-white font-light tracking-tight leading-tight mb-6">
                <span className="mask-line">
                  <span className="mask-line-inner">Let Us Shape</span>
                </span>
                <span className="mask-line">
                  <span className="mask-line-inner italic text-[#C8956A]">Your Sanctuary</span>
                </span>
              </h2>

              <p className="mask-line max-w-md mb-8">
                <span className="mask-line-inner text-xs md:text-sm text-white/60 font-light leading-relaxed">
                  We accept a limited selection of residential and architectural commissions per year to guarantee uncompromising craftsmanship.
                </span>
              </p>

              <div className="flex flex-col gap-2 text-xs font-mono text-white/40">
                <span>ATELIER: Zurich • Milan • Kyoto</span>
                <span>DIRECT: commissions@aura-studio.com</span>
              </div>
            </div>

            {/* Right: Integrated Active Inquiry Form */}
            <div className="col-span-1 lg:col-span-6 bg-[#0a0a0d] p-8 md:p-12 rounded-3xl border border-white/5 shadow-2xl">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("Inquiry received. An architectural director will contact you within 24 hours.");
                }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-white/50 mb-2 font-mono">
                    Client Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Full Name / Representative"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-[#C8956A] transition-colors cursor-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-white/50 mb-2 font-mono">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="client@residence.com"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-[#C8956A] transition-colors cursor-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-white/50 mb-2 font-mono">
                      Location / Region
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Kyoto / St. Moritz"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-[#C8956A] transition-colors cursor-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-white/50 mb-2 font-mono">
                    Project Scope & Vision
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe your architectural volume, timeline, and spatial preferences..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-[#C8956A] transition-colors resize-none cursor-none"
                  />
                </div>

                <button
                  ref={attachMagnetic}
                  type="submit"
                  onMouseEnter={() => {
                    setCursorExpanded(true);
                    setCursorText("Send");
                  }}
                  onMouseLeave={() => setCursorExpanded(false)}
                  className="w-full py-4 rounded-xl bg-[#C8956A] text-black font-semibold text-xs uppercase tracking-[0.25em] hover:bg-white transition-colors duration-300 cursor-none"
                >
                  <span data-magnetic-inner>Submit Commission Request</span>
                </button>
              </form>
            </div>
          </div>

          <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-mono text-white/30 uppercase tracking-widest">
            <span>© {new Date().getFullYear()} AURA INTERIORS. ALL RIGHTS RESERVED.</span>
            <span>AWWWARDS-TIER DIGITAL ARCHITECTURE</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
