function flag(name: string, fallback: boolean) {
  const raw = process.env[name]?.trim().toLowerCase();
  if (!raw) return fallback;
  if (raw === "0" || raw === "false" || raw === "off" || raw === "no") return false;
  if (raw === "1" || raw === "true" || raw === "on" || raw === "yes") return true;
  return fallback;
}

/**
 * Homepage experiments, read on the server at request time (not NEXT_PUBLIC_).
 * Newsletter stays off until a host turns it on, and still stores nothing.
 * The places slot is on by default; set FEATURE_PLACES to 0, false, off, or no to hide it.
 */
export const features = {
  newsletter: flag("FEATURE_NEWSLETTER", false),
  featuredPlaces: flag("FEATURE_PLACES", true),
};
