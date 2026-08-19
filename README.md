# Feria Bíblica · Carrera de obstáculos (Fase 1)

Juego de movimiento multi-dispositivo: una pantalla de anfitrión (`/host`) y cada
jugador desde su celular (`/join` → `/play/[code]`). Ver el documento de
requerimientos para el diseño completo.

## Configuración

1. Crea un proyecto en [Supabase](https://supabase.com) (plan gratuito alcanza para <20 jugadores).
2. En el SQL editor del proyecto, ejecuta [`supabase/schema.sql`](supabase/schema.sql).
3. Copia `.env.local.example` a `.env.local` y completa la URL y anon key del proyecto (Project Settings → API).
4. Instala dependencias y arranca el servidor:

```bash
npm install
npm run dev
```

## Probar localmente

- Anfitrión: abre `http://localhost:3000/host`.
- Jugador: abre `http://localhost:3000/join` en otra pestaña/dispositivo.

**Importante:** los sensores de movimiento (`DeviceMotionEvent`) solo funcionan en
un contexto seguro (HTTPS) y, en iOS, requieren el gesto explícito del botón
"Activar movimiento". En `localhost` los navegadores tratan la conexión como
segura, así que la Fase 1 se puede probar en desktop/Android en local, pero
**la calibración real de "cuánto cuenta una agitación" solo se puede validar
en celulares físicos reales**, idealmente ya desplegado en `https://ggamboa.website`
(o una URL HTTPS de Vercel) — ver sección de riesgos del documento de
requerimientos. Los valores de sensibilidad están en
[`src/hooks/useShake.ts`](src/hooks/useShake.ts) (`JERK_FOR_FULL_INTENSITY`) y
[`src/components/player/PlayerGame.tsx`](src/components/player/PlayerGame.tsx)
(`SPEED_FACTOR`).

## Estructura

- `src/app/host` — pantalla del anfitrión (lobby, QR, pista de carreras, leaderboard, podio).
- `src/app/join` y `src/app/play/[code]` — flujo del jugador (unirse, activar movimiento, correr, preguntas).
- `src/lib/race.ts` — toda la lógica de datos/tiempo real contra Supabase (sesiones, heats, puntaje).
- `src/lib/questions.ts` — banco de preguntas de ejemplo (pendiente de contenido final).
- `supabase/schema.sql` — esquema de base de datos y Realtime.
