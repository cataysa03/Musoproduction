"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("Header");

  const otherLocale = locale === "tr" ? "en" : "tr";

  return (
    <button
      type="button"
      onClick={() => router.replace(pathname, { locale: otherLocale })}
      aria-label={t("languageSwitcherLabel")}
      className="flex items-center gap-1 font-body text-xs uppercase tracking-widest text-neutral-grayBeige hover:text-neutral-cream transition-colors"
    >
      <span className={locale === "tr" ? "text-brass" : ""}>TR</span>
      <span className="text-neutral-grayBeige/40">|</span>
      <span className={locale === "en" ? "text-brass" : ""}>EN</span>
    </button>
  );
}
