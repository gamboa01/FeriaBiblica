import type { Question } from "@/lib/types";

// Banco de preguntas de ejemplo para pruebas de Fase 1.
// Contenido final pendiente de revisión por Inge (ver documento de requerimientos).
export const QUESTION_BANK: Question[] = [
  // Fácil
  {
    id: "f1",
    difficulty: "facil",
    text: "¿Quién construyó el arca?",
    options: ["Moisés", "Noé", "Abraham", "David"],
    correct_index: 1,
  },
  {
    id: "f2",
    difficulty: "facil",
    text: "¿Cuántos discípulos principales eligió Jesús?",
    options: ["7", "10", "12", "15"],
    correct_index: 2,
  },
  {
    id: "f3",
    difficulty: "facil",
    text: "¿En qué ciudad nació Jesús?",
    options: ["Nazaret", "Jerusalén", "Belén", "Jericó"],
    correct_index: 2,
  },
  {
    id: "f4",
    difficulty: "facil",
    text: "¿Quién venció a Goliat?",
    options: ["Saúl", "David", "Salomón", "Sansón"],
    correct_index: 1,
  },
  {
    id: "f5",
    difficulty: "facil",
    text: "¿Cuántos días descansó Dios tras crear el mundo, según Génesis?",
    options: ["Ninguno", "El séptimo día", "El décimo día", "No descansó"],
    correct_index: 1,
  },
  {
    id: "f6",
    difficulty: "facil",
    text: "¿Quién traicionó a Jesús por 30 monedas de plata?",
    options: ["Pedro", "Tomás", "Judas", "Juan"],
    correct_index: 2,
  },
  // Media
  {
    id: "m1",
    difficulty: "media",
    text: "¿Cuántos años vagó el pueblo de Israel en el desierto?",
    options: ["10", "20", "40", "70"],
    correct_index: 2,
  },
  {
    id: "m2",
    difficulty: "media",
    text: "¿Quién interpretó los sueños del faraón en Egipto?",
    options: ["José", "Daniel", "Moisés", "Jacob"],
    correct_index: 0,
  },
  {
    id: "m3",
    difficulty: "media",
    text: "¿En qué libro de la Biblia se narra la caída de las murallas de Jericó?",
    options: ["Éxodo", "Josué", "Jueces", "Números"],
    correct_index: 1,
  },
  {
    id: "m4",
    difficulty: "media",
    text: "¿Quién fue lanzado al foso de los leones?",
    options: ["Daniel", "Elías", "Jonás", "Ezequiel"],
    correct_index: 0,
  },
  {
    id: "m5",
    difficulty: "media",
    text: "¿Cuántos panes y peces usó Jesús para alimentar a la multitud?",
    options: ["3 panes y 2 peces", "5 panes y 2 peces", "7 panes y 3 peces", "2 panes y 5 peces"],
    correct_index: 1,
  },
  {
    id: "m6",
    difficulty: "media",
    text: "¿Qué apóstol negó conocer a Jesús tres veces?",
    options: ["Andrés", "Pedro", "Santiago", "Felipe"],
    correct_index: 1,
  },
  // Difícil
  {
    id: "d1",
    difficulty: "dificil",
    text: "¿Cómo se llamaba el rey que mandó construir el primer templo de Jerusalén?",
    options: ["David", "Salomón", "Ezequías", "Josías"],
    correct_index: 1,
  },
  {
    id: "d2",
    difficulty: "dificil",
    text: "¿En qué isla estaba Juan cuando escribió el libro de Apocalipsis?",
    options: ["Chipre", "Creta", "Patmos", "Malta"],
    correct_index: 2,
  },
  {
    id: "d3",
    difficulty: "dificil",
    text: "¿Cuál era el oficio de Lucas, autor del tercer evangelio?",
    options: ["Pescador", "Médico", "Recaudador de impuestos", "Carpintero"],
    correct_index: 1,
  },
  {
    id: "d4",
    difficulty: "dificil",
    text: "¿Qué profeta fue alimentado por cuervos junto al arroyo de Querit?",
    options: ["Elías", "Eliseo", "Isaías", "Jeremías"],
    correct_index: 0,
  },
  {
    id: "d5",
    difficulty: "dificil",
    text: "¿Cuál es el libro más corto del Antiguo Testamento?",
    options: ["Abdías", "Rut", "Nahúm", "Ageo"],
    correct_index: 0,
  },
  {
    id: "d6",
    difficulty: "dificil",
    text: "¿Quién fue el suegro de Moisés?",
    options: ["Coré", "Jetro", "Aarón", "Caleb"],
    correct_index: 1,
  },
];

export function pickQuestion(difficulty: Question["difficulty"], excludeIds: string[]): Question {
  const pool = QUESTION_BANK.filter(
    (q) => q.difficulty === difficulty && !excludeIds.includes(q.id)
  );
  const source = pool.length > 0 ? pool : QUESTION_BANK.filter((q) => q.difficulty === difficulty);
  return source[Math.floor(Math.random() * source.length)];
}
