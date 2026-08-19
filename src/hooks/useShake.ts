"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type MotionPermission = "unknown" | "granted" | "denied" | "unsupported";

interface DeviceMotionEventWithPermission {
  requestPermission?: () => Promise<"granted" | "denied">;
}

interface UseShakeOptions {
  /** Solo acumula movimiento mientras está en true (se pausa durante preguntas). */
  active: boolean;
  /** Se llama en cada muestra del acelerómetro con una intensidad 0-1. */
  onTick?: (intensity: number) => void;
}

// Nota de calibración (ver riesgos del documento de requerimientos): este umbral
// se probó de forma aproximada y necesita ajuste con celulares reales antes del evento.
const JERK_FOR_FULL_INTENSITY = 25;
const SAMPLE_INTERVAL_MS = 40;

export function useShake({ active, onTick }: UseShakeOptions) {
  const [permission, setPermission] = useState<MotionPermission>("unknown");
  const lastAccel = useRef<{ x: number; y: number; z: number } | null>(null);
  const lastSampleAt = useRef(0);
  const activeRef = useRef(active);
  activeRef.current = active;

  const handleMotion = useCallback(
    (event: DeviceMotionEvent) => {
      if (!activeRef.current) return;
      const accel = event.accelerationIncludingGravity;
      if (accel == null || accel.x == null || accel.y == null || accel.z == null) return;

      const now = performance.now();
      if (now - lastSampleAt.current < SAMPLE_INTERVAL_MS) return;

      if (lastAccel.current) {
        const dx = accel.x - lastAccel.current.x;
        const dy = accel.y - lastAccel.current.y;
        const dz = accel.z - lastAccel.current.z;
        const jerk = Math.sqrt(dx * dx + dy * dy + dz * dz);
        const intensity = Math.min(jerk / JERK_FOR_FULL_INTENSITY, 1);
        onTick?.(intensity);
      }
      lastAccel.current = { x: accel.x, y: accel.y, z: accel.z };
      lastSampleAt.current = now;
    },
    [onTick]
  );

  useEffect(() => {
    if (permission !== "granted") return;
    window.addEventListener("devicemotion", handleMotion);
    return () => window.removeEventListener("devicemotion", handleMotion);
  }, [permission, handleMotion]);

  const requestPermission = useCallback(async () => {
    if (typeof window === "undefined" || typeof window.DeviceMotionEvent === "undefined") {
      setPermission("unsupported");
      return;
    }
    const DME = window.DeviceMotionEvent as unknown as DeviceMotionEventWithPermission;
    if (typeof DME.requestPermission === "function") {
      try {
        const result = await DME.requestPermission();
        setPermission(result === "granted" ? "granted" : "denied");
      } catch {
        setPermission("denied");
      }
      return;
    }
    // Android y navegadores de escritorio no piden permiso explícito.
    setPermission("granted");
  }, []);

  return { permission, requestPermission };
}
