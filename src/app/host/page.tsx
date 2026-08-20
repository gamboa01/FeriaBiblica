import { HostGame } from "@/components/host/HostGame";

export default function HostPage() {
  return (
    <main className="flex flex-1 flex-col bg-gradient-to-br from-amber-300 via-orange-300 to-amber-400 text-slate-900">
      <HostGame />
    </main>
  );
}
