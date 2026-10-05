/* =====================================================================
   Camuflaje — Cuestionario de camuflaje de rasgos autistas (CAT-Q)
   Hull, Mandy, Lai, Baron-Cohen, Allison, Smith y Petrides, 2019.
   Veinticinco afirmaciones en escala de 7 puntos. Tres subescalas:
   compensación, enmascaramiento y asimilación. Total de 25 a 175.

   Traducción al español propia, a partir del texto original en inglés,
   mientras se publica la validación española en curso (CAT-Q-ES, USC).
   ===================================================================== */

window.CATQ = {
  id: 'catq', emoji: '🎭', nombre: 'Camuflaje', titulo: 'Cuestionario CAT-Q', corto: 'CAT-Q',
  sub: 'Cuánto esfuerzo pones en parecer «normal» en lo social. 25 afirmaciones, 4 minutos.',
  min: '4 min',
  traduccionProvisional: false,
  opciones: ['Totalmente en desacuerdo', 'En desacuerdo', 'Algo en desacuerdo', 'Ni de acuerdo ni en desacuerdo', 'Algo de acuerdo', 'De acuerdo', 'Totalmente de acuerdo'],
  instrucciones: 'Indique en qué medida está de acuerdo con cada afirmación, pensando en cómo se comporta en situaciones sociales.',

  items: [
    'Cuando interactúo con alguien, copio deliberadamente su lenguaje corporal o sus expresiones faciales.',
    'Vigilo mi lenguaje corporal o mis expresiones faciales para que parezca que estoy en calma.',
    'Rara vez siento la necesidad de actuar para salir adelante en una situación social.',
    'He desarrollado un guion para seguir en situaciones sociales (por ejemplo, una lista de preguntas o de temas de conversación).',
    'Repito frases que he oído decir a otras personas exactamente de la misma forma en que las oí la primera vez.',
    'Ajusto mi lenguaje corporal o mis expresiones faciales para dar la impresión de que me interesa la persona con la que estoy interactuando.',
    'En situaciones sociales, siento que estoy «actuando» en vez de ser yo.',
    'En mis interacciones sociales, uso comportamientos que aprendí viendo a otras personas interactuar.',
    'Siempre pienso en la impresión que causo en los demás.',
    'Necesito el apoyo de otras personas para socializar.',
    'Practico mis expresiones faciales y mi lenguaje corporal para asegurarme de que se vean naturales.',
    'No siento la necesidad de mirar a los ojos a los demás si no quiero.',
    'Tengo que obligarme a interactuar con la gente cuando estoy en situaciones sociales.',
    'He intentado mejorar mi comprensión de las habilidades sociales observando a otras personas.',
    'Vigilo mi lenguaje corporal o mis expresiones faciales para dar la impresión de que me interesa la persona con la que estoy interactuando.',
    'En situaciones sociales, busco maneras de evitar interactuar con los demás.',
    'He investigado las reglas de la interacción social (por ejemplo, estudiando psicología o leyendo libros sobre comportamiento humano) para mejorar mis propias habilidades sociales.',
    'Siempre soy consciente de la impresión que causo en los demás.',
    'Me siento libre de ser yo cuando estoy con otras personas.',
    'Aprendo cómo la gente usa el cuerpo y la cara para interactuar viendo televisión o películas, o leyendo ficción.',
    'Ajusto mi lenguaje corporal o mis expresiones faciales para que parezca que estoy en calma.',
    'Cuando hablo con otras personas, siento que la conversación fluye con naturalidad.',
    'He dedicado tiempo a aprender habilidades sociales de series y películas, e intento usarlas en mis interacciones.',
    'En las interacciones sociales, no presto atención a lo que hacen mi cara o mi cuerpo.',
    'En situaciones sociales, siento que estoy fingiendo ser «normal».'
  ],

  /* Ítems invertidos: puntúan 8 menos la respuesta. */
  invertidos: [3, 12, 19, 22, 24],
  escalaMin: 25, escalaMax: 175, corte: 100,

  subescalas: [
    { id: 'compensacion', nombre: 'Compensación', desc: 'Guiones, imitación, aprender lo social observando o estudiando', items: [1, 4, 5, 8, 11, 14, 17, 20, 23], rango: [9, 63],
      niveles: ['Lo social te sale sin manual.', 'Tienes algunos trucos aprendidos para las situaciones sociales.', 'Has construido un manual entero: guiones, imitación, estudio. Funciona, y cansa.'] },
    { id: 'enmascaramiento', nombre: 'Enmascaramiento', desc: 'Vigilar la cara, el cuerpo, la mirada y la impresión que das', items: [2, 6, 9, 12, 15, 18, 21, 24], rango: [8, 56],
      niveles: ['No vigilas lo que hace tu cara: simplemente pasa.', 'A ratos controlas cómo te ves; a ratos te olvidas.', 'Monitoreas cara, cuerpo y mirada casi todo el tiempo. Es trabajo invisible.'] },
    { id: 'asimilacion', nombre: 'Asimilación', desc: 'Sentir que actúas, que finges «normalidad», que te obligas a interactuar', items: [3, 7, 10, 13, 16, 19, 22, 25], rango: [8, 56],
      niveles: ['Te sientes tú cuando estás con gente.', 'A veces sientes que actúas; a veces fluye.', 'Lo social se siente como una actuación y a menudo te obligas a entrar en escena.'] }
  ],

  marcas: [
    { v: 91, label: 'Media mujeres no autistas', sub: '≈ 91' },
    { v: 100, label: 'Corte', sub: '100' },
    { v: 110, label: 'Media hombres autistas', sub: '≈ 110' },
    { v: 124, label: 'Media mujeres autistas', sub: '≈ 124' }
  ],

  franjas: [
    { max: 80, titulo: 'Poco camuflaje', texto: 'Por debajo de las medias de la población no autista. Lo que ves de ti en lo social es más o menos lo que hay: poco guion, poca vigilancia, poca actuación.' },
    { max: 99, titulo: 'Camuflaje en el rango habitual', texto: 'En la zona donde puntúa la mayoría de la gente no autista: entre 91 y 97 de media. Todo el mundo ajusta un poco la cara y el cuerpo en sociedad; tú lo haces en dosis normales.' },
    { max: 175, titulo: 'Camuflaje alto', texto: 'Por encima del corte de 100 que propusieron los autores. Pones un esfuerzo considerable en parecer «normal» en lo social. Importa por dos razones: cansa, y hace que cuestionarios como el AQ se queden cortos, porque miden rasgos que tú has aprendido a tapar.' }
  ],

  letraPequena: [
    'El camuflaje no es exclusivo de las personas autistas: lo hacen también personas con ansiedad social, TDAH o simplemente mucha exigencia social. El CAT-Q mide la conducta, no su causa.',
    'Las mujeres autistas puntúan de media más alto que los hombres autistas. Es una de las razones por las que el autismo se detecta más tarde en mujeres.',
    'Un camuflaje alto junto a un AQ bajo es la combinación que más vale la pena mirar con calma.',
    'Traducción propia del original en inglés; la validación española del CAT-Q está en curso.'
  ],

  creditos: 'Cuestionario de camuflaje de rasgos autistas (CAT-Q): Hull, L., Mandy, W., Lai, M.-C., Baron-Cohen, S., Allison, C., Smith, P., & Petrides, K. V. (2019). Development and validation of the Camouflaging Autistic Traits Questionnaire (CAT-Q). Journal of Autism and Developmental Disorders, 49(3), 819-833. Traducción al español propia, con los ítems en su orden y redacción originales.',

  ciencia: [
    { texto: 'El CAT-Q se validó con 354 adultos autistas y 478 no autistas. Medias del puntaje total: mujeres autistas 124,4; hombres autistas 109,6; mujeres no autistas 90,9; hombres no autistas 96,9. Los autores proponen 100 como corte.', fuente: 'Hull et al., Journal of Autism and Developmental Disorders, 2019', url: 'https://link.springer.com/article/10.1007/s10803-018-3792-6' },
    { texto: 'Tres subescalas: compensación (estrategias para superar dificultades sociales), enmascaramiento (ocultar o controlar rasgos) y asimilación (esforzarse por encajar). Consistencia interna del total: 0,94.', fuente: 'Hull et al., 2019, resumen en NovoPsych', url: 'https://novopsych.com/assessments/formulation/camouflaging-autistic-traits-questionnaire-cat-q/' },
    { texto: 'La validación de una versión española, el CAT-Q-ES, está en curso en la Universidad de Santiago de Compostela.', fuente: 'CiMUS, Universidade de Santiago de Compostela', url: 'https://cimus.usc.gal/news/el-cimus-lidera-un-proyecto-de-investigacion-para-evaluar-el-camuflaje-social-asociado-al-tea' }
  ]
};
