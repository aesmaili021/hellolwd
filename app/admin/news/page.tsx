import Link from "next/link";
import { deleteArticleAction } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin/AdminShell";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { getArticles } from "@/lib/data/articles";

export default async function AdminNewsPage() {
  const articles = await getArticles();

  return (
    <AdminShell current="news">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-extrabold tracking-[0.12em] text-primary uppercase">
            Stories
          </p>
          <h1 className="text-[28px] font-extrabold tracking-[-0.03em] text-navy">News</h1>
        </div>
        <Link
          href="/admin/news/new"
          className="inline-flex min-h-11 cursor-pointer items-center rounded-full bg-brand px-4 text-sm font-extrabold text-paper"
        >
          Add story
        </Link>
      </div>
      <ul className="divide-y divide-line rounded-xl border border-line">
        {articles.map((article) => (
          <li key={article.id} className="flex flex-col gap-2 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-bold text-navy">
                {article.title_en || article.title_fa || article.title_nl || article.title_es || "Untitled"}
              </p>
              <p className="text-[13px] text-muted">
                {article.source_name} · {article.category} · {article.locales.join(", ")}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link href={`/admin/news/${article.id}`} className="text-[13px] font-bold text-primary hover:text-navy">
                Edit
              </Link>
              <DeleteButton action={deleteArticleAction} id={article.id} />
            </div>
          </li>
        ))}
      </ul>
    </AdminShell>
  );
}
