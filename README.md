# ¿Cuál es tu edad mental?

Un test de edad mental medio chistoso, medio profundo. Veinticinco preguntas en seis temas
(cabeza, corazón, humor, alma, ocio y ciencia), cuatro minutos, y cinco preguntas con base en
investigación publicada.

Hecho para que Carlos y Karen descubran quién es la persona adulta aquí.

## Cómo funciona

- **Solo frontend.** Tres archivos (`index.html`, `style.css`, `app.js`) más los datos (`questions.js`).
  Sin dependencias, sin build, sin cuentas ni cookies.
- **Determinista.** Cada opción tiene una edad fija. La edad mental es la media de las 25 respuestas,
  y también se calcula por tema. Mismas respuestas, mismo resultado, siempre.
- **Cara a cara.** Al terminar puedes *desafiar a alguien*: se genera un enlace que lleva tu resultado
  codificado en la URL. Cuando la otra persona lo abre y termina el test, ve la comparación
  (edades, compatibilidad, en qué coinciden y en qué no). También se puede pasar el teléfono
  y que la segunda persona lo haga en el mismo dispositivo.

## Las cinco con base científica

El tema *Ciencia* tiene cinco preguntas que se apoyan en hallazgos publicados sobre cómo cambia
la mente con la edad. Al final del test se muestra, para cada una, tu respuesta, el hallazgo y la fuente.

| Pregunta | Hallazgo | Fuente |
| --- | --- | --- |
| ¿A qué hora te despertarías sin alarma? | El cronotipo se retrasa en la adolescencia, toca techo hacia los 20 y luego se adelanta con la edad. | Roenneberg et al., «A marker for the end of adolescence», *Current Biology*, 2004 |
| ¿Aceptas un plan nuevo con algo de riesgo? | La búsqueda de sensaciones alcanza su máximo en la adolescencia y baja de forma sostenida en la vida adulta. | Steinberg et al., «Age differences in sensation seeking and impulsivity as indexed by behavior and self-report», *Developmental Psychology*, 2008 |
| ¿Con quién pasarías media hora libre? | Con la edad, la preferencia se desplaza de conocer gente nueva a estar con los vínculos cercanos (selectividad socioemocional). | Fredrickson y Carstensen, «Choosing social partners: How old age and anticipated endings make people more selective», *Psychology and Aging*, 1990 |
| ¿Qué cuentas primero de un viaje con de todo? | Las personas mayores atienden y recuerdan proporcionalmente más lo positivo (efecto de positividad). | Reed, Chan y Mikels, «Meta-analysis of the age-related positivity effect», *Psychology and Aging*, 2014 |
| ¿Cumples un plan al que dijiste que sí? | La responsabilidad y la amabilidad aumentan de media a lo largo de la vida adulta (maduración de la personalidad). | Roberts, Walton y Viechtbauer, «Patterns of mean-level change in personality traits across the life course», *Psychological Bulletin*, 2006 |

Una sola pregunta no es un instrumento validado: el test sigue siendo un juego. Lo que sí es real
es la dirección de cada hallazgo.

## La carta de la noche

En `cita/` vive una segunda app, pensada para una cita de cena y copas: **La carta de la noche**.
Seis platos para conocerse de seis formas, con un solo celular que se pasa entre los dos.

| Plato | Mecánica | Base |
| --- | --- | --- |
| 🥂 Aperitivo, *Apuesto a que…* | Uno responde en secreto, el otro adivina. Se cuenta la «lectura mutua». | Similitud percibida: Tidwell, Eastwick y Finkel, 2013 |
| 🥗 Entrada, *Pregunta y repregunta* | Por turnos; quien escucha repregunta antes de contestar. Sube de nivel. | Huang et al., 2017; Sprecher et al., 2013; Kardas, Kumar y Epley, 2022 |
| 🍽️ Plato fuerte, *Buenas noticias y desastres con final feliz* | Uno cuenta una anécdota; el otro recibe una misión para celebrarla. | Reis et al., 2010; Bruk, Scholl y Bless, 2018; Fraley y Aron, 2004 |
| 🍰 Postre, *¿Qué harían si…?* | Hipotéticos que se resuelven entre los dos. | Aron et al., 2000; Proyer y Brauer |
| 🍸 Copas, *Retos* | Sincronía a la de tres, duelo de miradas, dos verdades y una mentira, reseña. | Hove y Risen, 2009; Kellerman, Lewis y Laird, 1989 |
| 🧾 La cuenta, *Lo que me llevo* | Lo aprendido, lo que gustó, un regalo imaginario y una pregunta pendiente. | Boothby et al., 2018; Zhao y Epley, 2021 |

