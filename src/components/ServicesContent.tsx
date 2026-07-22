"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ParallaxServices } from "@/components/ParallaxServices";

export default function ServicesContent({ showCta = true }: { showCta?: boolean }) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const elements = gsap.utils.toArray(".fade-up") as HTMLElement[];
      elements.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "cinematic",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
            },
          }
        );
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="w-full min-h-screen bg-background pt-32 pb-24 relative">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 relative z-10">

        <section className="mb-32 fade-up">
          <h1 className="text-5xl md:text-7xl font-heading text-neutral-cream mb-8 max-w-4xl">
            Methodology & Capabilities.
          </h1>
          <p className="text-xl md:text-2xl font-body text-neutral-grayBeige font-light max-w-3xl leading-relaxed">
            We don't just shoot video; we architect visual experiences. Our methodology relies on deliberate pre-production, cinematic restraint, and flawless execution.
          </p>
        </section>

        <ParallaxServices />

        {showCta && (
          <div className="mt-32 fade-up text-center border-t border-deepAnchor-alt1 pt-16">
            <p className="text-neutral-grayBeige font-body mb-8 text-lg">Project minimum engagements start at $25,000.</p>
            <Link href="/contact">
              <Button size="lg" className="text-lg px-8 h-14 rounded-none uppercase tracking-widest font-body font-medium transition-transform duration-300 hover:scale-105">
                Inquire Now
              </Button>
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
