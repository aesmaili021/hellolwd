import { redirect } from "next/navigation";
import { loginAction } from "@/app/admin/actions";
import { isAdmin } from "@/lib/admin/auth";
import { LogoMark } from "@/components/Pompebled";
import { ThemeToggle } from "@/components/ThemeToggle";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await isAdmin()) redirect("/admin/news");
  const { error } = await searchParams;

  return (
    <main className="mx-auto flex min-h-full w-full max-w-md flex-1 flex-col justify-center px-4 py-16">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <LogoMark className="h-7 w-7" />
          <span className="text-[21px] font-extrabold tracking-[-0.02em] text-navy">
            Hello<span className="text-primary">LWD</span>
          </span>
        </div>
        <ThemeToggle label="Toggle dark theme" />
      </div>
      <p className="text-[11px] font-extrabold tracking-[0.14em] text-primary uppercase">
        Editor desk
      </p>
      <h1 className="mt-2 text-[32px] font-extrabold tracking-[-0.03em] text-navy">
        Sign in
      </h1>
      <form action={loginAction} className="mt-8 flex flex-col gap-4">
        <label className="text-[11px] font-extrabold tracking-[0.08em] text-mute uppercase" htmlFor="username">
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          required
          className="rounded-lg border border-line bg-paper px-3 py-2.5 text-navy"
        />
        <label className="text-[11px] font-extrabold tracking-[0.08em] text-mute uppercase" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="rounded-lg border border-line bg-paper px-3 py-2.5 text-navy"
        />
        {error ? (
          <p className="text-sm font-semibold text-accent">Sign-in failed. Try again in a moment.</p>
        ) : null}
        <button
          type="submit"
          className="mt-2 min-h-11 cursor-pointer rounded-full bg-brand px-5 text-sm font-extrabold text-paper"
        >
          Enter desk
        </button>
      </form>
    </main>
  );
}
