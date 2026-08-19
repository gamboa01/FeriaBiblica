"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { getSessionByCode, joinSession } from "@/lib/race";
import { saveStoredPlayer } from "@/lib/storage";
import { supabaseConfigured } from "@/lib/supabase/client";
import { AVATAR_OPTIONS, DEFAULT_AVATAR } from "@/lib/avatars";

export function JoinForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const codeFromQr = searchParams.get("code")?.toUpperCase() ?? "";
  const [code, setCode] = useState(codeFromQr);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState<string>(DEFAULT_AVATAR);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (name.trim().length === 0) {
      setError("Escribe tu nombre");
      return;
    }
    if (code.trim().length !== 4) {
      setError("El código tiene 4 caracteres");
      return;
    }
    setLoading(true);
    try {
      const session = await getSessionByCode(code.trim());
      if (!session) {
        setError("No existe una sesión con ese código");
        return;
      }
      const player = await joinSession(session.id, name, avatar);
      saveStoredPlayer({
        playerId: player.id,
        sessionId: session.id,
        code: session.code,
        name: player.name,
      });
      router.push(`/play/${session.code}`);
    } catch {
      setError("Algo falló al entrar. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  if (!supabaseConfigured) {
    return (
      <p className="max-w-xs text-center text-sm text-amber-400">
        Falta configurar Supabase (.env.local) antes de poder unirse a una partida.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-xs flex-col gap-4">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Tu nombre"
        maxLength={24}
        className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-center text-lg text-slate-50 outline-none focus:border-amber-500"
      />
      <input
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        placeholder="CÓDIGO"
        maxLength={4}
        readOnly={Boolean(codeFromQr)}
        className={`rounded-lg border px-4 py-3 text-center text-lg uppercase tracking-[0.3em] text-slate-50 outline-none ${
          codeFromQr
            ? "border-slate-800 bg-slate-950 text-slate-400"
            : "border-slate-700 bg-slate-900 focus:border-amber-500"
        }`}
      />
      <div>
        <p className="mb-2 text-sm text-slate-400">Elige tu personaje</p>
        <div className="grid grid-cols-4 gap-2">
          {AVATAR_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setAvatar(option)}
              aria-pressed={avatar === option}
              className={`rounded-lg border py-3 text-2xl transition ${
                avatar === option
                  ? "border-amber-500 bg-amber-500/20"
                  : "border-slate-700 bg-slate-900 hover:bg-slate-800"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="rounded-xl bg-amber-500 px-6 py-4 text-lg font-semibold text-slate-950 shadow-lg transition hover:bg-amber-400 active:scale-95 disabled:opacity-60"
      >
        {loading ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
