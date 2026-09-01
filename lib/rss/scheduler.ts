import { ingestFeeds } from "@/lib/rss/ingest";

const HOURS = Math.max(1, Number(process.env.RSS_INTERVAL_HOURS || 3));

export function startRssScheduler() {
  if (process.env.VERCEL) return;
  const tick = () => {
    ingestFeeds().catch((error) => {
      console.error("[rss] ingest failed", error);
    });
  };
  setTimeout(tick, 15_000);
  setInterval(tick, HOURS * 60 * 60 * 1000);
}
