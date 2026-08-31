# HelloLWD — Design Brief

## What this is
A compact, multilingual local news and events hub for Leeuwarden, the Netherlands. Aggregates and summarizes local news via RSS, plus a curated weekend nightlife/music events section aimed at students and expats.

## Audience
International students (NHL Stenden), expats, and internationals living in Leeuwarden who don't read Dutch fluently — plus the Latin American, Farsi-speaking, and general international community with no existing local news source in their language.

## Languages
Four languages, all first-class (not just NL with translations bolted on):
- Dutch (nl)
- English (en)
- Spanish (es)
- Farsi / Persian (fa) — **right-to-left layout required**

Language switcher should be persistent and obvious (top nav), not buried in a menu.

## Core content types
1. **News feed** — RSS-sourced from local outlets (Omrop Fryslân, Omroep Leeuwarden, LC.nl), auto-summarized and translated into all 4 languages, always linking back to the original source.
2. **Weekend events / nightlife** — curated parties, club nights, live music, DJ sets. This is the flagship differentiator, no competitor covers this.

## News categories
Each news item is tagged with one category, filterable:
- Politics / Council
- Infrastructure (traffic, construction, transport)
- Culture / Events
- Business / Economy
- Safety / Incidents
- Education / Student life
- Sports

## Brand name
**HelloLWD**

## Visual identity direction
Color palette rooted in two local symbols:
- **Frisian provincial flag**: diagonal blue and white stripes with red pompeblêden (stylized water-lily leaves). Core colors: blue (~#01A0E2 / a deep sky-blue), red (~#C8102E), white.
- **Leeuwarden city identity**: keep it clean and modern rather than literally reproducing the flag — use the blue/red/white as an accent palette, not a background pattern.

Suggested palette:
- Primary blue: `#01A0E2` (Frisian flag blue)
- Deep navy (for text/headers, better contrast than the bright blue): `#0B3D5C`
- Accent red: `#C8102E` (pompeblêden red) — use sparingly, for tags/CTAs/category highlights, not large fields
- White / off-white background: `#FFFFFF` / `#F7FAFC`
- Neutral gray for body text: `#374151`

Avoid over-literal flag motifs (no diagonal stripe backgrounds everywhere) — the goal is "inspired by," clean and modern, not a flag graphic. A small pompeblêd (water-lily leaf) shape could work well as a favicon/logo mark or category icon accent.

## Typography
Clean, highly legible sans-serif that also renders Farsi (RTL) well — e.g. a pairing like Inter or Manrope for Latin scripts, with a matching web-safe Arabic/Farsi font (e.g. Vazirmatn) for the fa locale, not a forced single font across all scripts.

## Layout / structure (v1 scope)
- Homepage: top nav (logo, language switcher, category filter), hero/featured story, news feed (category tag, headline, 2–3 line summary, source + timestamp, "read full article" outbound link)
- Weekend Events section: separate tab/page, card per event (name, venue, date/time, genre tag, ticket/Instagram link), filterable by genre (electronic, hip-hop, live band, student party, etc.)
- Footer: colofon (business name, KVK number, contact email, address), privacy policy link
- Mobile-first — most of this audience will browse on phone

## Tone
Compact, scannable, no fluff. Headlines and summaries should read like a fast local briefing, not a full article rewrite.

## Explicitly out of scope for v1
- User accounts / comments
- Payment/ad infrastructure
- Full article reproduction (summaries + outbound links only, for copyright reasons)
