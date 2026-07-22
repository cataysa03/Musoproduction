import React from 'react';
import PhotosGalleryClient from './PhotosGalleryClient';
import { supabase } from "@/lib/supabase";

export const revalidate = 0; 

export default async function PhotosPortfolioPage() {
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("media_type", "photo")
    .order("created_at", { ascending: false });

  const galleryItems = projects?.map(p => ({
    id: p.id,
    src: p.media_url,
    title: p.title
  })) || [];

  return (
    <main className="w-full min-h-screen pt-32 pb-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Photos Portfolio
          </h1>
          <p className="text-lg text-muted-foreground">
            A showcase of nature's beauty and professional photography
          </p>
        </div>

        <PhotosGalleryClient items={galleryItems} />
      </div>
    </main>
  );
}
