/* =====================================================================
   Autistómetro — datos
   Cociente del Espectro Autista (AQ), Baron-Cohen et al., 2001.
   Ítems reproducidos sin modificaciones de la traducción oficial al
   español (México) de Molina-Arcia, Tovar y García, 2024, publicada por
   el Autism Research Centre de la Universidad de Cambridge, que permite
   su uso gratuito con fines no comerciales citando la fuente.
   ===================================================================== */

window.AQ = {
  opciones: ['Totalmente de acuerdo', 'Un poco de acuerdo', 'Un poco en desacuerdo', 'Totalmente en desacuerdo'],
  instrucciones: 'A continuación, encontrará una lista de frases. Por favor, léalas atentamente e indique la respuesta más apropiada. No deje ninguna frase sin responder.',

  items: [
    'Prefiero hacer las cosas con otros que solo.',
    'Prefiero hacer las cosas siempre de la misma manera.',
    'Si intento imaginar algo, me resulta muy fácil crear la imagen en mi mente.',
    'Con frecuencia me involucro tanto en algo, que ignoro lo demás.',
    'A menudo noto pequeños sonidos que los demás no perciben.',
    'Suelo fijarme en las placas de los automóviles, o en patrones de información de ese tipo.',
    'Muchas veces me dicen que lo que digo es poco amable, aunque yo crea que sí es amable.',
    'Cuando leo un cuento, me es fácil imaginar cómo se ven los personajes.',
    'Me fascina recordar fechas.',
    'En una situación social puedo seguir distintas conversaciones a la vez.',
    'Las situaciones sociales se me facilitan.',
    'Suelo notar detalles que los demás no ven.',
    'Prefiero ir a una biblioteca que a una fiesta.',
    'Me es fácil inventar historias.',
    'Me llaman más la atención las personas que los objetos.',
    'Hay cosas que suelen interesarme mucho, y me molesta cuando no puedo dedicarles tiempo.',
    'Me gusta tener platicas casuales.',
    'Cuando hablo, casi no dejo hablar a los demás.',
    'Me encantan los números.',
    'Cuando leo un cuento, me cuesta trabajo entender las intenciones de los personajes.',
    'No me gusta mucho leer temas de ficción.',
    'Me cuesta trabajo hacer nuevos amigos.',
    'Siempre noto patrones o secuencias en las cosas.',
    'Prefiero ir al teatro que al museo.',
    'No me molesta cuando hay cambios en mi rutina diaria.',
    'Por lo general me parece que no sé cómo mantener una conversación.',
    'Cuando alguien me está platicando, me parece fácil leer entre líneas o captar indirectas.',
    'A menudo me concentro más en lo general que en los pequeños detalles.',
    'No soy muy bueno para recordar números telefónicos.',
    'Usualmente, no me doy cuenta de cambios pequeños en una situación o en la apariencia de una persona.',
    'Me doy cuenta cuando alguien que me está escuchando, se aburre.',
    'Me parece fácil hacer más de una cosa a la vez.',
    'Cuando hablo por teléfono, no sé bien cuándo es mi turno para hablar.',
    'Me gusta hacer las cosas sin planearlas mucho.',
    'Suelo ser el último en entender una broma.',
    'Me es fácil darme cuenta de lo que alguien está pensando o sintiendo con tan sólo ver su rostro.',
    'Cuando hay una interrupción en lo que estoy haciendo, puedo retomarlo fácilmente.',
    'Soy bueno para platicar sobre temas sin importancia.',
    'Me suelen decir que me la paso hablando sobre un mismo tema, una y otra vez.',
    'De chico me gustaba actuar o fingir personajes cuando jugaba con otros niños.',
    'Me gusta recabar información relacionada con ciertas categorías de cosas (por ejemplo, tipos de automóviles, tipos de aves, tipos de teléfonos, tipos de plantas, etc.).',
    'Me cuesta trabajo imaginar cómo sería ser otra persona.',
    'Me gusta planear cuidadosamente las actividades en las que participo.',
    'Me gustan las actividades sociales.',
    'Me cuesta trabajo entender las intenciones de las personas.',
    'Las situaciones nuevas me ponen muy nervioso.',
    'Me gusta conocer gente nueva.',
    'Soy bastante diplomático.',
    'No soy muy bueno para recordar la fecha de nacimiento de otras personas.',
    'Me resulta muy fácil jugar a juegos con niños en los que hay que fingir ser otra persona.'
  ],

  /* Ítems (numerados desde 1) que suman un punto con «de acuerdo». El resto suma con «en desacuerdo». */
  acuerdo: [2, 4, 5, 6, 7, 9, 12, 13, 16, 18, 19, 20, 21, 22, 23, 26, 33, 35, 39, 41, 42, 43, 45, 46],

  subescalas: [
    {
      id: 'social', nombre: 'Habilidad social', desc: 'Fiestas, gente nueva, hacer amigos',
      items: [1, 11, 13, 15, 22, 36, 44, 45, 47, 48],
      niveles: ['Lo social se te da sin esfuerzo visible.', 'Lo social te sale, pero te cobra algo de energía.', 'Lo social te cuesta de verdad. Y aun así estás aquí, comparando resultados.']
    },
    {
      id: 'atencion', nombre: 'Cambio de atención', desc: 'Cambiar de tarea, de plan o de rutina',
      items: [2, 4, 10, 16, 25, 32, 34, 37, 43, 46],
      niveles: ['Cambias de plan sin que se note.', 'Prefieres saber qué viene, pero te adaptas.', 'Rutina y foco profundo: cuando estás en algo, el mundo espera.']
    },
    {
      id: 'detalle', nombre: 'Atención al detalle', desc: 'Patrones, números, sonidos, cambios pequeños',
      items: [5, 6, 9, 12, 19, 23, 28, 29, 30, 49],
      niveles: ['Ves el bosque antes que los árboles.', 'Notas los detalles cuando importan.', 'Notas lo que nadie más nota. Es la subescala donde más puntúa la gente de ciencias.']
    },
    {
      id: 'comunicacion', nombre: 'Comunicación', desc: 'Turnos, indirectas, charla casual, chistes',
      items: [7, 17, 18, 26, 27, 31, 33, 35, 38, 39],
      niveles: ['Lees entre líneas y la charla casual no te cuesta.', 'A veces se te escapa una indirecta, como a casi todo el mundo.', 'Las indirectas, los turnos y la charla por charlar te cuestan. Lo directo te sale mejor.']
    },
    {
      id: 'imaginacion', nombre: 'Imaginación', desc: 'Historias, personajes, ponerse en otra piel',
      items: [3, 8, 14, 20, 21, 24, 40, 41, 42, 50],
      niveles: ['Inventas historias con facilidad y te metes en la cabeza de los personajes.', 'Imaginas bien, aunque prefieres lo concreto.', 'Prefieres lo real a lo inventado, y ponerte en otra piel te cuesta.']
    }
  ],

  /* Marcas de referencia sobre la regla de 0 a 50. Solo cifras verificadas en su fuente. */
  marcas: [
    { v: 17, label: 'Media población', sub: '≈ 17', fuente: 'Ruzich et al., 2015' },
    { v: 26, label: 'Umbral clínico', sub: '26', fuente: 'Woodbury-Smith et al., 2005' },
    { v: 32, label: 'Corte original', sub: '32', fuente: 'Baron-Cohen et al., 2001' },
    { v: 35, label: 'Media autistas', sub: '≈ 35', fuente: 'Ruzich et al., 2015' }
  ],

  /* Lectura por franja (se usa la primera cuyo max >= puntaje). */
  franjas: [
    { max: 10, titulo: 'Muy por debajo de la media', texto: 'Tus rasgos del espectro, medidos así, están muy por debajo de lo habitual. Lees caras, cambias de plan sin drama y las fiestas no te cuestan. Una salvedad: también puede ser que enmascares bien, y de eso el AQ no se entera.' },
    { max: 21, titulo: 'En la media de la población', texto: 'Estás donde está la mayoría: en población general la media ronda los 17 puntos. Tienes rasgos del espectro, como todo el mundo, en dosis cotidiana. Lo interesante está en las subescalas: ahí se ve de qué están hechos tus puntos.' },
    { max: 25, titulo: 'Por encima de la media', texto: 'Más rasgos que la mayoría, todavía lejos de los puntos de corte. Suele querer decir que algunas cosas te cuestan más que a otras personas y otras te salen mejor: el detalle, el foco, la rutina. Mira cuáles.' },
    { max: 31, titulo: 'Zona de evaluación', texto: 'Estás en la franja donde, en clínica, un puntaje así junto con motivos de consulta justifica una evaluación completa. No es un diagnóstico. Es una señal de que el tema merece una conversación seria y, si quieres, un profesional.' },
    { max: 50, titulo: 'Por encima del corte original', texto: 'En el estudio original, el 80 % de los adultos autistas puntuaba 32 o más, y solo el 2 % del grupo control. Un puntaje así no diagnostica, pero sí dice que tus rasgos son muchos y marcados. Si te resuena, una evaluación formal puede poner nombre y, sobre todo, contexto.' }
  ],

  letraPequena: [
    'Es un cribado, no un diagnóstico. El AQ se diseñó para medir rasgos en toda la población. El diagnóstico lo hace un profesional con una evaluación completa.',
    'Es un autoinforme: mide cómo te ves, no cómo eres. Quien enmascara mucho sus rasgos puntúa bajo aunque los tenga. Para eso existe otro cuestionario, el CAT-Q, que puede ser la siguiente capa.',
    'La traducción es la oficial para población mexicana. Por eso dice «platicar».',
    'Si el resultado te deja pensando, con quien se habla es con un profesional.'
  ],

  creditos: 'Instrumento original: Baron-Cohen, S., Wheelwright, S., Skinner, R., Martin, J., & Clubley, E. (2001). The autism-spectrum quotient (AQ): Evidence from Asperger syndrome/high-functioning autism, males and females, scientists and mathematicians. Journal of Autism and Developmental Disorders, 31(1), 5-17. Traducción al español (México): Molina-Arcia, L., Tovar, A. E., & García, O. (2024). Factor structure and psychometric properties of the Spanish version of the Autism-Spectrum Quotient (AQ). Acta de Investigación Psicológica, 14(2). Publicado por el Autism Research Centre, University of Cambridge, que permite su uso gratuito con fines no comerciales citando la fuente. Ítems reproducidos sin modificaciones.',

  ciencia: [
    { texto: 'El AQ mide rasgos autistas como un continuo en toda la población. En el estudio original, el grupo autista promedió 35,8 y el grupo control 16,4; el 80 % de los autistas puntuó 32 o más, frente al 2 % de los controles. Los hombres puntuaron algo más que las mujeres, y la gente de ciencias más que la de humanidades.', fuente: 'Baron-Cohen, Wheelwright, Skinner, Martin y Clubley, Journal of Autism and Developmental Disorders, 2001', url: 'https://pubmed.ncbi.nlm.nih.gov/11439754/' },
    { texto: 'Un metaanálisis con 6.900 adultos sin diagnóstico encontró una media de 16,9; en adultos autistas, de 35,2.', fuente: 'Ruzich et al., Molecular Autism, 2015', url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4396128/' },
    { texto: 'En una clínica de adultos, un umbral de 26 clasificó bien al 83 % de las personas evaluadas, con sensibilidad de 0,95. Por eso 26 se usa como señal para derivar a evaluación.', fuente: 'Woodbury-Smith, Robinson, Wheelwright y Baron-Cohen, Journal of Autism and Developmental Disorders, 2005', url: 'https://pubmed.ncbi.nlm.nih.gov/16119474/' },
    { texto: 'La traducción al español es la oficial del Autism Research Centre, validada en población mexicana.', fuente: 'Molina-Arcia, Tovar y García, Acta de Investigación Psicológica, 2024', url: 'https://www.autismresearchcentre.com/content/uploads/2024/11/Autism-Quotient-Spanish-Mexico.pdf' }
  ]
};
