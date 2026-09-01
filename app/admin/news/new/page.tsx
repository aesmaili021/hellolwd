import Link from "next/link";
import { saveArticleAction } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin/AdminShell";
import { ArticleForm } from "@/components/admin/forms";

export default async function NewArticlePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <AdminShell current="news">
      <Link href="/admin/news" className="text-sm font-bold text-primary hover:text-navy">
        ← All stories
      </Link>
      <h1 className="mt-3 mb-6 text-[28px] font-extrabold tracking-[-0.03em] text-navy">
        New story
      </h1>
      {error ? (
        <p className="mb-4 text-sm font-semibold text-accent">
          Add a title in at least one selected language.
        </p>
      ) : null}
      <ArticleForm action={saveArticleAction} />
    </AdminShell>
  );
}
