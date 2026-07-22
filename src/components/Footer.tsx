"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  // Exclude admin pages from showing the global footer
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="bg-deepAnchor-alt2 border-t border-deepAnchor-alt1 py-16 px-6 md:px-12">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="md:col-span-2">
          <Link href="/" className="font-heading text-3xl text-neutral-cream tracking-widest uppercase block mb-4">
            Muso Production
          </Link>
          <p className="text-neutral-grayBeige font-body text-sm font-light max-w-sm">
            Premium Cinematic Production Portfolio. We bring vision to life through authentic narrative and world-class post-production.
          </p>
        </div>
        
        <div>
          <h4 className="font-body text-brass uppercase tracking-widest text-xs mb-4">Navigation</h4>
          <ul className="space-y-3">
            <li><Link href="/" className="text-neutral-grayBeige hover:text-neutral-cream transition-colors text-sm">Portfolio</Link></li>
            <li><Link href="/services" className="text-neutral-grayBeige hover:text-neutral-cream transition-colors text-sm">Services</Link></li>
            <li><Link href="/about" className="text-neutral-grayBeige hover:text-neutral-cream transition-colors text-sm">About</Link></li>
            <li><Link href="/contact" className="text-neutral-grayBeige hover:text-neutral-cream transition-colors text-sm">Contact</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-body text-brass uppercase tracking-widest text-xs mb-4">Social</h4>
          <ul className="space-y-3">
            <li><a href="#" className="text-neutral-grayBeige hover:text-neutral-cream transition-colors text-sm">Instagram</a></li>
            <li><a href="#" className="text-neutral-grayBeige hover:text-neutral-cream transition-colors text-sm">Vimeo</a></li>
            <li><a href="#" className="text-neutral-grayBeige hover:text-neutral-cream transition-colors text-sm">LinkedIn</a></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-[1600px] mx-auto mt-16 pt-8 border-t border-deepAnchor-alt1 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-neutral-grayBeige/50 text-xs font-body uppercase tracking-wider">
          © {new Date().getFullYear()} Muso Production. All rights reserved.
        </p>
        <div className="flex gap-6 text-neutral-grayBeige/50 text-xs font-body uppercase tracking-wider">
          <Link href="#" className="hover:text-neutral-grayBeige transition-colors">Privacy Policy</Link>
          <Link href="#" className="hover:text-neutral-grayBeige transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
