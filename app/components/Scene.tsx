"use client";

import React, { useEffect, useRef, useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { useProgress } from "@react-three/drei";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import InteriorModel, { MATERIAL_THEMES } from "./InteriorModel";

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 240;

interface SceneProps {
  theme: keyof typeof MATERIAL_THEMES;
  scrollProgress: number;
}

export default function Scene({ theme, scrollProgress }: SceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  // Inertia references
  const currentFrameRef = useRef(1);

  // Check reduced motion setting change listener
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Preload Image Sequence
  useEffect(() => {
    if (prefersReducedMotion) return;

    let loadedCount = 0;
    const loadedImages: HTMLImageElement[] = [];

    const preloadImages = async () => {
      const promises = Array.from({ length: TOTAL_FRAMES }).map((_, i) => {
        return new Promise<void>((resolve) => {
          const img = new Image();
          const frameNum = String(i + 1).padStart(3, "0");
          img.src = `/interio-animation/ezgif-frame-${frameNum}.jpg`;
          img.onload = () => {
            loadedCount++;
            setLoadProgress(Math.round((loadedCount / TOTAL_FRAMES) * 100));
            resolve();
          };
          img.onerror = () => {
            loadedCount++;
            resolve();
          };
          loadedImages[i] = img;
        });
      });

      await Promise.all(promises);
      setImages(loadedImages);
      setIsLoaded(true);
    };

    preloadImages();
  }, [prefersReducedMotion]);

  // Main Canvas drawing loop with custom cover sizing and lerping
  useEffect(() => {
    if (!isLoaded || images.length === 0 || prefersReducedMotion) return;

    let animId: number;
    let active = true;

    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = "100%";
      canvas.style.height = "100%";
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const draw = () => {
      if (!active) return;
      const canvas = canvasRef.current;
      if (!canvas) {
        animId = requestAnimationFrame(draw);
        return;
      }
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        animId = requestAnimationFrame(draw);
        return;
      }

      // Smooth interpolation towards scrollProgress
      const targetFrame = Math.max(
        1,
        Math.min(Math.round(scrollProgress * (TOTAL_FRAMES - 1)) + 1, TOTAL_FRAMES)
      );
      const diff = targetFrame - currentFrameRef.current;
      currentFrameRef.current += diff * 0.12;

      const frameIdx = Math.round(currentFrameRef.current) - 1;
      const img = images[frameIdx];

      if (img && img.complete && img.naturalWidth > 0) {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const w = canvas.width / dpr;
        const h = canvas.height / dpr;

        // Immersive Full-Screen Cover Fit (Zoomed in to 100%+ scale to fill the hero section)
        const scaleFactor = 1.05;
        const imgRatio = img.width / img.height;
        const canvasRatio = w / h;
        let dw: number, dh: number;
        if (canvasRatio > imgRatio) {
          dw = w * scaleFactor;
          dh = dw / imgRatio;
        } else {
          dh = h * scaleFactor;
          dw = dh * imgRatio;
        }
        const dx = (w - dw) / 2;
        const dy = (h - dh) / 2;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        ctx.save();
        ctx.scale(dpr, dpr);
        ctx.drawImage(img, dx, dy, dw, dh);
        ctx.restore();
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      active = false;
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [isLoaded, images, scrollProgress, prefersReducedMotion]);

  // Loading indicator from Drei useProgress
  const { progress: r3fProgress } = useProgress();

  return (
    <div ref={containerRef} className="fixed inset-0 w-full h-full -z-10 bg-[#0A0A0A] overflow-hidden">
      {/* Prefers Reduced Motion Fallback */}
      {prefersReducedMotion ? (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 transition-all duration-700"
          style={{ backgroundImage: `url('/interio-animation/ezgif-frame-120.jpg')` }}
        />
      ) : (
        <>
          {/* Scroll-Driven Cinematic Sequence Layer */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full transition-opacity duration-1000"
            style={{
              opacity: isLoaded ? 0.35 : 0,
              mixBlendMode: "lighten",
              filter: "contrast(1.08) brightness(0.95)",
            }}
          />

          {/* Real-time 3D Canvas overlay for Configurator and Detailed specs */}
          <div
            className="absolute inset-0 w-full h-full transition-opacity duration-1000 pointer-events-none"
            style={{
              opacity: scrollProgress > 0.65 ? 1 : 0.1,
            }}
          >
            <Canvas
              shadows
              camera={{ position: [0, 2, 8], fov: 45 }}
              dpr={[1, 2]}
              gl={{ antialias: true, alpha: true }}
            >
              <Suspense fallback={null}>
                <InteriorModel theme={theme} scrollProgress={scrollProgress} />
              </Suspense>
            </Canvas>
          </div>
        </>
      )}

      {/* Experience Loader Screen */}
      {!isLoaded && !prefersReducedMotion && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#0A0A0A] px-6">
          <span className="text-[11px] font-bold tracking-[0.4em] uppercase text-[#D39E82] mb-6 animate-pulse">
            FORM & SILENCE — LOADING
          </span>
          <div className="w-64 h-[1px] bg-white/10 relative overflow-hidden rounded-full mb-3">
            <div
              className="absolute h-full bg-[#D39E82] transition-all duration-300 ease-out"
              style={{ width: `${Math.max(loadProgress, r3fProgress)}%` }}
            />
          </div>
          <p className="text-[9px] tracking-widest text-white/40 font-mono">
            {Math.round(Math.max(loadProgress, r3fProgress))}% RESOLVED
          </p>
        </div>
      )}

      {/* Grid overlay design elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#0A0A0A]/40 to-[#0A0A0A] pointer-events-none" />
    </div>
  );
}
