/* =====================================================================
   ¿Cuál es tu edad mental? — lógica de la app
   Solo frontend. Sin dependencias. Sin azar.
   ===================================================================== */
(function () {
  'use strict';

  var QUESTIONS = window.QUESTIONS;
  var TOPICS = window.TOPICS;
  var PROFILES = window.PROFILES;
  var TOTAL = QUESTIONS.length;

  var allAges = [];
  QUESTIONS.forEach(function (q) { q.options.forEach(function (o) { allAges.push(o.age); }); });
  var MIN_AGE = Math.min.apply(null, allAges);
  var MAX_AGE = Math.max.apply(null, allAges);

  var app = document.getElementById('app');

  var state = {
    name: '',
    realAge: null,
    answers: [],
    index: 0,
    me: null,          // mi resultado terminado
    challenger: null   // resultado de la otra persona (por enlace o por «pasar el teléfono»)
  };

  /* ---------- utilidades ---------- */
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function mean(a) { return a.reduce(function (x, y) { return x + y; }, 0) / a.length; }
  function clamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)); }
  function pct(age) { return Math.round(((age - MIN_AGE) / (MAX_AGE - MIN_AGE)) * 100); }
  function band(age) { return age < 26 ? 'young' : age <= 45 ? 'mid' : 'old'; }
  function profileFor(age) {
    for (var i = 0; i < PROFILES.length; i++) if (age <= PROFILES[i].max) return PROFILES[i];
    return PROFILES[PROFILES.length - 1];
  }
  function topicById(id) {
    for (var i = 0; i < TOPICS.length; i++) if (TOPICS[i].id === id) return TOPICS[i];
    return null;
  }
  function $(sel) { return app.querySelector(sel); }
  function $$(sel) { return Array.prototype.slice.call(app.querySelectorAll(sel)); }

  /* ---------- puntuación ---------- */
  function calc(answers) {
    var byTopic = {}, all = [];
    TOPICS.forEach(function (t) { byTopic[t.id] = []; });
    answers.forEach(function (ai, qi) {
      var age = QUESTIONS[qi].options[ai].age;
      byTopic[QUESTIONS[qi].topic].push(age);
      all.push(age);
    });
    var topics = {};
    TOPICS.forEach(function (t) { topics[t.id] = Math.round(mean(byTopic[t.id])); });
    return { age: Math.round(mean(all)), topics: topics };
  }

  function makeResult(name, realAge, answers) {
    var r = calc(answers);
    return {
      name: name,
      realAge: realAge,
      answers: answers.slice(),
      age: r.age,
      topics: r.topics,
      profile: profileFor(r.age)
    };
  }

  /* ---------- compartir resultado por enlace ---------- */
  function encodePayload(r) {
    var raw = [r.name, r.realAge == null ? '' : r.realAge, r.answers.join('')].join('|');
    return btoa(unescape(encodeURIComponent(raw)))
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  function decodePayload(s) {
    try {
      var b = s.replace(/-/g, '+').replace(/_/g, '/');
      while (b.length % 4) b += '=';
      var raw = decodeURIComponent(escape(atob(b)));
      var parts = raw.split('|');
      if (parts.length !== 3) return null;
      var name = parts[0], age = parts[1], ans = parts[2];
      if (!new RegExp('^[0-3]{' + TOTAL + '}$').test(ans)) return null;
      var realAge = age === '' ? null : clamp(parseInt(age, 10) || 0, 1, 120);
      return makeResult((name || 'Alguien').slice(0, 30), realAge, ans.split('').map(Number));
    } catch (e) { return null; }
  }
  function pageUrl() { return location.href.split('#')[0]; }
  function challengeUrl(r) { return pageUrl() + '#r=' + encodePayload(r); }
  function readHash() {
    var m = location.hash.match(/[#&]r=([A-Za-z0-9_-]+)/);
    return m ? decodePayload(m[1]) : null;
  }
  function waLink(text) { return 'https://wa.me/?text=' + encodeURIComponent(text); }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).then(function () { return true; }, function () { return copyFallback(text); });
    }
    return Promise.resolve(copyFallback(text));
  }
  function copyFallback(text) {
    var ta = document.createElement('textarea');
    ta.value = text; ta.setAttribute('readonly', '');
    ta.style.position = 'fixed'; ta.style.top = '-1000px';
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    return ok;
  }

  /* ---------- render ---------- */
  function render(html) {
    app.innerHTML = html;
    window.scrollTo(0, 0);
    var s = $('.screen');
    if (s) requestAnimationFrame(function () { s.classList.add('in'); });
  }

  function countUp(node, to) {
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { node.textContent = to; return; }
    var start = null, dur = 1300;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min(1, (ts - start) / dur);
      var eased = 1 - Math.pow(1 - p, 3);
      node.textContent = Math.round(to * eased);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function animateBars() {
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        $$('.bar-fill').forEach(function (b) { b.style.width = b.getAttribute('data-w') + '%'; });
      });
    });
  }

  /* ---------- pantalla: inicio ---------- */
  function showIntro() {
    var c = state.challenger;
    render(
      '<section class="screen intro">' +
        '<p class="kicker">Un test medio chistoso, medio profundo</p>' +
        '<h1>¿Cuál es tu <em>edad mental</em>?</h1>' +
        '<p class="lead">Veinticinco preguntas sobre tu cabeza, tu corazón, tu humor, tu alma, tu ocio y un poco de ciencia. Cada respuesta suma o quita años. No hay trampa ni azar: solo tú.</p>' +
        '<ul class="meta"><li>25 preguntas</li><li>4 minutos</li><li>5 con base científica</li></ul>' +
        (c ? '<div class="banner">🔔 <strong>' + esc(c.name) + '</strong> ya hizo el test y tiene una edad mental de <strong>' + c.age + ' años</strong>. Haz el tuyo y al final verás la comparación.</div>' : '') +
        '<form id="start" autocomplete="off">' +
          '<label for="name">¿Cómo te llamas?</label>' +
          '<div class="chips">' +
            '<button type="button" class="chip" data-name="Carlos">Soy Carlos</button>' +
            '<button type="button" class="chip" data-name="Karen">Soy Karen</button>' +
          '</div>' +
          '<input id="name" name="name" type="text" maxlength="30" placeholder="Tu nombre" required value="' + esc(state.name) + '">' +
          '<label for="age">¿Y tu edad real? <span class="opt">(opcional; prometemos no juzgar)</span></label>' +
          '<input id="age" name="age" type="number" inputmode="numeric" min="1" max="120" placeholder="Por ejemplo, 29" value="' + (state.realAge == null ? '' : state.realAge) + '">' +
          '<button class="btn primary" type="submit">Empezar</button>' +
        '</form>' +
        '<p class="disclaimer">Cinco preguntas se apoyan en investigación publicada sobre cómo cambia la mente con la edad. Las otras veinte se apoyan en haber tenido nevera. Las fuentes están al final, por si alguien con bata quiere revisarlas.</p>' +
      '</section>'
    );

    $$('.chip').forEach(function (b) {
      b.addEventListener('click', function () {
        var input = $('#name');
        input.value = b.getAttribute('data-name');
        input.focus();
      });
    });

    $('#start').addEventListener('submit', function (e) {
      e.preventDefault();
      var name = $('#name').value.trim();
      if (!name) { $('#name').focus(); return; }
      var ageVal = $('#age').value;
      state.name = name;
      state.realAge = ageVal === '' ? null : clamp(parseInt(ageVal, 10) || 0, 1, 120);
      state.answers = [];
      state.index = 0;
      state.me = null;
      showQuestion();
    });
  }

  /* ---------- pantalla: pregunta ---------- */
  function showQuestion() {
    var i = state.index, q = QUESTIONS[i], t = topicById(q.topic);
    var letters = ['A', 'B', 'C', 'D'];
    var chosen = state.answers[i];

    render(
      '<section class="screen quiz">' +
        '<header class="quiz-head">' +
          '<span class="tag">' + t.emoji + ' ' + t.label + '</span>' +
          '<span class="counter">' + (i + 1) + ' / ' + TOTAL + '</span>' +
        '</header>' +
        '<div class="progress"><div class="progress-bar" style="width:' + ((i / TOTAL) * 100) + '%"></div></div>' +
        '<h2 class="question">' + q.text + '</h2>' +
        (q.note ? '<p class="note">' + q.note + '</p>' : '') +
        (q.science ? '<p class="note sci-note">🔬 Esta pregunta se apoya en investigación publicada. Al final te contamos en cuál.</p>' : '') +
        '<div class="options">' +
          q.options.map(function (o, oi) {
            return '<button type="button" class="option' + (chosen === oi ? ' selected' : '') + '" data-i="' + oi + '">' +
              '<span class="key">' + letters[oi] + '</span><span>' + o.text + '</span></button>';
          }).join('') +
        '</div>' +
        '<div class="quiz-foot">' +
          '<button type="button" class="btn ghost" id="back">' + (i === 0 ? 'Volver al inicio' : '← Anterior') + '</button>' +
        '</div>' +
      '</section>'
    );

    $$('.option').forEach(function (b) {
      b.addEventListener('click', function () { pick(parseInt(b.getAttribute('data-i'), 10)); });
    });
    $('#back').addEventListener('click', function () {
      if (i === 0) showIntro();
      else { state.index--; showQuestion(); }
    });
  }

  function pick(oi) {
    if (!$('.quiz')) return;
    state.answers[state.index] = oi;
    $$('.option').forEach(function (b) { b.disabled = true; b.classList.remove('selected'); });
    var btn = $('.option[data-i="' + oi + '"]');
    if (btn) btn.classList.add('selected');
    setTimeout(function () {
      if (state.index + 1 < TOTAL) { state.index++; showQuestion(); }
      else finish();
    }, 240);
  }

  function finish() {
    state.me = makeResult(state.name, state.realAge, state.answers);
    showResult();
  }

  /* ---------- pantalla: resultado ---------- */
  function realAgeLine(r) {
    if (r.realAge == null) return 'No nos dijiste tu edad real, así que asumimos que eres inmortal.';
    var d = r.age - r.realAge;
    if (Math.abs(d) <= 4) {
      return 'Tu cabeza y tu calendario van de la mano (' + r.realAge + ' de verdad, ' + r.age + ' de mente). Poca gente puede decirlo sin mentir.';
    }
    if (d > 0) {
      return 'Tienes ' + d + ' años de alma más que de calendario. No es que hayas envejecido: es que has vivido con atención.';
    }
    return 'Vas ' + (-d) + ' años por detrás de tu calendario. Guárdalo bien: es lo que te va a mantener con curiosidad cuando el resto se canse.';
  }

  function topicList(r) {
    return '<ul class="topics">' + TOPICS.map(function (t) {
      var a = r.topics[t.id];
      return '<li>' +
        '<div class="topic-row"><span>' + t.emoji + ' ' + t.label + '<span class="desc">' + t.desc + '</span></span><strong>' + a + ' años</strong></div>' +
        '<div class="bar-track"><div class="bar-fill" data-w="' + pct(a) + '"></div></div>' +
        '<p class="topic-note">' + t.notes[band(a)] + '</p>' +
      '</li>';
    }).join('') + '</ul>';
  }

  function scienceList(r) {
    var items = [];
    QUESTIONS.forEach(function (q, i) {
      if (!q.science) return;
      var o = q.options[r.answers[i]];
      items.push('<li>' +
        '<div class="q">' + q.text + '</div>' +
        '<div class="ans"><b>Tu respuesta:</b> ' + o.text + ' <span class="muted">(' + o.age + ')</span></div>' +
        '<p class="sci">' + q.science.finding + '</p>' +
        '<p class="src">Fuente: <a href="' + esc(q.science.url) + '" target="_blank" rel="noopener">' + q.science.source + '</a></p>' +
      '</li>');
    });
    return '<ul class="qlist sci-list">' + items.join('') + '</ul>';
  }

  function shareText(r) {
    return '🧠 Mi edad mental es de ' + r.age + ' años («' + r.profile.title + '»). ¿Y la tuya? Haz el test y al final comparamos: ' + challengeUrl(r);
  }

  function showResult() {
    var r = state.me, c = state.challenger;
    var canCompare = c && c.answers.length === TOTAL;

    render(
      '<section class="screen result">' +
        '<p class="kicker">' + esc(r.name) + ', tu edad mental es</p>' +
        '<div class="big-age"><span class="num" id="age-num">0</span><span class="unit">años</span></div>' +
        '<h2 class="profile-title">' + r.profile.title + '</h2>' +
        '<p class="profile-desc">' + r.profile.desc + '</p>' +
        '<p class="real-age">' + realAgeLine(r) + '</p>' +
        '<h3>Por temas</h3>' +
        topicList(r) +
        '<h3>Las cinco con base científica</h3>' +
        '<p class="muted small">Cada una se apoya en un hallazgo publicado sobre cómo cambia la mente con la edad. Una sola pregunta no es un instrumento validado, pero la dirección es la que marca la investigación.</p>' +
        scienceList(r) +
        '<blockquote class="quote">' + r.profile.quote + '</blockquote>' +
        '<div class="actions">' +
          (canCompare ? '<button type="button" class="btn accent" id="compare">Comparar con ' + esc(c.name) + ' →</button>' : '') +
          '<button type="button" class="btn primary" id="challenge">Desafiar a alguien</button>' +
          '<button type="button" class="btn ghost" id="restart">Repetir el test</button>' +
        '</div>' +
        '<div class="share-panel" id="share" hidden>' +
          '<p>Manda este enlace. Cuando esa persona termine el test, verá la comparación con tu resultado.</p>' +
          '<div class="share-url" id="share-url">' + esc(challengeUrl(r)) + '</div>' +
          '<button type="button" class="btn ghost" id="copy">Copiar enlace</button>' +
          '<a class="btn wa" id="wa" href="' + esc(waLink(shareText(r))) + '" target="_blank" rel="noopener">Enviar por WhatsApp</a>' +
          '<button type="button" class="btn ghost" id="pass">Que lo haga ahora en este teléfono</button>' +
          '<p class="toast" id="toast"></p>' +
        '</div>' +
      '</section>'
    );

    countUp($('#age-num'), r.age);
    animateBars();

    if (canCompare) $('#compare').addEventListener('click', showCompare);

    $('#challenge').addEventListener('click', function () {
      var p = $('#share');
      p.hidden = !p.hidden;
      if (!p.hidden) p.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });

    $('#copy').addEventListener('click', function () {
      copyText(challengeUrl(r)).then(function (ok) {
        $('#toast').textContent = ok ? '✓ Enlace copiado. Ahora solo falta el valor de mandarlo.' : 'No se pudo copiar; selecciona el enlace y cópialo a mano.';
      });
    });

    $('#pass').addEventListener('click', function () {
      state.challenger = state.me;
      state.name = '';
      state.realAge = null;
      state.answers = [];
      state.index = 0;
      state.me = null;
      showIntro();
    });

    $('#restart').addEventListener('click', function () {
      state.answers = [];
      state.index = 0;
      state.me = null;
      showIntro();
    });
  }

  /* ---------- pantalla: comparación ---------- */
  var TOPIC_LINES = {
    cabeza: function (o, y) { return o + ' lleva la agenda; ' + y + ' lleva la chispa.'; },
    corazon: function (o, y) { return o + ' quiere con calma; ' + y + ', con fuegos artificiales.'; },
    humor: function (o, y) { return y + ' se ríe de la caída; ' + o + ', de quien se ríe de la caída.'; },
    alma: function (o, y) { return o + ' ya hizo las paces con el tiempo; ' + y + ' todavía le está pidiendo explicaciones.'; },
    ocio: function (o, y) { return y + ' cierra el bar; ' + o + ' cierra el libro.'; },
    ciencia: function (o, y) { return o + ' es lo que predice la literatura; ' + y + ', el motivo de que sigan haciendo estudios.'; }
  };

  function duoVerdict(A, B) {
    var diff = Math.abs(A.age - B.age);
    var older = A.age >= B.age ? A : B;
    var younger = older === A ? B : A;
    if (diff <= 3) return 'Tienen prácticamente la misma edad mental. Sospechoso. ¿Seguro que no son la misma persona?';
    if (diff <= 10) return esc(older.name) + ' le lleva ' + diff + ' años mentales a ' + esc(younger.name) + '. Lo justo para discutir de música y ponerse de acuerdo en lo importante.';
    if (diff <= 20) return diff + ' años mentales de diferencia: ' + esc(older.name) + ' conduce y ' + esc(younger.name) + ' elige la música. Funciona.';
    return diff + ' años mentales de diferencia. Esto no es una conversación, es un intercambio generacional. Y aun así, miren la compatibilidad.';
  }

  function compatLabel(c) {
    if (c >= 85) return 'Almas gemelas (o alguien copió).';
    if (c >= 70) return 'Muy compatibles: distintas edades, mismo idioma.';
    if (c >= 50) return 'Compatibles con matices. Los matices son lo divertido.';
    return 'Mundos distintos. Por eso la conversación no se acaba.';
  }

  function showCompare() {
    var A = state.challenger, B = state.me;
    if (!A || !B) { showIntro(); return; }

    var rows = QUESTIONS.map(function (q, i) {
      var a = q.options[A.answers[i]], b = q.options[B.answers[i]];
      return { q: q, a: a, b: b, same: A.answers[i] === B.answers[i], diff: Math.abs(a.age - b.age) };
    });
    var sameCount = rows.filter(function (r) { return r.same; }).length;
    var meanDiff = mean(rows.map(function (r) { return r.diff; }));
    var compat = clamp(Math.round(100 - (meanDiff / 40) * 100), 0, 100);
    var alike = rows.filter(function (r) { return r.same; }).slice(0, 3);
    var unlike = rows.filter(function (r) { return !r.same; })
      .sort(function (x, y) { return y.diff - x.diff; }).slice(0, 3);

    function topicBlock(t) {
      var a = A.topics[t.id], b = B.topics[t.id];
      var line;
      if (Math.abs(a - b) <= 3) line = 'Empate técnico. Aquí piensan igual.';
      else {
        var older = a > b ? A : B, younger = older === A ? B : A;
        line = TOPIC_LINES[t.id](esc(older.name), esc(younger.name));
      }
      return '<div class="duo-topic">' +
        '<div class="label"><span>' + t.emoji + ' ' + t.label + '</span><span class="muted">' + a + ' vs ' + b + '</span></div>' +
        '<div class="duo-bars">' +
          '<div class="duo-bar a"><span class="who">' + esc(A.name) + '</span><div class="bar-track"><div class="bar-fill" data-w="' + pct(a) + '"></div></div><span class="n">' + a + '</span></div>' +
          '<div class="duo-bar b"><span class="who">' + esc(B.name) + '</span><div class="bar-track"><div class="bar-fill" data-w="' + pct(b) + '"></div></div><span class="n">' + b + '</span></div>' +
        '</div>' +
        '<p class="duo-line">' + line + '</p>' +
      '</div>';
    }

    function qItem(r, showBoth) {
      return '<li><div class="q">' + r.q.text + '</div>' +
        (showBoth
          ? '<div class="ans a"><b>' + esc(A.name) + ':</b> ' + r.a.text + ' <span class="muted">(' + r.a.age + ')</span></div>' +
            '<div class="ans b"><b>' + esc(B.name) + ':</b> ' + r.b.text + ' <span class="muted">(' + r.b.age + ')</span></div>'
          : '<div class="ans"><b>Ambos:</b> ' + r.a.text + '</div>') +
      '</li>';
    }

    var summary = '🧠 Edad mental: ' + A.name + ' ' + A.age + ' vs ' + B.name + ' ' + B.age +
      '. Compatibilidad mental: ' + compat + '%. Coincidimos en ' + sameCount + ' de ' + TOTAL + ' respuestas. Haz el test: ' + pageUrl();

    render(
      '<section class="screen compare">' +
        '<p class="kicker">Cara a cara</p>' +
        '<h2>' + esc(A.name) + '<span class="vs">vs</span>' + esc(B.name) + '</h2>' +
        '<div class="duo">' +
          '<div class="duo-card"><span class="duo-name">' + esc(A.name) + '</span><span class="duo-age">' + A.age + '</span><span class="duo-title">' + A.profile.title + '</span></div>' +
          '<div class="duo-card"><span class="duo-name">' + esc(B.name) + '</span><span class="duo-age">' + B.age + '</span><span class="duo-title">' + B.profile.title + '</span></div>' +
        '</div>' +
        '<p class="verdict">' + duoVerdict(A, B) + '</p>' +
        '<div class="compat">' +
          '<div class="compat-ring" style="--p:' + compat + '"><span>' + compat + '%</span></div>' +
          '<p><strong>' + compatLabel(compat) + '</strong>Compatibilidad mental. Coincidieron en ' + sameCount + ' de ' + TOTAL + ' respuestas.</p>' +
        '</div>' +
        '<h3>Por temas</h3>' +
        TOPICS.map(topicBlock).join('') +
        '<h3>Donde más se parecen</h3>' +
        (alike.length
          ? '<ul class="qlist">' + alike.map(function (r) { return qItem(r, false); }).join('') + '</ul>'
          : '<p class="muted">En ninguna pregunta. Impresionante. Eso también es una forma de compatibilidad.</p>') +
        '<h3>Donde más se diferencian</h3>' +
        (unlike.length
          ? '<ul class="qlist">' + unlike.map(function (r) { return qItem(r, true); }).join('') + '</ul>'
          : '<p class="muted">En nada. Respondieron exactamente igual. ¿Se pasaron las respuestas?</p>') +
        '<div class="actions">' +
          '<a class="btn wa" href="' + esc(waLink(summary)) + '" target="_blank" rel="noopener">Compartir el veredicto</a>' +
          '<button type="button" class="btn ghost" id="back-result">Volver a mi resultado</button>' +
          '<button type="button" class="btn ghost" id="restart">Empezar de nuevo</button>' +
        '</div>' +
      '</section>'
    );

    animateBars();
    $('#back-result').addEventListener('click', showResult);
    $('#restart').addEventListener('click', function () {
      state.answers = [];
      state.index = 0;
      state.me = null;
      showIntro();
    });
  }

  /* ---------- teclado: 1-4 o A-D para responder ---------- */
  document.addEventListener('keydown', function (e) {
    if (!$('.quiz')) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    var k = e.key.toLowerCase();
    var map = { '1': 0, '2': 1, '3': 2, '4': 3, 'a': 0, 'b': 1, 'c': 2, 'd': 3 };
    if (k in map) { e.preventDefault(); pick(map[k]); }
  });

  /* ---------- arranque ---------- */
  state.challenger = readHash();
  showIntro();
})();
