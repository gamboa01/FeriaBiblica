"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  createSession,
  finishSession,
  getSessionById,
  listHeatPlayers,
  listHeats,
  listPlayers,
  playersWithoutHeat,
  startFinalHeat,
  startNextHeat,
  subscribeToHeatPlayers,
  subscribeToSession,
} from "@/lib/race";
import { getStoredHostSession, saveStoredHostSession } from "@/lib/storage";
import { supabaseConfigured } from "@/lib/supabase/client";
import type { HeatPlayerRow, HeatRow, PlayerRow, SessionRow } from "@/lib/types";
import { Lobby } from "@/components/host/Lobby";
import { RaceTrack } from "@/components/host/RaceTrack";
import { HeatLeaderboard } from "@/components/host/HeatLeaderboard";
import { Podium } from "@/components/host/Podium";

export function HostGame() {
  const [session, setSession] = useState<SessionRow | null>(null);
  const [players, setPlayers] = useState<PlayerRow[]>([]);
  const [heats, setHeats] = useState<HeatRow[]>([]);
  const [heatPlayers, setHeatPlayers] = useState<HeatPlayerRow[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [busy, setBusy] = useState(false);
  const [joinUrl, setJoinUrl] = useState("");

  const currentHeat = heats[heats.length - 1] ?? null;
  const playersById = useMemo(() => new Map(players.map((p) => [p.id, p])), [players]);
  const initStarted = useRef(false);

  useEffect(() => {
    if (!supabaseConfigured || initStarted.current) return;
    initStarted.current = true;
    (async () => {
      const existingId = getStoredHostSession();
      let s = existingId ? await getSessionById(existingId) : null;
      if (!s) {
        s = await createSession();
        saveStoredHostSession(s.id);
      }
      setSession(s);
    })();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && session) {
      setJoinUrl(`${window.location.origin}/join?code=${session.code}`);
    }
  }, [session]);

  async function refreshSessionData(sessionId: string) {
    const [p, h] = await Promise.all([listPlayers(sessionId), listHeats(sessionId)]);
    setPlayers(p);
    setHeats(h);
    const pending = await playersWithoutHeat(sessionId);
    setPendingCount(pending.length);
    const s = await getSessionById(sessionId);
    setSession(s);
  }

  useEffect(() => {
    if (!session) return;
    refreshSessionData(session.id);
    const unsubscribe = subscribeToSession(session.id, () => refreshSessionData(session.id));
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.id]);

  useEffect(() => {
    if (!currentHeat) {
      setHeatPlayers([]);
      return;
    }
    listHeatPlayers(currentHeat.id).then(setHeatPlayers);
    const unsubscribe = subscribeToHeatPlayers(currentHeat.id, () => {
      listHeatPlayers(currentHeat.id).then(setHeatPlayers);
    });
    return unsubscribe;
  }, [currentHeat?.id]);

  if (!supabaseConfigured) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-10 text-center">
        <h1 className="text-2xl font-bold">Falta configurar Supabase</h1>
        <p className="text-slate-400">
          Define NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en .env.local (ver
          .env.local.example) y reinicia el servidor.
        </p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-xl text-slate-400">Creando sesión…</p>
      </div>
    );
  }

  if (session.status === "finished") {
    return <Podium players={players} />;
  }

  if (!currentHeat) {
    return (
      <Lobby
        code={session.code}
        joinUrl={joinUrl}
        players={players}
        starting={busy}
        onStart={async () => {
          setBusy(true);
          try {
            await startNextHeat(session.id);
          } finally {
            setBusy(false);
          }
        }}
      />
    );
  }

  if (currentHeat.status === "running") {
    return (
      <RaceTrack
        heatNumber={currentHeat.heat_number}
        isFinal={currentHeat.is_final}
        heatPlayers={heatPlayers}
        playersById={playersById}
      />
    );
  }

  // currentHeat.status === "finished"
  const nextAction = currentHeat.is_final
    ? {
        label: "Ver podio final",
        busy,
        onClick: async () => {
          setBusy(true);
          try {
            await finishSession(session.id);
            await refreshSessionData(session.id);
          } finally {
            setBusy(false);
          }
        },
      }
    : pendingCount > 0
      ? {
          label: "Siguiente carrera",
          busy,
          onClick: async () => {
            setBusy(true);
            try {
              await startNextHeat(session.id);
            } finally {
              setBusy(false);
            }
          },
        }
      : {
          label: "Iniciar carrera final (top 4)",
          busy,
          onClick: async () => {
            setBusy(true);
            try {
              await startFinalHeat(session.id);
            } finally {
              setBusy(false);
            }
          },
        };

  return (
    <HeatLeaderboard
      heatNumber={currentHeat.heat_number}
      isFinal={currentHeat.is_final}
      heatPlayers={heatPlayers}
      playersById={playersById}
      nextAction={nextAction}
    />
  );
}
