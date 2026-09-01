import { ingestFeeds } from "@/lib/rss/ingest";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

function authorized(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true;
  const header = request.headers.get("authorization");
  return header === `Bearer ${secret}`;
}

export async function GET(request: Request) {
  if (!authorized(request)) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  const result = await ingestFeeds();
  return Response.json(result);
}

export async function POST(request: Request) {
  return GET(request);
}
