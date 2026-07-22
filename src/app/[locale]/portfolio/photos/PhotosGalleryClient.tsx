"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import MasonryGrid from "@/components/ui/masonry-grid";

interface GalleryItem {
  id: string;
  src: string;
  title: string;
}

const BATCH_SIZE = 12;
// The Next.js image optimizer occasionally 500s when asked to resize many
// distinct images at once. Retry a couple of times, then fall back to the
// original file (bypassing the optimizer) rather than leaving a broken image.
const MAX_RETRIES = 2;

function GalleryImage({
  src,
  alt,
  sizes,
  priority,
}: {
  src: string;
  alt: string;
  sizes: string;
  priority: boolean;
}) {
  const [loaded, setLoaded] = useState(false);
  const [attempt, setAttempt] = useState(0);

  return (
    <>
      {!loaded && <div className="w-full aspect-[3/4] bg-muted animate-pulse" />}
      <Image
        key={attempt}
        src={src}
        alt={alt}
        width={0}
        height={0}
        sizes={sizes}
        className={loaded ? "w-full h-auto object-cover" : "hidden"}
        style={{ width: "100%", height: "auto" }}
        loading={priority ? "eager" : "lazy"}
        priority={priority}
        unoptimized={attempt >= MAX_RETRIES}
        onLoad={() => setLoaded(true)}
        onError={() => setAttempt((a) => a + 1)}
      />
    </>
  );
}

export default function PhotosGalleryClient({ items }: { items: GalleryItem[] }) {
  const t = useTranslations("Portfolio");
  const [visibleCount, setVisibleCount] = useState(Math.min(BATCH_SIZE, items.length));
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((count) => Math.min(count + BATCH_SIZE, items.length));
        }
      },
      { rootMargin: "600px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [items.length]);

  const visibleItems = items.slice(0, visibleCount);

  return (
    <>
      <MasonryGrid
        items={visibleItems}
        className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4"
        gap="1rem"
        renderItem={(item: GalleryItem, index: number) => (
          <div className="overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out bg-card">
            <GalleryImage
              src={item.src}
              alt={item.title || t("galleryItemAlt", { id: item.id })}
              sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              priority={index < 4}
            />
          </div>
        )}
      />
      {visibleCount < items.length && <div ref={sentinelRef} className="h-1 w-full" />}
    </>
  );
}
