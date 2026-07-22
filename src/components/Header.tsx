"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function Header() {
  const pathname = usePathname();
  const t = useTranslations("Header");
  const [isScrolled, setIsScrolled] = useState(false);

  // Exclude admin pages from showing the global header
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    {
      name: t("portfolio"),
      href: "/portfolio",
      submenu: [
        { name: t("photos"), href: "/portfolio/photos" },
        { name: t("videos"), href: "/portfolio/videos" }
      ]
    },
    { name: t("services"), href: "/services" },
    { name: t("about"), href: "/about" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b border-transparent ${
        isScrolled ? "bg-background/80 backdrop-blur-md border-deepAnchor-alt1 py-4" : "bg-transparent py-3"
      }`}
    >
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <img src="/logo.png" alt={t("logoAlt")} className="h-12 w-auto object-contain scale-[4] origin-left" />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <div key={link.name} className="relative group py-2">
              <Link
                href={link.href}
                className={`font-body text-sm uppercase tracking-widest transition-colors ${
                  pathname === link.href || (link.submenu && pathname?.startsWith(link.href))
                    ? "text-brass"
                    : "text-neutral-grayBeige hover:text-neutral-cream"
                }`}
              >
                {link.name}
              </Link>

              {link.submenu && (
                <div className="absolute top-full left-0 mt-2 w-40 bg-background/95 backdrop-blur-md border border-deepAnchor-alt1 rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top translate-y-2 group-hover:translate-y-0 flex flex-col py-2">
                  {link.submenu.map((subItem) => (
                    <Link
                      key={subItem.name}
                      href={subItem.href}
                      className="px-4 py-2 font-body text-xs uppercase tracking-widest text-neutral-grayBeige hover:text-brass hover:bg-deepAnchor transition-colors"
                    >
                      {subItem.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          <LanguageSwitcher />

          <Link href="/contact" className="ml-4">
            <Button variant="outline" className="border-brass text-brass hover:bg-brass hover:text-background rounded-none uppercase tracking-widest text-xs h-10 px-6">
              {t("inquire")}
            </Button>
          </Link>
        </nav>

        {/* Mobile menu toggle placeholder */}
        <button className="md:hidden text-neutral-cream" aria-label={t("menuToggle")}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
        </button>
      </div>
    </header>
  );
}
