"use client";

import { useEffect, useRef, useState } from "react";
import { clearObstacle, pickQuestionForHeat, recordWrongAttempt } from "@/lib/race";
import { ALL_QUESTION_IDS, getQuestionById } from "@/lib/questions";
import { playCorrect, playWrong } from "@/lib/sounds";
import type { HeatPlayerRow, Question } from "@/lib/types";

// Cuánto se espera antes de mostrar la siguiente pregunta tras fallar. No hay
// penalización de puntos por fallar (ver conversación de diseño) — este
// tiempo es el "costo" de una respuesta mala, además de perder tiempo de
// agitado frente a los demás corredores.
const WRONG_ANSWER_DELAY_MS = 2000;

export function QuestionOverlay({
  heatPlayer,
  raceStartedAt,
}: {
  heatPlayer: HeatPlayerRow;
  raceStartedAt: number;
}) {
  const [question, setQuestion] = useState<Question | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [busy, setBusy] = useState(false);
  // Ignora una respuesta de pickQuestionForHeat si para cuando llega ya
  // cambiamos de obstáculo/intento (evita mostrar una pregunta vieja).
  const attemptKey = useRef(0);

  useEffect(() => {
    const key = ++attemptKey.current;
    setQuestion(null);
    setSelected(null);
    setFeedback(null);
    setBusy(false);
    pickQuestionForHeat(heatPlayer.heat_id, ALL_QUESTION_IDS).then((id) => {
      if (key !== attemptKey.current) return;
      setQuestion(getQuestionById(id));
    });
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
      playCorrect();
      await clearObstacle(heatPlayer, raceStartedAt);
    } else {
      playWrong();
      setTimeout(() => {
        recordWrongAttempt(heatPlayer.id, heatPlayer.wrong_attempts + 1);
      }, WRONG_ANSWER_DELAY_MS);
    }
  }

  if (!question) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
        <p className="text-slate-400">Cargando pregunta…</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 p-6 text-center">
      <p className="text-sm uppercase tracking-wide text-amber-400">
        Obstáculo {heatPlayer.obstacle_index + 1}
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
              className={`rounded-lg border px-4 py-3 text-left text-slate-50 transition disabled:opacity-70 ${
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
