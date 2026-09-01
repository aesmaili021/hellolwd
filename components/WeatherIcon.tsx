import type { WeatherKind } from "@/lib/weather";

export function WeatherIcon({ kind, className }: { kind: WeatherKind; className?: string }) {
  const cls = className ?? "h-6 w-6";
  switch (kind) {
    case "clear":
      return (
        <svg viewBox="0 0 24 24" className={cls} aria-hidden>
          <circle cx="12" cy="12" r="4.2" fill="currentColor" />
          <path
            fill="currentColor"
            d="M11.2 3.2h1.6v2.4h-1.6zM11.2 18.4h1.6v2.4h-1.6zM3.2 11.2h2.4v1.6H3.2zM18.4 11.2h2.4v1.6h-2.4zM6.1 5l1.1-1.1 1.7 1.7L7.8 6.7zM15.1 18.4l1.1-1.1 1.7 1.7-1.1 1.1zM5 17.9l1.1 1.1 1.7-1.7-1.1-1.1zM16.2 6.7l1.1 1.1 1.7-1.7L17.9 5z"
          />
        </svg>
      );
    case "cloudy":
      return (
        <svg viewBox="0 0 24 24" className={cls} aria-hidden>
          <path
            fill="currentColor"
            d="M8.2 17.6h9.1a3.7 3.7 0 00.3-7.4 5.1 5.1 0 00-9.8-1.2A3.8 3.8 0 008.2 17.6z"
          />
        </svg>
      );
    case "fog":
      return (
        <svg viewBox="0 0 24 24" className={cls} aria-hidden>
          <path
            fill="currentColor"
            d="M6 8.2h12v1.4H6zM4.8 11.2h14.4v1.4H4.8zM6.5 14.2h11v1.4h-11zM5.2 17.2h13.6v1.4H5.2z"
          />
        </svg>
      );
    case "drizzle":
      return (
        <svg viewBox="0 0 24 24" className={cls} aria-hidden>
          <path fill="currentColor" d="M8.4 13.6h8.4A3.3 3.3 0 0017 7.2a4.5 4.5 0 00-8.6-1A3.4 3.4 0 008.4 13.6z" />
          <path fill="currentColor" d="M9 16.2h1.3v2.2H9zM13.4 16.8h1.3v2.2h-1.3z" />
        </svg>
      );
    case "rain":
      return (
        <svg viewBox="0 0 24 24" className={cls} aria-hidden>
          <path fill="currentColor" d="M8.2 13.2h9A3.5 3.5 0 0017.5 6.4 4.8 4.8 0 008.3 5.4 3.6 3.6 0 008.2 13.2z" />
          <path fill="currentColor" d="M9.2 15.4l.8 2.6h-1.2zm3.4.4l.8 2.6h-1.2zm3.4-.2l.8 2.6h-1.2z" />
        </svg>
      );
    case "snow":
      return (
        <svg viewBox="0 0 24 24" className={cls} aria-hidden>
          <path fill="currentColor" d="M8.4 12.8h8.6A3.4 3.4 0 0017.2 6.2 4.6 4.6 0 008.6 5.3 3.5 3.5 0 008.4 12.8z" />
          <circle cx="9.4" cy="16.4" r="0.9" fill="currentColor" />
          <circle cx="12.2" cy="17.6" r="0.9" fill="currentColor" />
          <circle cx="15" cy="16.2" r="0.9" fill="currentColor" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" className={cls} aria-hidden>
          <path fill="currentColor" d="M8.2 13h8.8A3.4 3.4 0 0017.2 6.4 4.7 4.7 0 008.4 5.4 3.5 3.5 0 008.2 13z" />
          <path fill="currentColor" d="M13.2 14.6l1.1 3.4-2.6-1.2 1.1 3.2-3.3-4.6z" />
        </svg>
      );
  }
}
