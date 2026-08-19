"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useShake } from "@/hooks/useShake";
import {
  enterQuestion,
  getLatestHeatPlayer,
  getSessionById,
  pushDistance,
  subscribeToPlayer,
} from "@/lib/race";
import { getStoredPlayer, type StoredPlayer } from "@/lib/storage";
import { OBSTACLE_COUNT, type HeatPlayerRow, type HeatRow, type SessionRow } from "@/lib/types";
import { supabaseConfigured } from "@/lib/supabase/client";
import { ActivateMotion } from "@/components/player/ActivateMotion";
import { RunningView } from "@/components/player/RunningView";
import { QuestionOverlay } from "@/components/player/QuestionOverlay";
import { StatusScreen } from "@/components/player/StatusScreen";

const SPEED_FACTOR = 1.1; // % de pista por muestra de intensidad máxima — calibrar con celulares reales

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
      if (latest.heatPlayer.state === "running") {
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

  const isRunning = heatPlayer?.state === "running";
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
    return <ActivateMotion permission={permission} onActivate={requestPermission} />;
  }

  if (session?.status === "finished") {
    return (
      <StatusScreen
        title={`¡Gracias por jugar, ${stored.name}!`}
        subtitle="Mira la pantalla grande para ver el podio final."
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
