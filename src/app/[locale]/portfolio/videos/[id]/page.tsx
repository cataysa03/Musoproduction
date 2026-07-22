import { notFound } from "next/navigation";
import ClientWrapper from "./ClientWrapper";
import { ShowcaseProject } from "@/components/CinematicVideoShowcase";
import { supabase } from "@/lib/supabase";

export const revalidate = 0;

export default async function VideoProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data: videoProjects } = await supabase
    .from("projects")
    .select("*")
    .eq("media_type", "video")
    .order("created_at", { ascending: false });

  const currentIndex = (videoProjects || []).findIndex((p) => String(p.id) === id);
  const record = currentIndex !== -1 ? videoProjects![currentIndex] : null;

  if (!record) {
    notFound();
  }

  const project: ShowcaseProject = {
    id: record.id,
    title: record.title,
    category: record.category,
    playbackId: record.media_url,
    client: record.client,
    year: record.year,
  };

  const nextIndex = (currentIndex + 1) % videoProjects!.length;
  const nextProject = videoProjects![nextIndex];

  return (
    <main className="relative w-full min-h-screen bg-deepAnchor flex flex-col items-center justify-center p-4 md:p-12 lg:p-24 xl:p-32 pt-28 md:pt-36 lg:pt-40 overflow-hidden">
      {/* Background Image Effect */}
      <div
        className="absolute inset-0 w-full h-full opacity-30 blur-3xl scale-110 pointer-events-none"
        style={{
          backgroundImage: `url('https://image.mux.com/${project.playbackId}/thumbnail.jpg?time=0')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 bg-deepAnchor/50 pointer-events-none" />
      <div className="film-grain absolute inset-0 pointer-events-none opacity-50" />

      <div className="w-full max-w-[1400px] z-10 relative">
        <ClientWrapper project={project} nextProjectId={nextProject.id} />
      </div>
    </main>
  );
}
