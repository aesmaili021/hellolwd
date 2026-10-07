/** Gold mark for a paid place at the top of a list. Not a news label. */
export function FeaturedBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-[#F6C400] px-2 py-0.5 text-[10px] font-extrabold tracking-wide text-[#3d2e00] uppercase">
      {children}
    </span>
  );
}
