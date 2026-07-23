"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { ParallaxServices } from "@/components/ParallaxServices";

export default function ServicesContent({ showCta = true }: { showCta?: boolean }) {
  const t = useTranslations("Services");

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
    <div className={`w-full md:min-h-screen bg-background pt-24 md:pt-32 relative ${showCta ? "pb-8 md:pb-24" : "pb-0 md:pb-4"}`}>
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 relative z-10">

        <section className="mb-32 fade-up">
          <h1 className="text-5xl md:text-7xl font-heading text-neutral-cream mb-8 max-w-4xl">
            {t("heading")}
          </h1>
          <p className="text-xl md:text-2xl font-body text-neutral-grayBeige font-light max-w-3xl leading-relaxed">
            {t("intro")}
          </p>
        </section>

        <ParallaxServices />

        {showCta && (
          <div className="mt-32 fade-up text-center border-t border-deepAnchor-alt1 pt-16">
            <Link href="/contact">
              <Button size="lg" className="text-lg px-8 h-14 rounded-none uppercase tracking-widest font-body font-medium transition-transform duration-300 hover:scale-105">
                {t("inquireNow")}
              </Button>
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
