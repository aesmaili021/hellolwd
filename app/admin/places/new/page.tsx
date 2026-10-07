import Link from "next/link";
import { savePlaceAction } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin/AdminShell";
import { PlaceForm } from "@/components/admin/forms";

export default async function NewPlacePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <AdminShell current="places">
      <Link href="/admin/places" className="text-sm font-bold text-primary hover:text-navy">
        ← All places
      </Link>
      <h1 className="mt-3 mb-6 text-[28px] font-extrabold tracking-[-0.03em] text-navy">Add place</h1>
      <PlaceForm action={savePlaceAction} error={error === "1"} />
    </AdminShell>
  );
}
