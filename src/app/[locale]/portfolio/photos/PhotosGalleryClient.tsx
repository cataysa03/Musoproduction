"use client";

import MasonryGrid from "@/components/ui/masonry-grid";

interface GalleryItem {
  id: string;
  src: string;
  title: string;
}

export default function PhotosGalleryClient({ items }: { items: GalleryItem[] }) {
  return (
    <MasonryGrid
      items={items}
      className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4"
      gap="1rem"
      renderItem={(item: GalleryItem) => (
        <div className="overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out bg-card">
          <img
            src={item.src}
            alt={item.title || `Gallery item ${item.id}`}
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
      )}
    />
  );
}
