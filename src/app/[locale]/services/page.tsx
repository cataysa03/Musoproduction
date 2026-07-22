import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ServicesContent from "@/components/ServicesContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata.services" });
  return { title: t("title"), description: t("description") };
}

export default function ServicesPage() {
  return <ServicesContent />;
}
