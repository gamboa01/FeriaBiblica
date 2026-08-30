"use client";

import type { MotionPermission } from "@/hooks/useShake";

export function ActivateMotion({
  permission,
  onActivate,
}: {
  permission: MotionPermission;
  onActivate: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 p-6 text-center">
      <h2 className="font-heading text-2xl font-bold">Un paso más</h2>
      <p className="max-w-xs text-slate-400">
        Necesitamos permiso para leer el movimiento de tu celular. Tócalo una sola vez.
      </p>
      <button
        onClick={onActivate}
        className="rounded-xl bg-amber-500 px-8 py-4 text-lg font-semibold text-slate-950 shadow-lg transition hover:bg-amber-400 active:scale-95"
      >
        Activar movimiento
      </button>
      {permission === "denied" && (
        <p className="max-w-xs text-sm text-red-400">
          Bloqueaste el permiso de movimiento. Revisa la configuración de Safari/Chrome para este
          sitio y vuelve a intentar.
        </p>
      )}
      {permission === "unsupported" && (
        <p className="max-w-xs text-sm text-red-400">
          Este navegador no soporta sensores de movimiento. Prueba abrir el enlace directamente en
          Safari o Chrome (no dentro de WhatsApp/Instagram).
        </p>
      )}
    </div>
  );
}
