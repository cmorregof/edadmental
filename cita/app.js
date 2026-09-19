/* =====================================================================
   La carta de la noche — lógica
   Un solo celular. Sin servidor. El progreso se guarda en el navegador
   para que la noche siga donde iba si el teléfono se bloquea.
   ===================================================================== */
(function () {
  'use strict';

  const C = window.CARTA;
  const KEY = 'carta-noche-v1';
  const app = document.getElementById('app');

  /* ---------- estado ---------- */
  function fresh() {
    return {
      v: 1,
      names: { a: 'Carlos', b: 'Karen' },
      mode: 'completo',
      theme: 'dark',
      screen: 'intro',
      current: null,
      order: {},      // platoId -> [{s:'main'|'extra', i}]
      used: {},       // platoId -> {main:[idx], extra:[idx]}
      prog: {},       // platoId -> progreso
      served: {},     // platoId -> true
      segunda: {},    // platoId -> true si está en segunda vuelta
      scores: {
        lectura: { a: { ok: 0, n: 0 }, b: { ok: 0, n: 0 } },
        sinc: { ok: 0, n: 0 },
        duelo: null,
        dosv: { a: null, b: null }
      },
      skips: { a: 3, b: 3 },
      cartasServidas: 0,
      textos: { postre: {}, regalo: { a: '', b: '' }, pendiente: { a: '', b: '' } },
      relampago: { i: 0, done: false }
    };
  }

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return null;
      const s = JSON.parse(raw);
      if (!s || s.v !== 1) return null;
      return s;
    } catch (e) { return null; }
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* sin memoria: seguimos igual */ }
  }

  let S = load() || fresh();
  let sciOpen = false;
  let timer = null;

  /* ---------- utilidades ---------- */
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const $ = (sel) => app.querySelector(sel);
  const $$ = (sel) => Array.from(app.querySelectorAll(sel));
  const name = (k) => S.names[k];
  const other = (k) => (k === 'a' ? 'b' : 'a');
  const plato = (id) => C.platos.find((p) => p.id === id);
  const platoIndex = (id) => C.platos.findIndex((p) => p.id === id);
  const fill = (t, a, b) => t.replace('{a}', esc(name(a))).replace('{b}', esc(name(b)));

  function stopTimer() { if (timer) { clearInterval(timer); clearTimeout(timer); timer = null; } }

  function applyTheme() {
    document.documentElement.setAttribute('data-theme', S.theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', S.theme === 'dark' ? '#14121b' : '#fbf6ee');
  }

  function go(screen, current) {
    stopTimer();
    sciOpen = false;
    if (screen) S.screen = screen;
    if (current !== undefined) S.current = current;
    save();
    draw();
  }

  function render(html) {
    app.innerHTML = html;
    window.scrollTo(0, 0);
    const s = $('.screen');
    if (s) requestAnimationFrame(() => s.classList.add('in'));
  }

  /* ---------- cartas: orden, repuesto, saltos ---------- */
  function ensureUsed(id) {
    if (!S.used[id]) S.used[id] = { main: [], extra: [] };
    return S.used[id];
  }
  function firstUnused(id, src) {
    const p = plato(id), list = src === 'main' ? p.cartas : p.extra, used = ensureUsed(id)[src];
    for (let i = 0; i < list.length; i++) if (used.indexOf(i) === -1) return i;
    return -1;
  }
  function remaining(id) {
    const p = plato(id), u = ensureUsed(id);
    return (p.cartas.length - u.main.length) + (p.extra.length - u.extra.length);
  }
  function takeSpare(id) {
    let i = firstUnused(id, 'extra');
    if (i !== -1) { ensureUsed(id).extra.push(i); return { s: 'extra', i }; }
    i = firstUnused(id, 'main');
    if (i !== -1) { ensureUsed(id).main.push(i); return { s: 'main', i }; }
    return null;
  }
  function buildOrder(id, segunda) {
    const p = plato(id), u = ensureUsed(id);
    const order = [];
    if (!segunda) {
      const fixed = p.tipo === 'retos' || p.tipo === 'cuenta';
      const n = (S.mode === 'corto' && !fixed) ? Math.ceil(p.cartas.length / 2) : p.cartas.length;
      for (let i = 0; i < n; i++) { u.main.push(i); order.push({ s: 'main', i }); }
    } else {
      let ref;
      while ((ref = takeSpare(id))) order.push(ref);
    }
    S.order[id] = order;
    S.prog[id] = freshProg(id);
  }
  function freshProg(id) {
    const p = plato(id);
    const prog = { i: 0, step: 'answer', secret: null, guess: null, sub: null };
    if (p.tipo === 'retos') prog.sub = freshSub(p.cartas[0]);
    return prog;
  }
  function freshSub(reto) {
    if (reto.k === 'sincronia') return { c: 0, phase: 'ready' };
    if (reto.k === 'duelo') return { phase: 'ready', who: null, secs: null };
    if (reto.k === 'dosverdades') return { phase: 'a_tells' };
    return { phase: 'ready' };
  }
  function cardAt(id) {
    const p = plato(id), ref = S.order[id][S.prog[id].i];
    return ref.s === 'main' ? p.cartas[ref.i] : p.extra[ref.i];
  }
  function starter(id) { return platoIndex(id) % 2 === 0 ? 'a' : 'b'; }
  function responder(id) {
    const st = starter(id), i = S.prog[id].i;
    return i % 2 === 0 ? st : other(st);
  }

  function openPlato(id, segunda) {
    if (!S.order[id] || S.served[id] || segunda) buildOrder(id, !!segunda);
    S.segunda[id] = !!segunda;
    if (segunda) delete S.served[id];
    go('plato', id);
  }

  function nextCard(id) {
    const prog = S.prog[id];
    S.cartasServidas++;
    prog.i++;
    prog.step = 'answer'; prog.secret = null; prog.guess = null;
    if (prog.i >= S.order[id].length) finishPlato(id);
    else {
      const p = plato(id);
      if (p.tipo === 'retos') prog.sub = freshSub(cardAt(id));
      go();
    }
  }
  function finishPlato(id) {
    S.served[id] = true;
    if (id === 'cuenta' && !S.segunda[id]) go('resumen', id);
    else go('cierre', id);
  }
  function swapCard(id) {
    const ref = takeSpare(id);
    if (!ref) { skipCard(id, null); return; }
    const prog = S.prog[id];
    S.order[id][prog.i] = ref;
    prog.step = 'answer'; prog.secret = null; prog.guess = null;
    if (plato(id).tipo === 'retos') prog.sub = freshSub(cardAt(id));
    go();
  }
  function skipCard(id, who) {
    if (who) S.skips[who] = Math.max(0, S.skips[who] - 1);
    const prog = S.prog[id];
    prog.i++;
    prog.step = 'answer'; prog.secret = null; prog.guess = null;
    if (prog.i >= S.order[id].length) finishPlato(id);
    else {
      if (plato(id).tipo === 'retos') prog.sub = freshSub(cardAt(id));
      go();
    }
  }

  /* ---------- piezas de interfaz ---------- */
  function sciPanel(items) {
    return '<div class="sci-panel" id="sci-panel"' + (sciOpen ? '' : ' hidden') + '>' +
      '<p class="sci-title">🔬 Por qué funciona</p>' +
      items.map((c) => '<p class="sci-item">' + esc(c.texto) + ' <a href="' + esc(c.url) + '" target="_blank" rel="noopener">' + esc(c.fuente) + '</a></p>').join('') +
      '</div>';
  }
  function bindSci() {
    const b = $('#sci'), p = $('#sci-panel');
    if (!b || !p) return;
    b.addEventListener('click', () => { sciOpen = !sciOpen; p.hidden = !sciOpen; b.classList.toggle('on', sciOpen); });
  }
  function bar(id, extraLabel) {
    const p = plato(id), n = S.order[id].length, i = Math.min(S.prog[id].i, n - 1);
    return '<header class="bar">' +
      '<button type="button" class="icon" id="to-menu" aria-label="Volver a la carta">‹</button>' +
      '<div class="bar-title">' + p.emoji + ' ' + esc(p.nombre) + (S.segunda[id] ? ' · 2ª vuelta' : '') + '<span class="bar-sub">' + (extraLabel || ('carta ' + (i + 1) + ' de ' + n)) + '</span></div>' +
      '<button type="button" class="icon' + (sciOpen ? ' on' : '') + '" id="sci" aria-label="Por qué funciona">🔬</button>' +
      '</header>' +
      '<div class="progress"><div class="progress-bar" style="width:' + Math.round((i / n) * 100) + '%"></div></div>' +
      sciPanel(p.ciencia);
  }
  function bindBar(id) {
    $('#to-menu').addEventListener('click', () => go(S.segunda[id] ? 'llevar' : 'menu'));
    bindSci();
  }
  function cardActions(id, who) {
    const spare = remaining(id) > 0;
    let skip;
    if (who) {
      skip = '<button type="button" class="link" id="skip" data-who="' + who + '"' + (S.skips[who] ? '' : ' disabled') + '>Saltar · ' + esc(name(who)) + ' (' + S.skips[who] + ')</button>';
    } else {
      skip = '<span class="link-group">Saltar: ' +
        '<button type="button" class="link" id="skip-a" data-who="a"' + (S.skips.a ? '' : ' disabled') + '>' + esc(name('a')) + ' (' + S.skips.a + ')</button> · ' +
        '<button type="button" class="link" id="skip-b" data-who="b"' + (S.skips.b ? '' : ' disabled') + '>' + esc(name('b')) + ' (' + S.skips.b + ')</button></span>';
    }
    return '<div class="card-actions">' +
      '<button type="button" class="link" id="swap"' + (spare ? '' : ' disabled') + '>↻ Otra carta' + (spare ? '' : ' (no quedan)') + '</button>' +
      skip +
      '</div>';
  }
  function bindCardActions(id) {
    const sw = $('#swap'); if (sw) sw.addEventListener('click', () => swapCard(id));
    $$('[id^="skip"]').forEach((b) => b.addEventListener('click', () => skipCard(id, b.getAttribute('data-who'))));
  }
  const btn = (id, label, cls) => '<button type="button" class="btn ' + (cls || 'primary') + '" id="' + id + '">' + label + '</button>';

  /* ---------- pantallas ---------- */
  function draw() {
    applyTheme();
    switch (S.screen) {
      case 'intro': return drawIntro();
      case 'menu': return drawMenu();
      case 'nombres': return drawNombres();
      case 'plato': return drawPlato();
      case 'cierre': return drawCierre();
      case 'resumen': return drawResumen();
      case 'llevar': return drawLlevar();
      case 'relampago': return drawRelampago();
      default: S.screen = 'intro'; return drawIntro();
    }
  }

  function drawIntro() {
    render(
      '<section class="screen intro">' +
        '<p class="kicker">' + esc(C.fecha) + '</p>' +
        '<h1>La carta<br>de la noche</h1>' +
        '<p class="lead">Seis platos para conocerse de seis formas. Un solo celular, que se pasa. Se sirve entre la cena y las copas.</p>' +
        '<form id="start" autocomplete="off">' +
          '<div class="row2">' +
            '<label>Primera persona<input id="na" type="text" maxlength="20" required value="' + esc(S.names.a) + '"></label>' +
            '<label>Segunda persona<input id="nb" type="text" maxlength="20" required value="' + esc(S.names.b) + '"></label>' +
          '</div>' +
          '<div class="seg" role="radiogroup" aria-label="Duración">' +
            '<button type="button" class="seg-btn' + (S.mode === 'corto' ? ' on' : '') + '" data-mode="corto"><b>Corto</b><span>unos 30 min</span></button>' +
            '<button type="button" class="seg-btn' + (S.mode === 'completo' ? ' on' : '') + '" data-mode="completo"><b>Completo</b><span>una hora, repartida</span></button>' +
          '</div>' +
          btn('open', 'Abrir la carta') +
        '</form>' +
        '<div class="rules">' +
          '<p class="rules-title">Reglas de la casa <button type="button" class="icon small" id="sci" aria-label="Por qué">🔬</button></p>' +
          '<ol>' + C.reglas.map((r) => '<li>' + esc(r) + '</li>').join('') + '</ol>' +
          sciPanel(C.reglasCiencia) +
        '</div>' +
        '<p class="tiny">Funciona sin señal una vez abierta. Si el celular se bloquea, la noche sigue donde iba.</p>' +
      '</section>'
    );
    $$('.seg-btn').forEach((b) => b.addEventListener('click', () => {
      S.mode = b.getAttribute('data-mode');
      $$('.seg-btn').forEach((x) => x.classList.toggle('on', x === b));
    }));
    bindSci();
    const start = (e) => {
      e.preventDefault();
      const a = $('#na').value.trim(), b = $('#nb').value.trim();
      if (!a || !b) { $(a ? '#nb' : '#na').focus(); return; }
      S.names = { a, b };
      go('menu');
    };
    $('#start').addEventListener('submit', start);
    $('#open').addEventListener('click', start);
  }

  function drawMenu() {
    const rows = C.platos.map((p, idx) => {
      const served = !!S.served[p.id], started = !!S.order[p.id] && !served;
      const status = served ? '<span class="status ok">Servido</span>' : started ? '<span class="status live">En curso</span>' : '<span class="status">' + esc(p.min) + '</span>';
      return '<button type="button" class="menu-row' + (served ? ' served' : '') + '" data-id="' + p.id + '">' +
        '<span class="menu-emoji">' + p.emoji + '</span>' +
        '<span class="menu-text"><span class="menu-name">' + (idx + 1) + '. ' + esc(p.nombre) + ' <em>' + esc(p.titulo) + '</em></span><span class="menu-sub">' + esc(p.sub) + '</span></span>' +
        status + '</button>';
    }).join('');
    const llevarOpen = !!S.served.cuenta;
    render(
      '<section class="screen menu">' +
        '<p class="kicker">' + esc(name('a')) + ' y ' + esc(name('b')) + ' · ' + esc(C.fecha) + '</p>' +
        '<h1>La carta</h1>' +
        '<p class="lead">Pidan en orden o como quieran. Cada plato termina con «guarden el celular».</p>' +
        '<div class="menu-list">' + rows +
          '<button type="button" class="menu-row llevar' + (llevarOpen ? '' : ' locked') + '" data-id="llevar"' + (llevarOpen ? '' : ' disabled') + '>' +
            '<span class="menu-emoji">🥡</span>' +
            '<span class="menu-text"><span class="menu-name">Para llevar</span><span class="menu-sub">' + (llevarOpen ? 'Ronda relámpago y segunda vuelta de cada plato.' : 'Se abre después de pedir la cuenta.') + '</span></span>' +
            '<span class="status">' + (llevarOpen ? 'Abierto' : '🔒') + '</span>' +
          '</button>' +
        '</div>' +
        '<div class="menu-foot">' +
          '<button type="button" class="link" id="nombres">Nombres</button>' +
          '<button type="button" class="link" id="theme">' + (S.theme === 'dark' ? 'Modo claro' : 'Modo oscuro') + '</button>' +
          (S.served.cuenta ? '<button type="button" class="link" id="resumen">Resumen</button>' : '') +
          '<button type="button" class="link danger" id="reset">Reiniciar la noche</button>' +
        '</div>' +
      '</section>'
    );
    $$('.menu-row').forEach((b) => b.addEventListener('click', () => {
      const id = b.getAttribute('data-id');
      if (id === 'llevar') { go('llevar'); return; }
      if (S.served[id]) { if (confirm('Este plato ya se sirvió. ¿Repetirlo desde el principio con las mismas cartas?')) { delete S.served[id]; S.prog[id] = freshProg(id); openPlato(id, false); } return; }
      openPlato(id, false);
    }));
    $('#nombres').addEventListener('click', () => go('nombres'));
    $('#theme').addEventListener('click', () => { S.theme = S.theme === 'dark' ? 'light' : 'dark'; go(); });
    const r = $('#resumen'); if (r) r.addEventListener('click', () => go('resumen'));
    $('#reset').addEventListener('click', () => {
      if (confirm('¿Borrar todo el progreso de la noche y empezar de cero?')) { const t = S.theme; S = fresh(); S.theme = t; go('intro'); }
    });
  }

  function drawNombres() {
    render(
      '<section class="screen">' +
        '<h2>¿Quiénes son?</h2>' +
        '<form id="f" autocomplete="off">' +
          '<label>Primera persona<input id="na" type="text" maxlength="20" required value="' + esc(S.names.a) + '"></label>' +
          '<label>Segunda persona<input id="nb" type="text" maxlength="20" required value="' + esc(S.names.b) + '"></label>' +
          btn('ok', 'Guardar') +
          btn('cancel', 'Cancelar', 'ghost') +
        '</form>' +
      '</section>'
    );
    const ok = (e) => {
      e.preventDefault();
      const a = $('#na').value.trim(), b = $('#nb').value.trim();
      if (a && b) S.names = { a, b };
      go('menu');
    };
    $('#f').addEventListener('submit', ok);
    $('#ok').addEventListener('click', ok);
    $('#cancel').addEventListener('click', () => go('menu'));
  }

  /* ---------- plato: despacho ---------- */
  function drawPlato() {
    const id = S.current, p = plato(id);
    if (!S.order[id] || !S.prog[id]) { buildOrder(id, false); save(); }
    if (S.prog[id].i >= S.order[id].length) { finishPlato(id); return; }
    switch (p.tipo) {
      case 'adivina': return drawAdivina(id);
      case 'turnos': return drawTurnos(id);
      case 'historias': return drawHistorias(id);
      case 'juntos': return drawJuntos(id);
      case 'retos': return drawRetos(id);
      case 'cuenta': return drawCuenta(id);
    }
  }

  /* ---------- Aperitivo: adivina ---------- */
  function drawAdivina(id) {
    const prog = S.prog[id], card = cardAt(id), X = responder(id), Y = other(X);
    let body;
    if (prog.step === 'answer') {
      body = '<p class="turno">Turno secreto de <b>' + esc(name(X)) + '</b>. ' + esc(name(Y)) + ', mira para otro lado.</p>' +
        '<h2 class="q">' + esc(card.q) + '</h2>' +
        '<div class="options">' + card.o.map((o, i) => '<button type="button" class="option" data-i="' + i + '">' + esc(o) + '</button>').join('') + '</div>' +
        cardActions(id, X);
    } else if (prog.step === 'pass') {
      body = '<div class="center"><div class="big-emoji">📱</div><h2>Pásale el celular a ' + esc(name(Y)) + '</h2><p class="muted">Sin mostrar la pantalla.</p>' + btn('go', 'Soy ' + esc(name(Y)) + ', listo') + '</div>';
    } else if (prog.step === 'guess') {
      body = '<p class="turno"><b>' + esc(name(Y)) + '</b>, ¿qué respondió ' + esc(name(X)) + '?</p>' +
        '<h2 class="q">' + esc(card.q) + '</h2>' +
        '<div class="options">' + card.o.map((o, i) => '<button type="button" class="option" data-i="' + i + '">' + esc(o) + '</button>').join('') + '</div>';
    } else {
      const ok = prog.guess === prog.secret, L = S.scores.lectura[Y];
      body = '<div class="center reveal ' + (ok ? 'ok' : 'no') + '"><div class="big-emoji">' + (ok ? '🎯' : '🙃') + '</div>' +
        '<h2>' + (ok ? '¡Acierto!' : 'Nop.') + '</h2>' +
        '<p>' + esc(name(X)) + ' dijo: <b>' + esc(card.o[prog.secret]) + '</b></p>' +
        '<p>' + esc(name(Y)) + ' pensó: <b>' + esc(card.o[prog.guess]) + '</b></p>' +
        '<p class="muted">' + esc(name(Y)) + ' lee a ' + esc(name(X)) + ': ' + L.ok + ' de ' + L.n + '</p>' +
        btn('next', 'Siguiente') + '</div>';
    }
    render('<section class="screen plato">' + bar(id) + body + '</section>');
    bindBar(id);
    if (prog.step === 'answer') {
      $$('.option').forEach((b) => b.addEventListener('click', () => { prog.secret = +b.getAttribute('data-i'); prog.step = 'pass'; go(); }));
      bindCardActions(id);
    } else if (prog.step === 'pass') {
      $('#go').addEventListener('click', () => { prog.step = 'guess'; go(); });
    } else if (prog.step === 'guess') {
      $$('.option').forEach((b) => b.addEventListener('click', () => {
        prog.guess = +b.getAttribute('data-i');
        const L = S.scores.lectura[Y]; L.n++; if (prog.guess === prog.secret) L.ok++;
        prog.step = 'reveal'; go();
      }));
    } else {
      $('#next').addEventListener('click', () => nextCard(id));
    }
  }

  /* ---------- Entrada: turnos con repregunta ---------- */
  function drawTurnos(id) {
    const prog = S.prog[id], card = cardAt(id);
    const first = responder(id), second = other(first);
    const X = prog.step === 'answer' ? first : second, Y = other(X);
    render(
      '<section class="screen plato">' + bar(id) +
        '<span class="nivel">Nivel ' + card.n + ' de 3</span>' +
        '<p class="turno">Responde <b>' + esc(name(X)) + '</b>. ' + esc(name(Y)) + ' escucha y repregunta.</p>' +
        '<h2 class="q">' + esc(card.q) + '</h2>' +
        '<p class="chips-label">Repreguntas para ' + esc(name(Y)) + ':</p>' +
        '<div class="chips">' + card.r.map((r) => '<span class="chip">' + esc(r) + '</span>').join('') + '</div>' +
        (prog.step === 'answer'
          ? btn('next', 'Ahora responde ' + esc(name(Y)))
          : btn('next', 'Siguiente carta')) +
        (prog.step === 'answer' ? cardActions(id, X) : '') +
      '</section>'
    );
    bindBar(id);
    if (prog.step === 'answer') { $('#next').addEventListener('click', () => { prog.step = 'second'; go(); }); bindCardActions(id); }
    else $('#next').addEventListener('click', () => nextCard(id));
  }

  /* ---------- Plato fuerte: historias con misión ---------- */
  function drawHistorias(id) {
    const card = cardAt(id), X = responder(id), Y = other(X);
    render(
      '<section class="screen plato">' + bar(id) +
        '<p class="turno">Cuenta <b>' + esc(name(X)) + '</b>.</p>' +
        '<h2 class="q">' + esc(card.q) + '</h2>' +
        '<div class="mision"><span class="mision-label">Misión para ' + esc(name(Y)) + '</span><p>' + esc(card.m) + '</p></div>' +
        btn('next', 'Siguiente carta') +
        cardActions(id, X) +
      '</section>'
    );
    bindBar(id);
    $('#next').addEventListener('click', () => nextCard(id));
    bindCardActions(id);
  }

  /* ---------- Postre: entre los dos ---------- */
  function drawJuntos(id) {
    const card = cardAt(id), key = id + ':' + card.q.slice(0, 24);
    render(
      '<section class="screen plato">' + bar(id) +
        '<p class="turno">Entre los dos.</p>' +
        '<h2 class="q">' + esc(card.q) + '</h2>' +
        '<label class="txt-label">' + esc(card.t) + ' <span class="opt">(opcional, sale en el resumen)</span>' +
          '<input id="txt" type="text" maxlength="80" value="' + esc(S.textos.postre[key] || '') + '"></label>' +
        btn('next', 'Siguiente carta') +
        cardActions(id, null) +
      '</section>'
    );
    bindBar(id);
    $('#next').addEventListener('click', () => { S.textos.postre[key] = $('#txt').value.trim(); nextCard(id); });
    bindCardActions(id);
  }

  /* ---------- Copas: retos ---------- */
  function drawRetos(id) {
    const prog = S.prog[id], reto = cardAt(id);
    if (!prog.sub) prog.sub = freshSub(reto);
    const sub = prog.sub;
    // los estados transitorios no sobreviven a una recarga
    if (reto.k === 'sincronia' && sub.phase === 'count') sub.phase = 'ready';
    if (reto.k === 'duelo' && sub.phase === 'run') sub.phase = 'ready';
    let body = '<h2 class="q">' + esc(reto.q) + '</h2><p class="desc">' + esc(reto.d) + '</p>';
    const nextLabel = prog.i + 1 < S.order[id].length ? 'Siguiente reto' : 'Terminar';

    if (reto.k === 'sincronia') {
      if (sub.phase === 'done') {
        body += '<div class="center"><div class="big-emoji">' + (S.scores.sinc.ok >= 3 ? '🔗' : '🎲') + '</div>' +
          '<p class="big-line">' + S.scores.sinc.ok + ' de ' + S.scores.sinc.n + ' coincidencias</p>' +
          '<p class="muted">' + (S.scores.sinc.ok >= 4 ? 'Sospechoso. Revisen si se pasaron las respuestas.' : S.scores.sinc.ok >= 2 ? 'Buena sintonía para ser la primera ronda.' : 'Dos mundos. Por eso la conversación no se acaba.') + '</p>' +
          btn('next', nextLabel) + '</div>';
      } else {
        body += '<p class="turno">Categoría ' + (sub.c + 1) + ' de ' + reto.cats.length + ' · coincidencias: ' + S.scores.sinc.ok + '</p>' +
          '<div class="cat" id="cat">' + esc(reto.cats[sub.c]) + '</div>' +
          '<div id="count" class="count" hidden></div>' +
          '<div id="ready">' + btn('start', 'A la de tres') + '</div>' +
          '<div id="verdict" class="row2" hidden><button type="button" class="btn primary" id="yes">🎯 Coincidimos</button><button type="button" class="btn ghost" id="no">Distintas</button></div>';
      }
    } else if (reto.k === 'duelo') {
      if (sub.phase === 'done') {
        body += '<div class="center"><div class="big-emoji">' + (sub.who === 'none' ? '🗿' : '😂') + '</div>' +
          '<p class="big-line">' + (sub.who === 'none' ? 'Nadie se rió en 60 segundos.' : 'Se rió primero ' + esc(name(sub.who)) + ' a los ' + sub.secs + ' s.') + '</p>' +
          '<p class="muted">' + (sub.who === 'none' ? 'Sospechoso. Kellerman lo advirtió.' : 'Perder aquí es la mejor forma de perder.') + '</p>' +
          btn('next', nextLabel) + '</div>';
      } else {
        body += '<div class="center"><div class="clock" id="clock">60</div>' +
          '<div id="ready">' + btn('start', 'Empezar') + '</div>' +
          '<div id="running" class="row2" hidden><button type="button" class="btn ghost" id="la">Se rió ' + esc(name('a')) + '</button><button type="button" class="btn ghost" id="lb">Se rió ' + esc(name('b')) + '</button></div></div>';
      }
    } else if (reto.k === 'dosverdades') {
      const ph = sub.phase;
      const T = ph.charAt(0), G = other(T); // T cuenta, G adivina
      if (ph === 'done') {
        const da = S.scores.dosv, line = (k) => (da[k] === null ? '' : esc(name(other(k))) + (da[k] ? ' descubrió' : ' no descubrió') + ' la mentira de ' + esc(name(k)) + '.');
        body += '<div class="center"><div class="big-emoji">🕵️</div><p class="big-line">' + line('a') + '<br>' + line('b') + '</p>' + btn('next', nextLabel) + '</div>';
      } else if (ph.endsWith('_tells')) {
        body += '<p class="turno"><b>' + esc(name(T)) + '</b> dice tres cosas. <b>' + esc(name(G)) + '</b> adivina cuál es la mentira.</p>' + btn('go', esc(name(G)) + ' ya adivinó');
      } else {
        body += '<p class="turno">¿<b>' + esc(name(G)) + '</b> acertó?</p><div class="row2"><button type="button" class="btn primary" id="yes">Acertó</button><button type="button" class="btn ghost" id="no">Falló</button></div>';
      }
    } else {
      body += '<p class="turno">Los dos.</p>' + btn('next', nextLabel);
    }
    if (sub.phase === 'ready' || (reto.k === 'dosverdades' && sub.phase === 'a_tells')) body += cardActions(id, null);

    render('<section class="screen plato">' + bar(id) + body + '</section>');
    bindBar(id);
    bindCardActions(id);
    const nx = $('#next'); if (nx) nx.addEventListener('click', () => nextCard(id));

    if (reto.k === 'sincronia' && sub.phase !== 'done') {
      $('#start').addEventListener('click', () => {
        $('#ready').hidden = true; const c = $('#count'); c.hidden = false;
        const seq = ['3', '2', '1', '¡YA!']; let k = 0;
        c.textContent = seq[0];
        timer = setInterval(() => {
          k++; if (k < seq.length) { c.textContent = seq[k]; c.classList.toggle('go', k === 3); }
          if (k >= seq.length - 1) { clearInterval(timer); timer = null; $('#verdict').hidden = false; }
        }, 800);
      });
      const verdict = (ok) => {
        S.scores.sinc.n++; if (ok) S.scores.sinc.ok++;
        sub.c++; if (sub.c >= reto.cats.length) sub.phase = 'done';
        go();
      };
      $('#yes').addEventListener('click', () => verdict(true));
      $('#no').addEventListener('click', () => verdict(false));
    }
    if (reto.k === 'duelo' && sub.phase !== 'done') {
      $('#start').addEventListener('click', () => {
        $('#ready').hidden = true; $('#running').hidden = false;
        let secs = 60; const clock = $('#clock');
        const end = (who) => {
          stopTimer(); sub.phase = 'done'; sub.who = who; sub.secs = 60 - secs; S.scores.duelo = { who, secs: 60 - secs }; go();
        };
        timer = setInterval(() => { secs--; clock.textContent = secs; if (secs <= 0) end('none'); }, 1000);
        $('#la').addEventListener('click', () => end('a'));
        $('#lb').addEventListener('click', () => end('b'));
      });
    }
    if (reto.k === 'dosverdades' && sub.phase !== 'done') {
      const ph = sub.phase, T = ph.charAt(0);
      const g = $('#go'); if (g) g.addEventListener('click', () => { sub.phase = T + '_check'; go(); });
      const y = $('#yes'), n = $('#no');
      const rec = (ok) => { S.scores.dosv[T] = ok; sub.phase = T === 'a' ? 'b_tells' : 'done'; go(); };
      if (y) y.addEventListener('click', () => rec(true));
      if (n) n.addEventListener('click', () => rec(false));
    }
  }

  /* ---------- La cuenta ---------- */
  function drawCuenta(id) {
    const card = cardAt(id);
    let body = '<h2 class="q">' + esc(card.q) + '</h2>';
    if (card.k === 'voz') {
      body += '<p class="turno">Lo dice <b>' + esc(name('a')) + '</b>. Luego <b>' + esc(name('b')) + '</b>. En voz alta.</p>';
    } else {
      const store = S.textos[card.k];
      body += '<label class="txt-label">' + fill(card.t, 'a', 'b') + '<input id="ta" type="text" maxlength="120" value="' + esc(store.a) + '"></label>' +
        '<label class="txt-label">' + fill(card.t, 'b', 'a') + '<input id="tb" type="text" maxlength="120" value="' + esc(store.b) + '"></label>' +
        '<p class="tiny">Se puede decir en voz alta y escribir solo una palabra. Sale en el resumen.</p>';
    }
    body += btn('next', S.prog[id].i + 1 < S.order[id].length ? 'Siguiente' : 'Pedir la cuenta');
    render('<section class="screen plato">' + bar(id) + body + '</section>');
    bindBar(id);
    $('#next').addEventListener('click', () => {
      if (card.k !== 'voz') { S.textos[card.k].a = $('#ta').value.trim(); S.textos[card.k].b = $('#tb').value.trim(); }
      nextCard(id);
    });
  }

  /* ---------- cierre de plato ---------- */
  function drawCierre() {
    const id = S.current, p = plato(id);
    let extra = '';
    if (p.tipo === 'adivina') {
      const L = S.scores.lectura;
      extra = '<p class="stat">' + esc(name('a')) + ' leyó a ' + esc(name('b')) + ': <b>' + L.a.ok + ' de ' + L.a.n + '</b><br>' + esc(name('b')) + ' leyó a ' + esc(name('a')) + ': <b>' + L.b.ok + ' de ' + L.b.n + '</b></p>';
    }
    render(
      '<section class="screen cierre center">' +
        '<div class="big-emoji">📵</div>' +
        '<h2>Guarden el celular</h2>' +
        '<p class="lead">' + esc(p.cierre) + '</p>' + extra +
        btn('back', S.segunda[id] ? 'Volver a Para llevar' : 'Volver a la carta') +
      '</section>'
    );
    $('#back').addEventListener('click', () => go(S.segunda[id] ? 'llevar' : 'menu'));
  }

  /* ---------- resumen ---------- */
  function resumenLines() {
    const A = name('a'), B = name('b'), L = S.scores.lectura, lines = [];
    if (L.a.n || L.b.n) lines.push('Lectura mutua: ' + A + ' leyó a ' + B + ' ' + L.a.ok + '/' + L.a.n + ' · ' + B + ' leyó a ' + A + ' ' + L.b.ok + '/' + L.b.n);
    if (S.scores.sinc.n) lines.push('Sincronía: ' + S.scores.sinc.ok + ' de ' + S.scores.sinc.n + ' coincidencias');
    if (S.scores.duelo) lines.push('Duelo de miradas: ' + (S.scores.duelo.who === 'none' ? 'nadie se rió en 60 s' : 'se rió primero ' + name(S.scores.duelo.who) + ' a los ' + S.scores.duelo.secs + ' s'));
    const d = S.scores.dosv;
    if (d.a !== null || d.b !== null) lines.push('Dos verdades y una mentira: ' + [d.a === null ? null : B + (d.a ? ' descubrió' : ' no descubrió') + ' la de ' + A, d.b === null ? null : A + (d.b ? ' descubrió' : ' no descubrió') + ' la de ' + B].filter(Boolean).join(' · '));
    Object.keys(S.textos.postre).forEach((k) => { if (S.textos.postre[k]) lines.push('Postre: ' + S.textos.postre[k]); });
    if (S.textos.regalo.a) lines.push('Regalo de ' + A + ' para ' + B + ': ' + S.textos.regalo.a);
    if (S.textos.regalo.b) lines.push('Regalo de ' + B + ' para ' + A + ': ' + S.textos.regalo.b);
    if (S.textos.pendiente.a) lines.push('Pendiente de ' + A + ': ' + S.textos.pendiente.a);
    if (S.textos.pendiente.b) lines.push('Pendiente de ' + B + ': ' + S.textos.pendiente.b);
    lines.push('Cartas servidas: ' + S.cartasServidas);
    return lines;
  }
  function shareText() {
    return '🍽️ La carta de la noche · ' + name('a') + ' y ' + name('b') + ' · ' + C.fecha + '\n' + resumenLines().join('\n');
  }
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text).then(() => true, () => false);
    return Promise.resolve(false);
  }
  function drawResumen() {
    const lines = resumenLines();
    render(
      '<section class="screen resumen">' +
        '<p class="kicker">Resumen de la noche</p>' +
        '<h1>' + esc(name('a')) + ' y ' + esc(name('b')) + '</h1>' +
        '<ul class="lines">' + lines.map((l) => '<li>' + esc(l) + '</li>').join('') + '</ul>' +
        '<div class="actions">' +
          '<a class="btn wa" href="https://wa.me/?text=' + encodeURIComponent(shareText()) + '" target="_blank" rel="noopener">Compartir por WhatsApp</a>' +
          btn('copy', 'Copiar resumen', 'ghost') +
          btn('llevar', '🥡 Para llevar') +
          btn('menu', 'Volver a la carta', 'ghost') +
        '</div>' +
        '<p class="toast" id="toast"></p>' +
      '</section>'
    );
    $('#copy').addEventListener('click', () => copyText(shareText()).then((ok) => { $('#toast').textContent = ok ? '✓ Copiado.' : 'No se pudo copiar; usa WhatsApp.'; }));
    $('#llevar').addEventListener('click', () => go('llevar'));
    $('#menu').addEventListener('click', () => go('menu'));
  }

  /* ---------- Para llevar ---------- */
  function drawLlevar() {
    const rows = C.platos.filter((p) => p.tipo !== 'cuenta').map((p) => {
      const left = remaining(p.id), live = S.segunda[p.id] && !S.served[p.id] && S.order[p.id];
      return '<button type="button" class="menu-row' + (left || live ? '' : ' locked') + '" data-id="' + p.id + '"' + (left || live ? '' : ' disabled') + '>' +
        '<span class="menu-emoji">' + p.emoji + '</span>' +
        '<span class="menu-text"><span class="menu-name">' + esc(p.nombre) + ' <em>segunda vuelta</em></span><span class="menu-sub">' + (live ? 'En curso' : left ? left + (left === 1 ? ' carta' : ' cartas') + ' de repuesto' : 'Se acabaron') + '</span></span>' +
        '<span class="status">' + (live ? '▶' : left ? '+' + left : '✓') + '</span></button>';
    }).join('');
    const R = C.relampago, rl = S.relampago;
    render(
      '<section class="screen menu">' +
        '<p class="kicker">🥡 Para llevar</p>' +
        '<h1>¿Todavía hay noche?</h1>' +
        '<p class="lead">Pidan otra ronda.</p>' +
        '<div class="menu-list">' +
          '<button type="button" class="menu-row" data-id="relampago"><span class="menu-emoji">' + R.emoji + '</span>' +
            '<span class="menu-text"><span class="menu-name">' + esc(R.nombre) + '</span><span class="menu-sub">' + esc(R.sub) + '</span></span>' +
            '<span class="status' + (rl.done ? ' ok' : '') + '">' + (rl.done ? 'Hecha' : rl.i ? 'En curso' : R.cartas.length + ' preguntas') + '</span></button>' +
          rows +
        '</div>' +
        '<div class="menu-foot">' +
          '<button type="button" class="link" id="resumen">Resumen</button>' +
          '<button type="button" class="link" id="menu">Volver a la carta</button>' +
        '</div>' +
      '</section>'
    );
    $$('.menu-row').forEach((b) => b.addEventListener('click', () => {
      const id = b.getAttribute('data-id');
      if (id === 'relampago') { if (rl.done && !confirm('Ya la hicieron. ¿Repetirla?')) return; if (rl.done) S.relampago = { i: 0, done: false }; go('relampago'); return; }
      if (S.segunda[id] && !S.served[id] && S.order[id]) { go('plato', id); return; }
      openPlato(id, true);
    }));
    $('#resumen').addEventListener('click', () => go('resumen'));
    $('#menu').addEventListener('click', () => go('menu'));
  }

  function drawRelampago() {
    const R = C.relampago, rl = S.relampago, n = R.cartas.length;
    if (rl.i >= n) {
      rl.done = true;
      render('<section class="screen cierre center"><div class="big-emoji">⚡</div><h2>Fin de la ronda relámpago</h2><p class="lead">Guarden el celular. Lo que salió rápido, salió sincero.</p>' + btn('back', 'Volver a Para llevar') + '</section>');
      $('#back').addEventListener('click', () => go('llevar'));
      return;
    }
    const X = rl.i % 2 === 0 ? 'a' : 'b';
    render(
      '<section class="screen plato">' +
        '<header class="bar"><button type="button" class="icon" id="to-menu" aria-label="Volver">‹</button>' +
        '<div class="bar-title">' + R.emoji + ' ' + esc(R.nombre) + '<span class="bar-sub">' + (rl.i + 1) + ' de ' + n + '</span></div>' +
        '<button type="button" class="icon" id="sci" aria-label="Por qué funciona">🔬</button></header>' +
        '<div class="progress"><div class="progress-bar" style="width:' + Math.round((rl.i / n) * 100) + '%"></div></div>' +
        sciPanel(R.ciencia) +
        '<p class="turno">Responde <b>' + esc(name(X)) + '</b>. Una palabra.</p>' +
        '<h2 class="q big">' + esc(R.cartas[rl.i]) + '</h2>' +
        '<div class="flash" key="' + rl.i + '"><div class="flash-bar"></div></div>' +
        btn('next', 'Siguiente') +
      '</section>'
    );
    $('#to-menu').addEventListener('click', () => go('llevar'));
    bindSci();
    $('#next').addEventListener('click', () => { rl.i++; go(); });
  }

  /* ---------- arranque ---------- */
  applyTheme();
  draw();

  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
    try { navigator.serviceWorker.register('sw.js'); } catch (e) { /* sin sw: la página igual funciona */ }
  }
})();
