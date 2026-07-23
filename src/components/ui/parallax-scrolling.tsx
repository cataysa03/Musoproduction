"use client";

import { useEffect, useRef, useState } from "react";
import MuxPlayer from "@mux/mux-player-react";
import type MuxPlayerElement from "@mux/mux-player";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

interface ParallaxScrollingProps {
  /** Three images, back to front, used for the parallax layers. */
  images?: {
    back: string;
    mid: string;
    front: string;
  };
  /** Mux video rendered in the front layer instead of `images.front`. Pass null to fall back to the image. */
  video?: { playbackId: string } | null;
  className?: string;
}

const DEFAULT_IMAGES = {
  back: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=1600&auto=format&fit=crop",
  mid: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1600&auto=format&fit=crop",
  front: "https://images.unsplash.com/photo-1516280440504-a50f862492f4?q=80&w=1600&auto=format&fit=crop",
};

const DEFAULT_VIDEO = {
  playbackId: "BkRRPsMYDj2BE6HPYbj7UZiwQnExROEadipTn600pEQY",
};

// Speed differential per layer, kept in the 5-15 yPercent range so the
// layers never desync distractingly (per project motion guidelines).
const LAYERS = [
  { layer: "1", yPercent: 14 }, // back image - moves most
  { layer: "2", yPercent: 9 }, // mid image
  { layer: "4", yPercent: 4 }, // front image - moves least
] as const;

export function ParallaxScrolling({
  images = DEFAULT_IMAGES,
  video = DEFAULT_VIDEO,
  className,
}: ParallaxScrollingProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<MuxPlayerElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  // Don't even mount the player until the section is nearly in view - if it
  // starts fetching its manifest/segments at page load, it competes with
  // the hero video for bandwidth and slows down the very first thing the
  // visitor sees.
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoadVideo(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px 0px" }
    );
    observer.observe(section);

    return () => observer.disconnect();
  }, [video]);

  useEffect(() => {
    if (!shouldLoadVideo) return;
    const section = sectionRef.current;
    const player = playerRef.current;
    if (!section || !player) return;

    // The video keeps decoding/rendering frames even while scrolled far out
    // of view, which competes with the main thread for scroll performance.
    // Pause it once it leaves the viewport and resume when it re-enters.
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
    observer.observe(section);

    // Only reveal the video once frames are actually advancing, so viewers
    // never see the frozen first frame while it buffers - it fades in
    // already in motion.
    const handlePlaying = () => setIsPlaying(true);
    player.addEventListener("playing", handlePlaying);

    return () => {
      observer.disconnect();
      player.removeEventListener("playing", handlePlaying);
    };
  }, [shouldLoadVideo]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      if (!section) return;

      // A single scrollTrigger drives every layer (no pin) so the section
      // scrolls in lock-step with the rest of the page - only the layers
      // inside it drift at different rates to sell the depth.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      LAYERS.forEach(({ layer, yPercent }, idx) => {
        tl.to(
          section.querySelectorAll(`[data-parallax-layer="${layer}"]`),
          { yPercent, ease: "none" },
          idx === 0 ? undefined : "<"
        );
      });
    }, sectionRef);

    // Recalculate once images/fonts have settled so positions stay accurate.
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    return () => {
      window.removeEventListener("load", onLoad);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={cn(
        "relative h-screen w-full overflow-hidden bg-deepAnchor",
        className
      )}
    >
      <div
        data-parallax-layer="1"
        className="absolute -top-[20%] z-0 h-[140%] w-full"
        style={{ willChange: "transform" }}
      >
        <img
          src={images.back}
          alt=""
          loading="eager"
          className="h-full w-full object-cover opacity-70"
        />
      </div>

      <div
        data-parallax-layer="2"
        className="absolute -top-[20%] z-10 h-[140%] w-full"
        style={{ willChange: "transform" }}
      >
        <img
          src={images.mid}
          alt=""
          loading="eager"
          className="h-full w-full object-cover opacity-90"
        />
      </div>

      <div
        data-parallax-layer="4"
        className="absolute -top-[20%] z-20 h-[140%] w-full"
        style={{ willChange: "transform" }}
      >
        {video && shouldLoadVideo ? (
          <MuxPlayer
            ref={playerRef}
            playbackId={video.playbackId}
            autoPlay="muted"
            preload="auto"
            loop
            muted
            playsInline
            style={{ width: "100%", height: "100%", objectFit: "cover", "--controls": "none" }}
            className={`h-full w-full object-cover pointer-events-none transition-opacity duration-700 ease-out ${
              isPlaying ? "opacity-100" : "opacity-0"
            }`}
          />
        ) : (
          <img
            src={images.front}
            alt=""
            loading="eager"
            className="h-full w-full object-cover"
          />
        )}
      </div>

      {/* Blends the seams revealed between layers into the site's dark background */}
      <div className="pointer-events-none absolute inset-0 z-40 bg-gradient-to-b from-black/50 via-transparent to-background" />
    </section>
  );
}
