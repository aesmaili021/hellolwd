import Link from "next/link";
import { deleteEventAction } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin/AdminShell";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { getAllEvents } from "@/lib/data/events";
import { formatEventWhen } from "@/lib/format";

export default async function AdminEventsPage() {
  const events = await getAllEvents();

  return (
    <AdminShell current="events">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-extrabold tracking-[0.12em] text-primary uppercase">
            Weekend
          </p>
          <h1 className="text-[28px] font-extrabold tracking-[-0.03em] text-navy">Events</h1>
        </div>
        <Link
          href="/admin/events/new"
          className="inline-flex min-h-11 cursor-pointer items-center rounded-full bg-brand px-4 text-sm font-extrabold text-paper"
        >
          Add event
        </Link>
      </div>
      <ul className="divide-y divide-line rounded-xl border border-line">
        {events.map((event) => (
          <li key={event.id} className="flex flex-col gap-2 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-bold text-navy">{event.name}</p>
              <p className="text-[13px] text-muted">
                {event.venue} · {event.genre} · {formatEventWhen(event.event_datetime, "en")}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link href={`/admin/events/${event.id}`} className="text-[13px] font-bold text-primary hover:text-navy">
                Edit
              </Link>
              <DeleteButton action={deleteEventAction} id={event.id} />
            </div>
          </li>
        ))}
      </ul>
    </AdminShell>
  );
}
