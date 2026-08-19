import { getSupabase } from "@/lib/supabase/client";
import { generateJoinCode } from "@/lib/joinCode";
import {
  FINISH_BONUS,
  MAX_LANES,
  OBSTACLE_COUNT,
  OBSTACLE_DIFFICULTIES,
  OBSTACLE_POINTS,
  type HeatPlayerRow,
  type HeatRow,
  type PlayerRow,
  type SessionRow,
} from "@/lib/types";

export async function createSession(): Promise<SessionRow> {
  const supabase = getSupabase();
  // Reintenta si el código generado ya existe (muy improbable con 4 chars, pero es barato de cubrir).
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = generateJoinCode();
    const { data, error } = await supabase
      .from("sessions")
      .insert({ code, status: "lobby" })
      .select()
      .single();
    if (!error) return data as unknown as SessionRow;
    if (!error.message.includes("duplicate")) throw error;
  }
  throw new Error("No se pudo generar un código de sesión único");
}

export async function getSessionByCode(code: string): Promise<SessionRow | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("code", code.toUpperCase())
    .maybeSingle();
  if (error) throw error;
  return (data as unknown as SessionRow) ?? null;
}

export async function getSessionById(id: string): Promise<SessionRow | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase.from("sessions").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return (data as unknown as SessionRow) ?? null;
}

export async function joinSession(
  sessionId: string,
  name: string,
  avatar: string
): Promise<PlayerRow> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("players")
    .insert({ session_id: sessionId, name: name.trim().slice(0, 24), avatar })
    .select()
    .single();
  if (error) throw error;
  return data as unknown as PlayerRow;
}

export async function getPlayer(playerId: string): Promise<PlayerRow | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase.from("players").select("*").eq("id", playerId).maybeSingle();
  if (error) throw error;
  return (data as unknown as PlayerRow) ?? null;
}

export async function listPlayers(sessionId: string): Promise<PlayerRow[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("players")
    .select("*")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data as unknown as PlayerRow[]) ?? [];
}

export async function listHeats(sessionId: string): Promise<HeatRow[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("heats")
    .select("*")
    .eq("session_id", sessionId)
    .order("heat_number", { ascending: true });
  if (error) throw error;
  return (data as unknown as HeatRow[]) ?? [];
}

export async function listHeatPlayers(heatId: string): Promise<HeatPlayerRow[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("heat_players")
    .select("*")
    .eq("heat_id", heatId)
    .order("lane", { ascending: true });
  if (error) throw error;
  return (data as unknown as HeatPlayerRow[]) ?? [];
}

/** Jugadores que aún no han corrido ninguna carrera regular (no-final) en esta sesión. */
export async function playersWithoutHeat(sessionId: string): Promise<PlayerRow[]> {
  const supabase = getSupabase();
  const players = await listPlayers(sessionId);
  const { data: rows, error } = await supabase
    .from("heat_players")
    .select("player_id, heats!inner(session_id, is_final)")
    .eq("heats.session_id", sessionId)
    .eq("heats.is_final", false);
  if (error) throw error;
  const racedIds = new Set((rows ?? []).map((r) => (r as { player_id: string }).player_id));
  return players.filter((p) => !racedIds.has(p.id));
}

export async function startNextHeat(sessionId: string): Promise<HeatRow> {
  const supabase = getSupabase();
  const pending = await playersWithoutHeat(sessionId);
  const batch = pending.slice(0, MAX_LANES);
  if (batch.length === 0) throw new Error("No quedan jugadores por correr");

  const existingHeats = await listHeats(sessionId);
  const heatNumber = existingHeats.filter((h) => !h.is_final).length + 1;

  const { data: heat, error: heatError } = await supabase
    .from("heats")
    .insert({ session_id: sessionId, heat_number: heatNumber, status: "running", is_final: false })
    .select()
    .single();
  if (heatError) throw heatError;

  const rows = batch.map((player, lane) => ({
    heat_id: (heat as unknown as HeatRow).id,
    player_id: player.id,
    lane,
    distance_pct: 0,
    obstacle_index: 0,
    state: "running" as const,
    wrong_attempts: 0,
    points: 0,
  }));
  const { error: hpError } = await supabase.from("heat_players").insert(rows);
  if (hpError) throw hpError;

  await supabase.from("sessions").update({ status: "racing" }).eq("id", sessionId);
  return heat as unknown as HeatRow;
}

