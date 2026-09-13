import Link from "next/link";
import { copyWeekendForwardAction, deleteEventAction } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin/AdminShell";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { getAllEvents } from "@/lib/data/events";
import { EVENT_GENRE_LABELS } from "@/lib/event-labels";
import { formatEventWhen } from "@/lib/format";
import { copyForwardPreview, formatDeskRange, splitDeskEvents } from "@/lib/weekend";
import type { EventRow } from "@/lib/types";

export default async function AdminEventsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; copied?: string }>;
}) {
  const { saved, copied } = await searchParams;
  const events = await getAllEvents();
  const { thisWeekend, upcoming, past, current } = splitDeskEvents(events);
  const preview = copyForwardPreview(events);
  const savedEvent = saved ? events.find((event) => event.id === saved) : null;
  const copiedCount = copied == null ? null : Number(copied);

  return (
    <AdminShell current="events">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-extrabold tracking-[0.12em] text-primary uppercase">
            Weekend
          </p>
          <h1 className="text-[28px] font-extrabold tracking-[-0.03em] text-navy">Events</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {preview.source.length ? (
            <form action={copyWeekendForwardAction}>
              <button
                type="submit"
                disabled={!preview.fresh.length}
                className="inline-flex min-h-11 cursor-pointer items-center rounded-full border border-line bg-paper px-4 text-sm font-extrabold text-navy disabled:cursor-not-allowed disabled:opacity-50"
              >
                {preview.fresh.length
                  ? `Copy ${preview.fresh.length} to next week`
                  : "Already copied"}
              </button>
            </form>
          ) : null}
          <Link
            href="/admin/events/new"
            className="inline-flex min-h-11 cursor-pointer items-center rounded-full bg-brand px-4 text-sm font-extrabold text-paper"
          >
            Add event
          </Link>
        </div>
      </div>

      {savedEvent ? (
        <p className="mb-4 text-sm font-semibold text-primary">
          Saved {savedEvent.name}.{" "}
          <Link href="/en/events" className="underline underline-offset-2 hover:text-navy">
            See it on the site
          </Link>
        </p>
      ) : null}
      {copiedCount != null ? (
        <p className="mb-4 text-sm font-semibold text-primary">
          {copiedCount
            ? `Copied ${copiedCount} ${copiedCount === 1 ? "event" : "events"} to next week.`
            : "Nothing new to copy — those nights are already listed."}
        </p>
      ) : null}

      <DeskSection
        title="This weekend"
        hint={formatDeskRange(current.friday, current.sunday)}
        empty="Nothing listed for this weekend yet."
        events={thisWeekend}
      />
      <DeskSection
        title="Upcoming"
        hint="After this Sunday"
        empty="Nothing after Sunday."
        events={upcoming}
      />
      {past.length ? (
        <details className="rounded-xl border border-line">
          <summary className="cursor-pointer px-4 py-3 text-[13px] font-extrabold tracking-[0.06em] text-mute uppercase">
            Past · {past.length}
          </summary>
          <EventList events={[...past].reverse()} />
        </details>
      ) : null}
    </AdminShell>
  );
}

function DeskSection({
  title,
  hint,
  empty,
  events,
}: {
  title: string;
  hint: string;
  empty: string;
  events: EventRow[];
}) {
  return (
    <section className="mb-6">
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <h2 className="text-[13px] font-extrabold tracking-[0.08em] text-mute uppercase">{title}</h2>
        <p className="text-[13px] text-muted">{hint}</p>
      </div>
      {events.length ? (
        <EventList events={events} />
      ) : (
        <p className="rounded-xl border border-dashed border-line px-4 py-5 text-sm text-muted">
          {empty}
        </p>
      )}
    </section>
  );
}

function EventList({ events }: { events: EventRow[] }) {
  return (
    <ul className="divide-y divide-line rounded-xl border border-line">
      {events.map((event) => (
        <li
          key={event.id}
          className="flex flex-col gap-2 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="font-bold text-navy">{event.name}</p>
            <p className="text-[13px] text-muted">
              {event.venue} · {EVENT_GENRE_LABELS[event.genre]} ·{" "}
              {formatEventWhen(event.event_datetime, "en")}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href={`/admin/events/${event.id}`}
              className="text-[13px] font-bold text-primary hover:text-navy"
            >
              Edit
            </Link>
            <DeleteButton action={deleteEventAction} id={event.id} />
          </div>
        </li>
      ))}
    </ul>
  );
}
