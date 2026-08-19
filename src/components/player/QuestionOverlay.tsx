"use client";

import { useEffect, useState } from "react";
import { clearObstacle, recordWrongAttempt } from "@/lib/race";
import { pickQuestion } from "@/lib/questions";
import { OBSTACLE_DIFFICULTIES, type HeatPlayerRow, type Question } from "@/lib/types";

export function QuestionOverlay({
  heatPlayer,
  raceStartedAt,
}: {
  heatPlayer: HeatPlayerRow;
  raceStartedAt: number;
}) {
  const difficulty = OBSTACLE_DIFFICULTIES[heatPlayer.obstacle_index];
  const [shownIds, setShownIds] = useState<string[]>([]);
  const [question, setQuestion] = useState<Question | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const q = pickQuestion(difficulty, shownIds);
    setQuestion(q);
    setShownIds((ids) => [...ids, q.id]);
    setSelected(null);
    setFeedback(null);
    setBusy(false);
    // Nueva pregunta cada vez que cambia el intento (o el obstáculo).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [heatPlayer.wrong_attempts, heatPlayer.obstacle_index]);

  async function handleAnswer(index: number) {
    if (!question || busy) return;
    setBusy(true);
    setSelected(index);
    const correct = index === question.correct_index;
    setFeedback(correct ? "correct" : "wrong");
    if (correct) {
      await clearObstacle(heatPlayer, raceStartedAt);
    } else {
      setTimeout(() => {
        recordWrongAttempt(heatPlayer.id, heatPlayer.wrong_attempts + 1);
      }, 700);
    }
  }

  if (!question) return null;

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 p-6 text-center">
      <p className="text-sm uppercase tracking-wide text-amber-400">
        Obstáculo {heatPlayer.obstacle_index + 1} · {difficulty}
      </p>
      <h2 className="text-xl font-bold">{question.text}</h2>
      <div className="grid w-full max-w-sm gap-3">
        {question.options.map((opt, i) => {
          const isSelected = selected === i;
          const showCorrect = feedback && i === question.correct_index;
          return (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              disabled={busy}
              className={`rounded-lg border px-4 py-3 text-left transition disabled:opacity-70 ${
                showCorrect
                  ? "border-emerald-500 bg-emerald-500/20"
                  : isSelected
                    ? "border-red-500 bg-red-500/20"
                    : "border-slate-700 bg-slate-900 hover:bg-slate-800"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {feedback === "wrong" && (
        <p className="text-sm text-red-400">No era esa — otra pregunta para seguir corriendo…</p>
      )}
    </div>
  );
}
