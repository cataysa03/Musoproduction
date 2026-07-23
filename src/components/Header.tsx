"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function Header() {
  const pathname = usePathname();
  const t = useTranslations("Header");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close the drawer on route change and lock page scroll while it's open.
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  // Exclude admin pages from showing the global header
  if (pathname?.startsWith("/admin")) {
    return null;
  }

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
    <>
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b border-transparent pt-[env(safe-area-inset-top)] ${
        isScrolled || isMenuOpen ? "bg-background/80 backdrop-blur-md border-deepAnchor-alt1 py-4" : "bg-transparent py-3"
      }`}
    >
      <div className="max-w-[1600px] mx-auto px-5 sm:px-6 md:px-12 flex justify-between items-center">
        <Link href="/" className="flex items-center shrink-0" onClick={() => setIsMenuOpen(false)}>
          <img
            src="/logo.png"
            alt={t("logoAlt")}
            className="h-9 md:h-12 w-auto object-contain scale-[2.5] md:scale-[4] origin-left"
          />
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

        {/* Mobile menu toggle */}
        <button
          onClick={() => setIsMenuOpen((open) => !open)}
          className="md:hidden relative z-[60] -mr-2 flex h-11 w-11 items-center justify-center text-neutral-cream"
          aria-label={t("menuToggle")}
          aria-expanded={isMenuOpen}
        >
          <span className="relative block h-4 w-6">
            <span
              className={`absolute left-0 top-0 h-[1.5px] w-full bg-current transition-all duration-300 ${
                isMenuOpen ? "top-1/2 -translate-y-1/2 rotate-45" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-1/2 h-[1.5px] w-full -translate-y-1/2 bg-current transition-opacity duration-300 ${
                isMenuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 bottom-0 h-[1.5px] w-full bg-current transition-all duration-300 ${
                isMenuOpen ? "bottom-1/2 translate-y-1/2 -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </div>
    </header>

    {/* Mobile menu drawer — rendered as a header sibling, not a child, so it
        stays fixed to the viewport even when the header itself picks up a
        backdrop-blur (which would otherwise create a containing block for it). */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed inset-0 z-50 md:hidden bg-black/95 backdrop-blur-md pt-[calc(env(safe-area-inset-top)+5.5rem)] pb-[calc(env(safe-area-inset-bottom)+2rem)] px-8 flex flex-col overflow-y-auto"
            onClick={() => setIsMenuOpen(false)}
          >
            <nav className="flex flex-col gap-1">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.08 + index * 0.05, ease: [0.25, 0.1, 0.25, 1] }}
                  className="border-b border-deepAnchor-alt1 py-4"
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`font-heading text-3xl tracking-wide ${
                      pathname === link.href || (link.submenu && pathname?.startsWith(link.href))
                        ? "text-brass"
                        : "text-neutral-cream"
                    }`}
                  >
                    {link.name}
                  </Link>

                  {link.submenu && (
                    <div className="mt-3 flex flex-col gap-3 pl-1">
                      {link.submenu.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          onClick={() => setIsMenuOpen(false)}
                          className="font-body text-xs uppercase tracking-[0.2em] text-neutral-grayBeige/70"
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.08 + navLinks.length * 0.05, ease: [0.25, 0.1, 0.25, 1] }}
              className="mt-auto flex items-center justify-between gap-4 pt-8"
            >
              <LanguageSwitcher />

              <Link href="/contact" onClick={() => setIsMenuOpen(false)}>
                <Button variant="outline" className="border-brass text-brass hover:bg-brass hover:text-background rounded-none uppercase tracking-widest text-xs h-11 px-6">
                  {t("inquire")}
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
