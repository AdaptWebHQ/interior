"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────── STORY CHAPTERS ─────────────────────────────── */
interface Chapter {
  startFrame: number;
  endFrame: number;
  eyebrow: string;
  title: string;
  subtitle: string;
}

const CHAPTERS: Chapter[] = [
  {
    startFrame: 1,
    endFrame: 45,
    eyebrow: "Chapter 01 — Vision",
    title: "We Design\nthe Space",
    subtitle:
      "Every masterpiece starts as a blank canvas. Our designers translate your story into blueprints, floor plans, and mood boards — before a single brick is laid.",
  },
  {
    startFrame: 46,
    endFrame: 90,
    eyebrow: "Chapter 02 — Foundation",
    title: "We Build\nthe Structure",
    subtitle:
      "Raw concrete, steel frames, and precision craftsmanship. The bones of your future home rise from the ground with uncompromising attention to structure and form.",
  },
  {
    startFrame: 91,
    endFrame: 135,
    eyebrow: "Chapter 03 — Atmosphere",
    title: "We Design\nthe Room",
    subtitle:
      "Walls breathe texture. Light falls exactly where it should. We craft every surface, angle, and proportion to create spaces that feel as good as they look.",
  },
  {
    startFrame: 136,
    endFrame: 180,
    eyebrow: "Chapter 04 — Life",
    title: "We Decorate\nIt",
    subtitle:
      "The finishing layer — furniture, art, flora, and curated objects. We dress each room with intention, turning architecture into a living, breathing home.",
  },
];

const TOTAL_FRAMES = 180;

function padFrame(n: number) {
  return String(n).padStart(3, "0");
}

function getActiveChapterIndex(frame: number): number {
  for (let i = CHAPTERS.length - 1; i >= 0; i--) {
    if (frame >= CHAPTERS[i].startFrame) return i;
  }
  return 0;
}

