import { getLaneTheme } from "@/lib/avatars";
import { OBSTACLE_COUNT, type HeatPlayerRow, type PlayerRow } from "@/lib/types";

const OBSTACLE_MARKERS = Array.from({ length: OBSTACLE_COUNT - 1 }, (_, i) => ((i + 1) / OBSTACLE_COUNT) * 100);

function LanePattern({ pattern }: { pattern: "road" | "stars" | "clouds" | null }) {
  if (pattern === "road") {
    return (
      <div
        className="absolute inset-y-0 left-1/2 w-2 -translate-x-1/2"
        style={{
          backgroundImage: "repeating-linear-gradient(to bottom, #facc15 0 16px, transparent 16px 32px)",
        }}
      />
    );
  }
  if (pattern === "stars") {
    return (
      <div
        className="absolute inset-0 opacity-80"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.85) 1px, transparent 1.5px)",
          backgroundSize: "18px 18px",
        }}
      />
    );
  }
  if (pattern === "clouds") {
    return (
      <div
        className="absolute inset-0 opacity-90"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.85) 10%, transparent 60%), radial-gradient(circle at 70% 50%, rgba(255,255,255,0.75) 12%, transparent 60%), radial-gradient(circle at 35% 78%, rgba(255,255,255,0.7) 10%, transparent 60%)",
        }}
      />
    );
  }
  return null;
}

export function RaceTrack({
  heatPlayers,
  playersById,
  pendingPlayers,
  onCloseHeat,
  closingHeat,
}: {
  heatPlayers: HeatPlayerRow[];
  playersById: Map<string, PlayerRow>;
  pendingPlayers: PlayerRow[];
  onCloseHeat: () => void;
  closingHeat: boolean;
}) {
  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden">
      <div className="flex shrink-0 items-center justify-between gap-4 px-6 py-4">
        <h1 className="text-2xl font-black text-slate-900 sm:text-3xl">Carrera de la Fe</h1>
        <button
          onClick={onCloseHeat}
          disabled={closingHeat}
          className="rounded-lg border border-slate-900/20 bg-white/40 px-3 py-1.5 text-xs font-semibold text-slate-800 backdrop-blur transition hover:border-red-500 hover:text-red-600 disabled:opacity-50"
        >
          {closingHeat ? "Cerrando…" : "Cerrar carrera"}
        </button>
      </div>

      <div className="flex min-h-0 flex-1 gap-3 px-4 pb-4 sm:gap-4 sm:px-6">
        {heatPlayers.map((hp) => {
          const player = playersById.get(hp.player_id);
          const theme = getLaneTheme(player?.avatar);
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

              <div
                className={`relative min-h-0 flex-1 overflow-hidden rounded-2xl ring-1 ring-inset ring-white/40 ${theme.base}`}
              >
                <LanePattern pattern={theme.pattern} />

                {/* meta */}
                <div className="absolute inset-x-0 top-0 z-10 flex h-3 items-center justify-center bg-[repeating-linear-gradient(90deg,#0f172a_0_8px,#f8fafc_8px_16px)]" />

                {OBSTACLE_MARKERS.map((m) => (
                  <div
                    key={m}
                    className="absolute inset-x-0 z-[5] h-[2px] bg-white/40"
                    style={{ bottom: `${m}%` }}
                  />
                ))}

                <div
                  className={`absolute inset-x-0 bottom-0 ${theme.fill} transition-[height] duration-300 ease-linear`}
                  style={{ height: `${hp.distance_pct}%` }}
                />

                <div
                  className="absolute left-1/2 z-[6] -translate-x-1/2 translate-y-1/2 text-3xl drop-shadow-lg transition-[bottom] duration-300 ease-linear sm:text-4xl"
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
