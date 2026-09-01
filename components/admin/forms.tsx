import { ArticleDesk } from "@/components/admin/ArticleDesk";
import { ImageField } from "@/components/admin/ImageField";
import {
  CONTENT_LOCALES,
  EVENT_GENRES,
  type Article,
  type EventRow,
} from "@/lib/types";

const field =
  "w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-navy outline-none";
const label = "mb-1 block text-[11px] font-extrabold tracking-[0.08em] text-mute uppercase";

function toLocalInput(iso?: string) {
  const date = iso ? new Date(iso) : new Date();
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function ArticleForm({
  action,
  article,
}: {
  action: (form: FormData) => void | Promise<void>;
  article?: Article;
}) {
  return <ArticleDesk action={action} article={article} />;
}

export function EventForm({
  action,
  event,
}: {
  action: (form: FormData) => void | Promise<void>;
  event?: EventRow;
}) {
  return (
    <form action={action} encType="multipart/form-data" className="flex flex-col gap-5">
      {event ? <input type="hidden" name="id" value={event.id} /> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="name" label="Name" defaultValue={event?.name} required />
        <Field name="venue" label="Venue" defaultValue={event?.venue} required />
        <Field
          name="event_datetime"
          label="Date and time"
          type="datetime-local"
          defaultValue={toLocalInput(event?.event_datetime)}
          required
        />
        <div>
          <label className={label} htmlFor="genre">Genre</label>
          <select id="genre" name="genre" defaultValue={event?.genre ?? "live-band"} className={field}>
            {EVENT_GENRES.map((id) => (
              <option key={id} value={id}>{id}</option>
            ))}
          </select>
        </div>
        <Field name="ticket_link" label="Tickets or Instagram URL" defaultValue={event?.ticket_link ?? ""} />
        <ImageField currentUrl={event?.image_url} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {CONTENT_LOCALES.map((code) => (
          <div key={code}>
            <label className={label} htmlFor={`description_${code}`}>Note · {code}</label>
            <textarea
              id={`description_${code}`}
              name={`description_${code}`}
              rows={3}
              defaultValue={event ? event[`description_${code}`] ?? "" : ""}
              className={field}
            />
          </div>
        ))}
      </div>
      <button
        type="submit"
        className="min-h-11 cursor-pointer self-start rounded-full bg-brand px-5 text-sm font-extrabold text-paper"
      >
        Save event
      </button>
    </form>
  );
}

function Field({
  name,
  label: title,
  defaultValue,
  type = "text",
  required,
  className,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  type?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className={label} htmlFor={name}>{title}</label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        className={field}
      />
    </div>
  );
}