export default function ScrollAnimation() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const frameRef = useRef(1);
  const targetFrameRef = useRef(1);
  const rafRef = useRef<number>(0);

  const [loadProgress, setLoadProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeChapter, setActiveChapter] = useState(-1);
  const [chapterProgress, setChapterProgress] = useState(0);
  const [showHero, setShowHero] = useState(true);

  /* ── Canvas Draw Function ───────────────────────────────────────────────── */
  const drawFrame = useCallback((img: HTMLImageElement | null | undefined) => {
    const canvas = canvasRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = canvas.width / dpr;
    const H = canvas.height / dpr;

    const targetRatio = 16 / 9;
    const windowRatio = W / H;

    let drawW: number;
    let drawH: number;

    if (windowRatio > targetRatio) {
      drawH = H * 0.96;
      drawW = drawH * targetRatio;
    } else {
      drawW = W * 0.96;
      drawH = drawW / targetRatio;
    }

    const dx = (W - drawW) / 2;
    const dy = (H - drawH) / 2;

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.fillStyle = "#08080a";
    ctx.fillRect(0, 0, W, H);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, dx, dy, drawW, drawH);
    ctx.restore();
  }, []);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
  }, []);

  /* ── 1. Preload all frames ─────────────────────────────────────────────── */
  useEffect(() => {
    let done = 0;
    const images: (HTMLImageElement | null)[] = new Array(TOTAL_FRAMES).fill(null);

    Promise.all(
      Array.from({ length: TOTAL_FRAMES }, (_, i) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.src = `/interio-animation/ezgif-frame-${padFrame(i + 1)}.jpg`;
          img.onload = () => {
            images[i] = img;
            done++;
            setLoadProgress(Math.round((done / TOTAL_FRAMES) * 100));
            resolve();
          };
          img.onerror = () => {
            done++;
            setLoadProgress(Math.round((done / TOTAL_FRAMES) * 100));
            resolve();
          };
        })
      )
    ).then(() => {
      imagesRef.current = images;
      setIsLoaded(true);
    });
  }, []);

  /* ── 2. RAF render loop ───────────────────────────────────────────────── */
  useEffect(() => {
    if (!isLoaded) return;
    resizeCanvas();

    const handleResize = () => {
      resizeCanvas();
      drawFrame(imagesRef.current[Math.round(frameRef.current) - 1]);
    };
    window.addEventListener("resize", handleResize, { passive: true });

    const loop = () => {
      frameRef.current = targetFrameRef.current;
      const idx = Math.max(0, Math.min(Math.round(frameRef.current) - 1, TOTAL_FRAMES - 1));
      drawFrame(imagesRef.current[idx]);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, [isLoaded, drawFrame, resizeCanvas]);

  /* ── 3. Pin + 1x Scrub through the 180 video frames ───────────────────── */
  useEffect(() => {
    if (!isLoaded || !sectionRef.current) return;

    const scrollTravel = window.innerHeight * 2.8;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: `+=${scrollTravel}`,
        pin: true,
        pinSpacing: true,
        scrub: true,
        immediateRender: false,
        onUpdate: (self) => {
          const p = self.progress;
          const frame = Math.max(1, Math.min(Math.round(p * (TOTAL_FRAMES - 1)) + 1, TOTAL_FRAMES));
          targetFrameRef.current = frame;

          const isInHero = p < 0.02;
          const chIdx = isInHero ? -1 : getActiveChapterIndex(frame);
          const ch = chIdx >= 0 ? CHAPTERS[chIdx] : null;
          const chProg = ch
            ? Math.max(0, Math.min((frame - ch.startFrame) / (ch.endFrame - ch.startFrame), 1))
            : 0;

          setShowHero(isInHero);
          setActiveChapter(chIdx);
          setChapterProgress(chProg);
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [isLoaded]);

  return (
    <section
      id="story"
      ref={sectionRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        background: "#08080a",
        overflow: "hidden",
      }}
    >
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          opacity: isLoaded ? 1 : 0,
          transition: "opacity 1.2s ease",
        }}
      />

      {/* Ambient Vignettes */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(135deg, rgba(8,8,10,0.78) 0%, rgba(8,8,10,0.2) 45%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to top, rgba(8,8,10,0.7) 0%, transparent 35%)",
          pointerEvents: "none",
        }}
      />

      {/* ── LOADING SCREEN ──────────────────────────────────────────────── */}
      {!isLoaded && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 60,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "#08080a",
          }}
        >
          <div style={{ position: "relative", marginBottom: "2.5rem" }}>
            <svg width="88" height="88" viewBox="0 0 88 88" fill="none">
              <circle cx="44" cy="44" r="40" stroke="rgba(255,255,255,0.05)" strokeWidth="1.5" />
              <circle
                cx="44"
                cy="44"
                r="40"
                stroke="#C8956A"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 40 * (loadProgress / 100)} ${2 * Math.PI * 40}`}
                style={{
                  transform: "rotate(-90deg)",
                  transformOrigin: "center",
                  transition: "stroke-dasharray 0.3s ease",
                }}
              />
            </svg>
            <span
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-sans, sans-serif)",
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                color: "#C8956A",
              }}
            >
              {loadProgress}%
            </span>
          </div>

          <span
            style={{
              fontFamily: "var(--font-sans, sans-serif)",
              fontSize: "9px",
              fontWeight: 700,
              letterSpacing: "0.5em",
              color: "#C8956A",
              textTransform: "uppercase",
              marginBottom: "1.75rem",
              display: "block",
            }}
          >
            AURA DESIGN STUDIO
          </span>

          <h1
            style={{
              fontFamily: "var(--font-serif, serif)",
              fontSize: "clamp(2.5rem, 6vw, 5.5rem)",
              fontWeight: 300,
              color: "#fff",
              lineHeight: 1.08,
              textAlign: "center",
              marginBottom: "1.25rem",
            }}
          >
            Crafting Your<br />
            <em style={{ fontStyle: "italic", color: "rgba(255,255,255,0.35)" }}>Living Story</em>
          </h1>
        </div>
      )}

      {/* ── HERO TITLE (Initial state) ──────────────────────────────────── */}
      {isLoaded && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 20,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 clamp(1.5rem, 5vw, 6rem)",
            opacity: showHero ? 1 : 0,
            transform: showHero ? "translateY(0)" : "translateY(-20px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
            pointerEvents: showHero ? "auto" : "none",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-sans, sans-serif)",
              fontSize: "9px",
              fontWeight: 700,
              letterSpacing: "0.5em",
              color: "#C8956A",
              textTransform: "uppercase",
              marginBottom: "1.5rem",
              display: "block",
            }}
          >
            AURA DESIGN STUDIO
          </span>

          <h1
            style={{
              fontFamily: "var(--font-serif, serif)",
              fontSize: "clamp(3rem, 7vw, 7.5rem)",
              fontWeight: 300,
              color: "#fff",
              lineHeight: 1.05,
              marginBottom: "1.5rem",
              maxWidth: "650px",
            }}
          >
            We Build<br />
            <em
              style={{
                fontStyle: "italic",
                color: "transparent",
                WebkitTextStroke: "1px rgba(255,255,255,0.3)",
              }}
            >
              Your Dream
            </em>
          </h1>

          <p
            style={{
              fontFamily: "var(--font-sans, sans-serif)",
              fontSize: "clamp(0.78rem, 1.2vw, 0.92rem)",
              color: "rgba(255,255,255,0.42)",
              maxWidth: "380px",
              lineHeight: 1.8,
              fontWeight: 300,
              marginBottom: "2.5rem",
            }}
          >
            Watch the full story of how we transform an empty lot into a living masterpiece — frame
            by frame, as you scroll.
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div
              style={{
                width: "1px",
                height: "52px",
                background: "rgba(255,255,255,0.1)",
                position: "relative",
                overflow: "hidden",
                borderRadius: "2px",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  width: "100%",
                  height: "50%",
                  background: "#C8956A",
                  borderRadius: "2px",
                  animation: "scrollDrop 1.8s ease-in-out infinite",
                }}
              />
            </div>
            <span
              style={{
                fontFamily: "var(--font-sans, sans-serif)",
                fontSize: "9px",
                letterSpacing: "0.35em",
                color: "rgba(255,255,255,0.28)",
                textTransform: "uppercase",
              }}
            >
              Scroll to reveal the story
            </span>
          </div>
        </div>
      )}

      {/* ── CHAPTER STORY CARDS (Chapters 1 to 4) ────────────────────────── */}
      {isLoaded &&
        CHAPTERS.map((ch, idx) => {
          const isActive = idx === activeChapter && !showHero;
          return (
            <div
              key={idx}
              style={{
                position: "absolute",
                zIndex: 20,
                left: "clamp(1.5rem, 5vw, 6rem)",
                bottom: "clamp(3.5rem, 7vh, 5.5rem)",
                maxWidth: "min(480px, 90vw)",
                opacity: isActive ? 1 : 0,
                transform: isActive ? "translateY(0)" : "translateY(16px)",
                filter: isActive ? "blur(0)" : "blur(6px)",
                transition:
                  "opacity 0.85s cubic-bezier(0.16,1,0.3,1), transform 0.85s cubic-bezier(0.16,1,0.3,1), filter 0.85s ease",
                pointerEvents: isActive ? "auto" : "none",
              }}
            >
              <span
                style={{
                  display: "block",
                  fontFamily: "var(--font-sans, sans-serif)",
                  fontSize: "9px",
                  fontWeight: 700,
                  letterSpacing: "0.4em",
                  color: "#C8956A",
                  textTransform: "uppercase",
                  marginBottom: "0.75rem",
                }}
              >
                {ch.eyebrow}
              </span>

              <h2
                style={{
                  fontFamily: "var(--font-serif, serif)",
                  fontSize: "clamp(2rem, 4vw, 3.5rem)",
                  fontWeight: 300,
                  color: "#fff",
                  lineHeight: 1.1,
                  marginBottom: "1rem",
                  whiteSpace: "pre-line",
                }}
              >
                {ch.title}
              </h2>

              <p
                style={{
                  fontFamily: "var(--font-sans, sans-serif)",
                  fontSize: "clamp(0.72rem, 1vw, 0.85rem)",
                  color: "rgba(255,255,255,0.48)",
                  lineHeight: 1.85,
                  fontWeight: 300,
                  marginBottom: "1.5rem",
                  maxWidth: "420px",
                }}
              >
                {ch.subtitle}
              </p>

              <div
                style={{
                  width: "100%",
                  height: "1px",
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: "1px",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    height: "100%",
                    width: isActive ? `${chapterProgress * 100}%` : "0%",
                    background: "#C8956A",
                    transition: "width 0.1s linear",
                    borderRadius: "1px",
                  }}
                />
              </div>
            </div>
          );
        })}

      {/* ── CHAPTER DOT INDICATOR ────────────────────────────────────────── */}
      {isLoaded && (
        <div
          style={{
            position: "absolute",
            right: "clamp(1.2rem, 2.5vw, 2.5rem)",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 30,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
            pointerEvents: "none",
          }}
        >
          {CHAPTERS.map((_, idx) => {
            const isActive = idx === activeChapter && !showHero;
            return (
              <div
                key={idx}
                style={{
                  width: "2px",
                  height: isActive ? "36px" : "14px",
                  borderRadius: "2px",
                  background: isActive ? "#C8956A" : "rgba(255,255,255,0.13)",
                  transition: "height 0.5s cubic-bezier(0.16,1,0.3,1), background 0.5s ease",
                }}
              />
            );
          })}
        </div>
      )}

      {/* CSS keyframe */}
      <style>{`
        @keyframes scrollDrop {
          0%   { top: -50%; }
          100% { top: 150%; }
        }
      `}</style>
    </section>
  );
}
