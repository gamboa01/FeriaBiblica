import type { Question } from "@/lib/types";

// Banco de preguntas real para el "mes de la Biblia" (provisto por Inge).
// Las 10 primeras venían de respuesta abierta y se pasaron a opción múltiple
// con libertad creativa para las opciones incorrectas; las últimas 10 ya
// venían como opción múltiple y se usaron tal cual.
export const QUESTION_BANK: Question[] = [
  {
    id: "q1",
    difficulty: "facil",
    text: "¿Cuántos libros contiene la división de los libros poéticos?",
    options: ["5", "7", "4"],
    correct_index: 0,
  },
  {
    id: "q2",
    difficulty: "media",
    text: "¿Cuáles son los cinco libros poéticos de la Biblia?",
    options: [
      "Job, Salmos, Proverbios, Eclesiastés y Cantares",
      "Génesis, Éxodo, Levítico, Números y Deuteronomio",
      "Isaías, Jeremías, Lamentaciones, Ezequiel y Daniel",
    ],
    correct_index: 0,
  },
  {
    id: "q3",
    difficulty: "facil",
    text: "¿Quién escribió la mayor parte del libro de Salmos?",
    options: ["David", "Salomón", "Moisés"],
    correct_index: 0,
  },
  {
    id: "q4",
    difficulty: "media",
    text: "¿Cuál es el tema principal del libro de Proverbios?",
    options: [
      "La sabiduría para vivir correctamente y el temor de Dios",
      "La profecía sobre el fin de los tiempos",
      "La historia del éxodo de Egipto",
    ],
    correct_index: 0,
  },
  {
    id: "q5",
    difficulty: "media",
    text: "¿Qué enseñanza principal presenta el libro de Job?",
    options: [
      "La prueba y paciencia de Job, y su confianza en Dios a pesar del sufrimiento",
      "Las leyes para el pueblo de Israel",
      "La conquista de la tierra prometida",
    ],
    correct_index: 0,
  },
  {
    id: "q6",
    difficulty: "facil",
    text: "¿Cuántos libros forman la división de los Profetas Menores?",
    options: ["12", "5", "17"],
    correct_index: 0,
  },
  {
    id: "q7",
    difficulty: "dificil",
    text: "¿Qué profeta recibió la visión del valle de los huesos secos?",
    options: ["Ezequiel", "Isaías", "Jeremías"],
    correct_index: 0,
  },
  {
    id: "q8",
    difficulty: "dificil",
    text: "¿Qué ocurrió durante los 400 años conocidos como el 'período de silencio'?",
    options: [
      "No hubo nuevos escritos ni revelación profética registrada",
      "Se escribieron los cuatro Evangelios",
      "El pueblo de Israel estuvo en el exilio en Babilonia",
    ],
    correct_index: 0,
  },
  {
    id: "q9",
    difficulty: "facil",
    text: "¿Qué acontecimiento marca el comienzo del Nuevo Testamento según la línea del tiempo?",
    options: ["El nacimiento de Jesús", "La resurrección de Jesús", "El día de Pentecostés"],
    correct_index: 0,
  },
  {
    id: "q10",
    difficulty: "facil",
    text: "¿Qué libros relatan la vida y ministerio de Jesús?",
    options: [
      "Los cuatro Evangelios: Mateo, Marcos, Lucas y Juan",
      "Los libros de la Ley",
      "Las cartas de Pablo",
    ],
    correct_index: 0,
  },
  {
    id: "q11",
    difficulty: "facil",
    text: "¿A qué división pertenecen Salmos y Proverbios?",
    options: ["Libros poéticos", "Evangelios", "Epístolas"],
    correct_index: 0,
  },
  {
    id: "q12",
    difficulty: "facil",
    text: "¿A qué división pertenece el libro de Hechos?",
    options: ["Libros históricos", "Libros proféticos", "Epístolas"],
    correct_index: 0,
  },
  {
    id: "q13",
    difficulty: "media",
    text: "¿Cuáles son los libros de la Ley?",
    options: [
      "Génesis, Éxodo, Levítico, Números y Deuteronomio",
      "Mateo, Marcos, Lucas, Juan y Hechos",
      "Salmos, Proverbios, Job, Eclesiastés y Cantares",
    ],
    correct_index: 0,
  },
  {
    id: "q14",
    difficulty: "dificil",
    text: "¿En qué libro de la Biblia se menciona a Diótrefes?",
    options: ["2 Juan", "3 Juan", "Judas"],
    correct_index: 1,
  },
  {
    id: "q15",
    difficulty: "facil",
    text: "¿Cuántos libros poéticos hay en el Antiguo Testamento?",
    options: ["5", "6", "7"],
    correct_index: 0,
  },
  {
    id: "q16",
    difficulty: "media",
    text: "¿Por qué se les llama 'profetas mayores'?",
    options: ["Porque fueron más importantes", "Por la extensión de sus escritos", "Porque vivieron más años"],
    correct_index: 1,
  },
  {
    id: "q17",
    difficulty: "facil",
    text: "¿Qué significa la palabra 'Evangelio'?",
    options: ["Buenas noticias", "Historia antigua", "Profecía"],
    correct_index: 0,
  },
  {
    id: "q18",
    difficulty: "facil",
    text: "¿En qué división encontramos principalmente la historia del rey David?",
    options: ["Libros históricos", "Profetas menores", "Epístolas"],
    correct_index: 0,
  },
  {
    id: "q19",
    difficulty: "media",
    text: "¿Cuál de estos libros NO pertenece a los profetas mayores?",
    options: ["Daniel", "Ezequiel", "Oseas"],
    correct_index: 2,
  },
  {
    id: "q20",
    difficulty: "dificil",
    text: "¿Quién menciona a Diótrefes en su carta?",
    options: ["Pedro", "Pablo", "El apóstol Juan"],
    correct_index: 2,
  },
];

export function pickQuestion(difficulty: Question["difficulty"], excludeIds: string[]): Question {
  const pool = QUESTION_BANK.filter(
    (q) => q.difficulty === difficulty && !excludeIds.includes(q.id)
  );
  const source = pool.length > 0 ? pool : QUESTION_BANK.filter((q) => q.difficulty === difficulty);
  return source[Math.floor(Math.random() * source.length)];
}