Después de la cuenta se abre **Para llevar**: una ronda relámpago y una segunda vuelta de cada plato
con las cartas de repuesto. Todo el contenido está en `cita/cards.js`.

Detalles pensados para la mesa:

- Modo restaurante: tema oscuro y letra grande por defecto. Hay modo claro.
- Cada plato termina con la pantalla «guarden el celular». Las reglas de la casa citan por qué.
- Cualquiera puede cambiar una carta o saltarla, tres saltos por persona.
- El progreso se guarda en el navegador: si el celular se bloquea, la noche sigue donde iba.
- Funciona sin señal una vez abierta, gracias a un service worker. Se puede añadir a la pantalla de inicio.
- Modo corto, de media hora, y modo completo, de una hora repartida en la noche.

Publicada junto al test, queda en `https://<usuario>.github.io/edadmental/cita/`.

## Neurodivergencia

En `espectro/` vive la tercera capa: tres instrumentos reales, cero inventados, con su puntuación oficial,
sus fuentes en cada pantalla y comparación entre dos por enlace. Cada uno guarda su progreso en el navegador.

| Instrumento | Qué mide | Ítems | Puntuación |
| --- | --- | --- | --- |
| 🔬 **Autistómetro**, Cociente del Espectro Autista (AQ), Baron-Cohen et al., 2001 | Rasgos del espectro autista en cinco subescalas | 50, con la traducción oficial al español del Autism Research Centre | 0 a 50 sobre una regla con media de población ≈ 17, umbral clínico 26, corte original 32 y media de adultos autistas ≈ 35 |
| ⚡ **TDAH**, escala ASRS v1.1, Kessler et al., 2005, con la OMS | Síntomas de TDAH en adultos: parte A de cribado y parte B de contexto, en dos dominios | 18, traducción provisional pendiente de la versión oficial para Colombia | Casillas sombreadas con la clave oficial; cribado positivo con 4 o más de 6 en la parte A |
| 🎭 **Camuflaje**, cuestionario CAT-Q, Hull et al., 2019 | Cuánto esfuerzo se pone en parecer «normal» en lo social: compensación, enmascaramiento y asimilación | 25, traducción propia del original mientras se publica la validación española | 25 a 175 con las medias por grupo del estudio original y el corte de 100 |

- **Perfil** con los tres resultados y una lectura del cruce entre AQ y camuflaje, que es donde el AQ se queda corto.
- **Comparación** por enlace: cada instrumento que ambos hayan hecho, con reglas dobles, subescalas lado a lado y los ítems donde respondieron al revés. Los enlaces de la versión anterior, solo con el AQ, siguen funcionando.
- Lectura por franjas escrita sin diagnosticar y letra pequeña en cada instrumento: son cribados, son autoinformes, y quien enmascara puntúa bajo en el AQ.

Los ítems del AQ se reproducen sin modificaciones y con los créditos que pide el Autism Research Centre.
Todo el contenido está en `espectro/items.js`, `espectro/asrs.js` y `espectro/catq.js`.

## Usarlo

Abre `index.html` en el navegador y listo. Para compartirlo con un enlace, publícalo con GitHub Pages:

1. Ve a *Settings → Pages* del repositorio.
2. En *Build and deployment* elige *Deploy from a branch*, rama `main`, carpeta `/ (root)`.
3. En un minuto estará en `https://<usuario>.github.io/edadmental/`.

## Ajustar el test

Todo el contenido está en `questions.js`:

- `TOPICS`: los seis temas y sus comentarios por franja (joven, media, mayor).
- `QUESTIONS`: las 25 preguntas, cada una con cuatro opciones y su edad. Las opciones están
  desordenadas a propósito para que la edad no sea evidente. Las del tema *Ciencia* llevan
  además un campo `science` con el hallazgo y la fuente.
- `PROFILES`: los perfiles por rango de edad mental, con título, descripción y frase final.
  El total posible va de 17 a 61 años, y las franjas están calibradas a ese rango.
