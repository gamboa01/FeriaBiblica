import { OBSTACLE_COUNT, type HeatPlayerRow, type PlayerRow } from "@/lib/types";

const OBSTACLE_MARKERS = Array.from({ length: OBSTACLE_COUNT - 1 }, (_, i) => ((i + 1) / OBSTACLE_COUNT) * 100);

const LANE_COLORS = [
  { fill: "bg-sky-500", glow: "shadow-sky-500/50" },
  { fill: "bg-rose-500", glow: "shadow-rose-500/50" },
  { fill: "bg-emerald-500", glow: "shadow-emerald-500/50" },
  { fill: "bg-violet-500", glow: "shadow-violet-500/50" },
];

export function RaceTrack({
  heatNumber,
  isFinal,
  heatPlayers,
  playersById,
  pendingPlayers,
  onCloseHeat,
  closingHeat,
}: {
  heatNumber: number;
  isFinal: boolean;
  heatPlayers: HeatPlayerRow[];
  playersById: Map<string, PlayerRow>;
  pendingPlayers: PlayerRow[];
  onCloseHeat: () => void;
  closingHeat: boolean;
}) {
  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden">
      <div className="flex shrink-0 items-center justify-between gap-4 px-6 py-4">
        <h1 className="text-2xl font-black text-slate-900 sm:text-3xl">
          {isFinal ? "🏆 Carrera final" : `Carrera ${heatNumber}`}
        </h1>
        <button
          onClick={onCloseHeat}
          disabled={closingHeat}
          className="rounded-lg border border-slate-900/20 bg-white/40 px-3 py-1.5 text-xs font-semibold text-slate-800 backdrop-blur transition hover:border-red-500 hover:text-red-600 disabled:opacity-50"
        >
          {closingHeat ? "Cerrando…" : "Cerrar carrera"}
        </button>
      </div>

      <div className="flex min-h-0 flex-1 gap-3 px-4 pb-4 sm:gap-4 sm:px-6">
        {heatPlayers.map((hp, i) => {
          const player = playersById.get(hp.player_id);
          const color = LANE_COLORS[i % LANE_COLORS.length];
          return (
            <div key={hp.id} className="flex min-w-0 flex-1 flex-col gap-2">
              <div className="flex shrink-0 flex-col items-center gap-0.5 rounded-xl bg-white/50 px-2 py-2 text-center backdrop-blur">
                <span className="text-3xl leading-none sm:text-4xl">{player?.avatar ?? "🏃"}</span>
                <span className="truncate text-sm font-bold text-slate-900 sm:text-base">
                  {player?.name ?? "…"}
                </span>
                <span className="text-xs font-medium text-slate-600">
                  {hp.state === "question" && "❓ respondiendo"}
                  {hp.state === "running" && "corriendo"}
                  {hp.state === "finished" && `🏁 ${hp.finish_rank}º lugar`}
                </span>
              </div>

              <div className="relative min-h-0 flex-1 overflow-hidden rounded-2xl bg-slate-900/15 ring-1 ring-inset ring-white/40">
                {/* meta */}
                <div className="absolute inset-x-0 top-0 z-10 flex h-3 items-center justify-center bg-[repeating-linear-gradient(90deg,#0f172a_0_8px,#f8fafc_8px_16px)]" />

                {OBSTACLE_MARKERS.map((m) => (
                  <div
                    key={m}
                    className="absolute inset-x-0 h-[2px] bg-slate-900/25"
                    style={{ bottom: `${m}%` }}
                  />
                ))}

                <div
                  className={`absolute inset-x-0 bottom-0 ${color.fill} opacity-70 transition-[height] duration-300 ease-linear`}
                  style={{ height: `${hp.distance_pct}%` }}
                />

                <div
                  className={`absolute left-1/2 -translate-x-1/2 translate-y-1/2 text-3xl drop-shadow-lg transition-[bottom] duration-300 ease-linear sm:text-4xl`}
                  style={{ bottom: `${hp.distance_pct}%` }}
                >
                  {player?.avatar ?? "🏃"}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {pendingPlayers.length > 0 && (
        <p className="shrink-0 pb-3 text-center text-sm font-medium text-slate-700">
          Esperando su turno: {pendingPlayers.map((p) => p.name).join(", ")}
        </p>
      )}
    </div>
  );
}
