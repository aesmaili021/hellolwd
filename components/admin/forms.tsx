import { ArticleDesk } from "@/components/admin/ArticleDesk";
import { ImageField } from "@/components/admin/ImageField";
import { VenuePresets } from "@/components/admin/VenuePresets";
import { EVENT_GENRE_LABELS } from "@/lib/event-labels";
import {
  CONTENT_LOCALES,
  EVENT_GENRES,
  PLACE_CATEGORIES,
  type Article,
  type EventRow,
  type PlaceRow,
} from "@/lib/types";

const PLACE_LABELS: Record<(typeof PLACE_CATEGORIES)[number], string> = {
  cafes: "Cafes",
  eats: "Cheap eats",
  bars: "Bars & nightlife",
  groceries: "International groceries",
  hair: "Barbers & hair",
  sports: "Sports & gyms",
  student: "Student essentials",
};

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
    <form id="event-form" action={action} encType="multipart/form-data" className="flex flex-col gap-5">
      {event ? <input type="hidden" name="id" value={event.id} /> : null}
      <VenuePresets />
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
          <label className={label} htmlFor="genre">Category</label>
          <select id="genre" name="genre" defaultValue={event?.genre ?? "live-band"} className={field}>
            {EVENT_GENRES.map((id) => (
              <option key={id} value={id}>
                {EVENT_GENRE_LABELS[id]}
              </option>
            ))}
          </select>
        </div>
        <Field name="ticket_link" label="Tickets or Instagram URL" defaultValue={event?.ticket_link ?? ""} />
        <label className="flex min-h-11 items-center gap-2 text-sm font-bold text-navy sm:col-span-2">
          <input type="checkbox" name="featured" defaultChecked={event?.featured === true} className="h-4 w-4" />
          Featured (gold badge, top of the list)
        </label>
        <Field
          name="maps_url"
          label="Google Maps URL"
          type="url"
          defaultValue={event?.maps_url ?? ""}
          className="sm:col-span-2"
        />
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

export function PlaceForm({
  action,
  place,
  error,
}: {
  action: (form: FormData) => void | Promise<void>;
  place?: PlaceRow;
  error?: boolean;
}) {
  return (
    <form action={action} className="flex flex-col gap-5">
      {place ? <input type="hidden" name="id" value={place.id} /> : null}
      {error ? (
        <p className="text-sm font-semibold text-accent">Name, address, and a public source URL are required.</p>
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="name" label="Name" defaultValue={place?.name} required />
        <div>
          <label className={label} htmlFor="category">Category</label>
          <select id="category" name="category" defaultValue={place?.category ?? "cafes"} className={field}>
            {PLACE_CATEGORIES.map((id) => (
              <option key={id} value={id}>
                {PLACE_LABELS[id]}
              </option>
            ))}
          </select>
        </div>
        <Field name="address" label="Address" defaultValue={place?.address} required className="sm:col-span-2" />
        <Field name="website" label="Website" type="url" defaultValue={place?.website ?? ""} />
        <Field name="email" label="Public email" type="email" defaultValue={place?.email ?? ""} />
        <Field
          name="source_url"
          label="Source URL"
          type="url"
          defaultValue={place?.source_url}
          required
          className="sm:col-span-2"
        />
        <Field
          name="sort_order"
          label="Order"
          type="number"
          defaultValue={place ? String(place.sort_order) : "0"}
        />
        <div className="flex flex-col justify-end gap-2">
          <label className="flex min-h-11 items-center gap-2 text-sm font-bold text-navy">
            <input type="checkbox" name="visible" defaultChecked={place ? place.visible : true} className="h-4 w-4" />
            Visible on the site
          </label>
          <label className="flex min-h-11 items-center gap-2 text-sm font-bold text-navy">
            <input type="checkbox" name="featured" defaultChecked={place?.featured === true} className="h-4 w-4" />
            Featured (gold badge)
          </label>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {CONTENT_LOCALES.map((code) => (
          <Field
            key={code}
            name={`description_${code}`}
            label={`One line · ${code}`}
            defaultValue={place ? place[`description_${code}`] : ""}
          />
        ))}
      </div>
      <button
        type="submit"
        className="min-h-11 cursor-pointer self-start rounded-full bg-brand px-5 text-sm font-extrabold text-paper"
      >
        Save place
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
