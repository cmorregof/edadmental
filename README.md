# ¿Cuál es tu edad mental?

Un test de edad mental medio chistoso, medio profundo. Veinte preguntas repartidas en cinco temas
(cabeza, corazón, humor, alma y ocio), tres minutos, cero validez científica.

Hecho para que Carlos y Karen descubran quién es la persona adulta aquí.

## Cómo funciona

- **Solo frontend.** Tres archivos (`index.html`, `style.css`, `app.js`) más los datos (`questions.js`).
  Sin dependencias, sin build, sin cuentas ni cookies.
- **Determinista.** Cada opción tiene una edad fija. La edad mental es la media de las 20 respuestas,
  y también se calcula por tema. Mismas respuestas, mismo resultado, siempre.
- **Cara a cara.** Al terminar puedes *desafiar a alguien*: se genera un enlace que lleva tu resultado
  codificado en la URL. Cuando la otra persona lo abre y termina el test, ve la comparación
  (edades, compatibilidad, en qué coinciden y en qué no). También se puede pasar el teléfono
  y que la segunda persona lo haga en el mismo dispositivo.

## Usarlo

Abre `index.html` en el navegador y listo. Para compartirlo con un enlace, publícalo con GitHub Pages:

1. Ve a *Settings → Pages* del repositorio.
2. En *Build and deployment* elige *Deploy from a branch*, rama `main`, carpeta `/ (root)`.
3. En un minuto estará en `https://<usuario>.github.io/edadmental/`.

## Ajustar el test

Todo el contenido está en `questions.js`:

- `TOPICS`: los cinco temas y sus comentarios por franja (joven, media, mayor).
- `QUESTIONS`: las 20 preguntas, cada una con cuatro opciones y su edad. Las opciones están
  desordenadas a propósito para que la edad no sea evidente.
- `PROFILES`: los perfiles por rango de edad mental, con título, descripción y frase final.
  El total posible va de 17 a 60 años, y las franjas están calibradas a ese rango.