export async function startFinalHeat(sessionId: string): Promise<HeatRow> {
  const supabase = getSupabase();
  const players = await listPlayers(sessionId);
  const top = [...players].sort((a, b) => b.total_score - a.total_score).slice(0, MAX_LANES);
  if (top.length === 0) throw new Error("No hay jugadores para la final");

  const { data: heat, error: heatError } = await supabase
    .from("heats")
    .insert({ session_id: sessionId, heat_number: 999, status: "running", is_final: true })
    .select()
    .single();
  if (heatError) throw heatError;

  const rows = top.map((player, lane) => ({
    heat_id: (heat as unknown as HeatRow).id,
    player_id: player.id,
    lane,
    distance_pct: 0,
    obstacle_index: 0,
    state: "running" as const,
    wrong_attempts: 0,
    points: 0,
  }));
  const { error: hpError } = await supabase.from("heat_players").insert(rows);
  if (hpError) throw hpError;

  return heat as unknown as HeatRow;
}

export async function pushDistance(heatPlayerId: string, distancePct: number): Promise<void> {
  const supabase = getSupabase();
  await supabase
    .from("heat_players")
    .update({ distance_pct: Math.min(100, Math.max(0, distancePct)) })
    .eq("id", heatPlayerId);
}

export async function enterQuestion(heatPlayerId: string): Promise<void> {
  const supabase = getSupabase();
  // Solo transiciona si de verdad estaba "running" — si ya está en "question"
  // o "finished" (llamada duplicada/desfasada), esto no hace nada.
  await supabase
    .from("heat_players")
    .update({ state: "question" })
    .eq("id", heatPlayerId)
    .eq("state", "running");
}

export async function recordWrongAttempt(heatPlayerId: string, wrongAttempts: number): Promise<void> {
  const supabase = getSupabase();
  await supabase
    .from("heat_players")
    .update({ wrong_attempts: wrongAttempts })
    .eq("id", heatPlayerId);
}

/**
 * Registra un obstáculo superado. Si era el último, cierra la carrera del
 * jugador (rango de llegada + bonus) y, como el primero en llegar gana,
 * ese mismo cierre marca el heat completo como finalizado — los demás
 * carriles quedan con lo que ya habían acumulado.
 */
export async function clearObstacle(
  heatPlayer: HeatPlayerRow,
  raceStartedAt: number
): Promise<{ finished: boolean }> {
  const supabase = getSupabase();

  // Vuelve a leer la fila desde la base en vez de confiar en el snapshot que
  // trae el cliente: en conexiones inestables (iOS) un envío repetido o
  // retrasado puede llegar con `heatPlayer` desactualizado. Si ya no está en
  // estado "question" (otro envío ya la resolvió, o el heat ya cerró), esta
  // llamada no hace nada — evita saltar obstáculos sin haber agitado.
  const { data: freshRow } = await supabase
    .from("heat_players")
    .select("*")
    .eq("id", heatPlayer.id)
    .single();
  const current = freshRow as unknown as HeatPlayerRow | null;
  if (!current || current.state !== "question") {
    return { finished: current?.state === "finished" };
  }

  const { data: heatRow } = await supabase
    .from("heats")
    .select("status")
    .eq("id", current.heat_id)
    .single();
  if ((heatRow as unknown as HeatRow | null)?.status === "finished") {
    return { finished: false };
  }

  const difficulty = OBSTACLE_DIFFICULTIES[current.obstacle_index];
  const obstaclePoints = OBSTACLE_POINTS[difficulty];
  const nextIndex = current.obstacle_index + 1;
  const finished = nextIndex >= OBSTACLE_COUNT;

  let finishRank: number | null = null;
  let bonus = 0;
  if (finished) {
    const { count } = await supabase
      .from("heat_players")
      .select("id", { count: "exact", head: true })
      .eq("heat_id", current.heat_id)
      .not("finish_rank", "is", null);
    finishRank = (count ?? 0) + 1;
    bonus = FINISH_BONUS[Math.min(finishRank - 1, FINISH_BONUS.length - 1)] ?? 0;
  }

  const newPoints = current.points + obstaclePoints + bonus;

  await supabase
    .from("heat_players")
    .update({
      obstacle_index: nextIndex,
      distance_pct: (nextIndex / OBSTACLE_COUNT) * 100,
      state: finished ? "finished" : "running",
      wrong_attempts: 0,
      points: newPoints,
      finish_rank: finishRank,
      finish_ms: finished ? Date.now() - raceStartedAt : null,
    })
    .eq("id", current.id);

  // total_score del jugador (lectura + escritura simple; concurrencia baja: un jugador solo escribe su propia fila)
  const { data: player } = await supabase
    .from("players")
    .select("total_score")
    .eq("id", current.player_id)
    .single();
  const currentTotal = (player as unknown as PlayerRow | null)?.total_score ?? 0;
  await supabase
    .from("players")
    .update({ total_score: currentTotal + obstaclePoints + bonus })
    .eq("id", current.player_id);

  if (finished && finishRank === 1) {
    await supabase.from("heats").update({ status: "finished" }).eq("id", current.heat_id);
  }

  return { finished };
}

