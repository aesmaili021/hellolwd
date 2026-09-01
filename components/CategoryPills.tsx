import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { NEWS_CATEGORIES, type NewsCategory } from "@/lib/types";

const MARK: Record<NewsCategory, string> = {
  politics: "🏛️",
  infrastructure: "🚧",
  culture: "🎭",
  business: "💼",
  safety: "🚨",
  education: "🎓",
  sports: "⚽",
};

export async function CategoryPills({
  active,
}: {
  active?: string;
  locale?: string;
}) {
  const t = await getTranslations("categories");
  const filters = await getTranslations("filters");

  return (
    <nav
      aria-label={filters("news")}
      className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:mx-0 lg:overflow-visible lg:px-0"
    >
      <ul className="flex w-max flex-nowrap gap-2 lg:flex-wrap">
        <li>
          <Chip
            href={{ pathname: "/" }}
            active={!active}
            label={filters("all")}
          />
        </li>
        {NEWS_CATEGORIES.map((id) => (
          <li key={id}>
            <Chip
              href={
                active === id
                  ? { pathname: "/" }
                  : { pathname: "/", query: { cat: id } }
              }
              active={active === id}
              mark={MARK[id]}
              label={t(id)}
              danger={active === id}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
}

function Chip({
  href,
  active,
  label,
  mark,
  danger,
}: {
  href: { pathname: "/"; query?: { cat: string } };
  active: boolean;
  label: string;
  mark?: string;
  danger?: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`inline-flex h-9 cursor-pointer items-center whitespace-nowrap rounded-full px-3.5 text-[13px] transition-colors duration-200 ease-out ${
        active
          ? danger
            ? "bg-accent font-extrabold text-paper"
            : "bg-brand font-extrabold text-paper"
          : "bg-wash font-semibold text-ink hover:text-navy"
      }`}
    >
      {mark ? (
        <span className="emoji me-1.5" dir="ltr" aria-hidden>
          {mark}
        </span>
      ) : null}
      {label}
      {active && danger ? <span className="ms-1.5" aria-hidden>✕</span> : null}
    </Link>
  );
}
