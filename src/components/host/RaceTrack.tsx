import { OBSTACLE_COUNT, type HeatPlayerRow, type PlayerRow } from "@/lib/types";

const OBSTACLE_MARKERS = Array.from({ length: OBSTACLE_COUNT - 1 }, (_, i) => ((i + 1) / OBSTACLE_COUNT) * 100);

export function RaceTrack({
  heatNumber,
  isFinal,
  heatPlayers,
  playersById,
}: {
  heatNumber: number;
  isFinal: boolean;
  heatPlayers: HeatPlayerRow[];
  playersById: Map<string, PlayerRow>;
}) {
  return (
    <div className="flex flex-1 flex-col justify-center gap-8 p-10">
      <h1 className="text-center text-3xl font-bold">
        {isFinal ? "Carrera final" : `Carrera ${heatNumber}`}
      </h1>

      <div className="flex flex-col gap-6">
        {heatPlayers.map((hp) => {
          const player = playersById.get(hp.player_id);
          return (
            <div key={hp.id} className="flex items-center gap-4">
              <div className="w-40 shrink-0 text-right text-xl font-semibold">
                {player?.name ?? "…"}
              </div>
              <div className="relative h-8 flex-1 overflow-hidden rounded-full bg-slate-800">
                {OBSTACLE_MARKERS.map((m) => (
                  <div
                    key={m}
                    className="absolute top-0 h-full w-[2px] bg-slate-600"
                    style={{ left: `${m}%` }}
                  />
                ))}
                <div
                  className="h-full rounded-full bg-amber-500 transition-[width] duration-300 ease-linear"
                  style={{ width: `${hp.distance_pct}%` }}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 text-2xl transition-[left] duration-300 ease-linear"
                  style={{ left: `${hp.distance_pct}%` }}
                >
                  🏃
                </div>
              </div>
              <div className="w-32 shrink-0 text-lg text-slate-400">
                {hp.state === "question" && "❓ respondiendo"}
                {hp.state === "running" && "corriendo"}
                {hp.state === "finished" && `🏁 ${hp.finish_rank}º lugar`}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
