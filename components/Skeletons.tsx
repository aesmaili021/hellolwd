function Bone({ className = "bg-wash" }: { className?: string }) {
  return <div className={`shimmer rounded-md ${className}`} />;
}

export function StatusBarSkeleton() {
  return (
    <div className="bg-navy" aria-hidden>
      <div className="mx-auto flex h-9 max-w-[1440px] items-center gap-2.5 px-4 lg:px-10">
        <Bone className="h-2.5 w-24 bg-paper/20" />
        <span className="h-3 w-px bg-paper/20" />
        <Bone className="h-2.5 w-20 bg-paper/15" />
        <span className="h-3 w-px bg-paper/20" />
        <Bone className="h-2.5 w-40 bg-paper/10" />
      </div>
    </div>
  );
}

export function TodaySkeleton() {
  return (
    <section className="border-b border-line bg-ice" aria-hidden>
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-3 px-4 py-3.5 sm:grid-cols-2 sm:items-center sm:gap-6 lg:px-10 lg:py-4">
        <Bone className="h-2.5 w-16 bg-slate sm:col-span-2" />
        {[0, 1].map((key) => (
          <div key={key} className="min-w-0">
            <Bone className="h-2 w-14 bg-slate" />
            <Bone className="mt-2 h-4 w-[78%] bg-wash" />
            {key === 0 ? <Bone className="mt-1.5 h-3 w-[52%] bg-slate" /> : null}
          </div>
        ))}
      </div>
    </section>
  );
}

function CtaSkeleton() {
  return (
    <section className="border-b border-line bg-ice px-4 py-7 lg:px-10 lg:py-11" aria-hidden>
      <div className="mx-auto flex max-w-[1440px] flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="w-full max-w-[38rem]">
          <Bone className="h-2.5 w-24 bg-slate" />
          <Bone className="mt-3 h-8 w-[88%] bg-wash lg:h-10" />
          <Bone className="mt-2 h-8 w-[62%] bg-wash lg:h-10" />
          <Bone className="mt-4 h-3.5 w-[70%] bg-slate" />
        </div>
        <Bone className="h-12 w-40 rounded-full bg-slate lg:h-14" />
      </div>
    </section>
  );
}

export function WeekendSlotSkeleton() {
  return (
    <div className="border-b border-line bg-paper px-4 py-2.5 lg:px-10" aria-hidden>
      <div className="mx-auto flex max-w-[1440px] items-center justify-between">
        <Bone className="h-3 w-48 bg-slate" />
        <Bone className="h-3 w-20 bg-slate" />
      </div>
    </div>
  );
}

function FilterRowBone() {
  return (
    <div className="flex gap-4 border-b border-line py-5">
      <Bone className="h-[78px] w-[104px] shrink-0 rounded-lg bg-wash" />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <Bone className="h-2.5 w-28 bg-slate" />
        <Bone className="h-4 w-full bg-wash" />
        <Bone className="h-4 w-[70%] bg-wash" />
      </div>
    </div>
  );
}

export function NewsSkeleton({ filtered = false }: { filtered?: boolean }) {
  return (
    <div className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-4 lg:px-10 lg:py-8">
      <div className="mb-5 flex gap-2 overflow-hidden lg:mb-7">
        {["w-12", "w-16", "w-20", "w-14", "w-[4.5rem]", "w-[4.25rem]", "w-[4.75rem]"].map(
          (width) => (
            <Bone key={width} className={`h-9 shrink-0 rounded-full bg-wash ${width}`} />
          ),
        )}
      </div>
      {filtered ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-11">
          {[0, 1, 2, 3].map((key) => (
            <FilterRowBone key={key} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1.35fr_1fr] lg:gap-9">
          <div>
            <Bone className="h-[190px] w-full rounded-[10px] bg-wash lg:h-[300px] lg:rounded-xl" />
            <Bone className="mt-3.5 h-5 w-16 bg-slate" />
            <Bone className="mt-3 h-7 w-full max-w-md bg-wash" />
            <Bone className="mt-2 h-7 w-[68%] bg-wash" />
            <Bone className="mt-3 h-3.5 w-full bg-slate" />
            <Bone className="mt-2 h-3.5 w-[84%] bg-slate" />
          </div>
          <div className="flex flex-col">
            {[0, 1, 2, 3, 4].map((key) => (
              <div
                key={key}
                className="border-t border-line py-4 lg:border-t-0 lg:border-b lg:py-[18px]"
              >
                <Bone className="h-3 w-24 bg-slate" />
                <Bone className="mt-2 h-4 w-full bg-wash" />
                <Bone className="mt-1.5 h-4 w-[64%] bg-wash" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function HomeSkeleton({ filtered = false }: { filtered?: boolean }) {
  return (
    <div aria-busy="true" aria-live="polite">
      {!filtered ? <TodaySkeleton /> : null}
      {!filtered ? <WeekendSlotSkeleton /> : null}
      <NewsSkeleton filtered={filtered} />
      <CtaSkeleton />
    </div>
  );
}

export function ArticleSkeleton() {
  return (
    <main
      id="content"
      className="mx-auto w-full max-w-[720px] flex-1 px-4 py-8 lg:px-10 lg:py-12"
      aria-busy="true"
    >
      <Bone className="h-4 w-28 bg-slate" />
      <Bone className="mt-6 h-[190px] w-full rounded-[10px] bg-wash lg:h-[300px] lg:rounded-xl" />
      <Bone className="mt-4 h-5 w-16 bg-slate" />
      <Bone className="mt-3.5 h-8 w-full max-w-sm bg-wash" />
      <Bone className="mt-2 h-8 w-[72%] bg-wash" />
      <div className="mt-5 flex flex-col gap-2.5">
        <Bone className="h-3.5 w-full bg-slate" />
        <Bone className="h-3.5 w-full bg-slate" />
        <Bone className="h-3.5 w-[88%] bg-slate" />
      </div>
    </main>
  );
}

export function EventsSkeleton() {
  return (
    <main
      id="content"
      className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-6 lg:px-10 lg:py-10"
      aria-busy="true"
    >
      <Bone className="h-2.5 w-24 bg-slate" />
      <Bone className="mt-3 h-8 w-64 bg-wash lg:h-10" />
      <div className="mt-6 flex gap-2 overflow-hidden">
        {["w-20", "w-16", "w-14", "w-[4.5rem]", "w-[4.25rem]"].map((width) => (
          <Bone key={width} className={`h-9 shrink-0 rounded-full bg-wash ${width}`} />
        ))}
      </div>
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
        {[0, 1, 2].map((key) => (
          <div key={key} className="rounded-xl border border-line bg-mist p-4">
            <Bone className="h-5 w-16 bg-slate" />
            <Bone className="mt-3 h-5 w-[88%] bg-wash" />
            <Bone className="mt-2 h-3.5 w-[50%] bg-slate" />
          </div>
        ))}
      </div>
    </main>
  );
}
