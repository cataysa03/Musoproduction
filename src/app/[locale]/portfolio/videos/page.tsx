import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import PortfolioGrid from "@/components/PortfolioGrid";
import { supabase } from "@/lib/supabase";
import { pickLocalized } from "@/lib/localizedField";

export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata.portfolioVideos" });
  return { title: t("title"), description: t("description") };
}

export default async function VideosPortfolioPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Portfolio" });

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("media_type", "video")
    .order("created_at", { ascending: false });

  // Map the generic project data to the shape expected by PortfolioGrid
  const videoProjects = projects?.map(p => ({
    id: p.id,
    title: pickLocalized(locale, p.title_tr, p.title_en),
    category: pickLocalized(locale, p.category_tr, p.category_en),
    color: p.color,
    media_type: p.media_type,
    media_url: p.media_url,
    client: p.client,
    year: p.year
  })) || [];

  return (
    <main className="w-full min-h-screen pt-32 pb-16">
      <PortfolioGrid title={t("videosHeading")} items={videoProjects as any} linkPrefix="/portfolio/videos" />
    </main>
  );
}
