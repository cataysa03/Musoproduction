# Muso Production - Project Architecture & Tech Stack Design

## Overview
This document defines the technical architecture and stack for the "Muso Production" cinematic portfolio website. The architecture is designed to meet the strict requirements of the "Premium Cinematic Production Portfolio" guidelines, specifically focusing on extreme performance (LCP < 2.5s), immersive scrollytelling animations, and a custom-built Content Management System (CMS) for managing heavy video assets without buffering.

## Tech Stack Decisions

### 1. Core Framework & Hosting
*   **Framework:** Next.js (App Router)
*   **Language:** TypeScript
*   **Hosting:** Vercel
*   **Rationale:** Next.js Server Components provide the optimal foundation for hitting our Core Web Vitals (LCP) targets while offering a robust full-stack environment for the custom CMS API routes.

### 2. Custom Built CMS (Backend & Data)
Instead of a third-party headless CMS, we are building a bespoke admin dashboard directly into the Next.js application.
*   **Database:** Supabase (PostgreSQL) - Stores portfolio metadata (title, client, description, media IDs).
*   **Authentication:** Supabase Auth - Secures the `/admin` dashboard routes.
*   **Image Storage:** Supabase Storage - Hosts high-res image assets and video thumbnails.
*   **Video Infrastructure:** Mux (via Direct Upload API) - *Crucial constraint:* We will not self-host video files. The custom CMS will upload videos directly to Mux, storing only the Mux Playback ID in Supabase. Mux provides HLS adaptive bitrate streaming to ensure zero-buffering playback across all devices.

### 3. Styling & Theme
*   **Styling:** Tailwind CSS (Strictly constrained via `tailwind.config.ts`)
*   **Palette Enforcement:** The Midnight Cinematic Palette (deep navy/blacks, high-contrast cream neutrals, warm brass accents) will be strictly enforced as CSS variables/Tailwind utility classes.
*   **Organic Textures:** Global SVG filters (`<feTurbulence>` + `<feColorMatrix>`) applied as fixed overlays with 0.03-0.08 opacity to create the tactile film grain.

### 4. Motion, Interactivity & Audio
*   **Animation Engine:** GSAP (GreenSock) + ScrollTrigger via `@gsap/react`. Handles scroll choreography, sticky sections, and parallax effects.
*   **Easing:** Custom `cubic-bezier(0.25, 0.1, 0.25, 1)` applied globally for physical, deliberate motion.
*   **Smooth Scrolling:** Lenis - Provides hardware-accelerated smooth scrolling to normalize scroll behavior across browsers, ensuring GSAP scroll-triggers fire predictably.
*   **Audio Context:** A React Context provider will manage global ambient sound design and UI micro-interactions (clicks/whooshes), enforcing a persistent mute toggle state across the app.

### 5. Conversion & Lead Generation Form
*   **Form Management:** React Hook Form + Zod (for strict schema validation).
*   **Architecture:** The form will be broken into progressive, multi-step components to reduce cognitive load. Conditional logic will adapt questions based on inputs (e.g., dynamic budget dropdowns).

## Data Flow (Video Upload Journey)
1.  Admin logs into `/admin` via Supabase Auth.
2.  Admin selects a video file in the custom CMS.
3.  Next.js requests an authenticated upload URL from Mux API.
4.  Client uploads the large video file directly to Mux (bypassing our Vercel server).
5.  Mux returns a `playbackId`.
6.  CMS saves the project metadata and `playbackId` to the Supabase PostgreSQL database.
7.  Frontend queries Supabase, retrieves the `playbackId`, and renders the video via `@mux/mux-player-react`.

## Global Constraints
*   **Performance:** LCP must remain under 2.5 seconds. Video heroes must use preloaded static poster images (`<link rel="preload">`).
*   **Layout Stability:** All media containers must have strict aspect ratios to prevent Cumulative Layout Shift (CLS).
*   **Aesthetics:** No generic colors. Strict adherence to the Midnight Palette.
