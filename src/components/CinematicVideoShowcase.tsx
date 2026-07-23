"use client";

import React, { useEffect, useRef, useState } from "react";
import MuxPlayer from "@mux/mux-player-react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { X, Volume2, VolumeX } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

export interface ShowcaseProject {
  id: number | string;
  title: string;
  category: string;
  playbackId: string;
  client?: string;
  year?: number;
  credits?: { role: string; name: string }[];
}

interface CinematicVideoShowcaseProps {
  project: ShowcaseProject;
  onNext: () => void;
}

export default function CinematicVideoShowcase({ project, onNext }: CinematicVideoShowcaseProps) {
  const t = useTranslations("CinematicVideoShowcase");
  const locale = useLocale();
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStartedPlaying, setHasStartedPlaying] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [isIdle, setIsIdle] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  
  const idleTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync state with player
  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    // Reset so the new video also fades in from a clean state instead of
    // snapping straight to visible with a frozen frame.
    setHasStartedPlaying(false);

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    // Only reveal the video once frames are actually advancing, so viewers
    // never see the frozen first frame while it buffers.
    const handlePlaying = () => setHasStartedPlaying(true);

    player.addEventListener("play", handlePlay);
    player.addEventListener("pause", handlePause);
    player.addEventListener("playing", handlePlaying);

    return () => {
      player.removeEventListener("play", handlePlay);
      player.removeEventListener("pause", handlePause);
      player.removeEventListener("playing", handlePlaying);
    };
  }, [project.playbackId]); // Re-bind if playbackId changes, though ref is same

  // Idle logic
  useEffect(() => {
    const resetIdle = () => {
      setIsIdle(false);
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
      if (isPlaying) {
        idleTimeoutRef.current = setTimeout(() => setIsIdle(true), 3000);
      }
    };

    const handleUserActivity = () => {
      resetIdle();
    };

    window.addEventListener("mousemove", handleUserActivity);
    window.addEventListener("touchstart", handleUserActivity);
    window.addEventListener("keydown", handleUserActivity);

    resetIdle();

    return () => {
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
      window.removeEventListener("mousemove", handleUserActivity);
      window.removeEventListener("touchstart", handleUserActivity);
      window.removeEventListener("keydown", handleUserActivity);
    };
  }, [isPlaying]);

  const togglePlayback = () => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pause();
      } else {
        playerRef.current.play();
      }
    }
  };

  const toggleMute = () => {
    setIsMuted((prev: boolean) => !prev);
  };

  const toggleFullscreen = () => {
    const player = playerRef.current;
    if (!player) return;

    // iOS Safari doesn't support Fullscreen API on arbitrary elements, only on
    // <video> via webkitEnterFullscreen. mux-player's own requestFullscreen/
    // exitFullscreen methods already handle that fallback internally, so we
    // delegate to the player instead of the wrapping container div.
    const media = player.media;
    const isCurrentlyFullscreen =
      !!(document.fullscreenElement || (document as any).webkitFullscreenElement) ||
      !!(media?.webkitDisplayingFullscreen && media?.webkitPresentationMode === "fullscreen");

    if (isCurrentlyFullscreen) {
      player.exitFullscreen?.();
    } else {
      player.requestFullscreen?.();
    }
  };

  // GSAP Entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".stagger-in",
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.15,
          ease: "cinematic",
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, [project.id]);

  const year = project.year || new Date().getFullYear();
  const clientName = project.client || t("defaultClientName");
  const studioName = t("studioName");

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-[16/10] md:aspect-video max-h-[80vh] flex flex-col overflow-hidden rounded-[28px] shadow-2xl border border-neutral-cream/10 bg-deepAnchor mx-auto z-10"
    >
      {/* 1. Video Canvas (Top Layer, ~92%) */}
      <div className="relative w-full flex-1 overflow-hidden rounded-t-[28px] bg-deepAnchor-alt2">
        <MuxPlayer
          ref={playerRef}
          playbackId={project.playbackId}
          style={{ width: "100%", height: "100%", objectFit: "cover", "--controls": "none" } as any}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-out ${
            hasStartedPlaying ? "opacity-100" : "opacity-0"
          }`}
          autoPlay="muted"
          preload="auto"
          loop
          muted={isMuted}
        />

        {/* --- HUD OVERLAYS --- */}
        <div 
          className={`absolute inset-0 z-10 transition-opacity duration-700 ease-cinematic pointer-events-none ${isIdle ? "opacity-15" : "opacity-100"}`}
        >
          {/* Enable pointer events only on interactive elements to not block clicks on the video if needed */}
          
          {/* Top Left: Logo + Tag */}
          <div className="absolute top-3 left-3 right-3 md:top-6 md:left-6 md:right-auto flex items-center gap-1.5 md:gap-3 stagger-in pointer-events-auto">
            <div className="w-6 h-6 md:w-8 md:h-8 shrink-0 rounded-md bg-deepAnchor-alt2/50 backdrop-blur-md border border-neutral-cream/10 flex items-center justify-center text-xs md:text-base font-bold text-neutral-cream">
              M
            </div>
            <span className="font-mono text-[9px] md:text-xs tracking-[0.1em] md:tracking-[0.15em] text-neutral-cream uppercase truncate">
              {clientName}
            </span>
            <div className="flex items-center gap-1.5 md:gap-2 font-mono text-[8px] md:text-[10px] tracking-wide md:tracking-widest text-neutral-cream/70 bg-deepAnchor-alt2/50 backdrop-blur-sm border border-neutral-cream/10 px-1.5 md:px-2 py-0.5 md:py-1 rounded shrink-0 whitespace-nowrap">
              {isPlaying ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  [ {t("rolling")} ]
                </>
              ) : (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-cream/40" />
                  [ {project.category.toLocaleUpperCase(locale)} ]
                </>
              )}
            </div>
          </div>

          {/* Center: Play Button */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
            <motion.button
              onClick={togglePlayback}
              whileTap={{ scale: 0.94 }}
              animate={!isPlaying ? { scale: [1, 1.04, 1] } : { scale: 1 }}
              transition={!isPlaying ? { duration: 3, repeat: Infinity, ease: "easeInOut" } : {}}
              className="relative w-16 h-16 md:w-40 md:h-40 rounded-full border border-neutral-cream/60 flex items-center justify-center font-mono text-[9px] md:text-xs tracking-[0.1em] md:tracking-[0.15em] text-neutral-cream stagger-in hover:bg-black/10 transition-colors"
            >
              {isPlaying ? t("pause") : t("play")}
            </motion.button>
          </div>

          {/* Bottom Bar: Transport Controls (left) + More Project (right), same level */}
          <div className="absolute bottom-2.5 left-2.5 right-2.5 md:bottom-6 md:left-6 md:right-6 flex items-center justify-between gap-x-2 stagger-in pointer-events-auto">
            <div className="flex items-center gap-x-1.5 md:gap-4 font-mono text-[7.5px] md:text-xs md:tracking-[0.15em] whitespace-nowrap">
              <button
                onClick={() => { if (playerRef.current) playerRef.current.play(); }}
                className={`hover:underline hover:text-neutral-cream transition-colors duration-300 ease-cinematic ${isPlaying ? 'text-neutral-cream' : 'text-neutral-cream/70'}`}
                aria-label={t("playAria")}
              >
                [{t("play")}]
              </button>
              <button
                onClick={() => { if (playerRef.current) playerRef.current.pause() }}
                className={`hover:underline hover:text-neutral-cream transition-colors duration-300 ease-cinematic ${!isPlaying ? 'text-neutral-cream' : 'text-neutral-cream/70'}`}
                aria-label={t("pauseAria")}
              >
                [{t("pause")}]
              </button>
              <button
                onClick={toggleFullscreen}
                className="text-neutral-cream/70 hover:underline hover:text-neutral-cream transition-colors duration-300 ease-cinematic"
                aria-label={t("fullscreenAria")}
              >
                [{t("fullscreen")}]
              </button>
              <button
                onClick={toggleMute}
                className="flex items-center gap-0.5 md:gap-1.5 text-neutral-cream/70 hover:underline hover:text-neutral-cream transition-colors duration-300 ease-cinematic"
                aria-label={isMuted ? t("unmuteAria") : t("muteAria")}
              >
                {isMuted ? <VolumeX className="w-2.5 h-2.5 md:w-3.5 md:h-3.5" /> : <Volume2 className="w-2.5 h-2.5 md:w-3.5 md:h-3.5" />}
                [{isMuted ? t("unmute") : t("mute")}]
              </button>
            </div>

            <button
              onClick={onNext}
              className="shrink-0 font-mono text-[7.5px] md:text-xs md:tracking-[0.15em] whitespace-nowrap text-neutral-cream hover:text-neutral-cream/70 transition-colors flex items-center gap-1 md:gap-2"
            >
              {t("moreProject")} <span className="text-[6px] md:text-[8px]">■</span>
            </button>
          </div>
        </div>

        {/* Info Panel Overlay */}
        <AnimatePresence>
          {showInfo && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute right-8 top-1/2 -translate-y-1/2 w-72 bg-deepAnchor-alt2/90 backdrop-blur-xl border border-neutral-cream/10 rounded-2xl p-6 z-30"
            >
              <button 
                onClick={() => setShowInfo(false)}
                className="absolute top-4 right-4 text-neutral-cream/70 hover:text-neutral-cream"
              >
                <X className="w-4 h-4" />
              </button>
              <h3 className="font-slab text-xl uppercase text-neutral-cream mb-4">{project.title}</h3>
              <div className="space-y-3 font-mono text-[10px] tracking-widest text-neutral-cream/70 uppercase">
                <div className="grid grid-cols-2 gap-2 border-b border-neutral-cream/10 pb-2">
                  <span>{t("clientLabel")}</span>
                  <span className="text-neutral-cream">{clientName}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 border-b border-neutral-cream/10 pb-2">
                  <span>{t("yearLabel")}</span>
                  <span className="text-neutral-cream">{year}</span>
                </div>
                {project.credits?.map((credit, i) => (
                  <div key={i} className="grid grid-cols-2 gap-2 border-b border-neutral-cream/10 pb-2 last:border-0">
                    <span>{credit.role}</span>
                    <span className="text-neutral-cream">{credit.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 2. Bezel Bar (Bottom Layer, ~8%) */}
      <div className="h-12 md:h-16 w-full shrink-0 bg-deepAnchor-alt2 border-t border-neutral-cream/5 flex items-center justify-between px-6 font-mono text-[10px] md:text-[11px] tracking-widest text-neutral-cream/60 uppercase rounded-b-[28px] z-20">
        <span>{year} © {clientName}</span>
        <span className="hidden md:inline-block">{t("craftedBy", { studio: studioName })}</span>
        <button className="text-brass hover:text-brass-alt transition-colors font-bold">
          {t("inquire")}
        </button>
      </div>
    </div>
  );
}
