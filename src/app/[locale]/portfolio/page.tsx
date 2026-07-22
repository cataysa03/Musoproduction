import Link from "next/link";

export default function PortfolioPage() {
  return (
    <main className="w-full min-h-screen bg-deepAnchor pt-32 pb-16 flex flex-col items-center justify-center">
      <div className="max-w-5xl w-full px-6 text-center">
        <h1 className="font-heading text-4xl md:text-6xl text-neutral-cream mb-4">
          Portfolio
        </h1>
        <p className="font-body text-neutral-grayBeige/70 uppercase tracking-widest text-sm mb-16">
          Choose a section
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/portfolio/photos"
            className="group relative h-64 md:h-80 flex items-center justify-center border border-deepAnchor-alt1 bg-deepAnchor-alt2 overflow-hidden transition-colors duration-500 hover:border-brass"
          >
            <span className="font-heading text-3xl md:text-4xl text-neutral-cream group-hover:text-brass transition-colors duration-500">
              Photos
            </span>
          </Link>

          <Link
            href="/portfolio/videos"
            className="group relative h-64 md:h-80 flex items-center justify-center border border-deepAnchor-alt1 bg-deepAnchor-alt2 overflow-hidden transition-colors duration-500 hover:border-brass"
          >
            <span className="font-heading text-3xl md:text-4xl text-neutral-cream group-hover:text-brass transition-colors duration-500">
              Videos
            </span>
          </Link>
        </div>
      </div>
    </main>
  );
}
