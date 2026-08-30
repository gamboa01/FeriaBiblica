import { OBSTACLE_COUNT } from "@/lib/types";

export function RunningView({ localPct, obstacleIndex }: { localPct: number; obstacleIndex: number }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 p-6 text-center">
      <p className="text-slate-400">
        Obstáculo {obstacleIndex + 1} de {OBSTACLE_COUNT}
      </p>
      <div className="h-4 w-full max-w-xs overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full bg-amber-500 transition-[width] duration-150 ease-linear"
          style={{ width: `${localPct}%` }}
        />
      </div>
      <h2 className="font-heading text-3xl font-bold">¡AGITA EL CELULAR!</h2>
      <p className="text-sm text-slate-400">Mientras más rápido agites, más corres</p>
    </div>
  );
}
