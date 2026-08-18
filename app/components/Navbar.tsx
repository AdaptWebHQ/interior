"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHidden(entry.isIntersecting);
      },
      {
        // Triggers when the story container begins overlaying the screen
        rootMargin: "-80px 0px 0px 0px",
        threshold: 0.01,
      }
    );

    const storySection = document.getElementById("story");
    if (storySection) {
      observer.observe(storySection);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (storySection) {
        observer.unobserve(storySection);
      }
    };
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 transform ${
        isHidden ? "-translate-y-full opacity-0 pointer-events-none" : "translate-y-0 opacity-100"
      } ${
        isScrolled
          ? "bg-[#0A0A0A]/95 backdrop-blur-md border-b border-white/5 py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="text-2xl md:text-3xl font-sans tracking-[0.2em] text-[#D39E82] font-black cursor-pointer focus:outline-none"
        >
          AURA
        </button>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {["Story", "Services", "Portfolio", "Reviews", "Contact"].map((item) => (
            <button
              key={item}
              onClick={() => scrollToSection(item.toLowerCase())}
              className="text-xs font-semibold tracking-widest uppercase text-white/70 hover:text-[#D39E82] transition-colors duration-300 cursor-pointer focus:outline-none"
            >
              {item}
            </button>
          ))}
          <Link
            href="/ktm"
            className="text-xs font-semibold tracking-widest uppercase text-[#ff6600] hover:text-[#ff6600]/80 transition-colors duration-300"
          >
            KTM Labs
          </Link>
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-4">
          <Link
            href="/ktm"
            className="hidden sm:inline-block px-5 py-2.5 text-xs font-semibold tracking-wider uppercase border border-[#ff6600] text-[#ff6600] hover:bg-[#ff6600] hover:text-black transition-all duration-300 rounded-full"
          >
            KTM Showcase
          </Link>
          <button
            onClick={() => scrollToSection("contact")}
            className="px-6 py-2.5 text-xs font-semibold tracking-wider uppercase border border-white/20 text-white hover:bg-white hover:text-black transition-all duration-300 rounded-full cursor-pointer focus:outline-none"
          >
            Inquire Now
          </button>
        </div>
      </div>
    </header>
  );
}
