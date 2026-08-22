export const AVATAR_OPTIONS = [
  "🏃‍♂️",
  "🏃‍♀️",
  "🚗",
  "🏍️",
  "🚴",
  "✈️",
  "🚢",
  "🚀",
] as const;

export const DEFAULT_AVATAR = AVATAR_OPTIONS[0];

export type LanePattern = "road" | "stars" | "clouds" | null;

export interface LaneTheme {
  /** Fondo del carril (detrás de todo). */
  base: string;
  /** Color de la barra de progreso que sube. */
  fill: string;
  /** Textura opcional dibujada sobre el fondo, debajo de la barra. */
  pattern: LanePattern;
}

const ROAD: LaneTheme = { base: "bg-[#2b2b31]", fill: "bg-slate-400/80", pattern: "road" };
const TRACK: LaneTheme = { base: "bg-[#7a4a30]", fill: "bg-orange-200/80", pattern: null };
const WATER: LaneTheme = { base: "bg-sky-700", fill: "bg-sky-300/80", pattern: null };
const SKY: LaneTheme = { base: "bg-sky-300", fill: "bg-white/70", pattern: "clouds" };
const SPACE: LaneTheme = { base: "bg-[#0b1026]", fill: "bg-indigo-400/70", pattern: "stars" };

/** Fondo de carril según el personaje: carretera para vehículos, pista para
 * corredores, agua para el barco, cielo/espacio para avión y cohete. */
export const AVATAR_LANE_THEME: Record<string, LaneTheme> = {
  "🏃‍♂️": TRACK,
  "🏃‍♀️": TRACK,
  "🚗": ROAD,
  "🏍️": ROAD,
  "🚴": ROAD,
  "✈️": SKY,
  "🚢": WATER,
  "🚀": SPACE,
};

export const DEFAULT_LANE_THEME: LaneTheme = { base: "bg-slate-700", fill: "bg-amber-400/80", pattern: null };

export function getLaneTheme(avatar: string | undefined): LaneTheme {
  return (avatar && AVATAR_LANE_THEME[avatar]) || DEFAULT_LANE_THEME;
}
