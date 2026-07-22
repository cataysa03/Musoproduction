"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface Project {
  id: number | string;
  title: string;
  category: string;
  color: string;
  media_type?: "photo" | "video";
  media_url?: string;
}

interface PortfolioGridProps {
  title?: string;
  items: Project[];
  viewMoreLink?: string;
  linkPrefix?: string;
}

export default function PortfolioGrid({ title, items, viewMoreLink, linkPrefix }: PortfolioGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("Portfolio");
  const resolvedTitle = title ?? t("selectedWorks");

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray(".portfolio-card", gridRef.current) as HTMLElement[];

      cards.forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "cinematic",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
            },
          }
        );
      });
    }, gridRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="py-24 px-6 md:px-12 max-w-[1600px] mx-auto" ref={gridRef}>
      <h2 className="text-4xl md:text-5xl font-heading text-neutral-cream mb-16 text-center">
        {resolvedTitle}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {items.map((project) => {
          const thumbnailUrl = project.media_url
            ? project.media_type === "video"
              ? `https://image.mux.com/${project.media_url}/thumbnail.jpg?time=0`
              : project.media_url
            : null;

          const cardContent = (
            <div
              className="portfolio-card group cursor-pointer aspect-video relative overflow-hidden rounded-lg shadow-2xl transition-transform duration-700 hover:scale-[1.02]"
            >
              <div className={`absolute inset-0 ${project.color}`} />

              {thumbnailUrl && (
                <Image
                  src={thumbnailUrl}
                  alt={project.title}
                  fill
                  loading="lazy"
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              )}

              {project.media_type === "video" && (
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-deepAnchor-alt2/50 backdrop-blur-md border border-neutral-cream/50 flex items-center justify-center transition-transform duration-500 ease-cinematic group-hover:scale-110">
                    <Play className="w-6 h-6 md:w-7 md:h-7 text-neutral-cream fill-neutral-cream ml-1" />
                  </div>
                </div>
              )}

            </div>
          );

          return linkPrefix ? (
            <Link key={project.id} href={`${linkPrefix}/${project.id}`}>
              {cardContent}
            </Link>
          ) : (
            <div key={project.id}>
              {cardContent}
            </div>
          );
        })}
      </div>

      {viewMoreLink && (
        <div className="mt-16 flex justify-center">
          <Link href={viewMoreLink}>
            <Button variant="outline" size="lg" className="text-lg px-8 h-14 rounded-none uppercase tracking-widest font-body font-medium transition-colors hover:bg-neutral-cream hover:text-background border-neutral-cream text-neutral-cream">
              {t("viewMore")}
            </Button>
          </Link>
        </div>
      )}
    </section>
  );
}
