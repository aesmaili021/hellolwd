export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-5 lg:px-10 lg:py-8">
      <p className="mb-4 text-[11px] font-extrabold tracking-[0.1em] text-mute uppercase">
        Loading
      </p>
      <div className="shimmer h-[190px] rounded-[10px] bg-[#E9EEF3] lg:h-[300px] lg:rounded-xl" />
      <div className="mt-4 flex flex-col gap-2.5">
        <div className="shimmer h-3 w-[90px] rounded bg-[#E9EEF3]" />
        <div className="shimmer h-[22px] w-full rounded bg-[#E9EEF3]" />
        <div className="shimmer h-[22px] w-[72%] rounded bg-[#E9EEF3]" />
        <div className="shimmer h-3.5 w-full rounded bg-[#EEF2F6]" />
        <div className="shimmer h-3.5 w-[84%] rounded bg-[#EEF2F6]" />
      </div>
      <div className="mt-8 flex flex-col gap-3.5">
        {[0, 1, 2].map((key) => (
          <div key={key} className="flex gap-3 border-t border-[#EEF2F6] pt-3.5">
            <div className="shimmer h-[58px] w-[76px] shrink-0 rounded-[7px] bg-[#E9EEF3]" />
            <div className="flex flex-1 flex-col gap-2">
              <div className="h-[11px] w-[60%] rounded bg-[#EEF2F6]" />
              <div className="h-[15px] w-full rounded bg-[#E9EEF3]" />
              <div className="h-[15px] w-[55%] rounded bg-[#E9EEF3]" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
