/* =====================================================================
   Neurodivergencia — lógica
   Tres instrumentos reales: AQ (autismo), ASRS v1.1 (TDAH) y CAT-Q
   (camuflaje). Solo frontend. El progreso se guarda en el navegador.
   ===================================================================== */
(function () {
  'use strict';

  /* ---------- instrumentos ---------- */
  const AQ = window.AQ;
  Object.assign(AQ, {
    id: 'aq', emoji: '🔬', nombre: 'Autistómetro', titulo: 'Cociente del Espectro Autista (AQ)', corto: 'AQ',
    sub: 'El AQ de Cambridge, el de verdad. 50 afirmaciones, 8 minutos.', min: '8 min', traduccionProvisional: false
  });
  const T = { aq: AQ, asrs: window.ASRS, catq: window.CATQ };
  const ORDER = ['aq', 'asrs', 'catq'];

  const KEY = 'neuro-v1';
  const OLD_KEY = 'autistometro-v1';
  const app = document.getElementById('app');

  /* ---------- estado ---------- */
  const freshTest = () => ({ answers: [], index: 0, done: false });
  function fresh() { return { v: 1, name: '', tests: { aq: freshTest(), asrs: freshTest(), catq: freshTest() } }; }
  function load() {
    try {
      const s = JSON.parse(localStorage.getItem(KEY));
      if (s && s.v === 1) return s;
      const old = JSON.parse(localStorage.getItem(OLD_KEY));
      if (old && old.v === 1) {
        const n = fresh(); n.name = old.name || ''; n.tests.aq = { answers: old.answers || [], index: old.index || 0, done: !!old.done };
        return n;
      }
    } catch (e) { /* nada guardado */ }
    return null;
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* seguimos */ } }
  let S = load() || fresh();
  let challenger = null;   // { name, results: { aq?, asrs?, catq? } }
  let current = 'aq';
  let sciOpen = false;

  /* ---------- utilidades ---------- */
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const $ = (sel) => app.querySelector(sel);
  const $$ = (sel) => Array.from(app.querySelectorAll(sel));
  const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
  const done = (id) => S.tests[id].done && S.tests[id].answers.length === T[id].items.length;

  /* ---------- puntuación ---------- */
  const AGREE = new Set(AQ.acuerdo);
  function scoreAQ(answers) {
    let total = 0; const subs = {};
    AQ.subescalas.forEach((s) => { subs[s.id] = 0; });
    answers.forEach((a, i) => {
      const no = i + 1, p = AGREE.has(no) ? (a <= 1 ? 1 : 0) : (a <= 1 ? 0 : 1);
      total += p;
      AQ.subescalas.forEach((s) => { if (s.items.indexOf(no) !== -1) subs[s.id] += p; });
    });
    return { total, subs, franja: AQ.franjas.find((f) => total <= f.max) };
  }
  function scoreASRS(answers) {
    const R = T.asrs, shaded = answers.map((a, i) => a >= R.umbral[i]);
    const a = R.parteA.filter((no) => shaded[no - 1]).length;
    const b = shaded.filter((x, i) => i >= 6 && x).length;
    const dom = {};
    R.dominios.forEach((d) => { dom[d.id] = d.items.filter((no) => shaded[no - 1]).length; });
    return { a, b, dom, shaded, positivo: a >= R.corteA, franja: R.franjasA.find((f) => a <= f.max) };
  }
  function scoreCATQ(answers) {
    const R = T.catq, inv = new Set(R.invertidos);
    let total = 0; const subs = {};
    R.subescalas.forEach((s) => { subs[s.id] = 0; });
    answers.forEach((a, i) => {
      const no = i + 1, v = inv.has(no) ? 8 - (a + 1) : a + 1;
      total += v;
      R.subescalas.forEach((s) => { if (s.items.indexOf(no) !== -1) subs[s.id] += v; });
    });
    return { total, subs, franja: R.franjas.find((f) => total <= f.max) };
  }
  const SCORE = { aq: scoreAQ, asrs: scoreASRS, catq: scoreCATQ };
  function result(id, answers) { return Object.assign({ id, answers: answers.slice() }, SCORE[id](answers)); }
  function myResults() {
    const r = {};
    ORDER.forEach((id) => { if (done(id)) r[id] = result(id, S.tests[id].answers); });
    return r;
  }
  const headline = (r) => r.id === 'aq' ? r.total + ' de 50' : r.id === 'asrs' ? 'parte A ' + r.a + ' de 6' : r.total + ' de 175';

  /* ---------- enlace para comparar ---------- */
  function encodeProfile(name, results) {
    const parts = [name];
    ORDER.forEach((id) => { if (results[id]) parts.push(id + '=' + results[id].answers.join('')); });
    return btoa(unescape(encodeURIComponent(parts.join('|')))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  function b64(s) { let b = s.replace(/-/g, '+').replace(/_/g, '/'); while (b.length % 4) b += '='; return decodeURIComponent(escape(atob(b))); }
  function decodeProfile(s) {
    try {
      const parts = b64(s).split('|'), name = (parts.shift() || 'Alguien').slice(0, 30), results = {};
      parts.forEach((p) => {
        const i = p.indexOf('='); if (i === -1) return;
        const id = p.slice(0, i), ans = p.slice(i + 1), t = T[id];
        if (!t || !new RegExp('^[0-' + (t.opciones.length - 1) + ']{' + t.items.length + '}$').test(ans)) return;
        results[id] = result(id, ans.split('').map(Number));
      });
      return Object.keys(results).length ? { name, results } : null;
    } catch (e) { return null; }
  }
  function decodeLegacy(s) {
    try {
      const raw = b64(s), i = raw.lastIndexOf('|');
      if (i === -1) return null;
      const name = raw.slice(0, i).slice(0, 30) || 'Alguien', ans = raw.slice(i + 1);
      if (!/^[0-3]{50}$/.test(ans)) return null;
      return { name, results: { aq: result('aq', ans.split('').map(Number)) } };
    } catch (e) { return null; }
  }
  function readHash() {
    let m = location.hash.match(/[#&]p=([A-Za-z0-9_-]+)/);
    if (m) return decodeProfile(m[1]);
    m = location.hash.match(/[#&]r=([A-Za-z0-9_-]+)/);
    return m ? decodeLegacy(m[1]) : null;
  }
  const pageUrl = () => location.href.split('#')[0];
  const profileUrl = () => pageUrl() + '#p=' + encodeProfile(S.name, myResults());
  const waLink = (t) => 'https://wa.me/?text=' + encodeURIComponent(t);
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text).then(() => true, () => false);
    return Promise.resolve(false);
  }
  function shareText() {
    const r = myResults(), bits = ORDER.filter((id) => r[id]).map((id) => T[id].nombre + ' ' + headline(r[id]));
    return '🧬 Neurodivergencia · ' + S.name + ': ' + bits.join(' · ') + '. Haz los tuyos y al final comparamos: ' + profileUrl();
  }

  /* ---------- render ---------- */
  function render(html) {
    app.innerHTML = html;
    window.scrollTo(0, 0);
    const s = $('.screen');
    if (s) requestAnimationFrame(() => s.classList.add('in'));
  }
  function animateBars() {
    requestAnimationFrame(() => requestAnimationFrame(() => { $$('.bar-fill').forEach((b) => { b.style.width = b.getAttribute('data-w') + '%'; }); }));
  }
  function countUp(node, to) {
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || to === 0) { node.textContent = to; return; }
    let start = null; const dur = 1000;
    const step = (ts) => {
      if (start === null) start = ts;
      const p = Math.min(1, (ts - start) / dur), e = 1 - Math.pow(1 - p, 3);
      node.textContent = Math.round(to * e);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  function sciPanel(items, title) {
    return '<div class="sci-panel" id="sci-panel"' + (sciOpen ? '' : ' hidden') + '><p class="sci-title">🔬 ' + (title || 'De dónde salen los números') + '</p>' +
      items.map((c) => '<p class="sci-item">' + esc(c.texto) + ' <a href="' + esc(c.url) + '" target="_blank" rel="noopener">' + esc(c.fuente) + '</a></p>').join('') + '</div>';
  }
  function bindSci() {
    const b = $('#sci'), p = $('#sci-panel');
    if (b && p) b.addEventListener('click', () => { sciOpen = !sciOpen; p.hidden = !sciOpen; b.classList.toggle('on', sciOpen); });
  }
  const sciBtn = '<button type="button" class="icon small" id="sci" aria-label="De dónde salen los números">🔬</button>';
  const btn = (id, label, cls) => '<button type="button" class="btn ' + (cls || 'primary') + '" id="' + id + '">' + label + '</button>';
  function finePrint(t) {
    return '<div class="fine"><b>Letra pequeña.</b> ' + t.letraPequena.map(esc).join(' ') + '</div><p class="credits">' + esc(t.creditos) + '</p>';
  }
  function ruler(min, max, marcas, a, b, fmt) {
    const pct = (v) => Math.round(((clamp(v, min, max) - min) / (max - min)) * 100);
    const marks = marcas.map((m, k) => '<div class="mark' + (k % 2 ? ' m2' : '') + '" style="left:' + pct(m.v) + '%" title="' + esc(m.label) + '"><span>' + esc(m.sub) + '</span></div>').join('');
    const near = (max - min) * 0.12;
    const stack = !!b && Math.abs(a.v - b.v) <= near;
    let dots = '<div class="me' + (stack ? ' low' : '') + '" style="left:' + pct(a.v) + '%"><small>' + esc(a.name) + '</small>' + (fmt ? fmt(a.v) : a.v) + '</div>';
    if (b) dots += '<div class="me b' + (stack ? ' stack' : '') + '" style="left:' + pct(b.v) + '%"><small>' + esc(b.name) + '</small>' + (fmt ? fmt(b.v) : b.v) + '</div>';
    return '<div class="ruler">' + marks + dots + '</div>';
  }
  function bars(subs, vals, maxOf, nivelOf) {
    return '<ul class="topics">' + subs.map((s) => {
      const v = vals[s.id], mx = maxOf(s), lv = nivelOf(s, v);
      return '<li><div class="sub-row"><span>' + esc(s.nombre) + '<span class="desc">' + esc(s.desc) + '</span></span><strong>' + v + ' / ' + mx + '</strong></div>' +
        '<div class="bar-track"><div class="bar-fill" data-w="' + Math.round((v / mx) * 100) + '"></div></div>' +
        '<p class="topic-note">' + esc(s.niveles[lv]) + '</p></li>';
    }).join('') + '</ul>';
  }
  const nivelAQ = (s, v) => (v <= 3 ? 0 : v <= 6 ? 1 : 2);
  const nivelASRS = (s, v) => (v <= 2 ? 0 : v <= 5 ? 1 : 2);
  const nivelCATQ = (s, v) => { const p = (v - s.rango[0]) / (s.rango[1] - s.rango[0]); return p < 0.4 ? 0 : p < 0.7 ? 1 : 2; };

  /* ---------- pantalla: inicio ---------- */
  function showIntro() {
    render(
      '<section class="screen intro">' +
        '<p class="kicker">Tres instrumentos reales. Cero inventados.</p>' +
        '<h1>Neuro<em>divergencia</em></h1>' +
        '<p class="lead">El Autistómetro, el cribado de TDAH de la OMS y el cuestionario de camuflaje. Cada uno da su propio resultado, y al final los tres se comparan entre dos.</p>' +
        '<ul class="meta"><li>3 instrumentos</li><li>15 minutos en total</li><li>Cada uno por separado</li></ul>' +
        '<div class="whatis"><div><b>Qué es</b>Cribados usados en investigación y en clínica, con su puntuación oficial y sus fuentes.</div><div><b>Qué no es</b>Un diagnóstico. Eso lo hace un profesional con una evaluación completa.</div></div>' +
        (challenger ? '<div class="banner">🔔 <strong>' + esc(challenger.name) + '</strong> ya hizo ' + Object.keys(challenger.results).length + (Object.keys(challenger.results).length === 1 ? ' instrumento' : ' instrumentos') + '. Haz los tuyos y al final verás la comparación.</div>' : '') +
        '<form id="start" autocomplete="off">' +
          '<label for="name">¿Cómo te llamas?</label>' +
          '<div class="chips"><button type="button" class="chip" data-name="Carlos">Soy Carlos</button><button type="button" class="chip" data-name="Karen">Soy Karen</button></div>' +
          '<input id="name" name="name" type="text" maxlength="30" placeholder="Tu nombre" required value="' + esc(S.name) + '">' +
          btn('open', 'Entrar') +
        '</form>' +
      '</section>'
    );
    $$('.chip[data-name]').forEach((b) => b.addEventListener('click', () => { $('#name').value = b.getAttribute('data-name'); $('#name').focus(); }));
    const go = (e) => { e.preventDefault(); const n = $('#name').value.trim(); if (!n) { $('#name').focus(); return; } S.name = n; save(); showHub(); };
    $('#start').addEventListener('submit', go);
    $('#open').addEventListener('click', go);
  }

  /* ---------- pantalla: hub ---------- */
  function showHub() {
    sciOpen = false;
    const mine = myResults(), nDone = Object.keys(mine).length;
    const rows = ORDER.map((id, k) => {
      const t = T[id], st = S.tests[id];
      let status, cls = '';
      if (done(id)) { status = headline(result(id, st.answers)); cls = ' ok'; }
      else if (st.answers.length) { status = st.answers.length + ' de ' + t.items.length; cls = ' live'; }
      else status = t.min;
      return '<button type="button" class="menu-row" data-id="' + id + '"><span class="menu-emoji">' + t.emoji + '</span>' +
        '<span class="menu-text"><span class="menu-name">' + (k + 1) + '. ' + esc(t.nombre) + ' <em>' + esc(t.titulo) + '</em></span><span class="menu-sub">' + esc(t.sub) + '</span></span>' +
        '<span class="status' + cls + '">' + esc(status) + '</span></button>';
    }).join('');
    const common = challenger ? ORDER.filter((id) => mine[id] && challenger.results[id]) : [];
    render(
      '<section class="screen menu">' +
        '<p class="kicker">' + esc(S.name) + ' · Neurodivergencia</p>' +
        '<h1>Tres instrumentos</h1>' +
        '<p class="lead">En el orden que quieras. Cada uno guarda su progreso si el celular se bloquea.</p>' +
        (challenger ? '<div class="banner">🔔 <strong>' + esc(challenger.name) + '</strong> ya hizo: ' + Object.keys(challenger.results).map((id) => T[id].nombre).join(', ') + '.' + (common.length ? ' Ya pueden comparar ' + (common.length === 1 ? 'uno.' : common.length + '.') : '') + '</div>' : '') +
        '<div class="menu-list">' + rows + '</div>' +
        '<div class="actions">' +
          (nDone ? btn('perfil', 'Ver mi perfil' + (nDone < 3 ? ' (' + nDone + ' de 3)' : '')) : '') +
          (common.length ? btn('compare', 'Comparar con ' + esc(challenger.name) + ' →', 'accent') : '') +
        '</div>' +
        '<div class="menu-foot"><button type="button" class="link" id="nombre">Cambiar nombre</button><button type="button" class="link danger" id="reset">Borrar todo</button></div>' +
      '</section>'
    );
    $$('.menu-row').forEach((b) => b.addEventListener('click', () => {
      const id = b.getAttribute('data-id');
      if (done(id)) showResult(id);
      else { current = id; S.tests[id].index = Math.min(S.tests[id].answers.length, T[id].items.length - 1); save(); showQuestion(); }
    }));
    const p = $('#perfil'); if (p) p.addEventListener('click', showPerfil);
    const c = $('#compare'); if (c) c.addEventListener('click', showCompare);
    $('#nombre').addEventListener('click', showIntro);
    $('#reset').addEventListener('click', () => { if (confirm('¿Borrar los tres resultados y empezar de cero?')) { S = fresh(); save(); showIntro(); } });
  }

  /* ---------- pantalla: pregunta ---------- */
  function showQuestion() {
    const id = current, t = T[id], st = S.tests[id], i = st.index, n = t.items.length, chosen = st.answers[i];
    render(
      '<section class="screen quiz">' +
        '<header class="quiz-head"><span class="tag">' + t.emoji + ' ' + esc(t.corto) + '</span><span class="counter">' + (i + 1) + ' / ' + n + '</span></header>' +
        '<div class="progress"><div class="progress-bar" style="width:' + ((i / n) * 100) + '%"></div></div>' +
        (i === 0 ? '<p class="instr">' + esc(t.instrucciones) + '</p>' : '') +
        (t.traduccionProvisional && i === 0 ? '<p class="prov">Traducción provisional del original en inglés; pendiente la versión oficial en español.</p>' : '') +
        '<h2 class="question statement">' + esc(t.items[i]) + '</h2>' +
        '<div class="options' + (t.opciones.length > 4 ? ' compact' : '') + '">' +
          t.opciones.map((o, oi) => '<button type="button" class="option lk' + (chosen === oi ? ' selected' : '') + '" data-i="' + oi + '"><span class="key">' + (oi + 1) + '</span><span>' + esc(o) + '</span></button>').join('') +
        '</div>' +
        '<div class="quiz-foot"><button type="button" class="btn ghost" id="back">' + (i === 0 ? 'Volver al menú' : '← Anterior') + '</button></div>' +
      '</section>'
    );
    $$('.option').forEach((b) => b.addEventListener('click', () => pick(+b.getAttribute('data-i'))));
    $('#back').addEventListener('click', () => { if (i === 0) showHub(); else { st.index--; save(); showQuestion(); } });
  }
  function pick(oi) {
    if (!$('.quiz')) return;
    const id = current, st = S.tests[id], n = T[id].items.length;
    st.answers[st.index] = oi;
    $$('.option').forEach((b) => { b.disabled = true; b.classList.toggle('selected', +b.getAttribute('data-i') === oi); });
    setTimeout(() => {
      if (st.index + 1 < n) { st.index++; save(); showQuestion(); }
      else { st.done = true; save(); showResult(id); }
    }, 180);
  }

  /* ---------- resultados ---------- */
  function resultActions(id) {
    const nDone = Object.keys(myResults()).length;
    return '<div class="actions">' +
      btn('perfil', nDone === 3 ? 'Ver mi perfil completo' : 'Ver mi perfil (' + nDone + ' de 3)') +
      btn('menu', nDone === 3 ? 'Volver al menú' : 'Seguir con el siguiente', 'accent') +
      btn('restart', 'Repetir este instrumento', 'ghost') +
      '</div>';
  }
  function bindResultActions(id) {
    $('#perfil').addEventListener('click', showPerfil);
    $('#menu').addEventListener('click', showHub);
    $('#restart').addEventListener('click', () => { S.tests[id] = freshTest(); save(); current = id; showQuestion(); });
    bindSci();
    animateBars();
  }

  function showResult(id) {
    sciOpen = false;
    const r = result(id, S.tests[id].answers);
    if (id === 'aq') return showResultAQ(r);
    if (id === 'asrs') return showResultASRS(r);
    return showResultCATQ(r);
  }

  function showResultAQ(r) {
    render(
      '<section class="screen result">' +
        '<p class="kicker">' + esc(S.name) + ', tu puntaje en el AQ es</p>' +
        '<div class="big-age"><span class="num" id="num">0</span><span class="unit">de 50</span></div>' +
        ruler(0, 50, AQ.marcas, { v: r.total, name: S.name }, null) +
        '<div class="band"><h2>' + esc(r.franja.titulo) + '</h2><p>' + esc(r.franja.texto) + '</p></div>' +
        '<p class="ref">Marcas: <b>≈ 17</b> media de población general · <b>26</b> umbral clínico · <b>32</b> corte original · <b>≈ 35</b> media de adultos autistas. ' + sciBtn + '</p>' +
        sciPanel(AQ.ciencia) +
        '<h3>Por subescalas</h3>' + bars(AQ.subescalas, r.subs, () => 10, nivelAQ) +
        resultActions('aq') + finePrint(AQ) +
      '</section>'
    );
    countUp($('#num'), r.total);
    bindResultActions('aq');
  }

  function showResultASRS(r) {
    const R = T.asrs;
    const boxes = (nos, cls) => '<div class="boxes">' + nos.map((no) => '<div class="box ' + cls + (r.shaded[no - 1] ? ' on' : '') + '">' + no + '</div>').join('') + '</div>';
    render(
      '<section class="screen result">' +
        '<p class="kicker">' + esc(S.name) + ', en la parte A del ASRS tienes</p>' +
        '<div class="big-age"><span class="num" id="num">0</span><span class="unit">casillas de 6</span></div>' +
        boxes(R.parteA, 'a') +
        '<div class="band"><h2>' + esc(r.franja.titulo) + '</h2><p>' + esc(r.franja.texto) + '</p></div>' +
        '<p class="ref">El cribado es positivo con <b>4 o más</b> casillas sombreadas en la parte A. ' + sciBtn + '</p>' +
        sciPanel(R.ciencia) +
        '<h3>Parte B: ' + r.b + ' casillas de 12</h3>' +
        boxes([7, 8, 9, 10, 11, 12], 'b') + boxes([13, 14, 15, 16, 17, 18], 'b') +
        '<p class="muted small">La parte B no tiene punto de corte: muestra qué síntomas aparecen con una frecuencia que llama la atención.</p>' +
        '<h3>Por dominios</h3>' + bars(R.dominios, r.dom, () => 9, nivelASRS) +
        resultActions('asrs') + finePrint(R) +
      '</section>'
    );
    countUp($('#num'), r.a);
    bindResultActions('asrs');
  }

  function showResultCATQ(r) {
    const R = T.catq;
    render(
      '<section class="screen result">' +
        '<p class="kicker">' + esc(S.name) + ', tu puntaje de camuflaje es</p>' +
        '<div class="big-age"><span class="num" id="num">0</span><span class="unit">de 175</span></div>' +
        ruler(R.escalaMin, R.escalaMax, R.marcas, { v: r.total, name: S.name }, null) +
        '<div class="band"><h2>' + esc(r.franja.titulo) + '</h2><p>' + esc(r.franja.texto) + '</p></div>' +
        '<p class="ref">Marcas: <b>≈ 91</b> media de mujeres no autistas · <b>≈ 97</b> hombres no autistas · <b>100</b> corte · <b>≈ 110</b> hombres autistas · <b>≈ 124</b> mujeres autistas. ' + sciBtn + '</p>' +
        sciPanel(R.ciencia) +
        '<h3>Por subescalas</h3>' + bars(R.subescalas, r.subs, (s) => s.rango[1], nivelCATQ) +
        resultActions('catq') + finePrint(R) +
      '</section>'
    );
    countUp($('#num'), r.total);
    bindResultActions('catq');
  }

  /* ---------- perfil ---------- */
  function perfilCards(results, pendingLabel) {
    return '<div class="perfil">' + ORDER.map((id) => {
      const t = T[id], r = results[id];
      if (!r) return '<div class="perfil-card pending"><span class="pc-emoji">' + t.emoji + '</span><span><span class="pc-name">' + esc(t.nombre) + '</span><br><span class="pc-sub">' + esc(pendingLabel) + '</span></span><span class="pc-num">pendiente</span></div>';
      const num = id === 'asrs' ? r.a + ' de 6' : headline(r);
      return '<div class="perfil-card"><span class="pc-emoji">' + t.emoji + '</span><span><span class="pc-name">' + esc(t.nombre) + (id === 'asrs' ? ' <span class="pc-sub">parte A</span>' : '') + '</span><br><span class="pc-sub">' + esc(r.franja.titulo) + '</span></span><span class="pc-num">' + esc(num) + '</span></div>';
    }).join('') + '</div>';
  }
  function cruce(m) {
    const aq = m.aq.total, cq = m.catq.total;
    if (aq < 26 && cq >= 100) return 'Cruce que vale la pena mirar: AQ por debajo del umbral clínico y camuflaje por encima del corte. Es exactamente la combinación en la que el AQ se queda corto.';
    if (aq >= 26 && cq >= 100) return 'AQ en zona de evaluación y camuflaje alto: muchos rasgos, y mucho esfuerzo en taparlos. Si algo merece una conversación con un profesional, es esto.';
    if (aq >= 26 && cq < 100) return 'AQ en zona de evaluación y camuflaje en rango habitual: los rasgos están, y no los tapas especialmente.';
    return 'AQ y camuflaje en rangos habituales: lo que se ve es lo que hay.';
  }
  function showPerfil() {
    const mine = myResults(), nDone = Object.keys(mine).length;
    const common = challenger ? ORDER.filter((id) => mine[id] && challenger.results[id]) : [];
    render(
      '<section class="screen result">' +
        '<p class="kicker">Perfil de ' + esc(S.name) + '</p>' +
        '<h1>' + (nDone === 3 ? 'Los tres' : nDone + ' de 3') + '</h1>' +
        perfilCards(mine, 'Todavía no lo has hecho') +
        (mine.aq && mine.catq ? '<p class="ref" style="margin-top:14px">' + esc(cruce(mine)) + '</p>' : '') +
        '<div class="actions">' +
          (common.length ? btn('compare', 'Comparar con ' + esc(challenger.name) + ' →', 'accent') : '') +
          btn('challenge', 'Desafiar a alguien') +
          btn('menu', 'Volver al menú', 'ghost') +
        '</div>' +
        '<div class="share-panel" id="share" hidden>' +
          '<p>Manda este enlace. Lleva ' + (nDone === 1 ? 'tu resultado' : 'tus ' + nDone + ' resultados') + '. Cuando esa persona termine los suyos, verá la comparación.</p>' +
          '<div class="share-url">' + esc(profileUrl()) + '</div>' +
          '<button type="button" class="btn ghost" id="copy">Copiar enlace</button>' +
          '<a class="btn wa" href="' + esc(waLink(shareText())) + '" target="_blank" rel="noopener">Enviar por WhatsApp</a>' +
          '<p class="toast" id="toast"></p>' +
        '</div>' +
      '</section>'
    );
    const c = $('#compare'); if (c) c.addEventListener('click', showCompare);
    $('#challenge').addEventListener('click', () => { const p = $('#share'); p.hidden = !p.hidden; if (!p.hidden) p.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); });
    $('#copy').addEventListener('click', () => copyText(profileUrl()).then((ok) => { $('#toast').textContent = ok ? '✓ Enlace copiado.' : 'No se pudo copiar; selecciona el enlace y cópialo a mano.'; }));
    $('#menu').addEventListener('click', showHub);
  }

  /* ---------- comparación ---------- */
  const LINES = {
    aq: {
      social: (hi, lo) => lo + ' abre la conversación; ' + hi + ' la sostiene cuando ya se puso interesante.',
      atencion: (hi, lo) => hi + ' necesita el plan; ' + lo + ' lo cambia por el camino.',
      detalle: (hi, lo) => hi + ' nota lo que nadie nota; ' + lo + ' nota que ' + hi + ' lo notó.',
      comunicacion: (hi, lo) => lo + ' lee las indirectas; ' + hi + ' agradece que se las digan directas.',
      imaginacion: (hi, lo) => lo + ' inventa la historia; ' + hi + ' comprueba que cuadre.'
    },
    asrs: {
      inatencion: (hi, lo) => hi + ' pierde las llaves; ' + lo + ' sabe dónde las dejó ' + hi + '.',
      hiperactividad: (hi, lo) => hi + ' termina las frases; ' + lo + ' las empieza.'
    },
    catq: {
      compensacion: (hi, lo) => hi + ' tiene guion; ' + lo + ' improvisa.',
      enmascaramiento: (hi, lo) => hi + ' vigila su cara; ' + lo + ' deja que hable sola.',
      asimilacion: (hi, lo) => hi + ' siente que actúa; ' + lo + ' se siente en casa.'
    }
  };
  function duoBars(A, B, subs, aVals, bVals, maxOf, lines, tie) {
    return subs.map((s) => {
      const a = aVals[s.id], b = bVals[s.id], mx = maxOf(s);
      let line;
      if (Math.abs(a - b) <= tie) line = 'Empate. Aquí funcionan igual.';
      else { const hi = a > b ? A : B, lo = hi === A ? B : A; line = lines[s.id](esc(hi.name), esc(lo.name)); }
      return '<div class="duo-topic"><div class="label"><span>' + esc(s.nombre) + '</span><span class="muted">' + a + ' vs ' + b + '</span></div><div class="duo-bars">' +
        '<div class="duo-bar a"><span class="who">' + esc(A.name) + '</span><div class="bar-track"><div class="bar-fill" data-w="' + Math.round((a / mx) * 100) + '"></div></div><span class="n">' + a + '</span></div>' +
        '<div class="duo-bar b"><span class="who">' + esc(B.name) + '</span><div class="bar-track"><div class="bar-fill" data-w="' + Math.round((b / mx) * 100) + '"></div></div><span class="n">' + b + '</span></div>' +
        '</div><p class="duo-line">' + line + '</p></div>';
    }).join('');
  }
  function oppList(A, B, t, rows, label) {
    return '<h3>' + label + '</h3>' + (rows.length
      ? '<ul class="opp">' + rows.map((r) => '<li><div class="q">' + (r.i + 1) + '. ' + esc(t.items[r.i]) + '</div>' +
          '<div class="ans a"><b>' + esc(A.name) + ':</b> ' + esc(t.opciones[r.a]) + '</div><div class="ans b"><b>' + esc(B.name) + ':</b> ' + esc(t.opciones[r.b]) + '</div></li>').join('') + '</ul>'
      : '<p class="muted">En ninguna. Sospechoso.</p>');
  }
  function duoCards(A, B, ra, rb, fmt) {
    return '<div class="duo"><div class="duo-card"><span class="duo-name">' + esc(A.name) + '</span><span class="duo-age">' + fmt(ra) + '</span><span class="duo-title">' + esc(ra.franja.titulo) + '</span></div>' +
      '<div class="duo-card"><span class="duo-name">' + esc(B.name) + '</span><span class="duo-age">' + fmt(rb) + '</span><span class="duo-title">' + esc(rb.franja.titulo) + '</span></div></div>';
  }
  function cmpAQ(A, B) {
    const ra = A.results.aq, rb = B.results.aq, agree = (x) => x <= 1;
    const rows = AQ.items.map((q, i) => ({ i, a: ra.answers[i], b: rb.answers[i], same: agree(ra.answers[i]) === agree(rb.answers[i]), diff: Math.abs(ra.answers[i] - rb.answers[i]) }));
    const same = rows.filter((r) => r.same).length, d = Math.abs(ra.total - rb.total), hi = ra.total >= rb.total ? A : B, lo = hi === A ? B : A;
    const v = d <= 3 ? 'Prácticamente el mismo puntaje. Lo que cambia es de qué está hecho.' : d <= 8 ? esc(hi.name) + ' tiene algo más de rasgos que ' + esc(lo.name) + ': ' + d + ' puntos de diferencia.' : 'Diferencia clara: ' + d + ' puntos. ' + esc(hi.name) + ' y ' + esc(lo.name) + ' procesan el mundo de formas distintas.';
    return '<div class="cmp-section"><h2>🔬 Autistómetro</h2>' + duoCards(A, B, ra, rb, (r) => r.total) +
      ruler(0, 50, AQ.marcas, { v: ra.total, name: A.name }, { v: rb.total, name: B.name }) +
      '<p class="verdict">' + v + '</p><p class="coin">Del mismo lado en <b>' + same + ' de 50</b> afirmaciones.</p>' +
      duoBars(A, B, AQ.subescalas, ra.subs, rb.subs, () => 10, LINES.aq, 1) +
      oppList(A, B, AQ, rows.filter((r) => !r.same).sort((x, y) => y.diff - x.diff).slice(0, 6), 'Donde respondieron al revés') + '</div>';
  }
  function cmpASRS(A, B) {
    const R = T.asrs, ra = A.results.asrs, rb = B.results.asrs;
    const rows = R.items.map((q, i) => ({ i, a: ra.answers[i], b: rb.answers[i], same: ra.shaded[i] === rb.shaded[i], diff: Math.abs(ra.answers[i] - rb.answers[i]) }));
    const v = ra.positivo === rb.positivo ? (ra.positivo ? 'Los dos dan cribado positivo. Dos motores en la misma mesa.' : 'Ninguno da cribado positivo. Miren la parte B: ahí está el matiz.') : esc((ra.positivo ? A : B).name) + ' da cribado positivo y ' + esc((ra.positivo ? B : A).name) + ' no. Eso no dice quién es más despistado; dice a quién le conviene una evaluación.';
    return '<div class="cmp-section"><h2>⚡ TDAH</h2>' + duoCards(A, B, ra, rb, (r) => r.a + '<small style="font-size:.4em"> / 6</small>') +
      '<p class="verdict">' + v + '</p><p class="coin">Parte B: ' + esc(A.name) + ' ' + ra.b + ' de 12 · ' + esc(B.name) + ' ' + rb.b + ' de 12.</p>' +
      duoBars(A, B, R.dominios, ra.dom, rb.dom, () => 9, LINES.asrs, 1) +
      oppList(A, B, R, rows.filter((r) => !r.same).sort((x, y) => y.diff - x.diff).slice(0, 6), 'Donde uno marca casilla y el otro no') + '</div>';
  }
  function cmpCATQ(A, B) {
    const R = T.catq, ra = A.results.catq, rb = B.results.catq, inv = new Set(R.invertidos);
    const side = (i, a) => { const v = inv.has(i + 1) ? 6 - a : a; return v < 3 ? -1 : v > 3 ? 1 : 0; };
    const rows = R.items.map((q, i) => { const sa = side(i, ra.answers[i]), sb = side(i, rb.answers[i]); return { i, a: ra.answers[i], b: rb.answers[i], same: sa === sb || sa === 0 || sb === 0, diff: Math.abs(ra.answers[i] - rb.answers[i]) }; });
    const d = Math.abs(ra.total - rb.total), hi = ra.total >= rb.total ? A : B, lo = hi === A ? B : A;
    const v = d <= 10 ? 'Camuflan más o menos lo mismo.' : esc(hi.name) + ' camufla bastante más que ' + esc(lo.name) + ': ' + d + ' puntos. ' + esc(hi.name) + ' llega a casa más cansado de lo social, aunque no se le note. Esa es la gracia.';
    return '<div class="cmp-section"><h2>🎭 Camuflaje</h2>' + duoCards(A, B, ra, rb, (r) => r.total) +
      ruler(R.escalaMin, R.escalaMax, R.marcas, { v: ra.total, name: A.name }, { v: rb.total, name: B.name }) +
      '<p class="verdict">' + v + '</p>' +
      duoBars(A, B, R.subescalas, ra.subs, rb.subs, (s) => s.rango[1], LINES.catq, 4) +
      oppList(A, B, R, rows.filter((r) => !r.same).sort((x, y) => y.diff - x.diff).slice(0, 6), 'Donde están en lados opuestos') + '</div>';
  }
  function showCompare() {
    const mine = myResults();
    if (!challenger) { showHub(); return; }
    const A = challenger, B = { name: S.name, results: mine };
    const common = ORDER.filter((id) => A.results[id] && B.results[id]);
    const missing = ORDER.filter((id) => !(A.results[id] && B.results[id])).map((id) => T[id].nombre + (A.results[id] ? ' (te falta a ti)' : B.results[id] ? ' (le falta a ' + A.name + ')' : ''));
    const summary = '🧬 Neurodivergencia · ' + A.name + ' vs ' + B.name + ': ' + common.map((id) => T[id].nombre + ' ' + headline(A.results[id]) + ' vs ' + headline(B.results[id])).join(' · ') + '. ' + pageUrl();
    render(
      '<section class="screen compare">' +
        '<p class="kicker">Cara a cara</p>' +
        '<h2>' + esc(A.name) + '<span class="vs">vs</span>' + esc(B.name) + '</h2>' +
        (missing.length ? '<p class="muted small">Pendientes: ' + esc(missing.join(', ')) + '.</p>' : '') +
        (common.indexOf('aq') !== -1 ? cmpAQ(A, B) : '') +
        (common.indexOf('asrs') !== -1 ? cmpASRS(A, B) : '') +
        (common.indexOf('catq') !== -1 ? cmpCATQ(A, B) : '') +
        '<div class="actions">' +
          '<a class="btn wa" href="' + esc(waLink(summary)) + '" target="_blank" rel="noopener">Compartir el veredicto</a>' +
          btn('perfil', 'Volver a mi perfil', 'ghost') +
          btn('menu', 'Volver al menú', 'ghost') +
        '</div>' +
        '<div class="fine"><b>Letra pequeña.</b> Son cribados, no diagnósticos. Comparar es para conversar, no para decidir quién «es» qué.</div>' +
      '</section>'
    );
    animateBars();
    $('#perfil').addEventListener('click', showPerfil);
    $('#menu').addEventListener('click', showHub);
  }

  /* ---------- teclado: 1-7 ---------- */
  document.addEventListener('keydown', (e) => {
    if (!$('.quiz') || e.metaKey || e.ctrlKey || e.altKey) return;
    const k = parseInt(e.key, 10);
    if (k >= 1 && k <= T[current].opciones.length) { e.preventDefault(); pick(k - 1); }
  });

  /* ---------- arranque ---------- */
  challenger = readHash();
  if (S.name) showHub(); else showIntro();
})();
