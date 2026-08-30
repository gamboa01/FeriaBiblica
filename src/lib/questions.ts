import type { Question } from "@/lib/types";

// Banco de preguntas real para el "mes de la Biblia" (provisto por Inge).
// Sin dificultad — las preguntas se reparten completamente al azar, sin
// pesos ni categorías (ver conversación de diseño). El primer bloque venía
// de respuesta abierta y se pasó a opción múltiple con libertad creativa
// para las opciones incorrectas; el resto ya venía armado como opción
// múltiple (algunas con 3 opciones, otras con 4 — ambas funcionan igual).
export const QUESTION_BANK: Question[] = [
  {
    id: "q1",
    text: "¿Cuántos libros contiene la división de los libros poéticos?",
    options: ["5", "7", "4"],
    correct_index: 0,
  },
  {
    id: "q2",
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
    text: "¿Quién escribió la mayor parte del libro de Salmos?",
    options: ["David", "Salomón", "Moisés"],
    correct_index: 0,
  },
  {
    id: "q4",
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
    text: "¿Cuántos libros forman la división de los Profetas Menores?",
    options: ["12", "5", "17"],
    correct_index: 0,
  },
  {
    id: "q7",
    text: "¿Qué profeta recibió la visión del valle de los huesos secos?",
    options: ["Ezequiel", "Isaías", "Jeremías"],
    correct_index: 0,
  },
  {
    id: "q8",
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
    text: "¿Qué acontecimiento marca el comienzo del Nuevo Testamento según la línea del tiempo?",
    options: ["El nacimiento de Jesús", "La resurrección de Jesús", "El día de Pentecostés"],
    correct_index: 0,
  },
  {
    id: "q10",
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
    text: "¿A qué división pertenecen Salmos y Proverbios?",
    options: ["Libros poéticos", "Evangelios", "Epístolas"],
    correct_index: 0,
  },
  {
    id: "q12",
    text: "¿A qué división pertenece el libro de Hechos?",
    options: ["Libros históricos", "Libros proféticos", "Epístolas"],
    correct_index: 0,
  },
  {
    id: "q13",
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
    text: "¿En qué libro de la Biblia se menciona a Diótrefes?",
    options: ["2 Juan", "3 Juan", "Judas"],
    correct_index: 1,
  },
  {
    id: "q15",
    text: "¿Cuántos libros poéticos hay en el Antiguo Testamento?",
    options: ["5", "6", "7"],
    correct_index: 0,
  },
  {
    id: "q16",
    text: "¿Por qué se les llama 'profetas mayores'?",
    options: ["Porque fueron más importantes", "Por la extensión de sus escritos", "Porque vivieron más años"],
    correct_index: 1,
  },
  {
    id: "q17",
    text: "¿Qué significa la palabra 'Evangelio'?",
    options: ["Buenas noticias", "Historia antigua", "Profecía"],
    correct_index: 0,
  },
  {
    id: "q18",
    text: "¿En qué división encontramos principalmente la historia del rey David?",
    options: ["Libros históricos", "Profetas menores", "Epístolas"],
    correct_index: 0,
  },
  {
    id: "q19",
    text: "¿Cuál de estos libros NO pertenece a los profetas mayores?",
    options: ["Daniel", "Ezequiel", "Oseas"],
    correct_index: 2,
  },
  {
    id: "q20",
    text: "¿Quién menciona a Diótrefes en su carta?",
    options: ["Pedro", "Pablo", "El apóstol Juan"],
    correct_index: 2,
  },
  {
    id: "q21",
    text: "¿Cuántos libros integran la sección del Pentateuco?",
    options: ["3", "5", "7", "12"],
    correct_index: 1,
  },
  {
    id: "q22",
    text: "¿Qué significa la palabra \"Torá\"?",
    options: ["Historia o Cantos", "Ley o Enseñanza", "Profecía o Alianza", "Verbo o Revelación"],
    correct_index: 1,
  },
  {
    id: "q23",
    text: "¿Cuáles eran los nombres de las parteras hebreas en Egipto?",
    options: ["Sara y Rebeca", "María y Raquel", "Sifra y Fúa", "Rut y Noemí"],
    correct_index: 2,
  },
  {
    id: "q24",
    text: "¿En qué año aproximado acampó Israel al pie del monte Sinaí?",
    options: ["2166 a.C.", "1445 a.C.", "1444 a.C.", "1406 a.C."],
    correct_index: 2,
  },
  {
    id: "q25",
    text: "¿Cuántos libros forman la sección de Históricos?",
    options: ["5", "10", "12", "13"],
    correct_index: 2,
  },
  {
    id: "q26",
    text: "¿Quién es señalado tradicionalmente como autor del libro de Nehemías?",
    options: ["Esdras", "Samuel", "Nehemías", "David"],
    correct_index: 2,
  },
  {
    id: "q27",
    text: "¿Qué rey de Judá comenzó su reinado a los 8 años y reparó la casa de Jehová tras hallar el libro de la Ley?",
    options: ["Saúl", "Salomón", "Josías", "David"],
    correct_index: 2,
  },
  {
    id: "q28",
    text: "Según la línea del tiempo de los Históricos, ¿en qué año ocurre la primera unción de David?",
    options: ["1406 a.C.", "1051 a.C.", "1024 a.C.", "1011 a.C."],
    correct_index: 2,
  },
  {
    id: "q29",
    text: "¿Cuál es la cantidad de libros que abarca la división de Poéticos?",
    options: ["4", "5", "12", "13"],
    correct_index: 1,
  },
  {
    id: "q30",
    text: "¿Cuántos salmos escribió David?",
    options: ["73", "12", "9", "51"],
    correct_index: 0,
  },
  {
    id: "q31",
    text: "¿Qué personaje elevó una oración a Jehová pidiendo no tener riqueza ni pobreza extrema en Proverbios 30:7-9?",
    options: ["Job", "Salomón", "Agur", "Lemuel"],
    correct_index: 2,
  },
  {
    id: "q32",
    text: "¿En qué rango de años aproximado se sitúa la fecha de escritura del libro de Job?",
    options: ["2000-1800 a.C.", "1440-586 a.C.", "Alrededor del 935 a.C.", "47-67 d.C."],
    correct_index: 0,
  },
  {
    id: "q33",
    text: "¿Cuántos libros componen la sección de Profetas Mayores?",
    options: ["4", "5", "12", "13"],
    correct_index: 1,
  },
  {
    id: "q34",
    text: "Isaías contiene más de 300 referencias o profecías relacionadas con:",
    options: ["El templo de Salomón", "El Mesías", "Las plagas de Egipto", "El viaje a Roma"],
    correct_index: 1,
  },
  {
    id: "q35",
    text: "¿Quién fue el escriba que anotó las palabras del profeta Jeremías en un rollo?",
    options: ["Baruc", "Daniel", "Baltasar", "Ezequiel"],
    correct_index: 0,
  },
  {
    id: "q36",
    text: "¿En qué año comenzó el ministerio del profeta Ezequiel en Babilonia?",
    options: ["740 a.C.", "627 a.C.", "593 a.C.", "539 a.C."],
    correct_index: 2,
  },
  {
    id: "q37",
    text: "¿Cuántos libros integran el grupo de los Profetas Menores?",
    options: ["5", "7", "12", "13"],
    correct_index: 2,
  },
  {
    id: "q38",
    text: "¿Qué significa el nombre del tercer hijo de Oseas, Lo-ammi?",
    options: ["Pueblo mío", "Dios fortalece", "Pueblo ajeno", "Dios salva"],
    correct_index: 2,
  },
  {
    id: "q39",
    text: "¿En qué pasaje se registra la reprensión a los sacerdotes por ofrecer animales ciegos y cojos en el altar?",
    options: ["Oseas 1:1-3", "Jonás 2:1-5", "Malaquías 1:6-9", "Hageo 2:1-4"],
    correct_index: 2,
  },
  {
    id: "q40",
    text: "¿Qué profeta inició su ministerio aproximadamente en el año 785 a.C. predicando en Nínive?",
    options: ["Sofonías", "Jonás", "Joel", "Habacuc"],
    correct_index: 1,
  },
  {
    id: "q41",
    text: "¿Cuántos libros conforman los Evangelios?",
    options: ["3", "4", "5", "12"],
    correct_index: 1,
  },
  {
    id: "q42",
    text: 'Según el enfoque de cada Evangelio, ¿cuál de ellos presenta a Jesús como el "Hijo de Dios"?',
    options: ["Mateo", "Marcos", "Lucas", "Juan"],
    correct_index: 3,
  },
  {
    id: "q43",
    text: "¿Cuántos milagros de Jesús registran los Evangelios aproximadamente?",
    options: ["Alrededor de 12", "Alrededor de 37", "Más de 300", "Exactamente 70"],
    correct_index: 1,
  },
  {
    id: "q44",
    text: "¿Quién es el autor del libro de Hechos?",
    options: ["Pedro", "Pablo", "Lucas", "Esteban"],
    correct_index: 2,
  },
  {
    id: "q45",
    text: "¿Qué personaje practicaba la hechicería en Samaria e intentó comprar el poder del Espíritu Santo con dinero?",
    options: ["Simón el mago", "Felipe", "Bernabé", "Saulo"],
    correct_index: 0,
  },
  {
    id: "q46",
    text: "¿Cuántos libros forman la sección de Cartas Paulinas?",
    options: ["5", "12", "13", "21"],
    correct_index: 2,
  },
  {
    id: "q47",
    text: "¿Qué colaborador de Pablo enfermó gravemente al llevar la ayuda de los filipenses a Roma?",
    options: ["Timoteo", "Tito", "Epafrodito", "Filemón"],
    correct_index: 2,
  },
  {
    id: "q48",
    text: "¿En qué lugar se encontraba exiliado el apóstol Juan cuando escribió el libro de Apocalipsis?",
    options: ["Isla de Patmos", "Roma", "Pérgamo", "Atenas"],
    correct_index: 0,
  },
  {
    id: "q49",
    text: '¿Qué creyente es mencionado en Apocalipsis 2:13 como "mi testigo fiel, que fue muerto entre vosotros"?',
    options: ["Dionisio", "Antipas", "Asclepio", "Ateneo"],
    correct_index: 1,
  },
  {
    id: "q50",
    text: "¿Cuántos libros forman la sección de Cartas Generales del Nuevo Testamento?",
    options: ["5", "8", "12", "13"],
    correct_index: 1,
  },
  {
    id: "q51",
    text: "¿Qué personaje en una de las iglesias ocupaba una posición de liderazgo pero no recibía a los hermanos ni permitía que otros lo hicieran?",
    options: ["Diótrefes", "Juan", "Santiago", "Pedro"],
    correct_index: 0,
  },
  {
    id: "q52",
    text: '¿Qué significa la palabra "epístola"?',
    options: ["Alianza", "Profecía", "Carta", "Ley"],
    correct_index: 2,
  },
  {
    id: "q53",
    text: "¿Cuál es el mensaje principal atribuido al libro de 1 Juan en la sección de Cartas Generales?",
    options: ["Cristo es superior", "Esperanza en el sufrimiento", "Dios es amor", "Defender la fe"],
    correct_index: 2,
  },
  {
    id: "q54",
    text: "¿Cuántos años duró aproximadamente el Período del Silencio?",
    options: ["70 años", "300 años", "400 años", "700 años"],
    correct_index: 2,
  },
  {
    id: "q55",
    text: '¿De qué término griego deriva la palabra "canon" y qué significaba originalmente?',
    options: [
      "Biblos, que significa libro",
      "Kanon, que significa vara de medir o regla",
      "Epistole, que significa mensaje",
      "Torá, que significa ley",
    ],
    correct_index: 1,
  },
  {
    id: "q56",
    text: "¿Qué profeta anunció el fin de los 400 años de silencio al proclamar la llegada de Jesús?",
    options: ["Juan el Bautista", "Malaquías", "Isaías", "Zacarías"],
    correct_index: 0,
  },
  {
    id: "q57",
    text: "¿Cómo se llama la traducción más antigua de la Biblia hebrea al idioma griego realizada durante el período de silencio?",
    options: ["Vulgata", "Septuaginta", "Códice Sinaítico", "Canon Hebreo"],
    correct_index: 1,
  },
  {
    id: "q58",
    text: "¿Cuál de los siguientes libros NO pertenece a las cartas Paulinas?",
    options: ["Romanos", "Gálatas", "Hebreos", "Filemón"],
    correct_index: 2,
  },
  {
    id: "q59",
    text: "¿Qué libro único del Nuevo Testamento es profético?",
    options: ["Hechos", "Daniel", "Judas", "Apocalipsis"],
    correct_index: 3,
  },
];

export function getQuestionById(id: string): Question | null {
  return QUESTION_BANK.find((q) => q.id === id) ?? null;
}

export const ALL_QUESTION_IDS = QUESTION_BANK.map((q) => q.id);
