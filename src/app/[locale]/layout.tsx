import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import SmoothScrollProvider from "@/providers/SmoothScrollProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HtmlLangSync from "@/components/HtmlLangSync";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata.home" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: locale === routing.defaultLocale ? "/" : `/${locale}`,
      languages: {
        tr: "/",
        en: "/en",
        "x-default": "/",
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <HtmlLangSync />
      <div className="film-grain"></div>

      <SmoothScrollProvider>
        <Header />
        <main className="flex-grow pt-0">{children}</main>
        <Footer />
      </SmoothScrollProvider>
    </NextIntlClientProvider>
  );
}
