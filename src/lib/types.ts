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

export interface Question {
  id: string;
  difficulty: Difficulty;
  text: string;
  options: string[];
  correct_index: number;
  category?: string;
}

export interface SessionRow {
  id: string;
  code: string;
  status: SessionStatus;
  created_at: string;
}

export interface PlayerRow {
  id: string;
  session_id: string;
  name: string;
  total_score: number;
  created_at: string;
}

export interface HeatRow {
  id: string;
  session_id: string;
  heat_number: number;
  status: HeatStatus;
  is_final: boolean;
  created_at: string;
}

export interface HeatPlayerRow {
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
}

// Minimal Supabase Database type — expand if generating types from the
// actual project schema later (`supabase gen types typescript`).
export interface Database {
  public: {
    Tables: {
      sessions: { Row: SessionRow; Insert: Partial<SessionRow>; Update: Partial<SessionRow> };
      players: { Row: PlayerRow; Insert: Partial<PlayerRow>; Update: Partial<PlayerRow> };
      heats: { Row: HeatRow; Insert: Partial<HeatRow>; Update: Partial<HeatRow> };
      heat_players: {
        Row: HeatPlayerRow;
        Insert: Partial<HeatPlayerRow>;
        Update: Partial<HeatPlayerRow>;
      };
    };
  };
}
