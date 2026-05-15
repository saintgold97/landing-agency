/**
 * Scroll timeline orchestration placeholder.
 *
 * Future home for pinned, layered, camera-driven scroll storytelling
 * (GSAP ScrollTrigger + React Three Fiber camera rigs).
 *
 * Sections opt in by tagging their root element with `data-cinema-section="<id>"`.
 */

export interface CinemaScene {
  id: string;
  pin?: boolean;
  scrub?: boolean | number;
}

export const cinemaScenes: CinemaScene[] = [
  { id: "hero", pin: true, scrub: true },
  { id: "story", scrub: 0.6 },
  { id: "suites", scrub: 0.6 },
  { id: "gallery", scrub: 0.4 },
  { id: "location", scrub: 0.6 },
];
