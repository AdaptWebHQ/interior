"use client";

import React, { useState } from "react";

export default function ContactForm() {
  const [formState, setFormState] = useState({ name: "", email: "", projectType: "Residential", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormState({ name: "", email: "", projectType: "Residential", message: "" });
    }, 4000);
  };

  return (
    <section id="contact" className="py-24 md:py-32 bg-background border-t border-[#e2e2e2]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          
          {/* Info Side */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold tracking-[0.25em] text-accent uppercase mb-3 block">
                COLLABORATE
              </span>
              <h2 className="text-4xl md:text-5xl font-serif text-foreground font-normal mb-6">
                Let&apos;s Craft Your Sanctuary.
              </h2>
              <p className="text-sm md:text-base text-muted font-light leading-relaxed mb-8">
                Ready to transform your home or commercial space? Reach out to start your custom design journey.
              </p>
            </div>

            {/* Details */}
            <div className="space-y-6">
              <div>
                <h4 className="text-[10px] tracking-widest uppercase text-accent font-semibold mb-1">
                  General Inquiries
                </h4>
                <p className="text-sm text-foreground/80 font-mono">098421 83415 / contact@bestinteriors.in</p>
              </div>
              <div>
                <h4 className="text-[10px] tracking-widest uppercase text-accent font-semibold mb-1">
                  Studio Address
                </h4>
                <p className="text-sm text-foreground/80 font-sans font-light leading-relaxed">
                  1/45A, Ganapathy Gounder Thottom, PO,<br />
                  Therkkuppalayam, Narasimhanaickenpalayam,<br />
                  Coimbatore, Tamil Nadu 641031
                </p>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-7 bg-[#f9f9f9] border border-[#e2e2e2] p-8 md:p-12 rounded-3xl relative">
            {submitted ? (
              <div className="h-full min-h-[350px] flex flex-col items-center justify-center text-center">
                <span className="text-3xl mb-4">✨</span>
                <h3 className="text-xl font-serif text-foreground font-normal mb-2">
                  Inquiry Received
                </h3>
                <p className="text-sm text-muted font-light max-w-xs leading-relaxed">
                  Thank you for reaching out. A representative from our design team will contact you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] tracking-wider uppercase text-muted font-medium">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      className="bg-background border border-[#e2e2e2] rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-accent transition-colors duration-300 font-sans font-light"
                      placeholder="Alexander Wright"
                    />
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] tracking-wider uppercase text-muted font-medium">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      className="bg-background border border-[#e2e2e2] rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-accent transition-colors duration-300 font-sans font-light"
                      placeholder="alexander@domain.com"
                    />
                  </div>
                </div>

                {/* Project Type */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] tracking-wider uppercase text-muted font-medium">
                    Space Type
                  </label>
                  <select
                    value={formState.projectType}
                    onChange={(e) => setFormState({ ...formState, projectType: e.target.value })}
                    className="bg-background border border-[#e2e2e2] rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-accent transition-colors duration-300 font-sans font-light"
                  >
                    <option value="Residential">Residential Sanctuary</option>
                    <option value="Kitchen">Kitchen Space</option>
                    <option value="Bedroom">Bedroom Suite</option>
                    <option value="Commercial">Commercial / Retail</option>
                  </select>
                </div>

                {/* Message */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] tracking-wider uppercase text-muted font-medium">
                    Brief Design Objective
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    className="bg-background border border-[#e2e2e2] rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-accent transition-colors duration-300 font-sans font-light resize-none"
                    placeholder="Tell us about the space you want to transform..."
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full py-4 bg-foreground hover:bg-foreground/95 text-background text-xs font-semibold tracking-[0.2em] uppercase rounded-full transition-all duration-300 focus:outline-none cursor-pointer shadow-sm"
                >
                  Send Proposal
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
