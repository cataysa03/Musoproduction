# Master Prompt: "Director's Slate" Cinematic Video Showcase

This is a targeted addendum to `project and design guideline.md`, scoped specifically to the **Videos portfolio experience** (the full-bleed single-video player moment — homepage hero and individual project showcase). It translates the reference screenshot into a buildable spec for this codebase (Next.js App Router, Tailwind, GSAP `ScrollTrigger`, Framer Motion, `@mux/mux-player-react`).

Everywhere else on the site keeps the existing Midnight Cinematic / Zodiak-serif language untouched. This style is a deliberate, contained exception for the moment the visitor is *inside* a video — it should read like professional viewfinder/monitor HUD chrome (a film slate, a director's monitor overlay), not like a generic video player skin.

---

## 🎬 DIMENSION 0: Intent

The reference is not a marketing hero — it's an **operator's overlay**. Every label is bracketed, monospaced, uppercase, and functional-looking, as if borrowed from editing software or a camera's on-screen display. The video itself supplies all color and emotion; the UI stays graphite/cream and gets out of the way. Restraint is the whole point: one circular play affordance, one headline, thin rules, no gradients or drop-shadow-heavy buttons.

## 🖼️ DIMENSION 1: Frame Anatomy

The showcase is a two-layer rounded frame floating on the page background (`bg-deepAnchor` + existing `.film-grain`), **not** an edge-to-edge section:

1. **Video canvas** (top layer, ~92% of frame height, `rounded-t-[28px]`) — the `MuxPlayer` fills this completely, `object-fit: cover`, with all HUD elements absolutely positioned on top.
2. **Bezel bar** (bottom layer, ~8% of frame height, `rounded-b-[28px]`, solid `bg-deepAnchor-alt2` or near-black) — a persistent credits strip, visually separate from the video like the label plate under a monitor.

Outer frame: `overflow-hidden`, subtle `shadow-2xl`, 1px hairline border in `neutral-cream/10`. On desktop the frame sits inset with breathing room (e.g. `p-6 md:p-10 lg:p-16` on its container) so the page background and grain are visible around it — on mobile it can go full-bleed (no inset) to preserve legibility.

### Overlay elements, positioned on the video canvas:

| Element | Position | Notes |
|---|---|---|
| Logo mark + project owner + tag badge | top-left | small rounded-square logo chip + bold uppercase name + bracketed status pill (see Dimension 4) |
| Menu (hamburger) button | top-right | translucent dark rounded-square, `backdrop-blur` |
| Headline (project title) | upper-left, ~35–45% from top | huge, heavy, condensed sans — see Dimension 3 |
| Category / subtitle | directly under headline | small bold uppercase, tighter than headline |
| Play button (circle) | center, biased slightly right | thin 1px ring, ~120–160px diameter, label inside |
| "INFO" pill | near the play circle, upper-right of it | filled cream pill, black text, small |
| Bracketed transport controls `[PLAY] [PAUSE] [FULLSCREEN]` | bottom-left of canvas, just above the bezel | real functional buttons, monospace |
| `MORE PROJECT ▪` | bottom-right of canvas, mirrored | cycles to next project |

### Bezel bar contents (three-column row):
`YYYY © {CLIENT NAME}` — left · `CRAFTED BY {STUDIO}` — center · `{CTA e.g. "INQUIRE" / "VIEW REEL"}` — right. All monospace, uppercase, evenly distributed with `justify-between`, small (`text-[11px]`), `tracking-widest`.

## ✍️ DIMENSION 2: Typography — the one deliberate exception

Add two new font tokens in `tailwind.config.ts`, used **only** inside this component:

```ts
fontFamily: {
  heading: ["Zodiak", "Didot", "Bodoni", "serif"],      // unchanged, rest of site
  body: ["Satoshi", "Inter", "Poppins", "sans-serif"],   // unchanged, rest of site
  mono: ["JetBrains Mono", "IBM Plex Mono", "Space Mono", "monospace"], // NEW — all HUD chrome
  slab: ["Neue Machina", "General Sans", "Archivo Black", "sans-serif"], // NEW — headline only
}
```

- **Headline** (`font-slab`): heavy weight, tight leading (`leading-[0.9]`), *normal* letter-spacing (not the wide tracking used elsewhere on the site) — `text-6xl md:text-8xl lg:text-[7.5rem]`, uppercase, `text-neutral-cream`.
- **Everything else in the HUD** (badges, buttons, controls, bezel bar): `font-mono uppercase tracking-[0.15em] text-xs`.
- Never mix: the serif `font-heading` does not appear anywhere inside this component. That contrast (chunky grotesk headline + terminal-mono labels, zero serif) is what makes it read as "operator HUD" instead of "editorial site."

## 🎨 DIMENSION 3: Color & Chrome

Stay inside the existing palette — no new hues, only new *treatments*:

- HUD text/icons: `text-neutral-cream` at full opacity for primary labels, `/70` for secondary (subtitle, bezel bar).
- Translucent chips (logo/tag badge, menu button): `bg-deepAnchor-alt2/50 backdrop-blur-md border border-neutral-cream/10`.
- The one inverted element — **INFO pill**: `bg-neutral-cream text-deepAnchor-alt2` solid fill, `rounded-full`, so it visually "pops forward" as the single actionable hint, exactly like the reference.
- Play ring: `border border-neutral-cream/60`, no fill (or `bg-black/10 backdrop-blur-sm` at most) — it must read as glass, not a button.
- Bezel bar: `bg-deepAnchor-alt2` (near-black from the existing palette), text `text-neutral-cream/60`, one accent word (CTA on the right) in `text-brass` to match the site's existing accent rule ("brass exclusively for CTAs/active states").

## 🎞️ DIMENSION 4: The Tag Badge (the "ACTION!" element)

In the reference this is a small dynamic word next to the client name — treat it as a **live status pill** driven by player state, not static copy:
- Default/paused: `[ REEL ]` or the project's medium (`[ NARRATIVE ]`, `[ COMMERCIAL ]`).
- On play: swap to `[ ROLLING ]` or `[ ACTION ]` with a small pulsing dot, echoing a film slate calling "action." This gives the badge real function instead of being decorative, and it's a nice, cheap moment of delight consistent with DIMENSION 5 of the master guideline (physical, deliberate motion).

## ⚙️ DIMENSION 5: Interaction & Motion

- **Play circle**: bound to the real `MuxPlayer` ref — click toggles `play()`/`pause()`. `scale(0.94)` on press (Framer `whileTap`), idle breathing loop (`scale: [1, 1.04, 1]`, ~3s, `ease: easeInOut`) while paused, stops breathing once playback starts.
- **Bracketed controls**: `[PLAY]`/`[PAUSE]` reflect and drive actual player state (swap label, don't just show both); `[FULLSCREEN]` calls `requestFullscreen()` on the container. Hover state: underline + `text-neutral-cream` from `/70`, `transition-colors duration-300 ease-cinematic` (reuse the existing `cinematic` timing token).
- **INFO pill**: opens a lightweight slide-up panel (Framer `AnimatePresence`) with director/DP/client/year credits — dismiss on click-away or `Esc`.
- **MORE PROJECT**: advances to the next project (wraps at end of list), triggers a GSAP crossfade/wipe between poster frames using the `cinematic` easing already defined in `tailwind.config.ts`, then swaps the `MuxPlayer` `playbackId`.
- **Idle-hide**: after ~3s with no pointer movement (and while playing), fade all HUD chrome to ~`opacity-15` except the headline; restore on `mousemove`/`touchstart`. Respect `prefers-reduced-motion` — disable breathing/idle-fade, keep state-driven changes instant.
- **Entrance**: stagger the badge → headline → subtitle → play ring in on mount/scroll-into-view (`opacity 0→1, y 24→0`), same GSAP `fromTo` pattern already used in `PortfolioGrid.tsx`.

## 🧩 DIMENSION 6: Component & Data Architecture

New reusable component: **`src/components/CinematicVideoShowcase.tsx`**

```ts
interface ShowcaseProject {
  id: number;
  title: string;          // "BENEATH THE SURFACE"
  category: string;       // "Narrative" — reuses existing Project.category
  playbackId: string;     // Mux playback ID
  client?: string;        // for the top-left name + bezel copyright
  year?: number;
  credits?: { role: string; name: string }[]; // for the INFO panel
}

interface CinematicVideoShowcaseProps {
  project: ShowcaseProject;
  onNext: () => void;      // wraps to next project in the current list
}
```

Wire it in two places:
1. **Homepage hero** — swap `VideoHero.tsx`'s static "ANTIGRAVITY" hero for this component fed with a featured project, or keep `VideoHero` as-is and reserve this component for #2 (recommended, since the homepage hero already has its own strong identity — don't dilute two different heroic statements on one page).
2. **Individual project view** — add `src/app/portfolio/videos/[id]/page.tsx`. Clicking a card in `PortfolioGrid.tsx` navigates here instead of being a static `div`; the route renders `CinematicVideoShowcase` full-viewport and `onNext` pushes to the next project's `id` in the same category list.

This requires extending the current placeholder data (`ALL_VIDEO_PROJECTS` in `src/app/portfolio/videos/page.tsx`, `src/app/page.tsx`) from `{ id, title, category, color }` to include a real `playbackId` per project — today every project is a flat color div with no video attached, per `docs/mux-service-guide.md` conventions for uploading/registering assets.

## 🚫 DIMENSION 7: Anti-Patterns Specific to This Component

- Don't let `font-slab`/`font-mono` leak outside this component — the rest of the site stays Zodiak/Satoshi.
- Don't reproduce the reference's ornate gold paisley backdrop literally — it fights DIMENSION 2 of the master guideline ("extreme restraint," "one focal point"). Use the existing `.film-grain` overlay and plain `bg-deepAnchor` margin instead.
- Don't make the bracketed transport controls decorative — if they're styled like real controls, they must actually control playback, or a screen-reader/keyboard user is stranded (`--controls: "none"` on `MuxPlayer` means these custom buttons are the *only* controls — give each an `aria-label` and visible focus ring).
- Don't skip the poster/preload pattern already established in `VideoHero.tsx` (`<link rel="preload" as="image" fetchPriority="high">` on the Mux thumbnail) — this component is even more LCP-sensitive since it's often the first full-viewport paint.
- Keep the mute toggle visible per the master guideline's sound-design constraint if/when ambient audio is added.
