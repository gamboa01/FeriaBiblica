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
  startNextHeat,
  subscribeToHeatPlayers,
  subscribeToSession,
} from "@/lib/race";
import { getStoredHostSession, saveStoredHostSession } from "@/lib/storage";
import { playFinish, unlockAudio } from "@/lib/sounds";
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
        className="absolute left-4 top-4 z-20 rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-1.5 text-xs text-slate-300 backdrop-blur transition hover:border-red-500 hover:text-red-400 disabled:opacity-50"
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
  // Con hasta 4 jugadores mandando un ping cada 300ms mientras corren, los
  // eventos de Realtime pueden llegar más rápido de lo que tarda en resolver
  // cada fetch. Descartar "por orden de disparo" puede hacer que NINGÚN fetch
  // gane nunca (pantalla del host congelada) — en vez de eso, se compara la
  // fecha real de actualización de los datos recibidos contra la última
  // aplicada, y solo se descarta si es genuinamente más vieja.
  const heatPlayersMaxUpdatedAt = useRef<string | null>(null);

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
    const pending = await playersWithoutHeat(sessionId);
    const s = await getSessionById(sessionId);
    setPlayers(p);
    setHeats(h);
    setPendingPlayers(pending);
    setSession(s);
  }

  useEffect(() => {
    if (!session) return;
    refreshSessionData(session.id);
    const unsubscribe = subscribeToSession(session.id, () => refreshSessionData(session.id));
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.id]);

  async function refreshHeatPlayers(heatId: string) {
    const rows = await listHeatPlayers(heatId);
    const newMax = rows.reduce((max, r) => (r.updated_at > max ? r.updated_at : max), "");
    if (heatPlayersMaxUpdatedAt.current && newMax && newMax < heatPlayersMaxUpdatedAt.current) {
      return; // esta respuesta es genuinamente más vieja que lo que ya se aplicó
    }
    if (newMax) heatPlayersMaxUpdatedAt.current = newMax;
    setHeatPlayers(rows);
  }

  useEffect(() => {
    heatPlayersMaxUpdatedAt.current = null;
    if (!currentHeat) {
      setHeatPlayers([]);
      return;
    }
    refreshHeatPlayers(currentHeat.id);
    const unsubscribe = subscribeToHeatPlayers(currentHeat.id, () => {
      refreshHeatPlayers(currentHeat.id);
    });
    // Refresco de respaldo cada 2s: si Realtime llega a perder o agrupar
    // algún cambio bajo carga (varios jugadores agitando a la vez), esto
    // hace que el host nunca se quede más de un par de segundos atrás.
    const pollInterval = setInterval(() => refreshHeatPlayers(currentHeat.id), 2000);
    return () => {
      unsubscribe();
      clearInterval(pollInterval);
    };
  }, [currentHeat?.id]);

  const heatFinishSoundPlayedFor = useRef<string | null>(null);
  useEffect(() => {
    if (currentHeat?.status === "finished" && heatFinishSoundPlayedFor.current !== currentHeat.id) {
      heatFinishSoundPlayedFor.current = currentHeat.id;
      playFinish();
    }
  }, [currentHeat?.id, currentHeat?.status]);

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
        <h1 className="text-2xl font-bold text-slate-900">Falta configurar Supabase</h1>
        <p className="text-slate-700">
          Define NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en .env.local (ver
          .env.local.example) y reinicia el servidor.
        </p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-xl font-medium text-slate-700">Creando sesión…</p>
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
            unlockAudio();
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

  // currentHeat.status === "finished" — una sesión es una sola carrera, así
  // que en cuanto no queda nadie pendiente se va directo al podio.
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
  const nextAction =
    pendingPlayers.length > 0
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
      : goToPodium;

  return (
    <HostShell onNewSession={handleNewSession} busy={busy}>
      <HeatLeaderboard
        heatPlayers={heatPlayers}
        playersById={playersById}
        pendingPlayers={pendingPlayers}
        nextAction={nextAction}
      />
    </HostShell>
  );
}
