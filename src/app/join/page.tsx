import { Suspense } from "react";
import { JoinForm } from "@/components/player/JoinForm";

export default function JoinPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 p-6 text-center">
      <div>
        <h1 className="font-heading text-2xl font-bold">Entrar al juego</h1>
        <p className="mt-1 text-slate-400">Escanea el QR de la pantalla grande</p>
      </div>
      <Suspense fallback={null}>
        <JoinForm />
      </Suspense>
    </main>
  );
}
