const TEAM_ID = "3736";

type EspnStat = { name?: string; value?: number; displayValue?: string };
type EspnTeam = {
  id?: string;
  displayName?: string;
  shortDisplayName?: string;
  abbreviation?: string;
  logos?: { href?: string }[];
};
type EspnCompetitor = {
  id?: string;
  homeAway?: string;
  winner?: boolean;
  score?: { value?: number; displayValue?: string } | string;
  team?: EspnTeam;
};
type EspnEvent = {
  id?: string;
  date?: string;
  name?: string;
  shortName?: string;
  competitions?: {
    status?: { type?: { state?: string; completed?: boolean } };
    competitors?: EspnCompetitor[];
    venue?: { fullName?: string };
  }[];
};

export type CambuurMatch = {
  id: string;
  date: string;
  home: boolean;
  opponent: string;
  score: string | null;
  result: "W" | "D" | "L" | null;
  live: boolean;
  venue?: string;
};

export type TableRow = {
  rank: number;
  name: string;
  played: number;
  points: number;
  gd: number;
  cambuur: boolean;
};

export type CambuurSnapshot = {
  name: string;
  logo: string | null;
  rank: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  points: number;
  gf: number;
  ga: number;
  gd: number;
  zone: "relegation" | "playoff" | "mid";
  recent: CambuurMatch[];
  next: CambuurMatch | null;
  live: CambuurMatch | null;
  table: TableRow[];
};

function stat(stats: EspnStat[] | undefined, name: string) {
  const row = stats?.find((item) => item.name === name);
  return Number(row?.value ?? row?.displayValue ?? 0);
}

function scoreOf(competitor?: EspnCompetitor) {
  if (!competitor) return null;
  if (typeof competitor.score === "string") return Number(competitor.score);
  if (typeof competitor.score?.value === "number") return competitor.score.value;
  if (competitor.score?.displayValue) return Number(competitor.score.displayValue);
  return null;
}

function parseMatch(event: EspnEvent): CambuurMatch | null {
  const game = event.competitions?.[0];
  const sides = game?.competitors ?? [];
  const us = sides.find((side) => side.id === TEAM_ID || side.team?.id === TEAM_ID);
  const them = sides.find((side) => side !== us);
  if (!us || !them) return null;
  const gf = scoreOf(us);
  const ga = scoreOf(them);
  const state = game?.status?.type?.state;
  const done = game?.status?.type?.completed || state === "post";
  const live = state === "in";
  let result: CambuurMatch["result"] = null;
  if (done && gf != null && ga != null) {
    result = gf > ga ? "W" : gf < ga ? "L" : "D";
  }
  return {
    id: event.id || event.date || event.shortName || "match",
    date: event.date || "",
    home: us.homeAway === "home",
    opponent: them.team?.shortDisplayName || them.team?.displayName || them.team?.abbreviation || "?",
    score: gf != null && ga != null ? `${gf}–${ga}` : null,
    result,
    live,
    venue: game?.venue?.fullName,
  };
}

async function getJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "Mozilla/5.0",
      },
      next: { revalidate: 900, tags: ["cambuur"] },
    });
    if (!res.ok) {
      console.warn("[cambuur]", url, res.status);
      return null;
    }
    return (await res.json()) as T;
  } catch (error) {
    console.warn("[cambuur]", url, error instanceof Error ? error.message : error);
    return null;
  }
}

export async function getCambuur(): Promise<CambuurSnapshot | null> {
  const [standings, schedule, team] = await Promise.all([
    getJson<{
      children?: { standings?: { entries?: { team?: EspnTeam; stats?: EspnStat[]; note?: { description?: string } }[] } }[];
    }>("https://site.api.espn.com/apis/v2/sports/soccer/ned.1/standings"),
    getJson<{ events?: EspnEvent[] }>(
      `https://site.api.espn.com/apis/site/v2/sports/soccer/ned.1/teams/${TEAM_ID}/schedule`,
    ),
    getJson<{ team?: { displayName?: string; logos?: { href?: string }[]; nextEvent?: EspnEvent[] } }>(
      `https://site.api.espn.com/apis/site/v2/sports/soccer/ned.1/teams/${TEAM_ID}`,
    ),
  ]);

  const entries = standings?.children?.[0]?.standings?.entries ?? [];
  const ours = entries.find((row) => row.team?.id === TEAM_ID || row.team?.abbreviation === "CAM");
  if (!ours) return null;

  const rank = stat(ours.stats, "rank");
  const start = Math.max(1, Math.min(rank - 2, 15));
  const table = entries
    .map((row) => ({
      rank: stat(row.stats, "rank"),
      name: row.team?.shortDisplayName || row.team?.displayName || "",
      played: stat(row.stats, "gamesPlayed"),
      points: stat(row.stats, "points"),
      gd: stat(row.stats, "pointDifferential"),
      cambuur: row.team?.id === TEAM_ID || row.team?.abbreviation === "CAM",
    }))
    .filter((row) => row.rank >= start && row.rank <= start + 3);

  const parsed = (schedule?.events ?? [])
    .map(parseMatch)
    .filter((row): row is CambuurMatch => Boolean(row))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const recent = parsed.filter((row) => row.result).slice(0, 4);
  const live = parsed.find((row) => row.live) ?? null;
  const upcoming = parsed
    .filter((row) => !row.result && !row.live)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const next = upcoming[0] ?? parseMatch(team?.team?.nextEvent?.[0] ?? {}) ?? null;

  const zone =
    rank >= 17 ? "relegation" : rank === 16 ? "playoff" : "mid";

  return {
    name: team?.team?.displayName || ours.team?.displayName || "SC Cambuur",
    logo: team?.team?.logos?.[0]?.href || ours.team?.logos?.[0]?.href || null,
    rank,
    played: stat(ours.stats, "gamesPlayed"),
    won: stat(ours.stats, "wins"),
    drawn: stat(ours.stats, "ties"),
    lost: stat(ours.stats, "losses"),
    points: stat(ours.stats, "points"),
    gf: stat(ours.stats, "pointsFor"),
    ga: stat(ours.stats, "pointsAgainst"),
    gd: stat(ours.stats, "pointDifferential"),
    zone,
    recent,
    next: next?.id === live?.id ? null : next,
    live,
    table,
  };
}
