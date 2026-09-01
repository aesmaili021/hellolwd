import { pingPostgres } from "@/lib/data/postgres";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!process.env.DATABASE_URL && !process.env.DATABASE_PRIVATE_URL) {
    return Response.json({ ok: true, store: "file" });
  }
  try {
    await pingPostgres();
    return Response.json({ ok: true, store: "postgres" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "db";
    return Response.json({ ok: false, store: "postgres", error: message }, { status: 503 });
  }
}
