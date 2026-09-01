export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  const { startRssScheduler } = await import("./lib/rss/scheduler");
  startRssScheduler();
}
