import Link from "next/link";
import { notFound } from "next/navigation";
import { saveEventAction } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin/AdminShell";
import { EventForm } from "@/components/admin/forms";
import { getEvent } from "@/lib/data/events";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await getEvent(id);
  if (!event) notFound();

  return (
    <AdminShell current="events">
      <Link href="/admin/events" className="text-sm font-bold text-primary hover:text-navy">
        ← All events
      </Link>
      <h1 className="mt-3 mb-6 text-[28px] font-extrabold tracking-[-0.03em] text-navy">
        Edit event
      </h1>
      <EventForm action={saveEventAction} event={event} />
    </AdminShell>
  );
}
