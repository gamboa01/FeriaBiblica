import type { HeatPlayerRow, PlayerRow } from "@/lib/types";

const MEDALS = ["🥇", "🥈", "🥉", "4º"];

export function HeatLeaderboard({
  heatNumber,
  isFinal,
  heatPlayers,
  playersById,
  pendingPlayers,
  nextAction,
}: {
  heatNumber: number;
  isFinal: boolean;
  heatPlayers: HeatPlayerRow[];
  playersById: Map<string, PlayerRow>;
  pendingPlayers: PlayerRow[];
  nextAction: { label: string; onClick: () => void; busy: boolean };
}) {
  const sorted = [...heatPlayers].sort((a, b) => (a.finish_rank ?? 99) - (b.finish_rank ?? 99));

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 p-10 text-center">
      <h1 className="text-3xl font-black text-slate-900">
        Resultados · {isFinal ? "Carrera final" : `Carrera ${heatNumber}`}
      </h1>
      <div className="flex w-full max-w-xl flex-col gap-3">
        {sorted.map((hp, i) => (
          <div
            key={hp.id}
            className="flex items-center justify-between rounded-xl bg-slate-900 px-6 py-4 shadow-lg"
          >
            <span className="text-xl text-white">
              {MEDALS[i] ?? `${i + 1}º`} {playersById.get(hp.player_id)?.avatar ?? ""}{" "}
              {playersById.get(hp.player_id)?.name ?? "…"}
            </span>
            <span className="text-xl font-bold text-amber-400">+{hp.points} pts</span>
          </div>
        ))}
      </div>
      {pendingPlayers.length > 0 && (
        <p className="text-sm font-medium text-slate-700">
          Esperando su turno: {pendingPlayers.map((p) => p.name).join(", ")}
        </p>
      )}
      <button
        onClick={nextAction.onClick}
        disabled={nextAction.busy}
        className="rounded-2xl bg-slate-900 px-10 py-5 text-2xl font-bold text-white shadow-xl transition hover:bg-slate-800 active:scale-95 disabled:opacity-50"
      >
        {nextAction.busy ? "Un momento…" : nextAction.label}
      </button>
    </div>
  );
}
