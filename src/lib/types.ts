export type Difficulty = "facil" | "media" | "dificil";

export type SessionStatus = "lobby" | "racing" | "finished";
export type HeatStatus = "waiting" | "running" | "finished";
export type HeatPlayerState = "running" | "question" | "finished";

export const OBSTACLE_COUNT = 5;
export const OBSTACLE_DIFFICULTIES: Difficulty[] = [
  "facil",
  "facil",
  "media",
  "media",
  "dificil",
];
export const OBSTACLE_POINTS: Record<Difficulty, number> = {
  facil: 10,
  media: 15,
  dificil: 20,
};
export const FINISH_BONUS = [50, 30, 15, 5]; // por posición de llegada (1º-4º)
export const MAX_LANES = 4;

// Nota: estos son `type`, no `interface`. Un `interface` no satisface
// `Record<string, unknown>` en un chequeo `extends` (TS no le infiere firma de
// índice porque las interfaces son abiertas/ampliables), y eso es justo lo
// que supabase-js exige de cada `Row` — con `interface` aquí, el tipado de
// insert/update de Supabase colapsa silenciosamente a `never`.
export type Question = {
  id: string;
  difficulty: Difficulty;
  text: string;
  options: string[];
  correct_index: number;
  category?: string;
};

export type SessionRow = {
  id: string;
  code: string;
  status: SessionStatus;
  created_at: string;
};

export type PlayerRow = {
  id: string;
  session_id: string;
  name: string;
  avatar: string;
  total_score: number;
  created_at: string;
};

export type HeatRow = {
  id: string;
  session_id: string;
  heat_number: number;
  status: HeatStatus;
  is_final: boolean;
  created_at: string;
};

export type HeatPlayerRow = {
  id: string;
  heat_id: string;
  player_id: string;
  lane: number;
  distance_pct: number;
  obstacle_index: number;
  state: HeatPlayerState;
  current_question_id: string | null;
  wrong_attempts: number;
  finish_rank: number | null;
  finish_ms: number | null;
  points: number;
  created_at: string;
  updated_at: string;
};

// Minimal Supabase Database type — expand if generating types from the
// actual project schema later (`supabase gen types typescript`).
// `Relationships`/`Views`/`Functions` are required (even empty) so this
// structurally satisfies supabase-js's GenericSchema/GenericTable — without
// them, table generics silently collapse to `never` and every insert/update
// call fails to type-check.
type Table<Row, Insert> = {
  Row: Row;
  Insert: Insert;
  Update: Partial<Row>;
  Relationships: [];
};

export interface Database {
  public: {
    Tables: {
      sessions: Table<SessionRow, Partial<SessionRow>>;
      players: Table<PlayerRow, Partial<PlayerRow>>;
      heats: Table<HeatRow, Partial<HeatRow>>;
      heat_players: Table<HeatPlayerRow, Partial<HeatPlayerRow>>;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}
