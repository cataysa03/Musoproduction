"use client";

import { useEffect, useRef, useState } from "react";
import MuxPlayer from "@mux/mux-player-react";
import type MuxPlayerElement from "@mux/mux-player";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { supabase } from "@/lib/supabase";

export default function VideoHero() {
  const t = useTranslations("VideoHero");
  const containerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<MuxPlayerElement>(null);

  const [playbackId, setPlaybackId] = useState("gMIu1TXznCuOzK1A6KJ4sMZqdv9TRAu2fzb02mc00S00P8");
  const [marqueeImages, setMarqueeImages] = useState<string[]>([
    "/images/sliding/DSC00327.JPG",
    "/images/sliding/DSC00389.jpg",
    "/images/sliding/DSC00549.jpg",
    "/images/sliding/DSC00638.jpg",
    "/images/sliding/DSC02342.jpg",
    "/images/sliding/DSC04802-5.jpg",
    "/images/sliding/DSC07812-2.JPG",
    "/images/sliding/DSC09590.JPG",
  ]);

  useEffect(() => {
    const fetchHeroData = async () => {
      const { data } = await supabase.from("site_settings").select("*").eq("id", 1).single();
      if (data) {
        if (data.hero_video_playback_id) setPlaybackId(data.hero_video_playback_id);
        if (data.hero_marquee_images?.length > 0) setMarqueeImages(data.hero_marquee_images);
      }
    };
    fetchHeroData();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const player = playerRef.current;
    if (!container || !player) return;

    // Stop decoding video frames once the hero is scrolled well out of view
    // so it doesn't keep competing with the rest of the page for scroll perf.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          player.play().catch(() => {});
        } else {
          player.pause();
        }
      },
      { rootMargin: "200px 0px" }
    );
    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Parallax effect on scroll
      gsap.to(bgRef.current, {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const duplicatedImages = [...marqueeImages, ...marqueeImages]; // Ensure enough images for seamless marquee

  return (
    <section className="relative w-full h-[100svh] md:h-screen overflow-hidden bg-deepAnchor" ref={containerRef}>
      {/* Preload the poster */}
      <link rel="preload" as="image" href={`https://image.mux.com/${playbackId}/thumbnail.jpg`} fetchPriority="high" />

      <div ref={bgRef} className="absolute inset-0 w-full h-full scale-[1.2]">
        <MuxPlayer
          ref={playerRef}
          playbackId={playbackId}
          autoPlay="muted"
          loop
          muted
          playsInline
          style={{ width: "100%", height: "100%", objectFit: "cover", "--controls": "none" }}
          className="w-full h-full object-cover object-[50%_25%] md:object-center opacity-60 pointer-events-none"
        />
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 px-6 pt-[env(safe-area-inset-top)] pb-36 sm:pb-40 md:pb-48">
        <h1 className="text-[clamp(1.85rem,9vw,2.75rem)] md:text-6xl lg:text-8xl font-heading text-neutral-cream text-center tracking-widest drop-shadow-2xl">
          {t("brand")}
        </h1>
        <p className="mt-4 md:mt-8 text-xs sm:text-sm md:text-2xl text-neutral-grayBeige font-body font-light tracking-[0.15em] md:tracking-[0.2em] leading-relaxed max-w-[85%] md:max-w-2xl text-center uppercase drop-shadow-md">
          {t("tagline")}
        </p>
        <motion.div
          className="flex flex-col items-center gap-2 md:gap-3 mt-8 md:mt-16"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-neutral-grayBeige/80 font-body">{t("scroll")}</span>
          <div className="w-[1px] h-8 md:h-16 bg-neutral-grayBeige/20 relative overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 w-full h-1/2 bg-neutral-cream"
              animate={{ y: ["-100%", "200%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
          </div>
        </motion.div>
      </div>

      {/* Animated Image Marquee */}
      <div className="absolute -bottom-8 sm:-bottom-12 md:-bottom-24 left-0 w-full h-[28%] sm:h-[32%] md:h-2/5 z-10 [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)]">
        <motion.div
          className="flex gap-3 md:gap-4 w-max pr-4 h-full items-center"
          animate={{
            x: ["0%", "-50%"],
            transition: {
              ease: "linear",
              duration: 40,
              repeat: Infinity,
            },
          }}
        >
          {duplicatedImages.map((src, index) => (
            <div
              key={index}
              className="relative aspect-[3/4] h-32 sm:h-40 md:h-64 flex-shrink-0"
              style={{
                rotate: `${(index % 2 === 0 ? -2 : 5)}deg`,
              }}
            >
              <img
                src={src}
                alt={t("showcaseImageAlt", { index: index + 1 })}
                className="w-full h-full object-cover rounded-xl md:rounded-2xl shadow-md border border-white/10"
              />
            </div>
          ))}
        </motion.div>
      </div>
      
      {/* Subtle overlay gradient to blend with next section */}
      <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-background to-transparent z-20 pointer-events-none" />

    </section>
  );
}
