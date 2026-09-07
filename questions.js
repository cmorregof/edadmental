/* =====================================================================
   ¿Cuál es tu edad mental? — datos del test
   Todo es determinista: cada opción tiene una "edad" fija y el resultado
   es la media de las 25 respuestas (y la media por tema).
   Las preguntas del tema «ciencia» llevan un campo `science` con el
   hallazgo en el que se apoyan y su fuente; se muestra en el resultado.
   ===================================================================== */

window.TOPICS = [
  {
    id: 'cabeza', emoji: '🧠', label: 'Cabeza', desc: 'Vida adulta y responsabilidades',
    notes: {
      young: 'Tu vida adulta va en modo «ya veremos». Y, de momento, funciona.',
      mid: 'Funcionas. Con esfuerzo, pero funcionas. Hay tuppers, hay alarma, hay esperanza.',
      old: 'Tienes tuppers etiquetados y abres las cartas del banco el mismo día. No hay más preguntas.'
    }
  },
  {
    id: 'corazon', emoji: '❤️', label: 'Corazón', desc: 'Amor y vínculos',
    notes: {
      young: 'Quieres con intensidad y contestas con estrategia. Hay pasión; falta calma.',
      mid: 'Sabes querer sin perderte. Casi siempre. Y cuando te pierdes, vuelves.',
      old: 'Quieres con calma y sin ruido. Eso es raro, y es bueno.'
    }
  },
  {
    id: 'humor', emoji: '😂', label: 'Humor', desc: 'De qué te ríes y cómo',
    notes: {
      young: 'Te ríes de una caída y de un pedo. Y tienes razón: son graciosos.',
      mid: 'Tu humor tiene capas, como una cebolla que cuenta chistes.',
      old: 'Te ríes de los chistes malos con ternura. Eso ya es sabiduría.'
    }
  },
  {
    id: 'alma', emoji: '🌌', label: 'Alma', desc: 'Lo profundo (y lo incómodo)',
    notes: {
      young: 'Todavía crees que el universo te tiene manía. No es personal: es el universo.',
      mid: 'Estás en el proceso. Y lo sabes, que es lo importante.',
      old: 'Has entendido que todo pasa. Incluso lo bueno, y por eso lo cuidas.'
    }
  },
  {
    id: 'ocio', emoji: '🎉', label: 'Ocio', desc: 'Cuerpo, hábitos y diversión',
    notes: {
      young: 'Fiesta hasta que cierren. Tu hígado toma nota para más adelante.',
      mid: 'Sabes divertirte sin hipotecar el domingo. Equilibrio de élite.',
      old: 'Manzanilla a las diez y cero remordimientos. Un ídolo.'
    }
  },
  {
    id: 'ciencia', emoji: '🔬', label: 'Ciencia', desc: 'Cinco preguntas con base en investigación publicada',
    notes: {
      young: 'Según los estudios, tu mente sigue en fase de explorar: madrugar poco, arriesgar mucho y contar los desastres con orgullo.',
      mid: 'La literatura te sitúa en plena transición: ya eliges mejor con quién estar, pero todavía te tienta el plan sin reservar.',
      old: 'La ciencia dice que tu mente ya hizo la mudanza a la calma: te quedas con lo bueno, con los tuyos y con la mañana.'
    }
  }
];

