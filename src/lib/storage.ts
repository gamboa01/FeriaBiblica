// Identidad del jugador persistida en el celular para poder recuperar la
// sesión si recarga la página a media carrera (ver riesgos del documento:
// "si se cae la señal a media partida hay bache").
const KEY = "feria-biblica:player";

export interface StoredPlayer {
  playerId: string;
  sessionId: string;
  code: string;
  name: string;
}

export function saveStoredPlayer(data: StoredPlayer) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(data));
}

export function getStoredPlayer(): StoredPlayer | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredPlayer;
  } catch {
    return null;
  }
}

export function clearStoredPlayer() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}

const HOST_KEY = "feria-biblica:host-session";

export function saveStoredHostSession(sessionId: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(HOST_KEY, sessionId);
}

export function getStoredHostSession(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(HOST_KEY);
}

export function clearStoredHostSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(HOST_KEY);
}
