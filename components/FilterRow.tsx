import Link from "next/link";

type Item = { id: string; label: string; href: string };

export function FilterRow({
  label,
  items,
  allHref,
  allLabel,
  activeId,
}: {
  label: string;
  items: Item[];
  allHref: string;
  allLabel: string;
  activeId?: string;
}) {
  return (
    <nav
      aria-label={label}
      className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <ul className="flex w-max gap-2 pb-1">
        <li>
          <Chip href={allHref} active={!activeId} label={allLabel} />
        </li>
        {items.map((item) => (
          <li key={item.id}>
            <Chip
              href={item.href}
              active={activeId === item.id}
              label={item.label}
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
}: {
  href: string;
  active: boolean;
  label: string;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`inline-flex h-11 cursor-pointer items-center rounded-full px-3.5 text-sm font-medium transition-colors duration-200 ease-out ${
        active
          ? "bg-navy text-paper"
          : "bg-mist text-ink-soft hover:bg-line hover:text-navy"
      }`}
    >
      {label}
    </Link>
  );
}
