/* =====================================================================
   La carta de la noche — contenido
   Seis platos, cada uno con sus cartas principales, sus cartas de
   repuesto (`extra`) y la nota de ciencia en la que se apoya.
   ===================================================================== */

window.CARTA = {
  fecha: 'Amor y Amistad · 19 de septiembre',

  reglas: [
    'El celular sale en ráfagas y se guarda. Cada plato termina con la pantalla «guarden el celular».',
    'Cualquiera puede cambiar una carta o saltarla. Nadie contesta lo que no quiere.',
    'Si una carta dispara una conversación larga y la app queda olvidada, la app ganó.'
  ],
  reglasCiencia: [
    { texto: 'La sola presencia de un celular sobre la mesa reduce la sensación de conexión y de empatía entre dos personas que conversan, sobre todo con temas personales.', fuente: 'Przybylski y Weinstein, Journal of Social and Personal Relationships, 2013', url: 'https://journals.sagepub.com/doi/10.1177/0265407512453827' },
    { texto: 'En un experimento en un restaurante, quienes tenían el celular a mano disfrutaron menos la comida con su gente, porque se distraían más.', fuente: 'Dwyer, Kushlev y Dunn, Journal of Experimental Social Psychology, 2018', url: 'https://www.sciencedirect.com/science/article/abs/pii/S0022103117301737' }
  ],

  platos: [
    /* ------------------------------------------------------------ */
    {
      id: 'aperitivo', emoji: '🥂', nombre: 'Aperitivo', titulo: 'Apuesto a que…',
      sub: 'Uno responde en secreto. El otro adivina.', min: '5 min', tipo: 'adivina',
      ciencia: [
        { texto: 'En citas rápidas reales, sentirse parecidos predijo la atracción; ser parecidos de verdad, no. Por eso cada acierto se celebra.', fuente: 'Tidwell, Eastwick y Finkel, Personal Relationships, 2013', url: 'https://onlinelibrary.wiley.com/doi/abs/10.1111/j.1475-6811.2012.01405.x' }
      ],
      cierre: 'Hablen de la respuesta que más los sorprendió.',
      cartas: [
        { q: 'La alarma de la mañana:', o: ['Una sola y me levanto', 'Cinco de nueve minutos', '¿Cuál alarma? Me despierto solo'] },
        { q: 'La cuenta llega con un error a tu favor:', o: ['Aviso', 'Celebro en silencio', 'Depende del monto'] },
        { q: '¿Duermes con medias?', o: ['Sí, siempre', 'Jamás', 'Solo si hace frío'] },
        { q: 'Las plantas de tu casa:', o: ['Viven', 'Sobreviven', 'Descansan en paz'] },
        { q: 'Llegar a los sitios:', o: ['Antes', 'Justo', '«Ya voy llegando», desde la casa'] },
        { q: 'En un karaoke:', o: ['Primero en la lista', 'Último, con dos tragos', 'Solo público'] },
        { q: 'Los términos y condiciones:', o: ['Los leo, en serio', 'Acepto sin mirar', 'Los leí una vez, en 2016'] },
        { q: 'Los mensajes de WhatsApp:', o: ['Contesto al momento', 'Leo y contesto después, a veces', 'Tengo 40 en visto con la mejor intención'] }
      ],
      extra: [
        { q: 'Si te pierdes en una ciudad:', o: ['Pregunto', 'Mapa y punto', 'Camino con confianza hasta que aparece algo'] },
        { q: 'Tu cajón de cables:', o: ['Ordenado', 'Existe', 'Es más bien una zona'] },
        { q: 'Cuando algo se daña en la casa:', o: ['Lo arreglo yo', 'Llamo a alguien', 'Aprendo a vivir con eso'] },
        { q: 'Las fotos del celular:', o: ['Organizadas en álbumes', 'Miles, sin tocar', 'Borro cada semana'] }
      ]
    },

    /* ------------------------------------------------------------ */
    {
      id: 'entrada', emoji: '🥗', nombre: 'Entrada', titulo: 'Pregunta y repregunta',
      sub: 'Por turnos. Quien escucha repregunta antes de contestar.', min: '10 min', tipo: 'turnos',
      ciencia: [
        { texto: 'En citas rápidas, quienes hacen preguntas de seguimiento caen mejor, porque transmiten que escuchan.', fuente: 'Huang, Yeomans, Brooks, Minson y Gino, Journal of Personality and Social Psychology, 2017', url: 'https://pubmed.ncbi.nlm.nih.gov/28447835/' },
        { texto: 'Cuando los dos se abren por turnos, el agrado sube más que cuando uno pregunta y el otro solo responde.', fuente: 'Sprecher, Treger, Wondra, Hilaire y Wallpe, Journal of Experimental Social Psychology, 2013', url: 'https://www.sciencedirect.com/science/article/pii/S002210311300070X' },
        { texto: 'La gente sobreestima lo incómoda que será una conversación algo profunda con alguien nuevo, y después se siente más conectada de lo que esperaba.', fuente: 'Kardas, Kumar y Epley, Journal of Personality and Social Psychology, 2022', url: 'https://pubmed.ncbi.nlm.nih.gov/34591541/' }
      ],
      cierre: 'Vuelvan a la respuesta que se quedó corta. Ahí suele estar lo bueno.',
      cartas: [
        { n: 1, q: '¿Qué talento inútil tienes que jamás pondrías en la hoja de vida?', r: ['¿Desde cuándo?', '¿Cuándo fue la última vez que lo usaste?', '¿Quién más lo sabe?'] },
        { n: 1, q: '¿Qué regla rara tienes contigo mismo y cumples religiosamente?', r: ['¿De dónde salió?', '¿La has roto alguna vez?', '¿A quién más se la impondrías?'] },
        { n: 2, q: '¿Qué haces «mal» a propósito porque te gusta más así?', r: ['¿Quién te lo ha criticado?', '¿Cuándo empezó?', '¿Lo defenderías en público?'] },
        { n: 2, q: '¿Qué opinión impopular defenderías en una cena con desconocidos?', r: ['¿Cómo llegaste a eso?', '¿Alguien te ha hecho dudar?', '¿Cuál es el mejor argumento en contra?'] },
        { n: 2, q: '¿A qué le cogiste el gusto tarde en la vida?', r: ['¿Qué te hizo cambiar?', '¿Qué te perdiste por no empezar antes?', '¿Qué sigue en la lista?'] },
        { n: 3, q: '¿Qué te preguntan siempre por tu trabajo, y qué te gustaría que te preguntaran en vez de eso?', r: ['Va: te la hago.', '¿Quién te ha hecho la mejor pregunta?', '¿Y qué contestarías hoy?'] }
      ],
      extra: [
        { n: 1, q: '¿Cuál es tu lujo barato favorito?', r: ['¿Cuándo fue la última vez?', '¿Con quién lo compartes?', '¿Quién te lo enseñó?'] },
        { n: 2, q: '¿Qué habilidad te gustaría tener ya mismo, sin el proceso de aprenderla?', r: ['¿Para usarla en qué, primero?', '¿Qué te frena?', '¿Y cuál sí valdría la pena aprender despacio?'] },
        { n: 2, q: '¿Qué fue lo más adulto y lo menos adulto que hiciste esta semana?', r: ['¿Cuál te dio más orgullo?', '¿Alguien fue testigo?', '¿Y la próxima semana?'] },
        { n: 3, q: '¿Qué cosa se toma en serio la gente y tú no?', r: ['¿Cómo lo notas?', '¿Y al revés: qué te tomas en serio tú y nadie más?', '¿Desde cuándo?'] }
      ]
    },

    /* ------------------------------------------------------------ */
    {
      id: 'fuerte', emoji: '🍽️', nombre: 'Plato fuerte', titulo: 'Buenas noticias y desastres con final feliz',
      sub: 'Uno cuenta. El otro tiene una misión.', min: '10 min', tipo: 'historias',
      ciencia: [
        { texto: 'Contar una buena noticia a alguien que la celebra con entusiasmo aumenta la confianza y el agrado, incluso entre desconocidos.', fuente: 'Reis, Smith, Carmichael y Caprariello, Journal of Personality and Social Psychology, 2010', url: 'https://pubmed.ncbi.nlm.nih.gov/20658846/' },
        { texto: 'Mostrar una pequeña imperfección propia se ve desde fuera como valentía y autenticidad, no como debilidad. Lo llaman «beautiful mess effect».', fuente: 'Bruk, Scholl y Bless, Journal of Personality and Social Psychology, 2018', url: 'https://doi.org/10.1037/pspa0000120' },
        { texto: 'Reírse juntos de algo acerca más que el humor de cada uno por separado.', fuente: 'Fraley y Aron, Personal Relationships, 2004', url: 'https://psycnet.apa.org/record/2004-11068-004' }
      ],
      cierre: 'Brinden por la victoria que no se celebró lo suficiente.',
      cartas: [
        { q: 'Una victoria del último año que no celebraste lo suficiente.', m: 'Pregunta qué pasó justo después. Y celébrala ahora: brindis obligatorio.' },
        { q: 'Un plan que salió mal y hoy es tu mejor anécdota.', m: 'Pídele el detalle más ridículo.' },
        { q: 'Lo último que hiciste por primera vez.', m: 'Pregunta qué lo llevó a hacerlo, y si repetiría.' },
        { q: 'Una vez que rompiste una regla y valió la pena.', m: 'Pregunta quién fue la primera persona que se enteró.' },
        { q: 'Un ridículo público que ya te da risa.', m: 'Di qué habrías hecho tú en su lugar.' },
        { q: 'Algo que te salió bien por pura terquedad.', m: 'Pregunta quién le dijo que no lo hiciera.' }
      ],
      extra: [
        { q: 'Un error de trabajo que hoy cuentas con orgullo.', m: 'Pregunta qué aprendió. Y qué no.' },
        { q: 'La mejor noticia que has recibido en un lugar raro.', m: 'Pregunta a quién llamó primero.' },
        { q: 'Un plan improvisado que salió mejor que uno planeado.', m: 'Pregunta con quién estaba.' }
      ]
    },

    /* ------------------------------------------------------------ */
    {
      id: 'postre', emoji: '🍰', nombre: 'Postre', titulo: '¿Qué harían si…?',
      sub: 'Se resuelve entre los dos.', min: '10 min', tipo: 'juntos',
      ciencia: [
        { texto: 'Hacer juntos algo novedoso, aunque dure siete minutos, mejora cómo se vive la relación. Imaginarlo también cuenta.', fuente: 'Aron, Norman, Aron, McKenna y Heyman, Journal of Personality and Social Psychology, 2000', url: 'https://pubmed.ncbi.nlm.nih.gov/10707334/' },
        { texto: 'Las personas juguetonas con su pareja, las que bromean con cariño y la animan, reportan más satisfacción en la relación.', fuente: 'Proyer y Brauer, resumen en Society for Personality and Social Psychology', url: 'https://spsp.org/news-center/character-context-blog/playfulness-romantic-relationships-love-really-such-easy-game' }
      ],
      cierre: 'Decidan cuál de los planes harían de verdad. Aunque sea uno.',
      cartas: [
        { q: 'Tienen 24 horas y 300 mil pesos en una ciudad donde no conocen a nadie. Armen el plan, a grandes rasgos.', t: 'El plan, en una línea' },
        { q: 'Mañana amanecen con el trabajo del otro. ¿Qué es lo primero que embarran?', t: 'Lo primero que se embarra' },
        { q: 'Inventen un festivo nuevo para Colombia: qué se celebra, qué se come y qué queda prohibido ese día.', t: 'Nombre del festivo' },
        { q: 'Diseñen la peor cita de Amor y Amistad posible. Sean específicos.', t: 'Título de la peor cita' },
        { q: 'Tienen que abrir un negocio juntos, absurdo pero rentable. ¿Qué venden y cómo se llama?', t: 'Nombre del negocio' }
      ],
      extra: [
        { q: '¿Qué prefieren: hablar con los animales, o hablar todos los idiomas pero con un acento rarísimo? Tienen que ponerse de acuerdo.', t: 'Veredicto' },
        { q: 'Les regalan un fin de semana con una sola condición: cero pantallas. Armen el plan.', t: 'El plan' },
        { q: 'Van de viaje en grupo con cinco amigos. Cada uno pone una regla innegociable y una absurda.', t: 'Las reglas' }
      ]
    },

    /* ------------------------------------------------------------ */
    {
      id: 'copas', emoji: '🍸', nombre: 'Copas', titulo: 'Retos',
      sub: 'Para la parte de la noche con menos cubiertos.', min: '15 min', tipo: 'retos',
      ciencia: [
        { texto: 'Moverse o hablar en sincronía con alguien aumenta el afecto hacia esa persona, aunque sea tocando un ritmo con el dedo.', fuente: 'Hove y Risen, Social Cognition, 2009', url: 'https://guilfordjournals.com/doi/10.1521/soco.2009.27.6.949' },
        { texto: 'Dos minutos de mirada mutua entre desconocidos aumentaron los sentimientos de afecto y de amor pasional en laboratorio. Aquí son sesenta segundos y con risa permitida.', fuente: 'Kellerman, Lewis y Laird, Journal of Research in Personality, 1989', url: 'https://www.sciencedirect.com/science/article/pii/0092656689900202' },
        { texto: 'Una experiencia graciosa compartida aumenta la cercanía en un primer encuentro.', fuente: 'Fraley y Aron, Personal Relationships, 2004', url: 'https://psycnet.apa.org/record/2004-11068-004' }
      ],
      cierre: 'Guarden el celular y pidan otra ronda. De lo que sea.',
      cartas: [
        { k: 'sincronia', q: 'Sincronía', d: 'Cuentan hasta tres y dicen a la vez una respuesta. Se suman las coincidencias.',
          cats: ['Una ciudad para perderse un fin de semana', 'Un olor que les gusta y a nadie más', 'Un número del 1 al 10', 'Algo que nunca falta en una nevera colombiana', 'Un superpoder inútil'] },
        { k: 'duelo', q: 'Duelo de miradas', d: 'Sesenta segundos mirándose a los ojos. Pierde quien se ría primero. Efecto secundario documentado desde 1989.' },
        { k: 'dosverdades', q: 'Dos verdades y una mentira', d: 'Edición laboral: dos cosas que de verdad te pasaron en el trabajo y una inventada. El otro adivina cuál es la mentira.' },
        { k: 'simple', q: 'Reseña de Google Maps', d: 'Cada uno describe al otro como si fuera una reseña de Google Maps. Con estrellas y con «volvería».' }
      ],
      extra: [
        { k: 'simple', q: 'Retrato en servilleta', d: 'Treinta segundos: cada uno dibuja al otro en una servilleta. Se intercambian. Se conservan.' },
        { k: 'simple', q: 'Firma con la otra mano', d: 'Cada uno firma la servilleta con la mano que no usa. Gana quien se reconozca la firma.' }
      ]
    },

    /* ------------------------------------------------------------ */
    {
      id: 'cuenta', emoji: '🧾', nombre: 'La cuenta', titulo: 'Lo que me llevo',
      sub: 'Se dice en voz alta. Los dos.', min: '5 min', tipo: 'cuenta',
      ciencia: [
        { texto: 'Después de una conversación, la gente subestima cuánto le gustó a la otra persona. Se llama «liking gap». Decirlo en voz alta lo cierra.', fuente: 'Boothby, Cooney, Sandstrom y Clark, Psychological Science, 2018', url: 'https://journals.sagepub.com/doi/abs/10.1177/0956797618783714' },
        { texto: 'Quien hace un elogio subestima lo bien que va a caer y sobreestima lo incómodo que será. Casi siempre se queda corto.', fuente: 'Zhao y Epley, Journal of Personality and Social Psychology, 2021', url: 'https://osf.io/ypk5g/' }
      ],
      cierre: 'Eso fue la carta. Lo demás ya es la noche.',
      cartas: [
        { k: 'voz', q: 'Una cosa que aprendiste del otro esta noche y no sabías a las siete.' },
        { k: 'voz', q: 'Una cosa que te gustó de cómo el otro cuenta las cosas.' },
        { k: 'regalo', q: 'Amigo secreto imaginario: con lo que aprendiste hoy, ¿qué le regalarías? Sin límite de presupuesto ni de leyes de la física.', t: 'Regalo de {a} para {b}' },
        { k: 'pendiente', q: 'Una pregunta que se queda pendiente para la próxima.', t: 'Pregunta pendiente de {a}' }
      ],
      extra: []
    }
  ],

  /* ------------------------------------------------------------ */
  relampago: {
    emoji: '⚡', nombre: 'Ronda relámpago', sub: 'Una palabra por respuesta. Diez segundos. Sin pensar.',
    ciencia: [
      { texto: 'Cuando dos personas «conectan», responden más rápido la una a la otra. Las pausas cortas son una señal honesta de conexión, tanto entre amigos como entre desconocidos.', fuente: 'Templeton, Chang, Reynolds, Cone LeBeaumont y Wheatley, PNAS, 2022', url: 'https://www.pnas.org/doi/10.1073/pnas.2116915119' }
    ],
    cartas: [
      'Un sonido que odias',
      'Un hábito que te da orgullo',
      'Algo que compras siempre en el aeropuerto',
      'Un lugar al que volverías mañana',
      'Una palabra que usas demasiado',
      'Algo que te da pereza y a nadie más',
      'Un año al que viajarías',
      'Lo primero que haces al llegar a la casa',
      'Un objeto que no botarías nunca',
      'Algo que se te da bien con las manos',
      'Un olor de la infancia',
      'Tu palabra favorita en otro idioma'
    ]
  }
};
