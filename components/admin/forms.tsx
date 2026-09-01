import {
  CONTENT_LOCALES,
  EVENT_GENRES,
  NEWS_CATEGORIES,
  type Article,
  type ContentLocale,
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
  const locales = article?.locales ?? [...CONTENT_LOCALES];

  return (
    <form action={action} className="flex flex-col gap-5">
      {article ? <input type="hidden" name="id" value={article.id} /> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="source_name" label="Source name" defaultValue={article?.source_name} required />
        <Field
          name="source_url"
          label="Article URL (full story, not homepage)"
          defaultValue={article?.source_url}
          required
        />
        <div>
          <label className={label} htmlFor="category">Category</label>
          <select id="category" name="category" defaultValue={article?.category ?? "culture"} className={field}>
            {NEWS_CATEGORIES.map((id) => (
              <option key={id} value={id}>{id}</option>
            ))}
          </select>
        </div>
        <Field
          name="published_at"
          label="Published"
          type="datetime-local"
          defaultValue={toLocalInput(article?.published_at)}
        />
        <Field
          name="image_url"
          label="Image URL (blank = placeholder)"
          defaultValue={article?.image_url ?? ""}
          className="sm:col-span-2"
        />
      </div>

      <fieldset>
        <legend className={label}>Show in languages</legend>
        <div className="flex flex-wrap gap-3">
          {CONTENT_LOCALES.map((code) => (
            <label key={code} className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-navy">
              <input
                type="checkbox"
                name="locales"
                value={code}
                defaultChecked={locales.includes(code as ContentLocale)}
                className="accent-primary"
              />
              {code.toUpperCase()}
            </label>
          ))}
        </div>
        <p className="mt-2 text-[13px] text-muted">
          Uncheck a language and that story stays off that locale. Fill title and summary only for the languages you keep.
        </p>
      </fieldset>

      <div className="grid gap-4">
        {CONTENT_LOCALES.map((code) => (
          <div key={code} className="rounded-xl border border-line p-4">
            <p className="mb-3 text-[11px] font-extrabold tracking-[0.1em] text-primary uppercase">
              {code}
            </p>
            <Field
              name={`title_${code}`}
              label="Title"
              defaultValue={article ? article[`title_${code}`] : ""}
            />
            <label className={`${label} mt-3`} htmlFor={`summary_${code}`}>Summary</label>
            <textarea
              id={`summary_${code}`}
              name={`summary_${code}`}
              rows={3}
              defaultValue={article ? article[`summary_${code}`] : ""}
              className={field}
            />
          </div>
        ))}
      </div>

      <button
        type="submit"
        className="min-h-11 cursor-pointer self-start rounded-full bg-brand px-5 text-sm font-extrabold text-paper"
      >
        Save story
      </button>
    </form>
  );
}

export function EventForm({
  action,
  event,
}: {
  action: (form: FormData) => void | Promise<void>;
  event?: EventRow;
}) {
  return (
    <form action={action} className="flex flex-col gap-5">
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
        <Field name="image_url" label="Image URL (blank = placeholder)" defaultValue={event?.image_url ?? ""} />
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
