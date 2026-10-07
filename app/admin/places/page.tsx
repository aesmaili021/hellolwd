import Link from "next/link";
import { deletePlaceAction, togglePlaceAction } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin/AdminShell";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { getAllPlaces } from "@/lib/data/places";
import { PLACE_CATEGORIES, type PlaceRow } from "@/lib/types";

const LABELS: Record<(typeof PLACE_CATEGORIES)[number], string> = {
  cafes: "Cafes",
  eats: "Cheap eats",
  bars: "Bars & nightlife",
  groceries: "International groceries",
  hair: "Barbers & hair",
  sports: "Sports & gyms",
  student: "Student essentials",
};

export default async function AdminPlacesPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  const places = await getAllPlaces();
  const savedPlace = saved ? places.find((place) => place.id === saved) : null;

  return (
    <AdminShell current="places">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-extrabold tracking-[0.12em] text-primary uppercase">Directory</p>
          <h1 className="text-[28px] font-extrabold tracking-[-0.03em] text-navy">Places</h1>
          <p className="mt-1 text-sm text-muted">{places.length} listings. Hidden ones stay off the public page.</p>
        </div>
        <Link
          href="/admin/places/new"
          className="inline-flex min-h-11 cursor-pointer items-center rounded-full bg-brand px-4 text-sm font-extrabold text-paper"
        >
          Add place
        </Link>
      </div>

      {savedPlace ? (
        <p className="mb-4 text-sm font-semibold text-primary">
          Saved {savedPlace.name}.{" "}
          <Link href={`/en/places#${savedPlace.id}`} className="underline underline-offset-2 hover:text-navy">
            See it on the site
          </Link>
        </p>
      ) : null}

      {places.length ? (
        <ul className="divide-y divide-line rounded-xl border border-line">
          {places.map((place) => (
            <PlaceRowView key={place.id} place={place} />
          ))}
        </ul>
      ) : (
        <p className="rounded-xl border border-dashed border-line px-4 py-5 text-sm text-muted">
          No places yet.
        </p>
      )}
    </AdminShell>
  );
}

function PlaceRowView({ place }: { place: PlaceRow }) {
  return (
    <li className="flex flex-col gap-3 px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="min-w-0">
        <p className="font-bold text-navy">
          {place.name}
          {place.featured ? <span className="ms-2 text-[11px] font-extrabold tracking-wide text-[#8a6d00] uppercase">Featured</span> : null}
          {place.visible ? null : <span className="ms-2 text-[11px] font-extrabold tracking-wide text-mute uppercase">Hidden</span>}
        </p>
        <p className="text-[13px] text-muted">
          {LABELS[place.category]} · order {place.sort_order} · {place.address}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <Toggle flag="featured" id={place.id} label={place.featured ? "Unfeature" : "Feature"} />
        <Toggle flag="visible" id={place.id} label={place.visible ? "Hide" : "Show"} />
        <Link href={`/admin/places/${place.id}`} className="text-[13px] font-bold text-primary hover:text-navy">
          Edit
        </Link>
        <DeleteButton action={deletePlaceAction} id={place.id} />
      </div>
    </li>
  );
}

function Toggle({ flag, id, label }: { flag: "featured" | "visible"; id: string; label: string }) {
  return (
    <form action={togglePlaceAction}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="flag" value={flag} />
      <button type="submit" className="cursor-pointer text-[13px] font-bold text-navy hover:text-primary">
        {label}
      </button>
    </form>
  );
}
