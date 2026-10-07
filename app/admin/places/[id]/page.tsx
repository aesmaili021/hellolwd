import Link from "next/link";
import { notFound } from "next/navigation";
import { savePlaceAction } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin/AdminShell";
import { PlaceForm } from "@/components/admin/forms";
import { getPlace } from "@/lib/data/places";

export default async function EditPlacePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const place = await getPlace(id);
  if (!place) notFound();

  return (
    <AdminShell current="places">
      <Link href="/admin/places" className="text-sm font-bold text-primary hover:text-navy">
        ← All places
      </Link>
      <h1 className="mt-3 mb-6 text-[28px] font-extrabold tracking-[-0.03em] text-navy">Edit place</h1>
      <PlaceForm action={savePlaceAction} place={place} error={error === "1"} />
    </AdminShell>
  );
}
