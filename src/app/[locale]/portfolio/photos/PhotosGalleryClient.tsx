"use client";

import { useEffect, useRef, useState } from "react";
import Image, { type ImageLoaderProps } from "next/image";
import { useTranslations } from "next-intl";
import MasonryGrid from "@/components/ui/masonry-grid";

interface GalleryItem {
  id: string;
  src: string;
  title: string;
}

const BATCH_SIZE = 12;
// Next.js's own image optimizer resizes on-demand with a single Node process,
// which times out (500) when asked to resize a dozen+ distinct images at
// once — exactly what this masonry grid does on load. Supabase Storage can
// resize images on the fly via its render endpoint, which handles the same
// concurrent load without choking, so route through that instead.
function supabaseImageLoader({ src, width, quality }: ImageLoaderProps) {
  const renderUrl = src.replace(
    "/storage/v1/object/public/",
    "/storage/v1/render/image/public/"
  );
  // resize=contain is required: without it, Supabase's transform endpoint
  // leaves height at the original pixel value when only width is given,
  // producing a badly distorted image (e.g. 640x5824 instead of 640x960).
  return `${renderUrl}?width=${width}&quality=${quality ?? 75}&resize=contain`;
}

// Safety net in case the render endpoint ever fails: fall back to the
// original file (fully bypassing image optimization) rather than leaving a
// broken image.
const MAX_RETRIES = 1;

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
        // Chromium's native `loading="lazy"` heuristic never fires for images
        // inside this CSS-columns + Framer Motion masonry layout (transformed,
        // column-repositioned elements throw off its viewport-distance guess),
        // so images render as permanently stuck placeholders. The gallery
        // already windows how many images are in the DOM via its own
        // IntersectionObserver (BATCH_SIZE), so native lazy loading is both
        // redundant and broken here — always eager-load what's rendered.
        loading="eager"
        priority={priority}
        loader={supabaseImageLoader}
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
