export const INTRO_STORAGE_KEY = "portfolio:intro-seen";

/**
 * Kill-switch for the welcome intro. Set to `false` while it is being
 * reworked; flip back to `true` when it is ready to ship.
 */
export const INTRO_ENABLED = false;

/**
 * When `true`, the welcome intro plays only on a visitor's very first load and
 * is suppressed on every reload afterwards (a tiny head script hides it before
 * first paint to avoid a flash).
 *
 * Kept `false` for now so the animation replays on every reload while it is
 * being tuned. Flip to `true` to enable the once-only gate.
 */
export const GATE_INTRO_ONCE = false;

export function hasSeenIntro(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(INTRO_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export function markIntroSeen(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(INTRO_STORAGE_KEY, "true");
  } catch {
    // Ignore storage failures (private mode, blocked storage, etc.).
  }
}
