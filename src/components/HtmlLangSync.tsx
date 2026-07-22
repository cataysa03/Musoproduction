"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";

/**
 * The root layout owns <html> and also serves locale-less routes
 * (/admin, /api), so it can't read the active locale to set `lang`
 * dynamically. This syncs it client-side once a locale is known.
 */
export default function HtmlLangSync() {
  const locale = useLocale();

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}
