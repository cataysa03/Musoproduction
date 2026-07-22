"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";

export default function AboutContent() {
  const t = useTranslations("About");

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
            {t("heroTitleLine1")} <br/><span className="text-brass">{t("heroTitleLine2")}</span>
          </h1>
          <p className="text-xl md:text-2xl font-body text-neutral-grayBeige font-light max-w-3xl leading-relaxed">
            {t("heroIntro")}
          </p>
        </section>


        {/* CTA */}
        <section className="reveal-block flex flex-col items-center justify-center text-center py-16">
          <h2 className="text-3xl md:text-5xl font-heading text-neutral-cream mb-8">{t("ctaHeading")}</h2>
          <Link href="/contact">
            <Button size="lg" className="text-lg px-8 h-14 rounded-none uppercase tracking-widest font-body font-medium transition-transform duration-300 hover:scale-105">
              {t("ctaButton")}
            </Button>
          </Link>
        </section>

      </div>
    </div>
  );
}
