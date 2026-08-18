"use client";

import React from "react";

const REVIEWS = [
  {
    text: "One of the best interiors and exteriors....fabulous quality and customer services",
    author: "Google Reviewer",
    rating: 5,
  },
  {
    text: "Understands customer requirements and offers practical design solutions!",
    author: "Google Reviewer",
    rating: 5,
  },
  {
    text: "I'm so glad I chose these people for my showroom.",
    author: "Showroom Client",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section id="reviews" className="py-24 md:py-32 bg-background border-t border-[#e2e2e2]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <span className="text-xs font-semibold tracking-[0.25em] text-accent uppercase mb-3 block">
              TESTIMONIALS
            </span>
            <h2 className="text-4xl md:text-5xl font-serif text-foreground font-normal">
              Google Reviews
            </h2>
          </div>

          {/* Rating overview */}
          <div className="flex items-center gap-4 bg-[#f9f9f9] border border-[#e2e2e2] px-6 py-4 rounded-2xl">
            <div className="flex flex-col">
              <span className="text-2xl font-serif font-semibold text-foreground">4.8</span>
              <span className="text-[10px] tracking-wider text-muted uppercase font-medium">82 Reviews</span>
            </div>
            <div className="h-8 w-[1px] bg-[#e2e2e2]" />
            <div className="flex flex-col justify-center">
              <div className="flex text-amber-500 text-sm">★★★★★</div>
              <span className="text-[10px] tracking-wider text-muted font-sans font-light">Highly Rated Studio</span>
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {REVIEWS.map((review, index) => (
            <div
              key={index}
              className="p-8 bg-[#f9f9f9] border border-[#e2e2e2] rounded-3xl flex flex-col justify-between"
            >
              <div>
                {/* Stars */}
                <div className="text-amber-500 text-sm mb-6">
                  {"★".repeat(review.rating)}
                </div>
                {/* Review Text */}
                <p className="text-sm md:text-base text-foreground/80 leading-relaxed font-serif italic font-normal mb-8">
                  &quot;{review.text}&quot;
                </p>
              </div>
              
              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-[#e2e2e2]/40">
                <div className="w-8 h-8 rounded-full bg-[#e2e2e2] flex items-center justify-center text-xs font-semibold text-foreground/60">
                  {review.author[0]}
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-foreground">{review.author}</h4>
                  <span className="text-[10px] text-muted tracking-wider">Verified Customer</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
