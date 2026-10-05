/* =====================================================================
   Se alinearon las estrellas — lógica
   Solo frontend. Cada uno responde por su lado; el enlace lleva las
   respuestas en el fragmento (#), nunca en la query string.
   ===================================================================== */
(function () {
  'use strict';

  const D = window.ESTRELLAS;
  const KEY = 'estrellas-v1';
  const app = document.getElementById('app');
  const RONDAS = ['r0', 'r1', 'r2', 'r3', 'r4', 'r5'];

  /* ---------- estado ---------- */
  function fresh() {
    return {
      v: 1, name: '',
      r0: { a: {}, texto: '', done: false },
      r1: { w: {}, done: false },
      r2: { a: {}, done: false },
      r3: { leida: false },
      r4: { r: {}, done: false },
      r5: { a: {}, done: false },
      prog: { r0: 0, r2: 0, r4: 0, r5: 0 }
    };
  }
  function load() { try { const s = JSON.parse(localStorage.getItem(KEY)); return s && s.v === 1 ? s : null; } catch (e) { return null; } }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* seguimos */ } }
  let S = load() || fresh();
  let challenger = null; // { name, data }
  let sciOpen = {};

  /* ---------- utilidades ---------- */
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const $ = (sel) => app.querySelector(sel);
  const $$ = (sel) => Array.from(app.querySelectorAll(sel));
  const meta = (id) => D.rondas.find((r) => r.id === id);
  const otherName = () => (S.name === D.personas[0] ? D.personas[1] : S.name === D.personas[1] ? D.personas[0] : 'la otra persona');
  const flag = (estado) => estado === 'flag' ? ' <span class="flag" title="Por verificar, fuente secundaria o estimación">⚑</span>' : estado === 'fix' ? ' <span class="fix" title="Corregido respecto al borrador">✏️</span>' : '';
  const src = (d) => '<a class="src" href="' + esc(d.url) + '" target="_blank" rel="noopener">🔬 ' + esc(d.fuente || 'fuente') + '</a>';
  const btn = (id, label, cls) => '<button type="button" class="btn ' + (cls || 'primary') + '" id="' + id + '">' + label + '</button>';

  function render(html) {
    app.innerHTML = html;
    window.scrollTo(0, 0);
    const s = $('.screen');
    if (s) requestAnimationFrame(() => s.classList.add('in'));
  }
  function animateBars() {
    requestAnimationFrame(() => requestAnimationFrame(() => { $$('.bar-fill').forEach((b) => { b.style.width = b.getAttribute('data-w') + '%'; }); }));
  }
  function bar(id, extra) {
    const m = meta(id);
    return '<header class="bar"><button type="button" class="icon" id="to-menu" aria-label="Volver al menú">‹</button>' +
      '<div class="bar-title">' + m.emoji + ' ' + esc(m.nombre) + '<span class="bar-sub">' + (extra || esc(m.sub)) + '</span></div></header>';
  }
  function bindBar() { $('#to-menu').addEventListener('click', showMenu); }

  /* ---------- completitud ---------- */
  const done = (id) => (id === 'r3' ? !!S.r3.leida : !!S[id].done);
  function status(id) {
    if (done(id)) return ['Hecha', 'ok'];
    if (id === 'r3') return [meta(id).min, ''];
    const p = S.prog[id] || 0;
    if (id === 'r1' && Object.keys(S.r1.w).length) return ['A medias', 'live'];
    if (p > 0) return ['A medias', 'live'];
    return [meta(id).min, ''];
  }

  /* ---------- enlace ---------- */
  function myData() {
    const d = { v: 1, n: S.name };
    if (S.r0.done) d.r0 = { a: S.r0.a, t: S.r0.texto };
    if (S.r1.done) d.r1 = S.r1.w;
    if (S.r2.done) d.r2 = S.r2.a;
    if (S.r4.done) d.r4 = S.r4.r;
    if (S.r5.done) d.r5 = S.r5.a;
    return d;
  }
  const b64e = (s) => btoa(unescape(encodeURIComponent(s))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const b64d = (s) => { let b = s.replace(/-/g, '+').replace(/_/g, '/'); while (b.length % 4) b += '='; return decodeURIComponent(escape(atob(b))); };
  function encodeLink() { return location.href.split('#')[0] + '#e=' + b64e(JSON.stringify(myData())); }
  function validInt(v, lo, hi) { return Number.isInteger(v) && v >= lo && v <= hi; }
  function decodeLink(s) {
    try {
      const d = JSON.parse(b64d(s));
      if (!d || d.v !== 1 || typeof d.n !== 'string') return null;
      const out = { name: d.n.slice(0, 30) || 'Alguien', data: {} };
      if (d.r0 && d.r0.a && D.r0.preguntas.every((q) => validInt(d.r0.a[q.id], 0, q.o.length - 1))) out.data.r0 = { a: d.r0.a, t: String(d.r0.t || '').slice(0, 240) };
      if (d.r1 && D.r1.categorias.every((c) => validInt(d.r1[c.id], 0, 100)) && D.r1.categorias.reduce((t, c) => t + d.r1[c.id], 0) === 100) out.data.r1 = d.r1;
      if (d.r2 && D.r2.items.every((it) => validInt(d.r2[it.id], 0, 3))) out.data.r2 = d.r2;
      if (d.r4 && d.r1 && typeof d.r4 === 'object') {
        const top = topCats(d.r1);
        const ok = D.r4.ciudades.every((c) => d.r4[c.id] && top.every((k) => validInt(d.r4[c.id][k], 1, 5)));
        if (ok) out.data.r4 = d.r4;
      }
      if (d.r5 && D.r5.disparadores.every((t) => d.r5[t.id] && validInt(d.r5[t.id].w, 1, 5) && validInt(d.r5[t.id].m, 0, 2))) {
        out.data.r5 = {}; D.r5.disparadores.forEach((t) => { out.data.r5[t.id] = { w: d.r5[t.id].w, m: d.r5[t.id].m, t: String(d.r5[t.id].t || '').slice(0, 240) }; });
      }
      return Object.keys(out.data).length ? out : null;
    } catch (e) { return null; }
  }
  function readHash() { const m = location.hash.match(/[#&]e=([A-Za-z0-9_-]+)/); return m ? decodeLink(m[1]) : null; }
  const waLink = (t) => 'https://wa.me/?text=' + encodeURIComponent(t);
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text).then(() => true, () => false);
    return Promise.resolve(false);
  }

  /* ---------- cálculo ---------- */
  function topCats(w) {
    return D.r1.categorias.map((c) => c.id).sort((a, b) => (w[b] - w[a]) || D.r1.categorias.findIndex((c) => c.id === a) - D.r1.categorias.findIndex((c) => c.id === b)).slice(0, 4);
  }
  function cityScore(w, ratings, cityId) {
    const top = topCats(w);
    let num = 0, den = 0;
    top.forEach((k) => { const wk = Math.max(w[k], 1); num += wk * ratings[cityId][k]; den += wk; });
    const s = num / den;                     // 1 a 5
    return Math.round(((s - 1) / 4) * 100);  // 0 a 100
  }
  function ranking(A, B) {
    return D.r4.ciudades.map((c) => {
      const a = cityScore(A.r1, A.r4, c.id), b = cityScore(B.r1, B.r4, c.id);
      return { c, a, b, j: Math.round((a + b) / 2), gap: Math.abs(a - b) };
    }).sort((x, y) => y.j - x.j);
  }
  const catName = (id) => D.r1.categorias.find((c) => c.id === id).nombre;

  /* ---------- pantallas ---------- */
  function showIntro() {
    render(
      '<section class="screen intro">' +
        '<p class="kicker">' + esc(D.kicker) + '</p>' +
        '<h1>Se alinearon<br>las estrellas</h1>' +
        '<p class="lead">' + esc(D.lema) + '</p>' +
        '<ul class="meta"><li>6 rondas</li><li>25 minutos</li><li>Cada uno por su lado</li></ul>' +
        (challenger ? '<div class="banner">🔔 <strong>' + esc(challenger.name) + '</strong> ya respondió. Cuando termines las tuyas, se abre El acuerdo.</div>' : '') +
        '<form id="start" autocomplete="off">' +
          '<label for="name">¿Quién responde?</label>' +
          '<div class="chips">' + D.personas.map((p) => '<button type="button" class="chip" data-name="' + esc(p) + '">Soy ' + esc(p) + '</button>').join('') + '</div>' +
          '<input id="name" name="name" type="text" maxlength="30" placeholder="Tu nombre" required value="' + esc(S.name) + '">' +
          btn('open', 'Entrar') +
        '</form>' +
        '<p class="tiny">Cada uno responde por su lado. Al final se comparan por un enlace que solo ven ustedes dos. Funciona sin señal una vez abierta y guarda el progreso.</p>' +
      '</section>'
    );
    $$('.chip[data-name]').forEach((b) => b.addEventListener('click', () => { $('#name').value = b.getAttribute('data-name'); $('#name').focus(); }));
    const go = (e) => { e.preventDefault(); const n = $('#name').value.trim(); if (!n) { $('#name').focus(); return; } S.name = n; save(); showMenu(); };
    $('#start').addEventListener('submit', go);
    $('#open').addEventListener('click', go);
  }

  function showMenu() {
    const nDone = RONDAS.filter(done).length;
    const canAgree = !!challenger && nDone > 0;
    const rows = D.rondas.map((r, k) => {
      if (r.id === 'r6') {
        return '<button type="button" class="menu-row' + (canAgree ? '' : ' locked') + '" data-id="r6"' + (canAgree ? '' : ' disabled') + '><span class="menu-emoji">' + r.emoji + '</span>' +
          '<span class="menu-text"><span class="menu-name">' + k + '. ' + esc(r.nombre) + '</span><span class="menu-sub">' + (canAgree ? 'Con las respuestas de ' + esc(challenger.name) + '.' : esc(r.sub)) + '</span></span>' +
          '<span class="status">' + (canAgree ? 'Abierto' : '🔒') + '</span></button>';
      }
      const [st, cls] = status(r.id);
      return '<button type="button" class="menu-row" data-id="' + r.id + '"><span class="menu-emoji">' + r.emoji + '</span>' +
        '<span class="menu-text"><span class="menu-name">' + k + '. ' + esc(r.nombre) + '</span><span class="menu-sub">' + esc(r.sub) + '</span></span>' +
        '<span class="status ' + cls + '">' + esc(st) + '</span></button>';
    }).join('');
    render(
      '<section class="screen menu">' +
        '<p class="kicker">' + esc(S.name) + ' · ' + esc(D.titulo) + '</p>' +
        '<h1>Las rondas</h1>' +
        '<p class="lead">En orden, o como quieras. La ronda 3 no se responde: se lee.</p>' +
        (challenger ? '<div class="banner">🔔 <strong>' + esc(challenger.name) + '</strong> ya respondió ' + Object.keys(challenger.data).length + ' rondas.' + (canAgree ? ' Ya pueden abrir El acuerdo.' : ' Responde al menos una y se abre El acuerdo.') + '</div>' : '') +
        '<div class="menu-list">' + rows + '</div>' +
        '<div class="actions">' + (nDone ? btn('perfil', 'Mis respuestas y enlace') : '') + '</div>' +
        '<div class="menu-foot"><button type="button" class="link" id="nombre">Cambiar nombre</button><button type="button" class="link" id="fuentes">Fuentes</button><button type="button" class="link danger" id="reset">Borrar todo</button></div>' +
      '</section>'
    );
    $$('.menu-row').forEach((b) => b.addEventListener('click', () => {
      const id = b.getAttribute('data-id');
      if (id === 'r6') showAcuerdo();
      else if (done(id) && id !== 'r3') showResumenRonda(id);
      else SCREENS[id]();
    }));
    const p = $('#perfil'); if (p) p.addEventListener('click', showPerfil);
    $('#nombre').addEventListener('click', showIntro);
    $('#fuentes').addEventListener('click', showFuentes);
    $('#reset').addEventListener('click', () => { if (confirm('¿Borrar todas tus respuestas y empezar de cero?')) { S = fresh(); save(); showIntro(); } });
  }

  /* ---------- Ronda 0 ---------- */
  function showR0() {
    const i = S.prog.r0, qs = D.r0.preguntas;
    if (i < qs.length) {
      const q = qs[i], chosen = S.r0.a[q.id];
      render('<section class="screen quiz">' + bar('r0', (i + 1) + ' de ' + (qs.length + 1)) +
        '<h2 class="q">' + esc(q.q) + '</h2><div class="options">' +
        q.o.map((o, oi) => '<button type="button" class="option' + (chosen === oi ? ' selected' : '') + '" data-i="' + oi + '">' + esc(o) + '</button>').join('') +
        '</div>' + (i > 0 ? '<div class="quiz-foot"><button type="button" class="btn ghost small" id="back">← Anterior</button></div>' : '') + '</section>');
      bindBar();
      $$('.option').forEach((b) => b.addEventListener('click', () => { S.r0.a[q.id] = +b.getAttribute('data-i'); S.prog.r0 = i + 1; save(); showR0(); }));
      const bk = $('#back'); if (bk) bk.addEventListener('click', () => { S.prog.r0 = i - 1; save(); showR0(); });
      return;
    }
    render('<section class="screen quiz">' + bar('r0', (qs.length + 1) + ' de ' + (qs.length + 1)) +
      '<h2 class="q">' + esc(D.r0.texto.label) + '</h2><p class="muted">Opcional. Lo ve solo la otra persona, en El acuerdo.</p>' +
      '<textarea id="txt" maxlength="' + D.r0.texto.max + '" rows="4" placeholder="Hasta ' + D.r0.texto.max + ' caracteres">' + esc(S.r0.texto) + '</textarea>' +
      btn('next', 'Guardar ronda 0') + '<div class="quiz-foot"><button type="button" class="btn ghost small" id="back">← Anterior</button></div></section>');
    bindBar();
    $('#next').addEventListener('click', () => { S.r0.texto = $('#txt').value.trim(); S.r0.done = true; save(); showResumenRonda('r0'); });
    $('#back').addEventListener('click', () => { S.prog.r0 = qs.length - 1; save(); showR0(); });
  }

  /* ---------- Ronda 1 ---------- */
  function showR1() {
    const w = S.r1.w; D.r1.categorias.forEach((c) => { if (!Number.isInteger(w[c.id])) w[c.id] = 0; });
    const used = () => D.r1.categorias.reduce((t, c) => t + w[c.id], 0);
    render('<section class="screen quiz">' + bar('r1', 'Reparte ' + D.r1.total + ' puntos') +
      '<div class="remaining" id="rem"></div>' +
      '<div class="steppers">' + D.r1.categorias.map((c) => '<div class="stepper" data-id="' + c.id + '"><div class="st-text"><b>' + esc(c.nombre) + '</b><span>' + esc(c.desc) + '</span></div>' +
        '<div class="st-ctl"><button type="button" class="st-btn" data-d="-1" aria-label="Menos">−</button><span class="st-val">' + w[c.id] + '</span><button type="button" class="st-btn" data-d="1" aria-label="Más">+</button></div></div>').join('') + '</div>' +
      btn('next', 'Guardar ronda 1') + '</section>');
    bindBar();
    const upd = () => {
      const left = D.r1.total - used();
      $('#rem').innerHTML = left === 0 ? '✓ Repartidos los 100' : 'Te quedan <b>' + left + '</b> puntos';
      $('#next').disabled = left !== 0;
      $$('.stepper').forEach((el) => { el.querySelector('.st-val').textContent = w[el.getAttribute('data-id')]; });
    };
    $$('.st-btn').forEach((b) => b.addEventListener('click', () => {
      const id = b.closest('.stepper').getAttribute('data-id'), d = +b.getAttribute('data-d') * D.r1.paso;
      const nv = w[id] + d;
      if (nv < 0 || nv > D.r1.total || used() + d > D.r1.total) return;
      w[id] = nv; save(); upd();
    }));
    upd();
    $('#next').addEventListener('click', () => { if (used() !== D.r1.total) return; S.r1.done = true; save(); showResumenRonda('r1'); });
  }

  /* ---------- Ronda 2 ---------- */
  function showR2() {
    const i = S.prog.r2, items = D.r2.items;
    if (i >= items.length) { S.r2.done = true; save(); showResumenRonda('r2'); return; }
    const it = items[i], chosen = S.r2.a[it.id];
    render('<section class="screen quiz">' + bar('r2', (i + 1) + ' de ' + items.length + ' · en secreto') +
      '<h2 class="q">' + esc(it.texto) + '</h2><div class="options">' +
      D.r2.opciones.map((o, oi) => '<button type="button" class="option' + (chosen === oi ? ' selected' : '') + '" data-i="' + oi + '">' + esc(o) + '</button>').join('') +
      '</div>' + (i > 0 ? '<div class="quiz-foot"><button type="button" class="btn ghost small" id="back">← Anterior</button></div>' : '') + '</section>');
    bindBar();
    $$('.option').forEach((b) => b.addEventListener('click', () => { S.r2.a[it.id] = +b.getAttribute('data-i'); S.prog.r2 = i + 1; save(); showR2(); }));
    const bk = $('#back'); if (bk) bk.addEventListener('click', () => { S.prog.r2 = i - 1; save(); showR2(); });
  }

  /* ---------- Ronda 3 ---------- */
  function datoLi(d) { return '<li>' + esc(d.t) + flag(d.estado) + ' ' + src(d) + '</li>'; }
  function showR3() {
    const cards = D.r3.cartas.map((c) => '<details class="card" id="c-' + c.id + '"><summary>' + c.emoji + ' ' + esc(c.titulo) + (c.datos.some((d) => d.estado === 'flag') ? ' <span class="flag">⚑</span>' : '') + '</summary>' +
      c.p.map((p) => '<p>' + esc(p) + '</p>').join('') + '<ul class="datos">' + c.datos.map(datoLi).join('') + '</ul></details>').join('');
    const rutas = '<div class="tabs" id="tabs">' + D.r3.rutas.map((r, k) => '<button type="button" class="tab' + (k === 0 ? ' on' : '') + '" data-k="' + k + '">' + esc(r.nombre) + '</button>').join('') + '</div><div id="ruta"></div>';
    render('<section class="screen plato">' + bar('r3', 'Para entender, no para comparar') +
      '<p class="muted">Diez cartas. Toca una para abrirla. ⚑ es por verificar; ✏️ es un dato corregido respecto al borrador.</p>' +
      '<div class="cards">' + cards + '</div>' +
      '<h3>Rutas para Karen</h3><p class="muted">Pasos, tiempo y costo. Los años son estimaciones ⚑.</p>' + rutas +
      btn('next', S.r3.leida ? 'Leída. Volver al menú' : 'Marcar como leída') + '</section>');
    bindBar();
    const drawRuta = (k) => {
      const r = D.r3.rutas[k];
      $('#ruta').innerHTML = '<div class="ruta"><ol>' + r.pasos.map((p) => '<li>' + esc(p) + '</li>').join('') + '</ol>' +
        '<p><b>Tiempo:</b> ' + esc(r.tiempo.t) + flag(r.tiempo.estado) + '</p><p><b>Costo:</b> ' + esc(r.costo.t) + flag(r.costo.estado) + '</p>' +
        '<p><b>¿Casarse para ir juntos?</b> ' + esc(r.casarse) + '</p><p><b>Idioma:</b> ' + esc(r.idioma) + '</p></div>';
      $$('.tab').forEach((t) => t.classList.toggle('on', +t.getAttribute('data-k') === k));
    };
    $$('.tab').forEach((t) => t.addEventListener('click', () => drawRuta(+t.getAttribute('data-k'))));
    drawRuta(0);
    $('#next').addEventListener('click', () => { S.r3.leida = true; save(); showMenu(); });
  }

  /* ---------- Ronda 4 ---------- */
  function cityCard(c, open) {
    const li = (d) => '<li>' + esc(d.t) + flag(d.estado) + ' <a class="src" href="' + esc(d.url) + '" target="_blank" rel="noopener">🔬</a></li>';
    return '<details class="card"' + (open ? ' open' : '') + '><summary>' + c.emoji + ' ' + esc(c.nombre) + '</summary>' +
      '<p class="lbl">Para Carlos</p><ul class="datos">' + c.carlos.map(li).join('') + '</ul>' +
      '<p class="lbl">Para Karen</p><ul class="datos">' + c.karen.map(li).join('') + '</ul>' +
      '<p><b>Lo bueno:</b> ' + esc(c.bueno) + '</p><p><b>Lo difícil:</b> ' + esc(c.dificil) + '</p><p><b>¿Casarse?</b> ' + esc(c.casarse) + ' · <b>Idioma:</b> ' + esc(c.idioma) + '</p></details>';
  }
  function showR4() {
    if (!S.r1.done) {
      render('<section class="screen plato">' + bar('r4') + '<p class="lead">Primero la ronda 1: de ahí salen las cuatro categorías en las que vas a calificar.</p>' + btn('go1', 'Ir a Cien puntos') + '</section>');
      bindBar(); $('#go1').addEventListener('click', showR1); return;
    }
    const top = topCats(S.r1.w), i = S.prog.r4, cities = D.r4.ciudades;
    if (i >= cities.length) { S.r4.done = true; save(); showResumenRonda('r4'); return; }
    const c = cities[i]; S.r4.r[c.id] = S.r4.r[c.id] || {};
    const rows = top.map((k) => '<div class="rate" data-k="' + k + '"><span class="rate-l">' + esc(catName(k)) + '</span><div class="rate-chips">' +
      D.r4.escala.map((v) => '<button type="button" class="rchip' + (S.r4.r[c.id][k] === v ? ' on' : '') + '" data-v="' + v + '">' + v + '</button>').join('') + '</div></div>').join('');
    render('<section class="screen plato">' + bar('r4', 'Ciudad ' + (i + 1) + ' de ' + cities.length) +
      (i === 0 ? '<p class="muted">Tus cuatro categorías, según la ronda 1: <b>' + top.map(catName).map(esc).join(', ') + '</b>. Califica cada ciudad de 1 a 5 solo en esas.</p>' : '') +
      cityCard(c, true) + '<div class="rates">' + rows + '</div>' +
      btn('next', i + 1 < cities.length ? 'Siguiente ciudad' : 'Guardar ronda 4') +
      (i > 0 ? '<div class="quiz-foot"><button type="button" class="btn ghost small" id="back">← Anterior</button></div>' : '') + '</section>');
    bindBar();
    const upd = () => { $('#next').disabled = !top.every((k) => S.r4.r[c.id][k]); };
    $$('.rchip').forEach((b) => b.addEventListener('click', () => {
      const k = b.closest('.rate').getAttribute('data-k'); S.r4.r[c.id][k] = +b.getAttribute('data-v'); save();
      b.closest('.rate-chips').querySelectorAll('.rchip').forEach((x) => x.classList.toggle('on', x === b)); upd();
    }));
    upd();
    $('#next').addEventListener('click', () => { if ($('#next').disabled) return; S.prog.r4 = i + 1; save(); showR4(); });
    const bk = $('#back'); if (bk) bk.addEventListener('click', () => { S.prog.r4 = i - 1; save(); showR4(); });
  }

  /* ---------- Ronda 5 ---------- */
  function showR5() {
    const i = S.prog.r5, ts = D.r5.disparadores;
    if (i < ts.length) {
      const t = ts[i], a = S.r5.a[t.id] || {};
      render('<section class="screen quiz">' + bar('r5', (i + 1) + ' de ' + ts.length) +
        '<h2 class="q">' + esc(t.texto) + '</h2>' +
        '<p class="lbl">¿Cuánto te pesa?</p><div class="rate-chips big">' + [1, 2, 3, 4, 5].map((v) => '<button type="button" class="rchip' + (a.w === v ? ' on' : '') + '" data-v="' + v + '">' + v + '</button>').join('') + '</div>' +
        '<p class="lbl">Si quieres, dilo con tus palabras</p><textarea id="txt" maxlength="240" rows="3" placeholder="Opcional">' + esc(a.t || '') + '</textarea>' +
        '<p class="lbl">Lo que le pides a ' + esc(otherName()) + ' cuando hablen de esto</p><div class="options">' +
        D.r5.misiones.map((m, mi) => '<button type="button" class="option mis' + (a.m === mi ? ' selected' : '') + '" data-m="' + mi + '">' + esc(m) + '</button>').join('') + '</div>' +
        btn('next', 'Siguiente') + (i > 0 ? '<div class="quiz-foot"><button type="button" class="btn ghost small" id="back">← Anterior</button></div>' : '') + '</section>');
      bindBar();
      const upd = () => { $('#next').disabled = !(a.w && a.m !== undefined); };
      $$('.rchip').forEach((b) => b.addEventListener('click', () => { a.w = +b.getAttribute('data-v'); $$('.rchip').forEach((x) => x.classList.toggle('on', x === b)); S.r5.a[t.id] = a; save(); upd(); }));
      $$('.mis').forEach((b) => b.addEventListener('click', () => { a.m = +b.getAttribute('data-m'); $$('.mis').forEach((x) => x.classList.toggle('selected', x === b)); S.r5.a[t.id] = a; save(); upd(); }));
      upd();
      $('#next').addEventListener('click', () => { if ($('#next').disabled) return; a.t = $('#txt').value.trim(); S.r5.a[t.id] = a; S.prog.r5 = i + 1; save(); showR5(); });
      const bk = $('#back'); if (bk) bk.addEventListener('click', () => { S.prog.r5 = i - 1; save(); showR5(); });
      return;
    }
    render('<section class="screen plato">' + bar('r5', 'Línea de tiempo') +
      '<p class="muted">Fechas reales de los dos si Carlos empieza en Fall 2027. Lo marcado con ⚑ es estimación. Si el ciclo de 2027 no sale, todo se corre un año.</p>' +
      timeline() + btn('next', 'Guardar ronda 5') + '</section>');
    bindBar();
    $('#next').addEventListener('click', () => { S.r5.done = true; save(); showResumenRonda('r5'); });
  }
  function timeline() {
    return '<div class="tl">' + D.r5.linea.map((l) => '<div class="tl-row"><div class="tl-date">' + esc(l.fecha) + flag(l.estado) + '</div><div class="tl-cell"><b>Carlos</b> ' + esc(l.carlos) + '</div><div class="tl-cell"><b>Karen</b> ' + esc(l.karen || '—') + '</div></div>').join('') + '</div>';
  }

  /* ---------- resumen de una ronda (propia) ---------- */
  function resumenRonda(id, P) {
    if (id === 'r0') return '<ul class="lines">' + D.r0.preguntas.map((q) => '<li><span class="muted">' + esc(q.q) + '</span><br>' + esc(q.o[P.r0.a[q.id]]) + '</li>').join('') + (P.r0.t ? '<li><span class="muted">Dijo:</span><br>«' + esc(P.r0.t) + '»</li>' : '') + '</ul>';
    if (id === 'r1') return '<ul class="topics">' + D.r1.categorias.slice().sort((a, b) => P.r1[b.id] - P.r1[a.id]).map((c) => '<li><div class="sub-row"><span>' + esc(c.nombre) + '</span><strong>' + P.r1[c.id] + '</strong></div><div class="bar-track"><div class="bar-fill" data-w="' + P.r1[c.id] + '"></div></div></li>').join('') + '</ul>';
    if (id === 'r2') return '<ul class="lines">' + D.r2.items.map((it) => '<li><span class="muted">' + esc(it.texto) + '</span><br>' + esc(D.r2.opciones[P.r2[it.id]]) + '</li>').join('') + '</ul>';
    if (id === 'r4') { const top = topCats(P.r1); return '<p class="muted">Calificaste en: ' + top.map(catName).map(esc).join(', ') + '.</p><ul class="topics">' + D.r4.ciudades.map((c) => { const s = cityScore(P.r1, P.r4, c.id); return '<li><div class="sub-row"><span>' + c.emoji + ' ' + esc(c.nombre) + '</span><strong>' + s + '</strong></div><div class="bar-track"><div class="bar-fill" data-w="' + s + '"></div></div></li>'; }).join('') + '</ul>'; }
    if (id === 'r5') return '<ul class="lines">' + D.r5.disparadores.map((t) => { const a = P.r5[t.id]; return '<li><span class="muted">' + esc(t.texto) + '</span><br>Pesa ' + a.w + ' de 5 · ' + esc(D.r5.misiones[a.m]) + (a.t ? '<br>«' + esc(a.t) + '»' : '') + '</li>'; }).join('') + '</ul>';
    return '';
  }
  function showResumenRonda(id) {
    const P = { r0: { a: S.r0.a, t: S.r0.texto }, r1: S.r1.w, r2: S.r2.a, r4: S.r4.r, r5: S.r5.a };
    const nDone = RONDAS.filter(done).length;
    render('<section class="screen result">' + bar(id, 'Tus respuestas') + resumenRonda(id, P) +
      '<div class="actions">' + btn('menu', nDone === 6 ? 'Volver al menú' : 'Seguir con la siguiente') + btn('perfil', 'Mis respuestas y enlace', 'ghost') + btn('redo', 'Responder de nuevo', 'ghost') + '</div></section>');
    bindBar(); animateBars();
    $('#menu').addEventListener('click', showMenu);
    $('#perfil').addEventListener('click', showPerfil);
    $('#redo').addEventListener('click', () => {
      if (id === 'r0') S.r0 = { a: {}, texto: '', done: false };
      if (id === 'r1') S.r1 = { w: {}, done: false };
      if (id === 'r2') S.r2 = { a: {}, done: false };
      if (id === 'r4') S.r4 = { r: {}, done: false };
      if (id === 'r5') S.r5 = { a: {}, done: false };
      S.prog[id] = 0; save(); SCREENS[id]();
    });
  }

  /* ---------- perfil y enlace ---------- */
  function showPerfil() {
    const nDone = RONDAS.filter(done).length;
    const list = D.rondas.filter((r) => r.id !== 'r6').map((r) => '<div class="perfil-card' + (done(r.id) ? '' : ' pending') + '"><span class="pc-emoji">' + r.emoji + '</span><span class="pc-name">' + esc(r.nombre) + '</span><span class="pc-num">' + (done(r.id) ? (r.id === 'r3' ? 'leída' : 'hecha') : 'pendiente') + '</span></div>').join('');
    render('<section class="screen result">' +
      '<p class="kicker">' + esc(S.name) + '</p><h1>' + nDone + ' de 6</h1><div class="perfil">' + list + '</div>' +
      '<div class="actions">' + (challenger && nDone ? btn('acuerdo', 'Abrir El acuerdo con ' + esc(challenger.name) + ' →', 'accent') : '') + btn('share', 'Compartir mis respuestas') + btn('menu', 'Volver al menú', 'ghost') + '</div>' +
      '<div class="share-panel" id="panel" hidden>' +
        '<p class="warn">🔒 ' + esc(D.r6.avisoCompartir) + '</p>' +
        '<p>El enlace lleva tus respuestas en el fragmento, después del «#». No pasa por ningún servidor.</p>' +
        '<div class="share-url">' + esc(encodeLink()) + '</div>' +
        '<button type="button" class="btn ghost" id="copy">Copiar enlace</button>' +
        '<a class="btn wa" href="' + esc(waLink('✨ Se alinearon las estrellas · respondí ' + nDone + ' de 6 rondas. Responde las tuyas y se abre El acuerdo: ' + encodeLink())) + '" target="_blank" rel="noopener">Enviar por WhatsApp</a>' +
        '<p class="toast" id="toast"></p></div>' +
      '</section>');
    const a = $('#acuerdo'); if (a) a.addEventListener('click', showAcuerdo);
    $('#share').addEventListener('click', () => { const p = $('#panel'); p.hidden = !p.hidden; if (!p.hidden) p.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); });
    $('#copy').addEventListener('click', () => copyText(encodeLink()).then((ok) => { $('#toast').textContent = ok ? '✓ Enlace copiado.' : 'No se pudo copiar; selecciona el enlace y cópialo a mano.'; }));
    $('#menu').addEventListener('click', showMenu);
  }

  /* ---------- El acuerdo ---------- */
  function showAcuerdo() {
    if (!challenger) { showMenu(); return; }
    const A = Object.assign({ name: challenger.name }, challenger.data);
    const B = { name: S.name };
    if (S.r0.done) B.r0 = { a: S.r0.a, t: S.r0.texto };
    if (S.r1.done) B.r1 = S.r1.w;
    if (S.r2.done) B.r2 = S.r2.a;
    if (S.r4.done && S.r1.done) B.r4 = S.r4.r;
    if (S.r5.done) B.r5 = S.r5.a;
    const both = (k) => A[k] && B[k];
    const pend = [];
    let html = '', coinc = [], difs = [];

    // Ronda 0
    if (both('r0')) {
      const rows = D.r0.preguntas.map((q) => { const same = A.r0.a[q.id] === B.r0.a[q.id]; (same ? coinc : difs).push(q.q); return '<li><div class="q">' + esc(q.q) + '</div><div class="ans a"><b>' + esc(A.name) + ':</b> ' + esc(q.o[A.r0.a[q.id]]) + '</div><div class="ans b"><b>' + esc(B.name) + ':</b> ' + esc(q.o[B.r0.a[q.id]]) + '</div>' + (same ? '<div class="same">✓ Coinciden</div>' : '') + '</li>'; }).join('');
      const noPorAhora = [A, B].some((P) => D.r0.preguntas[1].o[P.r0.a.irse] === 'No por ahora');
      html += '<div class="cmp-section"><h2>🌱 Lo que quiero</h2>' + (noPorAhora ? '<div class="banner warm">' + esc(D.r0.avisoNoPorAhora) + '</div>' : '') + '<ul class="opp">' + rows + '</ul>' +
        (A.r0.t || B.r0.t ? '<div class="quotes">' + (A.r0.t ? '<p><b>' + esc(A.name) + ':</b> «' + esc(A.r0.t) + '»</p>' : '') + (B.r0.t ? '<p><b>' + esc(B.name) + ':</b> «' + esc(B.r0.t) + '»</p>' : '') + '</div>' : '') + '</div>';
    }
    // Ronda 1
    if (both('r1')) {
      const diffs = D.r1.categorias.map((c) => ({ c, a: A.r1[c.id], b: B.r1[c.id], d: Math.abs(A.r1[c.id] - B.r1[c.id]) })).sort((x, y) => y.d - x.d);
      const top3 = diffs.slice(0, 3).filter((x) => x.d >= 10);
      if (diffs[0].d >= 10) pend.push('¿Por qué «' + diffs[0].c.nombre + '» pesa ' + diffs[0].a + ' para ' + A.name + ' y ' + diffs[0].b + ' para ' + B.name + '?');
      html += '<div class="cmp-section"><h2>💯 Cien puntos</h2>' +
        (top3.length ? '<p class="verdict">Donde más pesan distinto: ' + top3.map((x) => esc(x.c.nombre) + ' (' + x.a + ' vs ' + x.b + ')').join(' · ') + '.</p>' : '<p class="verdict">Pesan casi lo mismo en todo. Raro y bonito.</p>') +
        D.r1.categorias.map((c) => '<div class="duo-topic"><div class="label"><span>' + esc(c.nombre) + '</span><span class="muted">' + A.r1[c.id] + ' vs ' + B.r1[c.id] + '</span></div><div class="duo-bars">' +
          '<div class="duo-bar a"><span class="who">' + esc(A.name) + '</span><div class="bar-track"><div class="bar-fill" data-w="' + A.r1[c.id] + '"></div></div><span class="n">' + A.r1[c.id] + '</span></div>' +
          '<div class="duo-bar b"><span class="who">' + esc(B.name) + '</span><div class="bar-track"><div class="bar-fill" data-w="' + B.r1[c.id] + '"></div></div><span class="n">' + B.r1[c.id] + '</span></div></div></div>').join('') + '</div>';
    }
    // Ronda 2
    if (both('r2')) {
      const L = D.r2.lecturas; let tense = null;
      const rows = D.r2.items.map((it) => {
        const a = A.r2[it.id], b = B.r2[it.id]; let key, cls = '';
        if (a === 3 || b === 3) key = 'persona';
        else if (a === 0 && b === 0) { key = 'fuerte'; cls = 'ok'; coinc.push(it.texto); }
        else if ((a === 0 && b === 2) || (a === 2 && b === 0)) { key = 'tension'; cls = 'warn'; if (!tense) tense = it; difs.push(it.texto); }
        else if ((a === 0 && b === 1) || (a === 1 && b === 0)) { key = 'matiz'; if (!tense) tense = it; }
        else if (a === 2 && b === 2) key = 'libre';
        else { key = 'alineado'; cls = 'ok'; coinc.push(it.texto); }
        return '<li class="' + cls + '"><div class="q">' + esc(it.texto) + '</div><div class="ans a"><b>' + esc(A.name) + ':</b> ' + esc(D.r2.opciones[a]) + '</div><div class="ans b"><b>' + esc(B.name) + ':</b> ' + esc(D.r2.opciones[b]) + '</div><div class="read">' + esc(L[key]) + '</div></li>';
      }).join('');
      if (tense) pend.push('«' + tense.texto.replace(/\.$/, '') + '»: ¿qué significa para cada uno, y qué cambiaría si no se cumple?');
      html += '<div class="cmp-section"><h2>🧱 No negociables</h2><ul class="opp">' + rows + '</ul></div>';
    }
    // Ronda 4
    if (both('r4') && both('r1')) {
      const rk = ranking(A, B);
      const maxGap = rk.slice().sort((x, y) => y.gap - x.gap)[0];
      if (maxGap && maxGap.gap >= 20) { const hi = maxGap.a > maxGap.b ? A : B, lo = hi === A ? B : A; pend.push('¿Qué ve ' + hi.name + ' en ' + maxGap.c.nombre + ' que ' + lo.name + ' no ve?'); }
      html += '<div class="cmp-section"><h2>🏙️ Ciudades</h2>' +
        '<p class="muted">Cada uno calificó en sus cuatro categorías: ' + esc(A.name) + ' en ' + topCats(A.r1).map(catName).map(esc).join(', ') + '; ' + esc(B.name) + ' en ' + topCats(B.r1).map(catName).map(esc).join(', ') + '. De 0 a 100.</p>' +
        '<table class="rank"><thead><tr><th>Ciudad</th><th>' + esc(A.name) + '</th><th>' + esc(B.name) + '</th><th>Juntos</th><th>Brecha</th></tr></thead><tbody>' +
        rk.map((r, i) => '<tr' + (r.gap >= 20 ? ' class="warn"' : '') + '><td>' + (i + 1) + '. ' + r.c.emoji + ' ' + esc(r.c.nombre) + '</td><td>' + r.a + '</td><td>' + r.b + '</td><td><b>' + r.j + '</b></td><td>' + r.gap + (r.gap >= 20 ? ' ⚠' : '') + '</td></tr>').join('') +
        '</tbody></table><p class="muted small">Una brecha de 20 o más va señalada aunque la ciudad quede arriba.</p></div>';
    }
    // Ronda 5
    if (both('r5')) {
      html += '<div class="cmp-section"><h2>⏳ Plazos y miedos</h2><p class="muted">Para hacer en persona: cada uno pidió una misión.</p><ul class="opp">' +
        D.r5.disparadores.map((t) => { const a = A.r5[t.id], b = B.r5[t.id]; return '<li><div class="q">' + esc(t.texto) + '</div>' +
          '<div class="ans a"><b>' + esc(A.name) + ':</b> pesa ' + a.w + ' de 5 · pide: ' + esc(D.r5.misiones[a.m]) + (a.t ? '<br>«' + esc(a.t) + '»' : '') + '</div>' +
          '<div class="ans b"><b>' + esc(B.name) + ':</b> pesa ' + b.w + ' de 5 · pide: ' + esc(D.r5.misiones[b.m]) + (b.t ? '<br>«' + esc(b.t) + '»' : '') + '</div></li>'; }).join('') + '</ul>' +
        '<h3>Línea de tiempo</h3>' + timeline() + '</div>';
    }
    const missing = RONDAS.filter((k) => k !== 'r3' && !both(k)).map((k) => meta(k).nombre + (A[k] ? ' (te falta a ti)' : B[k] ? ' (le falta a ' + A.name + ')' : ''));
    while (pend.length < 3 && missing.length) pend.push('Falta ' + missing.shift() + ' para tener la foto completa.');
    const summary = '✨ Se alinearon las estrellas · ' + A.name + ' y ' + B.name + ' · ' + coinc.length + ' coincidencias, ' + difs.length + ' diferencias · ' + location.href.split('#')[0];

    render('<section class="screen compare">' +
      '<p class="kicker">El acuerdo</p><h2>' + esc(A.name) + '<span class="vs">y</span>' + esc(B.name) + '</h2>' +
      '<p class="coin">Coinciden en <b>' + coinc.length + '</b> y difieren en <b>' + difs.length + '</b> de las respuestas comparables.</p>' +
      (missing.length ? '<p class="muted small">Pendientes: ' + esc(missing.join(', ')) + '.</p>' : '') +
      html +
      '<div class="cmp-section"><h2>❓ Tres preguntas pendientes</h2><ol class="pend">' + pend.slice(0, 3).map((p) => '<li>' + esc(p) + '</li>').join('') + '</ol></div>' +
      '<div class="cmp-section"><h2>📅 Próximos pasos</h2><ul class="pasos">' + D.r6.pasos.map((p) => '<li><span class="tl-date">' + esc(p.fecha) + '</span><b>' + esc(p.quien) + '</b> ' + esc(p.t) + '</li>').join('') + '</ul></div>' +
      '<div class="actions"><p class="warn">🔒 ' + esc(D.r6.avisoCompartir) + '</p><a class="btn wa" href="' + esc(waLink(summary)) + '" target="_blank" rel="noopener">Compartir el resumen</a>' + btn('menu', 'Volver al menú', 'ghost') + '</div>' +
      '<div class="fine"><b>Letra pequeña.</b> Esto es para conversar, no para ganar. Las reglas de visas y licencias cambian; antes de decidir, confirmar en las fuentes.</div>' +
      '</section>');
    animateBars();
    $('#menu').addEventListener('click', showMenu);
  }

  /* ---------- fuentes ---------- */
  function showFuentes() {
    const all = [];
    D.r3.cartas.forEach((c) => c.datos.forEach((d) => all.push(d)));
    D.r4.ciudades.forEach((c) => c.carlos.concat(c.karen).forEach((d) => all.push({ t: c.nombre + ': ' + d.t, estado: d.estado, fuente: d.url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0], url: d.url })));
    render('<section class="screen result"><header class="bar"><button type="button" class="icon" id="to-menu" aria-label="Volver">‹</button><div class="bar-title">🔬 Fuentes<span class="bar-sub">' + all.length + ' datos</span></div></header>' +
      '<p class="muted">' + esc(D.fuentes.nota) + '</p><ul class="datos">' + all.map(datoLi).join('') + '</ul></section>');
    bindBar();
  }

  const SCREENS = { r0: showR0, r1: showR1, r2: showR2, r3: showR3, r4: showR4, r5: showR5 };

  /* ---------- arranque ---------- */
  challenger = readHash();
  if (S.name) showMenu(); else showIntro();

  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
    try { navigator.serviceWorker.register('sw.js'); } catch (e) { /* sin sw */ }
  }
})();
