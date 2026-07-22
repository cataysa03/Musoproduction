"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AboutPage() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Reveal animation for content blocks
      const blocks = gsap.utils.toArray(".reveal-block") as HTMLElement[];
      blocks.forEach((block) => {
        gsap.fromTo(
          block,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "cinematic",
            scrollTrigger: {
              trigger: block,
              start: "top 80%",
            },
          }
        );
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="w-full relative bg-background pt-32 pb-24">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-sapphire-alt/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1600px] mx-auto px-6 md:px-12 relative z-10">
        
        {/* Header Section */}
        <section className="mb-32 reveal-block">
          <h1 className="text-5xl md:text-7xl font-heading text-neutral-cream mb-8">
            The Art of <br/><span className="text-brass">Narrative.</span>
          </h1>
          <p className="text-xl md:text-2xl font-body text-neutral-grayBeige font-light max-w-3xl leading-relaxed">
            Muso Production is a premium cinematic production house. We believe in the power of visual storytelling to elevate brands, document truth, and create lasting impact through uncompromising aesthetic standards.
          </p>
        </section>

        {/* Key Personnel */}
        <section className="mb-32">
          <h2 className="text-sm font-body uppercase tracking-widest text-brass mb-12 reveal-block">Key Personnel</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {[
              { name: "Elena Rostova", role: "Executive Producer", bio: "With 15 years in high-end commercial production, Elena orchestrates complex shoots across the globe." },
              { name: "Julian Vance", role: "Director of Photography", bio: "An award-winning cinematographer known for his mastery of natural light and atmospheric tension." },
              { name: "Marcus Thorne", role: "Lead Colorist", bio: "Specializing in the Midnight Palette, Marcus brings the final cinematic polish to every frame." }
            ].map((person, i) => (
              <div key={i} className="reveal-block border-t border-deepAnchor-alt1 pt-8">
                <h3 className="text-2xl font-heading text-neutral-cream mb-2">{person.name}</h3>
                <p className="text-sm font-body uppercase tracking-widest text-neutral-grayBeige/50 mb-6">{person.role}</p>
                <p className="font-body text-neutral-grayBeige font-light leading-relaxed">{person.bio}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Press & Awards */}
        <section className="mb-24 reveal-block bg-deepAnchor-alt1 p-12 md:p-24 rounded-lg">
          <h2 className="text-sm font-body uppercase tracking-widest text-brass mb-12">Press & Awards</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="border-l-2 border-brass pl-8">
              <h4 className="text-xl font-heading text-neutral-cream mb-2">Cannes Lions</h4>
              <p className="font-body text-sm text-neutral-grayBeige/70 uppercase tracking-widest mb-4">Gold Lion • Cinematography</p>
              <p className="font-body text-neutral-grayBeige font-light">Awarded for our groundbreaking visual work on the "Midnight Sun" global campaign.</p>
            </div>
            <div className="border-l-2 border-brass pl-8">
              <h4 className="text-xl font-heading text-neutral-cream mb-2">D&AD Awards</h4>
              <p className="font-body text-sm text-neutral-grayBeige/70 uppercase tracking-widest mb-4">Yellow Pencil • Direction</p>
              <p className="font-body text-neutral-grayBeige font-light">Recognized for outstanding narrative direction in documentary storytelling.</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="reveal-block flex flex-col items-center justify-center text-center py-16">
          <h2 className="text-3xl md:text-5xl font-heading text-neutral-cream mb-8">Ready to collaborate?</h2>
          <Link href="/contact">
            <Button size="lg" className="text-lg px-8 h-14 rounded-none uppercase tracking-widest font-body font-medium transition-transform duration-300 hover:scale-105">
              Contact Us
            </Button>
          </Link>
        </section>

      </div>
    </div>
  );
}
