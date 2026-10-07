function enabled(name: string) {
  const raw = process.env[name]?.trim().toLowerCase();
  return raw === "1" || raw === "true" || raw === "on" || raw === "yes";
}

/**
 * Homepage experiments. Both default off.
 * Read on the server at request time (not NEXT_PUBLIC_, so a host can flip them
 * without a client bundle). Newsletter still has no storage behind it.
 */
export const features = {
  newsletter: enabled("FEATURE_NEWSLETTER"),
  featuredPlaces: enabled("FEATURE_PLACES"),
};
