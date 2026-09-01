export function LegalDoc({
  title,
  updated,
  sections,
}: {
  title: string;
  updated: string;
  sections: { heading: string; body: string }[];
}) {
  return (
    <main id="content" className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-10 lg:px-10 lg:py-16">
      <h1 className="max-w-[22ch] text-[32px] font-extrabold tracking-[-0.03em] text-navy lg:text-[38px]">
        {title}
      </h1>
      <p className="mt-3 text-[13px] font-semibold text-mute">{updated}</p>
      <div className="mt-8 flex max-w-[68ch] flex-col gap-8">
        {sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-lg font-extrabold tracking-[-0.02em] text-navy">{section.heading}</h2>
            <p className="mt-2 text-base leading-7 text-ink whitespace-pre-line">{section.body}</p>
          </section>
        ))}
      </div>
    </main>
  );
}
