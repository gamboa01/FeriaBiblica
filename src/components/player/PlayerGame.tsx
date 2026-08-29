"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useShake } from "@/hooks/useShake";
import {
  enterQuestion,
  getLatestHeatPlayer,
  getSessionById,
  pushDistance,
  subscribeToHeat,
  subscribeToPlayer,
  subscribeToSessionStatus,
} from "@/lib/race";
import { getStoredPlayer, type StoredPlayer } from "@/lib/storage";
import { playFinish, unlockAudio } from "@/lib/sounds";
import { OBSTACLE_COUNT, type HeatPlayerRow, type HeatRow, type SessionRow } from "@/lib/types";
import { supabaseConfigured } from "@/lib/supabase/client";
import { ActivateMotion } from "@/components/player/ActivateMotion";
import { RunningView } from "@/components/player/RunningView";
import { QuestionOverlay } from "@/components/player/QuestionOverlay";
import { StatusScreen } from "@/components/player/StatusScreen";

// % de pista por muestra de intensidad máxima. Bajado de 1.1 a 0.2 el
// 2026-08-19 tras probar en celular real: con 1.1 bastaban ~3 agitadas para
// llegar al primer obstáculo. Sigue siendo un valor aproximado — probable que
// haga falta afinarlo de nuevo en el ensayo con más celulares.
const SPEED_FACTOR = 0.2;

export function PlayerGame({ code }: { code: string }) {
  const router = useRouter();
  const [stored, setStored] = useState<StoredPlayer | null>(null);
  const [session, setSession] = useState<SessionRow | null>(null);
  const [heatPlayer, setHeatPlayer] = useState<HeatPlayerRow | null>(null);
  const [heat, setHeat] = useState<HeatRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [localPct, setLocalPct] = useState(0);

  const pctRef = useRef(0);
  const enteringQuestion = useRef(false);
  // Evita que los ecos de nuestro propio pushDistance() (vía Realtime) reinicien
  // el progreso local: solo se resetea al entrar de verdad a un obstáculo nuevo.
  const runningSegmentKey = useRef<string | null>(null);

  useEffect(() => {
    const s = getStoredPlayer();
    if (!s || s.code !== code) {
      router.replace(`/join?code=${code}`);
      return;
    }
    setStored(s);
  }, [code, router]);

  async function refresh(playerId: string, sessionId: string) {
    const [sessionRow, latest] = await Promise.all([
      getSessionById(sessionId),
      getLatestHeatPlayer(playerId),
    ]);
    setSession(sessionRow);
    if (latest) {
      setHeatPlayer(latest.heatPlayer);
      setHeat(latest.heat);
      const key = `${latest.heatPlayer.id}:${latest.heatPlayer.obstacle_index}`;
      if (latest.heatPlayer.state === "running" && runningSegmentKey.current !== key) {
        runningSegmentKey.current = key;
        pctRef.current = latest.heatPlayer.distance_pct;
        setLocalPct(latest.heatPlayer.distance_pct);
        enteringQuestion.current = false;
      }
    }
    setLoading(false);
  }

  useEffect(() => {
    if (!stored) return;
    refresh(stored.playerId, stored.sessionId);
    const unsubscribe = subscribeToPlayer(stored.playerId, () => {
      refresh(stored.playerId, stored.sessionId);
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stored]);

  useEffect(() => {
    if (!heat || !stored) return;
    const unsubscribe = subscribeToHeat(heat.id, () => {
      refresh(stored.playerId, stored.sessionId);
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [heat?.id]);

  useEffect(() => {
    if (!stored) return;
    const unsubscribe = subscribeToSessionStatus(stored.sessionId, () => {
      refresh(stored.playerId, stored.sessionId);
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stored?.sessionId]);

  const finishSoundPlayedFor = useRef<string | null>(null);
  useEffect(() => {
    if (heatPlayer?.state === "finished" && finishSoundPlayedFor.current !== heatPlayer.id) {
      finishSoundPlayedFor.current = heatPlayer.id;
      playFinish();
    }
  }, [heatPlayer?.id, heatPlayer?.state]);

  const isRunning = heatPlayer?.state === "running" && heat?.status !== "finished";
  const { permission, requestPermission } = useShake({
    active: isRunning,
    onTick: (intensity) => {
      if (!heatPlayer || enteringQuestion.current) return;
      const nextThreshold = ((heatPlayer.obstacle_index + 1) / OBSTACLE_COUNT) * 100;
      const next = Math.min(pctRef.current + intensity * SPEED_FACTOR, nextThreshold);
      pctRef.current = next;
      setLocalPct(next);
      if (next >= nextThreshold) {
        enteringQuestion.current = true;
        enterQuestion(heatPlayer.id);
      }
    },
  });

  useEffect(() => {
    if (!isRunning || !heatPlayer || permission !== "granted") return;
    const interval = setInterval(() => {
      pushDistance(heatPlayer.id, pctRef.current);
    }, 300);
    return () => clearInterval(interval);
  }, [isRunning, heatPlayer, permission]);

  if (!supabaseConfigured) {
    return (
      <StatusScreen
        title="Falta configurar Supabase"
        subtitle="Define NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en .env.local"
      />
    );
  }

  if (!stored || loading) {
    return <StatusScreen title="Cargando…" />;
  }

  if (permission !== "granted") {
    return (
      <ActivateMotion
        permission={permission}
        onActivate={() => {
          unlockAudio();
          requestPermission();
        }}
      />
    );
  }

  if (session?.status === "finished") {
    return (
      <StatusScreen
        title={`¡Gracias por jugar, ${stored.name}!`}
        subtitle="Mira la pantalla grande para ver el podio. Vuelve a escanear el QR o vuelve a ingresar al juego para la siguiente ronda."
      />
    );
  }

  if (!heatPlayer || !heat) {
    return (
      <StatusScreen
        title={`Hola, ${stored.name}`}
        subtitle="Espera a que la anfitriona inicie tu carrera…"
      />
    );
  }

  if (heat.status === "finished" && heatPlayer.state !== "finished") {
    return (
      <StatusScreen
        title="La carrera terminó"
        subtitle={`Sumaste ${heatPlayer.points} puntos hasta donde llegaste — mira la pantalla grande.`}
      />
    );
  }

  if (heatPlayer.state === "question") {
    return (
      <QuestionOverlay heatPlayer={heatPlayer} raceStartedAt={new Date(heat.created_at).getTime()} />
    );
  }

  if (heatPlayer.state === "finished") {
    return (
      <StatusScreen
        title={
          heatPlayer.finish_rank === 1
            ? "¡Llegaste primero! 🏆"
            : `Llegaste en ${heatPlayer.finish_rank}º lugar`
        }
        subtitle={`Sumaste ${heatPlayer.points} puntos en esta carrera. Mira la pantalla grande.`}
      />
    );
  }

  return <RunningView localPct={localPct} obstacleIndex={heatPlayer.obstacle_index} />;
}
