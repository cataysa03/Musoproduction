import VideoHero from "@/components/VideoHero";
import PortfolioGrid from "@/components/PortfolioGrid";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ParallaxScrolling } from "@/components/ui/parallax-scrolling";
import ServicesContent from "@/components/ServicesContent";
import { supabase } from "@/lib/supabase";

export const revalidate = 0; // Disable caching for demo purposes

export default async function Home() {
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("is_featured", true)
    .order("created_at", { ascending: false });

  const featuredPhotos = projects?.filter(p => p.media_type === "photo") || [];
  const featuredVideos = projects?.filter(p => p.media_type === "video") || [];

  return (
    <main className="w-full h-full relative">
      <VideoHero />
      <ServicesContent showCta={false} />
      <ParallaxScrolling />
      <PortfolioGrid title="Photos" items={featuredPhotos} viewMoreLink="/portfolio/photos" />
      <PortfolioGrid title="Videos" items={featuredVideos} viewMoreLink="/portfolio/videos" linkPrefix="/portfolio/videos" />
      
      <section className="py-32 px-6 flex flex-col items-center justify-center text-center max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-heading text-neutral-cream mb-6">
          Ready to tell your story?
        </h2>
        <p className="text-neutral-grayBeige font-body text-lg mb-10 max-w-2xl font-light">
          We bring cinematic vision to commercial and documentary projects, delivering impact through authentic narrative and world-class production.
        </p>
        <Link href="/contact">
          <Button size="lg" className="text-lg px-8 h-14 rounded-none uppercase tracking-widest font-body font-medium transition-transform duration-300 hover:scale-105">
            Speak to an expert
          </Button>
        </Link>
      </section>
    </main>
  );
}
