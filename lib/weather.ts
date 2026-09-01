export type WeatherKind =
  | "clear"
  | "cloudy"
  | "fog"
  | "drizzle"
  | "rain"
  | "snow"
  | "storm";

export type WeatherDay = {
  date: string;
  kind: WeatherKind;
  max: number;
  min: number;
  rain: number;
};

export type WeatherSnapshot = {
  city: string;
  updated: string;
  current: {
    temp: number;
    kind: WeatherKind;
    wind: number;
    humidity: number;
  };
  days: WeatherDay[];
};

const LAT = 53.2012;
const LON = 5.7999;

function kindFromCode(code: number): WeatherKind {
  if (code === 0) return "clear";
  if (code <= 3) return "cloudy";
  if (code <= 48) return "fog";
  if (code <= 57) return "drizzle";
  if (code <= 67) return "rain";
  if (code <= 77) return "snow";
  if (code <= 82) return "rain";
  if (code <= 86) return "snow";
  return "storm";
}

function round(value: number) {
  return Math.round(value);
}

export async function getLeeuwardenWeather(): Promise<WeatherSnapshot | null> {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}` +
    "&current=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m" +
    "&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max" +
    "&timezone=Europe%2FAmsterdam&forecast_days=5";

  try {
    const res = await fetch(url, {
      next: { revalidate: 1800, tags: ["weather"] },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      current?: {
        time?: string;
        temperature_2m?: number;
        weather_code?: number;
        wind_speed_10m?: number;
        relative_humidity_2m?: number;
      };
      daily?: {
        time?: string[];
        weather_code?: number[];
        temperature_2m_max?: number[];
        temperature_2m_min?: number[];
        precipitation_probability_max?: number[];
      };
    };
    if (data.current?.temperature_2m == null || !data.daily?.time?.length) return null;

    return {
      city: "Leeuwarden",
      updated: data.current.time || new Date().toISOString(),
      current: {
        temp: round(data.current.temperature_2m),
        kind: kindFromCode(data.current.weather_code ?? 2),
        wind: round(data.current.wind_speed_10m ?? 0),
        humidity: round(data.current.relative_humidity_2m ?? 0),
      },
      days: data.daily.time.slice(0, 5).map((date, index) => ({
        date,
        kind: kindFromCode(data.daily?.weather_code?.[index] ?? 2),
        max: round(data.daily?.temperature_2m_max?.[index] ?? 0),
        min: round(data.daily?.temperature_2m_min?.[index] ?? 0),
        rain: round(data.daily?.precipitation_probability_max?.[index] ?? 0),
      })),
    };
  } catch {
    return null;
  }
}
