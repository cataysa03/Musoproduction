import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import PhotosGalleryClient from "./PhotosGalleryClient";
import { supabase } from "@/lib/supabase";
import { pickLocalized } from "@/lib/localizedField";

export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata.portfolioPhotos" });
  return { title: t("title"), description: t("description") };
}

export default async function PhotosPortfolioPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Portfolio" });

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("media_type", "photo")
    .order("created_at", { ascending: false });

  const galleryItems = projects?.map(p => ({
    id: p.id,
    src: p.media_url,
    title: pickLocalized(locale, p.title_tr, p.title_en)
  })) || [];

  return (
    <main className="w-full min-h-screen pt-32 pb-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            {t("photosHeading")}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t("photosSubheading")}
          </p>
        </div>

        <PhotosGalleryClient items={galleryItems} />
      </div>
    </main>
  );
}
