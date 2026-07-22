import PortfolioGrid from "@/components/PortfolioGrid";
import { supabase } from "@/lib/supabase";

export const revalidate = 0;

export default async function VideosPortfolioPage() {
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("media_type", "video")
    .order("created_at", { ascending: false });

  // Map the generic project data to the shape expected by PortfolioGrid
  // (which might expect playbackId if we change PortfolioGrid, but currently PortfolioGrid
  // just renders a card and links to /portfolio/videos/[id]).
  // Wait, let's look at how PortfolioGrid works. It accepts `items` and a `linkPrefix`.
  
  const videoProjects = projects?.map(p => ({
    id: p.id,
    title: p.title,
    category: p.category,
    color: p.color,
    media_type: p.media_type,
    media_url: p.media_url,
    client: p.client,
    year: p.year
  })) || [];

  return (
    <main className="w-full min-h-screen pt-32 pb-16">
      <PortfolioGrid title="Videos Portfolio" items={videoProjects as any} linkPrefix="/portfolio/videos" />
    </main>
  );
}
