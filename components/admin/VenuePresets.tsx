"use client";

import { VENUE_PRESETS, type VenuePreset } from "@/lib/venues";

const label = "mb-1.5 block text-[11px] font-extrabold tracking-[0.08em] text-mute uppercase";

function fill(name: string, value: string) {
  const input = document.getElementById(name);
  if (input instanceof HTMLInputElement) {
    input.value = value;
    input.dispatchEvent(new Event("input", { bubbles: true }));
  }
}

function applyPreset(venue: VenuePreset) {
  fill("venue", venue.name);
  fill("ticket_link", venue.ticket_link);
  fill("maps_url", venue.maps_url);
}

export function VenuePresets() {
  return (
    <div>
      <p className={label}>Fill from a venue</p>
      <div className="flex flex-wrap gap-2">
        {VENUE_PRESETS.map((venue) => (
          <button
            key={venue.id}
            type="button"
            onClick={() => applyPreset(venue)}
            className="inline-flex min-h-11 cursor-pointer items-center rounded-full bg-ice px-3.5 text-[13px] font-extrabold text-navy hover:bg-wash"
          >
            {venue.name}
          </button>
        ))}
      </div>
    </div>
  );
}
