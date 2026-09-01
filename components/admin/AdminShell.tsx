import Link from "next/link";
import { redirect } from "next/navigation";
import { logoutAction } from "@/app/admin/actions";
import { LogoMark } from "@/components/Pompebled";
import { ThemeToggle } from "@/components/ThemeToggle";
import { isAdmin } from "@/lib/admin/auth";

const TABS = [
  { href: "/admin/news", label: "News" },
  { href: "/admin/events", label: "Events" },
  { href: "/admin/rss", label: "RSS" },
] as const;

export async function AdminShell({
  current,
  children,
}: {
  current: "news" | "events" | "rss";
  children: React.ReactNode;
}) {
  if (!(await isAdmin())) redirect("/admin/login");

  return (
    <div className="flex min-h-full flex-1 flex-col bg-paper">
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3.5">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <LogoMark className="h-[22px] w-[22px]" />
              <span className="text-[17px] font-extrabold tracking-[-0.02em] text-navy">
                Hello<span className="text-primary">LWD</span>
              </span>
            </Link>
            <span className="rounded-full bg-wash px-2.5 py-1 text-[11px] font-extrabold tracking-[0.08em] text-mute uppercase">
              Desk
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle label="Toggle dark theme" />
            <form action={logoutAction}>
              <button
                type="submit"
                className="cursor-pointer rounded-full px-3 py-1.5 text-[13px] font-bold text-muted hover:text-navy"
              >
                Log out
              </button>
            </form>
          </div>
        </div>
        <nav className="mx-auto flex max-w-5xl gap-6 px-4">
          {TABS.map((tab) => {
            const on = current === tab.href.split("/")[2];
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`cursor-pointer pb-2.5 text-[14px] ${
                  on
                    ? "border-b-2 border-primary font-bold text-navy"
                    : "font-semibold text-muted hover:text-navy"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>
    </div>
  );
}