/* Las opciones están desordenadas a propósito para que la edad no sea obvia. */
window.QUESTIONS = [
  /* ---- ronda 1 ---- */
  {
    topic: 'cabeza',
    text: 'Son las 23:47 y mañana madrugas. ¿Qué estás haciendo?',
    options: [
      { text: 'Viendo «solo un capítulo más» por cuarta vez.', age: 17 },
      { text: 'Ya en la cama, con la alarma puesta y la ropa de mañana preparada.', age: 52 },
      { text: 'Contestando mensajes que llevaban tres días esperando.', age: 29 },
      { text: 'Durmiendo desde las 22:30, como manda la tradición.', age: 71 }
    ]
  },
  {
    topic: 'corazon',
    text: 'Te escribe alguien que te gusta. ¿Cuánto tardas en responder?',
    options: [
      { text: 'Espero el doble de lo que tardó esa persona. Es matemática.', age: 18 },
      { text: 'Al instante. ¿Para qué el drama?', age: 38 },
      { text: 'Cuando lo vea. No vivo pegado al teléfono.', age: 58 },
      { text: 'Lo leo, sonrío, y contesto con calma cuando puedo escribir bien.', age: 45 }
    ]
  },
  {
    topic: 'humor',
    text: '¿Qué te hace reír más?',
    options: [
      { text: 'Un video de alguien cayéndose. Clásico e infalible.', age: 11 },
      { text: 'La ironía fina, la que hay que entender.', age: 44 },
      { text: 'Un chiste tan malo que da la vuelta y se vuelve bueno.', age: 28 },
      { text: 'Cuando un niño dice algo que un adulto no se atrevería a decir.', age: 61 }
    ]
  },
  {
    topic: 'alma',
    text: '¿Cómo te llevas con el tiempo?',
    options: [
      { text: 'Voy corriendo. Siempre. No sé hacia dónde.', age: 29 },
      { text: 'Tengo todo el tiempo del mundo. No me preocupa en absoluto.', age: 17 },
      { text: 'Lo que hay, hay. Lo importante es con quién lo gastas.', age: 69 },
      { text: 'Aprendí a decir que no a cosas para que me quede tiempo para las importantes.', age: 48 }
    ]
  },
  {
    topic: 'ocio',
    text: 'Tu sábado por la mañana ideal:',
    options: [
      { text: 'Salir a hacer deporte antes de que el mundo se despierte.', age: 40 },
      { text: 'Levantarme cuando el cuerpo quiera, sin alarma ni planes.', age: 22 },
      { text: 'Mercado, café con alguien y pendientes. Productivo, pero rico.', age: 51 },
      { text: 'Desayuno largo, un libro, y nada que hacer hasta la tarde.', age: 63 }
    ]
  },
  {
    topic: 'ciencia',
    text: 'Sin alarma, sin obligaciones y sin nadie que te juzgue: ¿a qué hora te despertarías de forma natural?',
    options: [
      { text: 'Entre las 8 y las 10.', age: 40 },
      { text: 'Después del mediodía. El día empieza cuando yo digo.', age: 16 },
      { text: 'Antes de las 7, y con energía.', age: 62 },
      { text: 'Entre las 10 y las 12.', age: 25 }
    ],
    science: {
      finding: 'El cronotipo (la hora a la que tu reloj interno prefiere dormir y despertar) se va retrasando durante la adolescencia, toca techo alrededor de los 20 años y desde ahí se adelanta poco a poco con la edad.',
      source: 'Roenneberg et al., «A marker for the end of adolescence», Current Biology, 2004',
      url: 'https://doi.org/10.1016/j.cub.2004.11.039'
    }
  },

  /* ---- ronda 2 ---- */
  {
    topic: 'cabeza',
    text: 'Te llega una carta del banco. ¿Qué haces?',
    options: [
      { text: 'La dejo en la mesa «para luego». Luego es un concepto flexible.', age: 24 },
      { text: '¿Cartas? Yo solo abro notificaciones.', age: 16 },
      { text: 'La abro al momento: si hay un problema, prefiero saberlo ya.', age: 45 },
      { text: 'La abro, la leo dos veces y la archivo en una carpeta con etiqueta.', age: 63 }
    ]
  },
  {
    topic: 'corazon',
    text: 'Para ti, una cita perfecta es…',
    options: [
      { text: 'Cenar tranquilos y hablar hasta que cierren el lugar.', age: 36 },
      { text: 'Algo con adrenalina: un plan que no sepamos cómo va a terminar.', age: 21 },
      { text: 'Quedarnos en casa, manta, película y no tener que fingir nada.', age: 68 },
      { text: 'Un paseo largo sin destino y sin mirar el reloj.', age: 57 }
    ]
  },
  {
    topic: 'humor',
    text: 'En un grupo de WhatsApp, tú eres quien…',
    options: [
      { text: 'Contesta con un «jajaja» educado dos horas después.', age: 47 },
      { text: 'Manda los stickers a las 3 de la mañana.', age: 15 },
      { text: 'Cuenta la anécdota que hace que todos respondan.', age: 31 },
      { text: 'Corrige la ortografía de los demás, con cariño.', age: 55 }
    ]
  },
  {
    topic: 'alma',
    text: 'Cuando algo sale mal en tu vida, piensas que…',
    options: [
      { text: 'Algo aprenderé, aunque ahora mismo solo quiero gritar.', age: 34 },
      { text: 'Es culpa del universo, que me tiene manía.', age: 13 },
      { text: 'Fue culpa mía, seguro. Toca analizar cada detalle durante tres días.', age: 26 },
      { text: 'Todo pasa. Incluso esto.', age: 60 }
    ]
  },
  {
    topic: 'ocio',
    text: 'Tu playlist se define como…',
    options: [
      { text: 'Lo que suena ahora mismo en todas partes.', age: 16 },
      { text: 'Un caos absoluto: reguetón, ópera y un podcast a medias.', age: 27 },
      { text: 'Jazz, cosas tranquilas y música para leer.', age: 62 },
      { text: 'Lo que escuchaba a los 15 años, sin disimular.', age: 38 }
    ]
  },
  {
    topic: 'ciencia',
    text: 'Te proponen algo nuevo con un punto de riesgo: saltar en paracaídas, pedir un plato que no sabes qué es, un viaje sin reservar nada.',
    options: [
      { text: 'Sí, si voy con gente de confianza.', age: 30 },
      { text: 'Sí, sin pensarlo. La adrenalina es el plan.', age: 15 },
      { text: 'No, gracias. Ya tuve mi época y la disfruté.', age: 63 },
      { text: 'Depende de cuánto riesgo y de si vale la pena.', age: 44 }
    ],
    science: {
      finding: 'La búsqueda de sensaciones (las ganas de experiencias nuevas e intensas) alcanza su máximo en la adolescencia y baja de forma sostenida a lo largo de la vida adulta.',
      source: 'Steinberg et al., «Age differences in sensation seeking and impulsivity as indexed by behavior and self-report», Developmental Psychology, 2008',
      url: 'https://doi.org/10.1037/a0012955'
    }
  },

  /* ---- ronda 3 ---- */
  {
    topic: 'cabeza',
    text: 'Tu nevera (refrigerador, heladera, como le digas) ahora mismo dice de ti que…',
    options: [
      { text: 'Hay salsas, tres cervezas y una luz que funciona.', age: 19 },
      { text: 'Está llena, porque hacer las compras es mi plan favorito del sábado.', age: 66 },
      { text: 'Hay verduras de verdad y algo cocinado en un tupper.', age: 41 },
      { text: 'Hay sobras de anoche y un plan claro para comérmelas.', age: 30 }
    ]
  },
  {
    topic: 'corazon',
    text: '¿En qué te fijas primero en alguien?',
    options: [
      { text: 'El físico. Seamos sinceros.', age: 19 },
      { text: 'Cómo trata a la persona que le sirve la comida.', age: 49 },
      { text: 'La risa. Si se ríe bien, ya no hay vuelta atrás.', age: 32 },
      { text: 'Si me hace pensar cosas que no había pensado.', age: 41 }
    ]
  },
  {
    topic: 'humor',
    text: 'Te cuentan un chiste malo. Tú…',
    options: [
      { text: 'Me río de verdad. Los chistes malos son el mejor invento de la humanidad.', age: 67 },
      { text: 'Me río, pero sobre todo de lo malo que era.', age: 25 },
      { text: 'Guardo silencio hasta que sea incómodo. Ese es mi humor.', age: 42 },
      { text: 'Digo «ese me lo sé mejor» y lo cuento peor.', age: 35 }
    ]
  },
  {
    topic: 'alma',
    text: '¿Qué te da más miedo?',
    options: [
      { text: 'No llegar a ser quien podría ser.', age: 27 },
      { text: 'Aburrirme.', age: 12 },
      { text: 'Olvidar cómo sonaba la risa de alguien que ya no está.', age: 64 },
      { text: 'Gastar mi tiempo con gente que no me suma.', age: 43 }
    ]
  },
  {
    topic: 'ocio',
    text: 'Una noche de fiesta, hoy en día, es…',
    options: [
      { text: 'Cena rica, dos copas y en casa a la 1. Feliz.', age: 42 },
      { text: 'Hasta que cierren, y después a buscar algo de comer.', age: 18 },
      { text: '¿Fiesta? Yo estoy en el sofá con una manzanilla a las 22:00, sin remordimientos.', age: 72 },
      { text: 'Ir a una casa con amigos y sacar un juego de mesa.', age: 54 }
    ]
  },
  {
    topic: 'ciencia',
    text: 'Tienes media hora libre y puedes pasarla con una de estas personas. ¿A quién eliges?',
    options: [
      { text: 'Alguien que acabo de conocer y con quien tengo mucho en común.', age: 21 },
      { text: 'Un familiar cercano o una amistad de toda la vida.', age: 60 },
      { text: 'Quien escribió un libro que me encantó.', age: 29 },
      { text: 'Alguien que me puede ayudar con algo que necesito ahora.', age: 24 }
    ],
    science: {
      finding: 'Cuando el tiempo se percibe como amplio, priorizamos conocer gente nueva y aprender; cuando se percibe como limitado, elegimos a quienes ya nos importan. Con la edad, la preferencia se desplaza hacia los vínculos cercanos. Es la teoría de la selectividad socioemocional.',
      source: 'Fredrickson y Carstensen, «Choosing social partners: How old age and anticipated endings make people more selective», Psychology and Aging, 1990',
      url: 'https://doi.org/10.1037/0882-7974.5.3.335'
    }
  },

  /* ---- ronda 4 ---- */
  {
    topic: 'cabeza',
    text: 'Te duele algo raro desde hace tres días. ¿Qué haces?',
    note: 'Nota para el personal sanitario: los autodiagnósticos también cuentan.',
    options: [
      { text: 'Lo busco en internet y a los diez minutos ya tengo tres enfermedades graves.', age: 22 },
      { text: 'Pido cita con el médico, como una persona funcional.', age: 48 },
      { text: 'Lo ignoro. El cuerpo sabe lo que hace.', age: 15 },
      { text: 'Se lo pregunto «como quien no quiere la cosa» a alguien que estudió medicina.', age: 33 }
    ]
  },
  {
    topic: 'corazon',
    text: 'Te peleaste con alguien que te importa. Tu estrategia:',
    options: [
      { text: 'Mandar un meme como bandera blanca.', age: 16 },
      { text: 'Hablarlo cuanto antes, aunque incomode.', age: 46 },
      { text: 'Dar espacio y esperar a que se pase solo.', age: 27 },
      { text: 'Escribir un mensaje largo, borrarlo, y mandar uno corto y sincero.', age: 38 }
    ]
  },
  {
    topic: 'humor',
    text: 'Alguien se tira un pedo en una reunión seria.',
    options: [
      { text: 'Me aguanto la risa y me tiembla el labio.', age: 23 },
      { text: 'Ni me inmuto. Soy profesional.', age: 50 },
      { text: 'Es gracioso. Siempre. Es la ley.', age: 9 },
      { text: 'Me río, pero también me pregunto si esa persona está bien del intestino.', age: 36 }
    ]
  },
  {
    topic: 'ciencia',
    text: 'Vuelves de un viaje que tuvo de todo: momentos buenísimos y un par de desastres. Al contarlo, ¿qué sale primero?',
    options: [
      { text: 'Los desastres, con todo detalle. Son la mejor parte de la historia.', age: 19 },
      { text: 'Lo bueno. Los desastres los menciono de pasada.', age: 49 },
      { text: 'Los desastres, pero ya como algo que me da risa.', age: 31 },
      { text: 'Casi solo lo bueno. Lo malo se me olvidó, en serio.', age: 64 }
    ],
    science: {
      finding: 'Con la edad, la atención y la memoria se inclinan hacia lo positivo: las personas mayores atienden y recuerdan proporcionalmente más lo bueno que lo malo, en comparación con las jóvenes. Se conoce como «efecto de positividad».',
      source: 'Reed, Chan y Mikels, «Meta-analysis of the age-related positivity effect», Psychology and Aging, 2014',
      url: 'https://doi.org/10.1037/a0035194'
    }
  },
  {
    topic: 'ocio',
    text: '¿Qué haces cuando te aburres?',
    options: [
      { text: 'Llamar a alguien y armar un plan en veinte minutos.', age: 25 },
      { text: 'Mirar el teléfono hasta que se me duerma la mano.', age: 14 },
      { text: 'Ordenar algo. Un cajón, una idea, la vida.', age: 45 },
      { text: 'Aburrirme no está mal. A veces ahí salen las mejores ideas.', age: 57 }
    ]
  },
  {
    topic: 'ciencia',
    text: 'Hace dos semanas dijiste que sí a un plan. Hoy es el día y no te apetece nada.',
    options: [
      { text: 'Voy, pero llego tarde y me quejo un rato.', age: 26 },
      { text: 'Voy. Un compromiso es un compromiso.', age: 52 },
      { text: 'Cancelo con una excusa creativa.', age: 17 },
      { text: 'Voy, y además llevo algo para compartir.', age: 61 }
    ],
    science: {
      finding: 'La responsabilidad y la amabilidad (dos de los cinco grandes rasgos de personalidad) aumentan de media a lo largo de la vida adulta, sobre todo entre los 20 y los 40 años. La psicología lo llama «maduración de la personalidad».',
      source: 'Roberts, Walton y Viechtbauer, «Patterns of mean-level change in personality traits across the life course: A meta-analysis of longitudinal studies», Psychological Bulletin, 2006',
      url: 'https://doi.org/10.1037/0033-2909.132.1.1'
    }
  },
  {
    topic: 'alma',
    text: 'Si pudieras hablar cinco minutos con tu yo de hace diez años, le dirías…',
    options: [
      { text: '«Sé más amable contigo; te estás tratando peor que a nadie.»', age: 46 },
      { text: '«Compra bitcoin.»', age: 18 },
      { text: '«Todo va a salir bien», y nada más, porque merece vivirlo.', age: 55 },
      { text: 'La lista completa de errores que evitar, con fechas.', age: 24 }
    ]
  }
];

