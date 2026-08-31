import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[50vh] w-full max-w-3xl flex-col justify-center px-4">
      <h1 className="text-2xl font-semibold text-navy">404</h1>
      <p className="mt-2 text-ink">This page is not on HelloLWD.</p>
      <Link
        href="/en"
        className="mt-4 inline-flex min-h-11 w-fit cursor-pointer items-center font-medium text-navy underline-offset-4 hover:underline"
      >
        Back to news
      </Link>
    </main>
  );
}
