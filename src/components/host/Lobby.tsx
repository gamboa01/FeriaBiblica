import { QRCodeSVG } from "qrcode.react";
import type { PlayerRow } from "@/lib/types";

export function Lobby({
  code,
  joinUrl,
  players,
  onStart,
  starting,
}: {
  code: string;
  joinUrl: string;
  players: PlayerRow[];
  onStart: () => void;
  starting: boolean;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-10 p-10 text-center">
      <div>
        <h1 className="text-4xl font-bold">Feria Bíblica · Carrera de obstáculos</h1>
        <p className="mt-2 text-xl text-slate-400">Escanea el código o entra en {joinUrl}</p>
      </div>

      <div className="flex items-center gap-12">
        <div className="rounded-2xl bg-white p-6">
          <QRCodeSVG value={joinUrl} size={220} />
        </div>
        <div>
          <p className="text-lg text-slate-400">Código</p>
          <p className="text-7xl font-black tracking-[0.2em] text-amber-400">{code}</p>
        </div>
      </div>

      <div className="w-full max-w-2xl">
        <p className="mb-3 text-lg text-slate-400">{players.length} jugador(es) conectado(s)</p>
        <div className="flex flex-wrap justify-center gap-3">
          {players.map((p) => (
            <span
              key={p.id}
              className="rounded-full bg-slate-800 px-4 py-2 text-lg font-medium text-slate-100"
            >
              {p.avatar} {p.name}
            </span>
          ))}
        </div>
      </div>

      <button
        onClick={onStart}
        disabled={players.length === 0 || starting}
        className="rounded-2xl bg-amber-500 px-10 py-5 text-2xl font-bold text-slate-950 shadow-lg transition hover:bg-amber-400 active:scale-95 disabled:opacity-50"
      >
        {starting ? "Iniciando…" : "Iniciar primera carrera"}
      </button>
    </div>
  );
}