/** Cierra la carrera actual para todos los carriles, la hayan terminado o no. */
export async function closeHeat(heatId: string): Promise<void> {
  const supabase = getSupabase();
  await supabase.from("heats").update({ status: "finished" }).eq("id", heatId);
}

/** Última fila heat_players del jugador (su carrera actual o más reciente), con el heat asociado. */
export async function getLatestHeatPlayer(
  playerId: string
): Promise<{ heatPlayer: HeatPlayerRow; heat: HeatRow } | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("heat_players")
    .select("*, heats(*)")
    .eq("player_id", playerId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const row = data as unknown as HeatPlayerRow & { heats: HeatRow };
  const { heats, ...heatPlayer } = row;
  return { heatPlayer: heatPlayer as HeatPlayerRow, heat: heats };
}

export async function finishSession(sessionId: string): Promise<void> {
  const supabase = getSupabase();
  await supabase.from("sessions").update({ status: "finished" }).eq("id", sessionId);
}

export function subscribeToPlayer(playerId: string, onChange: () => void) {
  const supabase = getSupabase();
  const channel = supabase
    .channel(`player:${playerId}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "heat_players", filter: `player_id=eq.${playerId}` },
      onChange
    )
    .subscribe();
  return () => {
    supabase.removeChannel(channel);
  };
}

/**
 * Escucha el heat actual del jugador directamente (no solo su propia fila en
 * heat_players): así se entera de que la carrera cerró aunque en ese momento
 * no esté generando updates propios (p. ej. a media pregunta).
 */
export function subscribeToHeat(heatId: string, onChange: () => void) {
  const supabase = getSupabase();
  const channel = supabase
    .channel(`heat-status:${heatId}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "heats", filter: `id=eq.${heatId}` },
      onChange
    )
    .subscribe();
  return () => {
    supabase.removeChannel(channel);
  };
}

export function subscribeToHeatPlayers(heatId: string, onChange: () => void) {
  const supabase = getSupabase();
  const channel = supabase
    .channel(`heat_players:${heatId}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "heat_players", filter: `heat_id=eq.${heatId}` },
      onChange
    )
    .subscribe();
  return () => {
    supabase.removeChannel(channel);
  };
}

export function subscribeToSession(sessionId: string, onChange: () => void) {
  const supabase = getSupabase();
  const channel = supabase
    .channel(`session:${sessionId}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "sessions", filter: `id=eq.${sessionId}` },
      onChange
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "heats", filter: `session_id=eq.${sessionId}` },
      onChange
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "players", filter: `session_id=eq.${sessionId}` },
      onChange
    )
    .subscribe();
  return () => {
    supabase.removeChannel(channel);
  };
}
