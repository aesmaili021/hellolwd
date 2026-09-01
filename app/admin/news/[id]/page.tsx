import Link from "next/link";
import { notFound } from "next/navigation";
import { saveArticleAction } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin/AdminShell";
import { ArticleForm } from "@/components/admin/forms";
import { getArticle } from "@/lib/data/articles";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await getArticle(id);
  if (!article) notFound();

  return (
    <AdminShell current="news">
      <Link href="/admin/news" className="text-sm font-bold text-primary hover:text-navy">
        ← All stories
      </Link>
      <h1 className="mt-3 mb-6 text-[28px] font-extrabold tracking-[-0.03em] text-navy">
        Edit story
      </h1>
      <ArticleForm action={saveArticleAction} article={article} />
    </AdminShell>
  );
}
