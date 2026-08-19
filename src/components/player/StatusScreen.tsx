export function StatusScreen({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
      <h2 className="text-2xl font-bold">{title}</h2>
      {subtitle && <p className="max-w-xs text-slate-400">{subtitle}</p>}
    </div>
  );
}
