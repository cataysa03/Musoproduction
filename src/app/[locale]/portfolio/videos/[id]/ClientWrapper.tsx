"use client";

import { useRouter } from "next/navigation";
import CinematicVideoShowcase, { ShowcaseProject } from "@/components/CinematicVideoShowcase";

export default function ClientWrapper({ project, nextProjectId }: { project: ShowcaseProject, nextProjectId: number | string }) {
  const router = useRouter();

  return (
    <CinematicVideoShowcase 
      project={project} 
      onNext={() => router.push(`/portfolio/videos/${nextProjectId}`)} 
    />
  );
}
