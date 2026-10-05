/* =====================================================================
   TDAH — Escala de autoinforme de TDAH en adultos (ASRS v1.1)
   Kessler et al., 2005, desarrollada con la Organización Mundial de la
   Salud. Dieciocho preguntas: la parte A (1 a 6) es el cribado; la parte
   B (7 a 18) aporta contexto. Se puntúa por «casillas sombreadas».

   TRADUCCIÓN PROVISIONAL al español a partir del texto original en
   inglés. Existe una versión oficial para Colombia distribuida por la
   Universidad de Harvard; cuando se tenga, se sustituye aquí sin tocar
   nada más.
   ===================================================================== */

window.ASRS = {
  id: 'asrs', emoji: '⚡', nombre: 'TDAH', titulo: 'Escala ASRS v1.1', corto: 'ASRS',
  sub: 'El cribado de TDAH en adultos de la OMS. 18 preguntas, 3 minutos.',
  min: '3 min',
  traduccionProvisional: true,
  opciones: ['Nunca', 'Rara vez', 'A veces', 'A menudo', 'Muy a menudo'],
  instrucciones: 'Marque la casilla que mejor describa cómo se ha sentido y comportado durante los últimos seis meses.',

  items: [
    /* Parte A */
    '¿Con qué frecuencia tiene problemas para terminar los últimos detalles de un proyecto, una vez que ya hizo las partes difíciles?',
    '¿Con qué frecuencia le cuesta poner las cosas en orden cuando tiene que hacer una tarea que requiere organización?',
    '¿Con qué frecuencia tiene problemas para recordar citas u obligaciones?',
    'Cuando tiene una tarea que requiere pensar mucho, ¿con qué frecuencia evita empezarla o la aplaza?',
    '¿Con qué frecuencia mueve las manos o los pies, o se remueve en el asiento, cuando tiene que estar sentado mucho tiempo?',
    '¿Con qué frecuencia se siente demasiado activo y con la necesidad de hacer cosas, como si tuviera un motor por dentro?',
    /* Parte B */
    '¿Con qué frecuencia comete errores por descuido cuando tiene que trabajar en un proyecto aburrido o difícil?',
    '¿Con qué frecuencia le cuesta mantener la atención cuando hace un trabajo aburrido o repetitivo?',
    '¿Con qué frecuencia le cuesta concentrarse en lo que le dicen, incluso cuando le hablan directamente?',
    '¿Con qué frecuencia pierde cosas o le cuesta encontrarlas en la casa o en el trabajo?',
    '¿Con qué frecuencia lo distraen la actividad o el ruido a su alrededor?',
    '¿Con qué frecuencia se levanta de su asiento en reuniones u otras situaciones en las que se espera que permanezca sentado?',
    '¿Con qué frecuencia se siente inquieto o intranquilo?',
    '¿Con qué frecuencia le cuesta desconectarse y relajarse cuando tiene tiempo libre?',
    '¿Con qué frecuencia se da cuenta de que habla demasiado en situaciones sociales?',
    'Cuando está en una conversación, ¿con qué frecuencia termina las frases de las personas con las que habla antes de que ellas puedan terminarlas?',
    '¿Con qué frecuencia le cuesta esperar su turno en situaciones en las que hay que turnarse?',
    '¿Con qué frecuencia interrumpe a los demás cuando están ocupados?'
  ],

  /* Umbral de la casilla sombreada por ítem (índice de opción a partir del cual cuenta):
     2 = desde «A veces», 3 = desde «A menudo». */
  umbral: [2, 2, 2, 3, 3, 3, 3, 3, 2, 3, 3, 2, 3, 3, 3, 2, 3, 2],
  parteA: [1, 2, 3, 4, 5, 6],
  corteA: 4,

  dominios: [
    { id: 'inatencion', nombre: 'Inatención', desc: 'Detalles, organización, memoria, concentración, objetos perdidos', items: [1, 2, 3, 4, 7, 8, 9, 10, 11],
      niveles: ['La atención te responde cuando la llamas.', 'Se te escapan detalles y citas más de lo que te gustaría.', 'La atención va por libre: organizarse, terminar y recordar cuestan de verdad.'] },
    { id: 'hiperactividad', nombre: 'Hiperactividad e impulsividad', desc: 'Inquietud, motor interno, hablar de más, interrumpir, esperar', items: [5, 6, 12, 13, 14, 15, 16, 17, 18],
      niveles: ['Puedes quedarte quieto y esperar tu turno sin sufrir.', 'Algo de motor interno: te cuesta desconectar y a veces interrumpes.', 'Motor encendido casi siempre: inquietud, hablar de más, esperar es un deporte.'] }
  ],

  marcas: [], // el ASRS no va sobre una regla continua: se lee por casillas

  franjasA: [
    { max: 1, titulo: 'Cribado negativo', texto: 'Una o ninguna casilla sombreada en la parte A. Según el cribado de la OMS, tus respuestas no apuntan a TDAH en adultos. Mira la parte B de todas formas: ahí está el matiz.' },
    { max: 3, titulo: 'Cribado negativo, con cosas que mirar', texto: 'Dos o tres casillas sombreadas de seis. No llega al umbral del cribado, pero algunos síntomas están presentes con frecuencia. Si te reconoces en la parte B, vale la pena comentarlo con un profesional.' },
    { max: 6, titulo: 'Cribado positivo', texto: 'Cuatro o más casillas sombreadas de seis. En palabras de la propia escala: síntomas muy compatibles con TDAH en adultos, y se justifica una evaluación más completa. No es un diagnóstico. Es la señal de que vale la pena pedir una.' }
  ],

  letraPequena: [
    'Es un cribado, no un diagnóstico. La parte A detecta a quien conviene evaluar; el diagnóstico lo hace un profesional con historia clínica y, en lo posible, información de la infancia.',
    'La parte A tiene sensibilidad del 69 % y especificidad del 99,5 %: cuando da positivo casi nunca se equivoca, pero puede dar negativo en personas que sí tienen TDAH.',
    'Cerca del 4,4 % de los adultos cumple criterios de TDAH, según la encuesta de referencia en Estados Unidos.',
    'Traducción provisional a partir del original en inglés, pendiente de sustituir por la versión oficial en español para Colombia.'
  ],

  creditos: 'Escala de autoinforme de TDAH en adultos (ASRS v1.1), lista de síntomas: Kessler, R. C., Adler, L., Ames, M., Demler, O., Faraone, S., Hiripi, E., Howes, M. J., Jin, R., Secnik, K., Spencer, T., Ustun, T. B., & Walters, E. E. (2005). The World Health Organization Adult ADHD Self-Report Scale (ASRS): a short screening scale for use in the general population. Psychological Medicine, 35(2), 245-256. Desarrollada con la Organización Mundial de la Salud. Clave de corrección oficial por casillas sombreadas.',

  ciencia: [
    { texto: 'Las seis preguntas de la parte A se eligieron entre dieciocho por su capacidad de predecir el diagnóstico clínico: sensibilidad del 68,7 %, especificidad del 99,5 % y clasificación correcta del 97,9 %. Cuatro o más casillas sombreadas marcan el cribado positivo.', fuente: 'Kessler et al., Psychological Medicine, 2005', url: 'https://www.media.psykab.se/2014/01/Kessler2005ASRS-PsychMed.pdf' },
    { texto: 'En la encuesta nacional de referencia en Estados Unidos, el 4,4 % de los adultos cumplía criterios de TDAH; el 62 % eran hombres y el 38 %, mujeres.', fuente: 'Kessler et al., American Journal of Psychiatry, 2006', url: 'https://www.scirp.org/reference/referencespapers?referenceid=3580180' },
    { texto: 'Clave de corrección: en la parte A, los ítems 1 a 3 cuentan desde «A veces» y los 4 a 6 desde «A menudo». En la parte B, los ítems 9, 12, 16 y 18 cuentan desde «A veces» y el resto desde «A menudo».', fuente: 'Lista de síntomas ASRS v1.1, instrucciones oficiales', url: 'https://add.org/wp-content/uploads/2015/03/adhd-questionnaire-ASRS111.pdf' }
  ]
};
