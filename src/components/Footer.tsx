"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";

export default function Footer() {
  const pathname = usePathname();
  const t = useTranslations("Footer");

  // Exclude admin pages from showing the global footer
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="bg-deepAnchor-alt2 border-t border-deepAnchor-alt1 py-16 px-6 md:px-12">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-12">
        <div className="md:col-span-2">
          <Link href="/" className="font-heading text-3xl text-neutral-cream tracking-widest uppercase block mb-4">
            {t("brand")}
          </Link>
          <p className="text-neutral-grayBeige font-body text-sm font-light max-w-sm">
            {t("tagline")}
          </p>
        </div>

        <div>
          <h4 className="font-body text-brass uppercase tracking-widest text-xs mb-4">{t("navigationHeading")}</h4>
          <ul className="space-y-3">
            <li><Link href="/" className="text-neutral-grayBeige hover:text-neutral-cream transition-colors text-sm">{t("portfolio")}</Link></li>
            <li><Link href="/services" className="text-neutral-grayBeige hover:text-neutral-cream transition-colors text-sm">{t("services")}</Link></li>
            <li><Link href="/about" className="text-neutral-grayBeige hover:text-neutral-cream transition-colors text-sm">{t("about")}</Link></li>
            <li><Link href="/contact" className="text-neutral-grayBeige hover:text-neutral-cream transition-colors text-sm">{t("contact")}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-body text-brass uppercase tracking-widest text-xs mb-4">{t("socialHeading")}</h4>
          <ul className="space-y-3">
            <li><a href="https://www.instagram.com/muso.production/?hl=en" target="_blank" rel="noopener noreferrer" className="text-neutral-grayBeige hover:text-neutral-cream transition-colors text-sm">{t("instagram")}</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-body text-brass uppercase tracking-widest text-xs mb-4">{t("contactHeading")}</h4>
          <ul className="space-y-3">
            <li><a href="mailto:info@musoproduction.com" className="text-neutral-grayBeige hover:text-neutral-cream transition-colors text-sm">info@musoproduction.com</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto mt-16 pt-8 border-t border-deepAnchor-alt1 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-neutral-grayBeige/50 text-xs font-body uppercase tracking-wider">
          {t("copyright", { year: new Date().getFullYear() })}
        </p>
        <div className="flex gap-6 text-neutral-grayBeige/50 text-xs font-body uppercase tracking-wider">
          <Link href="#" className="hover:text-neutral-grayBeige transition-colors">{t("privacyPolicy")}</Link>
          <Link href="#" className="hover:text-neutral-grayBeige transition-colors">{t("termsOfService")}</Link>
        </div>
      </div>
    </footer>
  );
}
