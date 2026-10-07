import { getTranslations } from "next-intl/server";
import { LineIcon, type LineIconName } from "@/components/LineIcon";
import { Link } from "@/i18n/navigation";
import { NEWS_CATEGORIES, type NewsCategory } from "@/lib/types";

const MARK: Record<NewsCategory, LineIconName> = {
  politics: "landmark",
  infrastructure: "cone",
  culture: "drama",
  business: "briefcase",
  safety: "siren",
  education: "cap",
  sports: "ball",
};

export async function CategoryPills({
  active,
  basePath = "/",
}: {
  active?: string;
  locale?: string;
  basePath?: "/" | "/archive";
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
            href={{ pathname: basePath }}
            active={!active}
            label={filters("all")}
          />
        </li>
        {NEWS_CATEGORIES.map((id) => (
          <li key={id}>
            <Chip
              href={
                active === id
                  ? { pathname: basePath }
                  : { pathname: basePath, query: { cat: id } }
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
  href: { pathname: "/" | "/archive"; query?: { cat: string } };
  active: boolean;
  label: string;
  mark?: LineIconName;
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
      {mark ? <LineIcon name={mark} className="me-1.5 h-4 w-4 shrink-0" /> : null}
      {label}
      {active && danger ? <LineIcon name="x" className="ms-1.5 h-3.5 w-3.5 shrink-0" /> : null}
    </Link>
  );
}
