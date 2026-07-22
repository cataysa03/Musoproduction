"use client";

import { useRouter } from "@/i18n/routing";
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
