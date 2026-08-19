import type { PlayerRow } from "@/lib/types";

export function Podium({ players }: { players: PlayerRow[] }) {
  const sorted = [...players].sort((a, b) => b.total_score - a.total_score);
  const top = sorted.slice(0, 3);
  // Co-campeones si hay empate exacto en el primer lugar.
  const champions = sorted.filter((p) => p.total_score === sorted[0]?.total_score);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-10 p-10 text-center">
      <h1 className="text-4xl font-bold">🏆 Podio final</h1>
      {champions.length > 1 && (
        <p className="text-xl text-amber-400">
          ¡Empate en el primer lugar! Co-campeones: {champions.map((c) => c.name).join(", ")}
        </p>
      )}
      <div className="flex items-end gap-8">
        {top[1] && <PodiumBlock place={2} player={top[1]} height="h-40" />}
        {top[0] && <PodiumBlock place={1} player={top[0]} height="h-56" />}
        {top[2] && <PodiumBlock place={3} player={top[2]} height="h-28" />}
      </div>
    </div>
  );
}

function PodiumBlock({
  place,
  player,
  height,
}: {
  place: number;
  player: PlayerRow;
  height: string;
}) {
  const medal = place === 1 ? "🥇" : place === 2 ? "🥈" : "🥉";
  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-2xl font-bold">{medal}</p>
      <p className="text-xl font-semibold">{player.name}</p>
      <p className="text-lg text-amber-400">{player.total_score} pts</p>
      <div className={`w-32 rounded-t-lg bg-slate-800 ${height}`} />
    </div>
  );
}
