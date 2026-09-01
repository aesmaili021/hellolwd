export function Pompebled({
  className,
  vein = true,
}: {
  className?: string;
  vein?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M16 3c5 4 9 8 9 13.5C25 22.3 21 27 16 29c-5-2-9-6.7-9-12.5C7 11 11 7 16 3z"
        fill="currentColor"
      />
      {vein ? (
        <path
          d="M16 3v26"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="1.6"
          opacity=".7"
        />
      ) : null}
    </svg>
  );
}

export function LogoMark({ className = "h-[30px] w-[30px]" }: { className?: string }) {
  return (
    <span className={`inline-flex text-accent ${className}`}>
      <Pompebled className="h-full w-full" />
    </span>
  );
}
