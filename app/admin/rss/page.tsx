import { deleteRssAction, ingestFeedsAction, saveRssAction } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin/AdminShell";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { getRssSources } from "@/lib/data/rss";
import { CONTENT_LOCALES } from "@/lib/types";

function LocalePicks({
  selected,
}: {
  selected: readonly string[];
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {CONTENT_LOCALES.map((code) => (
        <label
          key={code}
          className="inline-flex min-h-9 cursor-pointer items-center rounded-full bg-wash px-3 text-[12px] font-extrabold text-navy"
        >
          <input
            type="checkbox"
            name="locales"
            value={code}
            defaultChecked={selected.includes(code)}
            className="me-1.5 accent-primary"
          />
          {code.toUpperCase()}
        </label>
      ))}
    </div>
  );
}

export default async function AdminRssPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; added?: string; images?: string }>;
}) {
  const { error, added, images } = await searchParams;
  const feeds = await getRssSources();

  return (
    <AdminShell current="rss">
      <p className="text-[11px] font-extrabold tracking-[0.12em] text-primary uppercase">
        Sources
      </p>
      <h1 className="mb-2 text-[28px] font-extrabold tracking-[-0.03em] text-navy">
        RSS feeds
      </h1>
      <p className="mb-6 max-w-[60ch] text-sm text-muted">
        Stories from a feed only appear in the languages you tick. Leave all four on for every locale.
      </p>
      <form action={ingestFeedsAction} className="mb-6">
        <button
          type="submit"
          className="min-h-11 cursor-pointer rounded-full bg-brand px-4 text-sm font-extrabold text-paper"
        >
          Pull feeds now
        </button>
      </form>
      {added != null ? (
        <p className="mb-4 text-sm font-semibold text-primary">
          Pulled {added} new stories{images ? `, ${images} photos` : ""}.
        </p>
      ) : null}

      <form action={saveRssAction} className="mb-8 grid gap-3 rounded-xl border border-line p-4">
        <div className="grid gap-3 sm:grid-cols-[1fr_1.4fr]">
          <div>
            <label className="mb-1 block text-[11px] font-extrabold tracking-[0.08em] text-mute uppercase" htmlFor="name">
              Name
            </label>
            <input id="name" name="name" required className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-navy" />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-extrabold tracking-[0.08em] text-mute uppercase" htmlFor="url">
              Feed URL
            </label>
            <input id="url" name="url" type="url" required className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-navy" />
          </div>
        </div>
        <div>
          <p className="mb-1.5 text-[11px] font-extrabold tracking-[0.08em] text-mute uppercase">
            Show in
          </p>
          <LocalePicks selected={CONTENT_LOCALES} />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm font-semibold text-navy">
            <input type="checkbox" name="enabled" defaultChecked className="accent-primary" />
            On
          </label>
          <button type="submit" className="min-h-11 cursor-pointer rounded-full bg-brand px-4 text-sm font-extrabold text-paper">
            Add feed
          </button>
        </div>
      </form>
      {error ? (
        <p className="mb-4 text-sm font-semibold text-accent">Name and URL are required.</p>
      ) : null}

      <ul className="divide-y divide-line rounded-xl border border-line">
        {feeds.map((feed) => (
          <li key={feed.id} className="flex flex-col gap-3 px-4 py-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="font-bold text-navy">{feed.name}</p>
                <a href={feed.url} className="break-all text-[13px] text-primary hover:text-navy" target="_blank" rel="noreferrer">
                  {feed.url}
                </a>
                <p className="mt-1 text-[12px] text-mute">
                  {feed.last_pulled_at
                    ? `Last pull ${new Date(feed.last_pulled_at).toLocaleString("nl-NL")}`
                    : "Not pulled yet"}
                  {feed.last_error ? ` · ${feed.last_error}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-[12px] font-extrabold ${feed.enabled ? "text-primary" : "text-mute"}`}>
                  {feed.enabled ? "ON" : "OFF"}
                </span>
                <form action={saveRssAction}>
                  <input type="hidden" name="id" value={feed.id} />
                  <input type="hidden" name="name" value={feed.name} />
                  <input type="hidden" name="url" value={feed.url} />
                  {feed.enabled ? null : <input type="hidden" name="enabled" value="on" />}
                  <button type="submit" className="cursor-pointer text-[13px] font-bold text-primary hover:text-navy">
                    {feed.enabled ? "Turn off" : "Turn on"}
                  </button>
                </form>
                <DeleteButton action={deleteRssAction} id={feed.id} />
              </div>
            </div>
            <form action={saveRssAction} className="flex flex-wrap items-center gap-3">
              <input type="hidden" name="id" value={feed.id} />
              <input type="hidden" name="name" value={feed.name} />
              <input type="hidden" name="url" value={feed.url} />
              {feed.enabled ? <input type="hidden" name="enabled" value="on" /> : null}
              <LocalePicks selected={feed.locales} />
              <button type="submit" className="cursor-pointer text-[13px] font-bold text-primary hover:text-navy">
                Save languages
              </button>
            </form>
          </li>
        ))}
      </ul>
    </AdminShell>
  );
}
