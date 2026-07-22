import VideoHero from "@/components/VideoHero";
import PortfolioGrid from "@/components/PortfolioGrid";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { ParallaxScrolling } from "@/components/ui/parallax-scrolling";
import ServicesContent from "@/components/ServicesContent";
import { supabase } from "@/lib/supabase";
import { pickLocalized } from "@/lib/localizedField";
import { getTranslations } from "next-intl/server";

export const revalidate = 0; // Disable caching for demo purposes

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Home" });

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("is_featured", true)
    .order("created_at", { ascending: false });

  const localize = (p: any) => ({
    ...p,
    title: pickLocalized(locale, p.title_tr, p.title_en),
    category: pickLocalized(locale, p.category_tr, p.category_en),
  });

  const featuredPhotos = (projects?.filter((p) => p.media_type === "photo") || []).map(localize);
  const featuredVideos = (projects?.filter((p) => p.media_type === "video") || []).map(localize);

  return (
    <main className="w-full h-full relative">
      <VideoHero />
      <ServicesContent showCta={false} />
      <ParallaxScrolling />
      <PortfolioGrid title={t("photosGridTitle")} items={featuredPhotos} viewMoreLink="/portfolio/photos" />
      <PortfolioGrid title={t("videosGridTitle")} items={featuredVideos} viewMoreLink="/portfolio/videos" linkPrefix="/portfolio/videos" />

      <section className="py-32 px-6 flex flex-col items-center justify-center text-center max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-heading text-neutral-cream mb-6">
          {t("ctaHeading")}
        </h2>
        <p className="text-neutral-grayBeige font-body text-lg mb-10 max-w-2xl font-light">
          {t("ctaBody")}
        </p>
        <Link href="/contact">
          <Button size="lg" className="text-lg px-8 h-14 rounded-none uppercase tracking-widest font-body font-medium transition-transform duration-300 hover:scale-105">
            {t("ctaButton")}
          </Button>
        </Link>
      </section>
    </main>
  );
}
