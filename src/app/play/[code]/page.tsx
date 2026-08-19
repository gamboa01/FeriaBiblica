import { PlayerGame } from "@/components/player/PlayerGame";

export default async function PlayPage(props: PageProps<"/play/[code]">) {
  const { code } = await props.params;
  return (
    <main className="flex flex-1 flex-col">
      <PlayerGame code={code.toUpperCase()} />
    </main>
  );
}
