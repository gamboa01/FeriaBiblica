import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-10 p-6 text-center">
      <div>
        <h1 className="text-3xl font-bold sm:text-4xl">Feria Bíblica</h1>
        <p className="mt-2 text-slate-400">Carrera de la Fe · corran para ganar (1 Cor. 9)</p>
      </div>

      <div className="flex w-full max-w-xs flex-col gap-4">
        <Link
          href="/host"
          className="rounded-xl bg-amber-500 px-6 py-4 text-lg font-semibold text-slate-950 shadow-lg transition hover:bg-amber-400 active:scale-95"
        >
          Soy la anfitriona (pantalla grande)
        </Link>
        <Link
          href="/join"
          className="rounded-xl border border-slate-700 bg-slate-900 px-6 py-4 text-lg font-semibold text-slate-50 shadow-lg transition hover:bg-slate-800 active:scale-95"
        >
          Soy jugador (mi celular)
        </Link>
      </div>
    </main>
  );
}