/* Perfiles por rango de edad mental (se usa el primero cuyo max >= edad).
   El total posible va de 17 a 60, así que las franjas están calibradas a ese rango. */
window.PROFILES = [
  {
    max: 20,
    title: 'Criatura del recreo',
    desc: 'Tu calendario dice una cosa y tu cabeza está pidiendo cinco minutos más de patio. Te ríes fuerte, te aburres rápido y no le tienes miedo a casi nada, salvo a las cartas del banco. Ojo: la gente como tú es la que hace que los demás se acuerden de jugar.',
    quote: 'Crecer es obligatorio; madurar, opcional. Tú lo estás haciendo a tu ritmo, y ese ritmo tiene música.'
  },
  {
    max: 27,
    title: 'Adolescente con tarjeta de crédito',
    desc: 'Tienes responsabilidades, pero las tratas como sugerencias. Vives intensamente, contestas mensajes tarde y crees que el tiempo es infinito. Lo mejor: todavía te sorprende todo. Lo peor: tu nevera.',
    quote: 'Tienes toda la intensidad y casi nada del miedo. Ese es el combo que más se extraña después.'
  },
  {
    max: 34,
    title: 'Persona adulta en versión beta',
    desc: 'Ya sabes lo que hay que hacer; otra cosa es hacerlo. Alternas días de tuppers y planificación con noches de «un capítulo más». Estás en obras, y lo bonito es que se nota que las obras van bien.',
    quote: 'Nadie sabe lo que hace; tú al menos lo intentas con buena cara. Eso ya es media adultez.'
  },
  {
    max: 42,
    title: 'Adultez funcional (con dudas razonables)',
    desc: 'Funcionas. Pagas las cosas a tiempo, quieres con cabeza y te ríes con capas. Tienes la edad mental en la que se aprende que decir «no» también es cuidar. Todavía te permites el caos, pero ahora lo eliges tú.',
    quote: 'Elegir el caos es distinto a sufrirlo. Has aprendido la diferencia, y se nota.'
  },
  {
    max: 49,
    title: 'Alma que ya sabe lo que quiere',
    desc: 'Has hecho las paces con muchas cosas, incluida tu playlist. Prefieres una conversación larga a una noche larga. Sabes que todo pasa, y por eso cuidas lo que hay. Sigues teniendo humor, solo que ahora es más afilado.',
    quote: 'Ya no necesitas que te entiendan todos. Solo quienes importan. Y esas personas te entienden.'
  },
  {
    max: 55,
    title: 'Sabiduría con memes',
    desc: 'Tu paz mental es de otra liga. Te ríes de los chistes malos con ternura, madrugas por gusto y no tienes nada que demostrar. Eres la persona a la que todos llaman cuando la vida se complica.',
    quote: 'La calma no te llegó por edad: la construiste. Que nadie te diga que fue suerte.'
  },
  {
    max: 999,
    title: 'Alma anciana con wifi',
    desc: 'Has vivido tres vidas en una y te quedan ganas de una cuarta, tranquila y con manzanilla. Tu tiempo es tuyo y lo gastas con quien te da la gana. Pocas cosas te sorprenden, y las que lo hacen, las guardas.',
    quote: 'Has soltado tanto que ahora solo cargas lo que quieres. Eso no es vejez: es lujo.'
  }
];
