"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  closeHeat,
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

function HostShell({
  children,
  onNewSession,
  busy,
}: {
  children: ReactNode;
  onNewSession: () => void;
  busy: boolean;
}) {
  return (
    <div className="relative flex flex-1 flex-col">
      {children}
      <button
        onClick={onNewSession}
        disabled={busy}
        className="absolute right-4 top-4 rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-1.5 text-xs text-slate-400 backdrop-blur transition hover:border-red-500 hover:text-red-400 disabled:opacity-50"
      >
        Nueva sesión
      </button>
    </div>
  );
}

export function HostGame() {
  const [session, setSession] = useState<SessionRow | null>(null);
  const [players, setPlayers] = useState<PlayerRow[]>([]);
  const [heats, setHeats] = useState<HeatRow[]>([]);
  const [heatPlayers, setHeatPlayers] = useState<HeatPlayerRow[]>([]);
  const [pendingPlayers, setPendingPlayers] = useState<PlayerRow[]>([]);
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
    setPendingPlayers(pending);
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

  async function handleNewSession() {
    if (
      !window.confirm(
        "¿Cerrar esta sesión y empezar una nueva? Los jugadores conectados tendrán que escanear el código nuevo."
      )
    ) {
      return;
    }
    setBusy(true);
    try {
      // Marca la sesión vieja como terminada para que a cualquier jugador
      // que se haya quedado ahí le aparezca el aviso de volver a entrar,
      // en vez de dejarlo colgado sin saber que ya se cerró.
      if (session) {
        await finishSession(session.id);
      }
      const s = await createSession();
      saveStoredHostSession(s.id);
      setSession(s);
      setPlayers([]);
      setHeats([]);
      setHeatPlayers([]);
      setPendingPlayers([]);
    } finally {
      setBusy(false);
    }
  }

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
    return (
      <HostShell onNewSession={handleNewSession} busy={busy}>
        <Podium players={players} />
      </HostShell>
    );
  }

  if (!currentHeat) {
    return (
      <HostShell onNewSession={handleNewSession} busy={busy}>
        <Lobby
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
      </HostShell>
    );
  }

  if (currentHeat.status === "running") {
    return (
      <HostShell onNewSession={handleNewSession} busy={busy}>
        <RaceTrack
          heatNumber={currentHeat.heat_number}
          isFinal={currentHeat.is_final}
          heatPlayers={heatPlayers}
          playersById={playersById}
          pendingPlayers={pendingPlayers}
          onCloseHeat={async () => {
            setBusy(true);
            try {
              await closeHeat(currentHeat.id);
            } finally {
              setBusy(false);
            }
          }}
          closingHeat={busy}
        />
      </HostShell>
    );
  }

  // currentHeat.status === "finished"
  const regularHeatsCount = heats.filter((h) => !h.is_final).length;
  // Con 4 jugadores o menos, todos ya corrieron juntos en una sola tanda —
  // no hay un "mejor 4" distinto de esos mismos jugadores, así que la final
  // no aporta nada y se salta directo al podio.
  const finalMakesSense = regularHeatsCount > 1;
  const goToPodium = {
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
  };
  const nextAction = currentHeat.is_final
    ? goToPodium
    : pendingPlayers.length > 0
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
      : finalMakesSense
        ? {
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
          }
        : goToPodium;

  return (
    <HostShell onNewSession={handleNewSession} busy={busy}>
      <HeatLeaderboard
        heatNumber={currentHeat.heat_number}
        isFinal={currentHeat.is_final}
        heatPlayers={heatPlayers}
        playersById={playersById}
        pendingPlayers={pendingPlayers}
        nextAction={nextAction}
      />
    </HostShell>
  );
}
