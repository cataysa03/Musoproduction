import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ContactForm from "@/components/ContactForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata.contact" });
  return { title: t("title"), description: t("description") };
}

export default function ContactPage() {
  return <ContactForm />;
}
