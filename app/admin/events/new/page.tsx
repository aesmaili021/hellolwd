import Link from "next/link";
import { saveEventAction } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin/AdminShell";
import { EventForm } from "@/components/admin/forms";

export default async function NewEventPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <AdminShell current="events">
      <Link href="/admin/events" className="text-sm font-bold text-primary hover:text-navy">
        ← All events
      </Link>
      <h1 className="mt-3 mb-6 text-[28px] font-extrabold tracking-[-0.03em] text-navy">
        New event
      </h1>
      {error ? (
        <p className="mb-4 text-sm font-semibold text-accent">Name and venue are required.</p>
      ) : null}
      <EventForm action={saveEventAction} />
    </AdminShell>
  );
}
