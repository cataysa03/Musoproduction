import type { Metadata } from "next";
import SmoothScrollProvider from "@/providers/SmoothScrollProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Muso Production | Premium Cinematic Portfolio",
  description: "High-end cinematic production portfolio.",
};

export default function LocaleLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="film-grain"></div>

      <SmoothScrollProvider>
        <Header />
        <main className="flex-grow pt-0">{children}</main>
        <Footer />
      </SmoothScrollProvider>
    </>
  );
}
