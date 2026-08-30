import { OBSTACLE_COUNT, type HeatPlayerRow, type PlayerRow } from "@/lib/types";

// Sin puntaje: el orden es por posición de llegada (finish_rank) y, para
// quien no llegó a terminar, por cuántos obstáculos alcanzó a superar.
function rankKey(hp: HeatPlayerRow): [number, number] {
  return hp.finish_rank !== null ? [0, hp.finish_rank] : [1, -hp.obstacle_index];
}

export function Podium({
  heatPlayers,
  playersById,
}: {
  heatPlayers: HeatPlayerRow[];
  playersById: Map<string, PlayerRow>;
}) {
  const sorted = [...heatPlayers].sort((a, b) => {
    const [aTier, aRank] = rankKey(a);
    const [bTier, bRank] = rankKey(b);
    return aTier !== bTier ? aTier - bTier : aRank - bRank;
  });
  const top = sorted.slice(0, 3);
  const firstKey = sorted[0] ? rankKey(sorted[0]) : null;
  const champions = firstKey
    ? sorted.filter((hp) => {
        const k = rankKey(hp);
        return k[0] === firstKey[0] && k[1] === firstKey[1];
      })
    : [];

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-10 p-10 text-center">
      <h1 className="font-heading text-4xl font-black text-slate-900">🏆 Podio final</h1>
      {champions.length > 1 && (
        <p className="text-xl font-semibold text-amber-800">
          ¡Empate en el primer lugar! Co-campeones:{" "}
          {champions.map((hp) => playersById.get(hp.player_id)?.name ?? "…").join(", ")}
        </p>
      )}
      <div className="flex items-end gap-8">
        {top[1] && (
          <PodiumBlock place={2} heatPlayer={top[1]} player={playersById.get(top[1].player_id)} height="h-40" />
        )}
        {top[0] && (
          <PodiumBlock place={1} heatPlayer={top[0]} player={playersById.get(top[0].player_id)} height="h-56" />
        )}
        {top[2] && (
          <PodiumBlock place={3} heatPlayer={top[2]} player={playersById.get(top[2].player_id)} height="h-28" />
        )}
      </div>
    </div>
  );
}

function PodiumBlock({
  place,
  heatPlayer,
  player,
  height,
}: {
  place: number;
  heatPlayer: HeatPlayerRow;
  player: PlayerRow | undefined;
  height: string;
}) {
  const medal = place === 1 ? "🥇" : place === 2 ? "🥈" : "🥉";
  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-2xl font-bold">{medal}</p>
      <p className="text-xl font-semibold text-slate-900">
        {player?.avatar} {player?.name ?? "…"}
      </p>
      <p className="text-lg font-bold text-amber-800">
        {heatPlayer.obstacle_index}/{OBSTACLE_COUNT}
      </p>
      <div className={`w-32 rounded-t-lg bg-slate-900 shadow-xl ${height}`} />
    </div>
  );
}
