/* =====================================================================
   Autistómetro — lógica
   Solo frontend. Puntuación oficial del AQ: un punto por ítem, 0 a 50.
   El progreso se guarda en el navegador por si el celular se bloquea.
   ===================================================================== */
(function () {
  'use strict';

  const AQ = window.AQ;
  const N = AQ.items.length;
  const KEY = 'autistometro-v1';
  const app = document.getElementById('app');

  const AGREE = new Set(AQ.acuerdo);
  const MAX = 50;

  /* ---------- estado ---------- */
  function fresh() { return { v: 1, name: '', answers: [], index: 0, done: false }; }
  function load() {
    try { const s = JSON.parse(localStorage.getItem(KEY)); return s && s.v === 1 ? s : null; } catch (e) { return null; }
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* seguimos */ } }
  let S = load() || fresh();
  let me = null;         // resultado propio
  let challenger = null; // resultado de la otra persona (por enlace)

  /* ---------- utilidades ---------- */
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const $ = (sel) => app.querySelector(sel);
  const $$ = (sel) => Array.from(app.querySelectorAll(sel));
  const pct = (v) => Math.round((v / MAX) * 100);
  const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));

  /* ---------- puntuación ---------- */
  function pointFor(itemNo, answer) {
    const agree = answer <= 1;
    return AGREE.has(itemNo) ? (agree ? 1 : 0) : (agree ? 0 : 1);
  }
  function score(answers) {
    let total = 0;
    const subs = {};
    AQ.subescalas.forEach((s) => { subs[s.id] = 0; });
    answers.forEach((a, i) => {
      const no = i + 1, p = pointFor(no, a);
      total += p;
      AQ.subescalas.forEach((s) => { if (s.items.indexOf(no) !== -1) subs[s.id] += p; });
    });
    return { total, subs };
  }
  function franja(total) { return AQ.franjas.find((f) => total <= f.max) || AQ.franjas[AQ.franjas.length - 1]; }
  function nivel(v) { return v <= 3 ? 0 : v <= 6 ? 1 : 2; }
  function makeResult(name, answers) {
    const r = score(answers);
    return { name, answers: answers.slice(), total: r.total, subs: r.subs, franja: franja(r.total) };
  }

  /* ---------- enlace para comparar ---------- */
  function encode(r) {
    const raw = r.name + '|' + r.answers.join('');
    return btoa(unescape(encodeURIComponent(raw))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  function decode(s) {
    try {
      let b = s.replace(/-/g, '+').replace(/_/g, '/');
      while (b.length % 4) b += '=';
      const raw = decodeURIComponent(escape(atob(b)));
      const i = raw.lastIndexOf('|');
      if (i === -1) return null;
      const name = raw.slice(0, i).slice(0, 30) || 'Alguien', ans = raw.slice(i + 1);
      if (!new RegExp('^[0-3]{' + N + '}$').test(ans)) return null;
      return makeResult(name, ans.split('').map(Number));
    } catch (e) { return null; }
  }
  const pageUrl = () => location.href.split('#')[0];
  const challengeUrl = (r) => pageUrl() + '#r=' + encode(r);
  function readHash() { const m = location.hash.match(/[#&]r=([A-Za-z0-9_-]+)/); return m ? decode(m[1]) : null; }
  const waLink = (t) => 'https://wa.me/?text=' + encodeURIComponent(t);
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text).then(() => true, () => false);
    return Promise.resolve(false);
  }

  /* ---------- render ---------- */
  function render(html) {
    app.innerHTML = html;
    window.scrollTo(0, 0);
    const s = $('.screen');
    if (s) requestAnimationFrame(() => s.classList.add('in'));
  }
  function animateBars() {
    requestAnimationFrame(() => requestAnimationFrame(() => {
      $$('.bar-fill').forEach((b) => { b.style.width = b.getAttribute('data-w') + '%'; });
    }));
  }
  function countUp(node, to) {
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || to === 0) { node.textContent = to; return; }
    let start = null; const dur = 1100;
    const step = (ts) => {
      if (start === null) start = ts;
      const p = Math.min(1, (ts - start) / dur), e = 1 - Math.pow(1 - p, 3);
      node.textContent = Math.round(to * e);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  let sciOpen = false;
  function sciPanel() {
    return '<div class="sci-panel" id="sci-panel"' + (sciOpen ? '' : ' hidden') + '><p class="sci-title">🔬 De dónde salen los números</p>' +
      AQ.ciencia.map((c) => '<p class="sci-item">' + esc(c.texto) + ' <a href="' + esc(c.url) + '" target="_blank" rel="noopener">' + esc(c.fuente) + '</a></p>').join('') + '</div>';
  }
  function bindSci() {
    const b = $('#sci'), p = $('#sci-panel');
    if (b && p) b.addEventListener('click', () => { sciOpen = !sciOpen; p.hidden = !sciOpen; b.classList.toggle('on', sciOpen); });
  }

  /* ---------- pantalla: inicio ---------- */
  function showIntro() {
    const c = challenger;
    const resume = !S.done && S.answers.length > 0 && S.name;
    const saved = S.done && S.answers.length === N;
    render(
      '<section class="screen intro">' +
        '<p class="kicker">El AQ de Cambridge, el de verdad</p>' +
        '<h1>Autistó<em>metro</em></h1>' +
        '<p class="lead">Cincuenta afirmaciones del Cociente del Espectro Autista, con la traducción oficial. Mide rasgos que todo el mundo tiene en algún grado, y los pone en una regla de 0 a 50 con las marcas reales de la investigación.</p>' +
        '<ul class="meta"><li>50 afirmaciones</li><li>8 minutos</li><li>Instrumento validado</li></ul>' +
        '<div class="whatis">' +
          '<div><b>Qué es</b>Un cribado de rasgos del espectro usado en investigación y en clínica desde 2001.</div>' +
          '<div><b>Qué no es</b>Un diagnóstico. Eso lo hace un profesional con una evaluación completa.</div>' +
        '</div>' +
        (c ? '<div class="banner">🔔 <strong>' + esc(c.name) + '</strong> ya lo hizo y puntuó <strong>' + c.total + ' de 50</strong>. Haz el tuyo y al final verás la comparación.</div>' : '') +
        (resume ? '<div class="banner">Tienes un intento a medias: ' + S.answers.length + ' de ' + N + ' respondidas. <button type="button" class="link" id="resume">Continuar</button></div>' : '') +
        (saved ? '<div class="banner">Hay un resultado guardado de <strong>' + esc(S.name) + '</strong> en este celular. <button type="button" class="link" id="see">Verlo</button></div>' : '') +
        '<form id="start" autocomplete="off">' +
          '<label for="name">¿Cómo te llamas?</label>' +
          '<div class="chips"><button type="button" class="chip" data-name="Carlos">Soy Carlos</button><button type="button" class="chip" data-name="Karen">Soy Karen</button></div>' +
          '<input id="name" name="name" type="text" maxlength="30" placeholder="Tu nombre" required value="' + esc(S.name) + '">' +
          '<button class="btn primary" type="submit">Empezar</button>' +
        '</form>' +
        '<p class="instr" style="margin-top:18px">' + esc(AQ.instrucciones) + '</p>' +
        '<p class="disclaimer">Cuatro opciones por afirmación, sin punto medio a propósito: así lo diseñaron. <button type="button" class="icon small" id="sci" aria-label="De dónde salen los números">🔬</button></p>' +
        sciPanel() +
      '</section>'
    );
    $$('.chip[data-name]').forEach((b) => b.addEventListener('click', () => { $('#name').value = b.getAttribute('data-name'); $('#name').focus(); }));
    bindSci();
    const r = $('#resume'); if (r) r.addEventListener('click', () => { S.index = Math.min(S.answers.length, N - 1); save(); showQuestion(); });
    const v = $('#see'); if (v) v.addEventListener('click', () => { me = makeResult(S.name, S.answers); showResult(); });
    $('#start').addEventListener('submit', (e) => {
      e.preventDefault();
      const name = $('#name').value.trim();
      if (!name) { $('#name').focus(); return; }
      S = fresh(); S.name = name; save();
      showQuestion();
    });
  }

  /* ---------- pantalla: afirmación ---------- */
  function showQuestion() {
    const i = S.index, chosen = S.answers[i];
    render(
      '<section class="screen quiz">' +
        '<header class="quiz-head"><span class="tag">🔬 AQ</span><span class="counter">' + (i + 1) + ' / ' + N + '</span></header>' +
        '<div class="progress"><div class="progress-bar" style="width:' + ((i / N) * 100) + '%"></div></div>' +
        '<h2 class="question statement">' + esc(AQ.items[i]) + '</h2>' +
        '<div class="options">' +
          AQ.opciones.map((o, oi) => '<button type="button" class="option lk' + (chosen === oi ? ' selected' : '') + '" data-i="' + oi + '"><span class="key">' + (oi + 1) + '</span><span>' + esc(o) + '</span></button>').join('') +
        '</div>' +
        '<div class="quiz-foot"><button type="button" class="btn ghost" id="back">' + (i === 0 ? 'Volver al inicio' : '← Anterior') + '</button></div>' +
      '</section>'
    );
    $$('.option').forEach((b) => b.addEventListener('click', () => pick(+b.getAttribute('data-i'))));
    $('#back').addEventListener('click', () => { if (i === 0) showIntro(); else { S.index--; save(); showQuestion(); } });
  }
  function pick(oi) {
    if (!$('.quiz')) return;
    S.answers[S.index] = oi;
    $$('.option').forEach((b) => { b.disabled = true; b.classList.toggle('selected', +b.getAttribute('data-i') === oi); });
    setTimeout(() => {
      if (S.index + 1 < N) { S.index++; save(); showQuestion(); }
      else finish();
    }, 200);
  }
  function finish() {
    S.done = true; save();
    me = makeResult(S.name, S.answers);
    showResult();
  }

  /* ---------- piezas del resultado ---------- */
  function ruler(a, b) {
    const marks = AQ.marcas.map((m, k) => '<div class="mark' + (k % 2 ? ' m2' : '') + '" style="left:' + pct(m.v) + '%" title="' + esc(m.label) + '"><span>' + esc(m.sub) + '</span></div>').join('');
    const stack = !!b && Math.abs(a.total - b.total) <= 6;
    let dots = '<div class="me' + (stack ? ' low' : '') + '" style="left:' + pct(a.total) + '%" title="' + esc(a.name) + '"><small>' + esc(a.name) + '</small>' + a.total + '</div>';
    if (b) {
      dots += '<div class="me b' + (stack ? ' stack' : '') + '" style="left:' + pct(b.total) + '%" title="' + esc(b.name) + '"><small>' + esc(b.name) + '</small>' + b.total + '</div>';
    }
    return '<div class="ruler">' + marks + dots + '</div>';
  }
  function subList(r) {
    return '<ul class="topics">' + AQ.subescalas.map((s) => {
      const v = r.subs[s.id];
      return '<li><div class="sub-row"><span>' + esc(s.nombre) + '<span class="desc">' + esc(s.desc) + '</span></span><strong>' + v + ' / 10</strong></div>' +
        '<div class="bar-track"><div class="bar-fill" data-w="' + (v * 10) + '"></div></div>' +
        '<p class="topic-note">' + esc(s.niveles[nivel(v)]) + '</p></li>';
    }).join('') + '</ul>';
  }
  function finePrint() {
    return '<div class="fine"><b>Letra pequeña.</b> ' + AQ.letraPequena.map(esc).join(' ') + '</div>' +
      '<p class="credits">' + esc(AQ.creditos) + ' <a href="https://www.autismresearchcentre.com/tests/" target="_blank" rel="noopener">Autism Research Centre</a>.</p>';
  }
  function shareText(r) {
    return '🔬 Autistómetro: puntué ' + r.total + ' de 50 en el AQ («' + r.franja.titulo + '»). La media de la población ronda 17. Haz el tuyo y al final comparamos: ' + challengeUrl(r);
  }

  /* ---------- pantalla: resultado ---------- */
  function showResult() {
    const r = me, c = challenger;
    const canCompare = c && c.answers.length === N;
    render(
      '<section class="screen result">' +
        '<p class="kicker">' + esc(r.name) + ', tu puntaje en el AQ es</p>' +
        '<div class="big-age"><span class="num" id="num">0</span><span class="unit">de 50</span></div>' +
        ruler(r, null) +
        '<div class="band"><h2>' + esc(r.franja.titulo) + '</h2><p>' + esc(r.franja.texto) + '</p></div>' +
        '<p class="ref">Marcas de la regla: <b>≈ 17</b> media de población general · <b>26</b> umbral clínico · <b>32</b> corte original · <b>≈ 35</b> media de adultos autistas. <button type="button" class="icon small" id="sci" aria-label="De dónde salen los números">🔬</button></p>' +
        sciPanel() +
        '<h3>Por subescalas</h3>' +
        subList(r) +
        '<div class="actions">' +
          (canCompare ? '<button type="button" class="btn accent" id="compare">Comparar con ' + esc(c.name) + ' →</button>' : '') +
          '<button type="button" class="btn primary" id="challenge">Desafiar a alguien</button>' +
          '<button type="button" class="btn ghost" id="restart">Repetir</button>' +
        '</div>' +
        '<div class="share-panel" id="share" hidden>' +
          '<p>Manda este enlace. Cuando esa persona termine, verá la comparación con tu resultado.</p>' +
          '<div class="share-url">' + esc(challengeUrl(r)) + '</div>' +
          '<button type="button" class="btn ghost" id="copy">Copiar enlace</button>' +
          '<a class="btn wa" href="' + esc(waLink(shareText(r))) + '" target="_blank" rel="noopener">Enviar por WhatsApp</a>' +
          '<p class="toast" id="toast"></p>' +
        '</div>' +
        finePrint() +
      '</section>'
    );
    countUp($('#num'), r.total);
    animateBars();
    bindSci();
    if (canCompare) $('#compare').addEventListener('click', showCompare);
    $('#challenge').addEventListener('click', () => { const p = $('#share'); p.hidden = !p.hidden; if (!p.hidden) p.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); });
    $('#copy').addEventListener('click', () => copyText(challengeUrl(r)).then((ok) => { $('#toast').textContent = ok ? '✓ Enlace copiado.' : 'No se pudo copiar; selecciona el enlace y cópialo a mano.'; }));
    $('#restart').addEventListener('click', () => { const name = S.name; S = fresh(); S.name = name; save(); me = null; showIntro(); });
  }

  /* ---------- pantalla: comparación ---------- */
  const LINES = {
    social: (hi, lo) => lo + ' abre la conversación; ' + hi + ' la sostiene cuando ya se puso interesante.',
    atencion: (hi, lo) => hi + ' necesita el plan; ' + lo + ' lo cambia por el camino.',
    detalle: (hi, lo) => hi + ' nota lo que nadie nota; ' + lo + ' nota que ' + hi + ' lo notó.',
    comunicacion: (hi, lo) => lo + ' lee las indirectas; ' + hi + ' agradece que se las digan directas.',
    imaginacion: (hi, lo) => lo + ' inventa la historia; ' + hi + ' comprueba que cuadre.'
  };
  function verdict(A, B) {
    const d = Math.abs(A.total - B.total);
    const hi = A.total >= B.total ? A : B, lo = hi === A ? B : A;
    if (d <= 3) return 'Prácticamente el mismo puntaje. Lo que cambia es de qué está hecho: miren las subescalas.';
    if (d <= 8) return esc(hi.name) + ' tiene algo más de rasgos que ' + esc(lo.name) + ': ' + d + ' puntos de diferencia. Suficiente para notarse, no para discutir.';
    return 'Hay una diferencia clara: ' + d + ' puntos. ' + esc(hi.name) + ' y ' + esc(lo.name) + ' procesan el mundo de formas distintas, y las subescalas dicen en qué.';
  }
  function showCompare() {
    const A = challenger, B = me;
    if (!A || !B) { showIntro(); return; }
    const agree = (x) => x <= 1;
    const rows = AQ.items.map((q, i) => ({ i, q, a: A.answers[i], b: B.answers[i], same: agree(A.answers[i]) === agree(B.answers[i]), diff: Math.abs(A.answers[i] - B.answers[i]) }));
    const sameCount = rows.filter((r) => r.same).length;
    const opposite = rows.filter((r) => !r.same).sort((x, y) => y.diff - x.diff).slice(0, 8);

    const subBlock = (s) => {
      const a = A.subs[s.id], b = B.subs[s.id];
      let line;
      if (Math.abs(a - b) <= 1) line = 'Empate. Aquí funcionan igual.';
      else { const hi = a > b ? A : B, lo = hi === A ? B : A; line = LINES[s.id](esc(hi.name), esc(lo.name)); }
      return '<div class="duo-topic"><div class="label"><span>' + esc(s.nombre) + '</span><span class="muted">' + a + ' vs ' + b + '</span></div>' +
        '<div class="duo-bars">' +
          '<div class="duo-bar a"><span class="who">' + esc(A.name) + '</span><div class="bar-track"><div class="bar-fill" data-w="' + (a * 10) + '"></div></div><span class="n">' + a + '</span></div>' +
          '<div class="duo-bar b"><span class="who">' + esc(B.name) + '</span><div class="bar-track"><div class="bar-fill" data-w="' + (b * 10) + '"></div></div><span class="n">' + b + '</span></div>' +
        '</div><p class="duo-line">' + line + '</p></div>';
    };
    const summary = '🔬 Autistómetro: ' + A.name + ' ' + A.total + ' vs ' + B.name + ' ' + B.total + ' de 50. Respondimos del mismo lado en ' + sameCount + ' de ' + N + ' afirmaciones. Haz el tuyo: ' + pageUrl();

    render(
      '<section class="screen compare">' +
        '<p class="kicker">Cara a cara</p>' +
        '<h2>' + esc(A.name) + '<span class="vs">vs</span>' + esc(B.name) + '</h2>' +
        '<div class="duo">' +
          '<div class="duo-card"><span class="duo-name">' + esc(A.name) + '</span><span class="duo-age">' + A.total + '</span><span class="duo-title">' + esc(A.franja.titulo) + '</span></div>' +
          '<div class="duo-card"><span class="duo-name">' + esc(B.name) + '</span><span class="duo-age">' + B.total + '</span><span class="duo-title">' + esc(B.franja.titulo) + '</span></div>' +
        '</div>' +
        ruler(A, B) +
        '<p class="ref">Marcas: <b>≈ 17</b> media de población · <b>26</b> umbral clínico · <b>32</b> corte original · <b>≈ 35</b> media de adultos autistas.</p>' +
        '<p class="verdict">' + verdict(A, B) + '</p>' +
        '<p class="coin">Respondieron del mismo lado en <b>' + sameCount + ' de ' + N + '</b> afirmaciones.</p>' +
        '<h3>Por subescalas</h3>' +
        AQ.subescalas.map(subBlock).join('') +
        '<h3>Donde respondieron al revés</h3>' +
        (opposite.length
          ? '<ul class="opp">' + opposite.map((r) => '<li><div class="q">' + (r.i + 1) + '. ' + esc(r.q) + '</div>' +
              '<div class="ans a"><b>' + esc(A.name) + ':</b> ' + esc(AQ.opciones[r.a]) + '</div>' +
              '<div class="ans b"><b>' + esc(B.name) + ':</b> ' + esc(AQ.opciones[r.b]) + '</div></li>').join('') + '</ul>'
          : '<p class="muted">En ninguna. Respondieron del mismo lado las cincuenta veces. Sospechoso.</p>') +
        '<div class="actions">' +
          '<a class="btn wa" href="' + esc(waLink(summary)) + '" target="_blank" rel="noopener">Compartir el veredicto</a>' +
          '<button type="button" class="btn ghost" id="back-result">Volver a mi resultado</button>' +
        '</div>' +
        finePrint() +
      '</section>'
    );
    animateBars();
    $('#back-result').addEventListener('click', showResult);
  }

  /* ---------- teclado: 1-4 ---------- */
  document.addEventListener('keydown', (e) => {
    if (!$('.quiz') || e.metaKey || e.ctrlKey || e.altKey) return;
    const k = { '1': 0, '2': 1, '3': 2, '4': 3 }[e.key];
    if (k !== undefined) { e.preventDefault(); pick(k); }
  });

  /* ---------- arranque ---------- */
  challenger = readHash();
  if (S.done && S.answers.length === N && !challenger) { me = makeResult(S.name, S.answers); showResult(); }
  else showIntro();
})();
