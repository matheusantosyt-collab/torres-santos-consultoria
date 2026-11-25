/* Torres Santos Consultoria — site. Vanilla JS, sem dependências. */
(() => {
  'use strict';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const root = document.documentElement;
    const mqPin = matchMedia('(min-width: 961px)');
  let reduce = root.classList.contains('reduce');

  /* ---------------- Reduzir animações (preferência do visitante) ---------------- */
  const calmBtn = $('#calmToggle');
  if (calmBtn) {
    calmBtn.textContent = reduce ? 'Ativar animações' : 'Reduzir animações';
    calmBtn.setAttribute('aria-pressed', String(reduce));
    calmBtn.addEventListener('click', () => {
      try { localStorage.setItem('tsc-calm', reduce ? '0' : '1'); } catch (e) {}
      const u = new URL(location.href);
      u.searchParams.delete('movimento');
      location.replace(u.toString());
    });
  }

  /* ---------------- Word splitting (headings) ---------------- */
  function splitWords(el) {
    const label = el.textContent.replace(/\s+/g, ' ').trim();
    let i = 0;
    const walk = (node) => {
      Array.from(node.childNodes).forEach((child) => {
        if (child.nodeType === 3) {
          const parts = child.textContent.split(/(\s+)/);
          const frag = document.createDocumentFragment();
          parts.forEach((p) => {
            if (!p) return;
            if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(' ')); return; }
            const w = document.createElement('span');
            w.className = 'w';
            w.setAttribute('aria-hidden', 'true');
            const inner = document.createElement('span');
            inner.textContent = p;
            inner.style.setProperty('--i', i++);
            w.appendChild(inner);
            frag.appendChild(w);
          });
          child.replaceWith(frag);
        } else if (child.nodeType === 1) {
          walk(child);
        }
      });
    };
    walk(el);
    el.setAttribute('aria-label', label);
  }
  $$('[data-split]').forEach(splitWords);

  /* ---------------- Statement words ---------------- */
  const stText = $('#statementText');
  const stWords = [];
  const stMarks = [];
  if (stText) {
    let idx = 0;
    const walk = (node, mark) => {
      Array.from(node.childNodes).forEach((child) => {
        if (child.nodeType === 3) {
          const frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach((p) => {
            if (!p) return;
            if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(p)); return; }
            const s = document.createElement('span');
            s.className = 'sw';
            s.textContent = p;
            stWords.push(s);
            if (mark) { mark.count++; }
            idx++;
            frag.appendChild(s);
          });
          child.replaceWith(frag);
        } else if (child.nodeType === 1 && child.classList.contains('hl')) {
          const m = { start: idx, count: 0, bar: null };
          walk(child, m);
          const bar = document.createElement('span');
          bar.className = 'hl-bar';
          bar.setAttribute('aria-hidden', 'true');
          child.prepend(bar);
          m.bar = bar;
          stMarks.push(m);
        }
      });
    };
    walk(stText, null);
  }

  /* ---------------- Reveal on view ---------------- */
  const intro = $('[data-intro]');
  const revealEls = $$('[data-rise], [data-split]:not([data-intro]), [data-reveal]');
  if (reduce || !('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.classList.add('is-in'));
    if (intro) intro.classList.add('is-in');
  } else {
    const io = new IntersectionObserver((entries) => {
      let n = 0;
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        if (el.hasAttribute('data-rise')) el.style.setProperty('--d', (n++ * 60) + 'ms');
        el.classList.add('is-in');
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    revealEls.forEach((el) => io.observe(el));

    if (intro) {
      const go = () => requestAnimationFrame(() => intro.classList.add('is-in'));
      const t = new Promise((r) => setTimeout(r, 450));
      Promise.race([document.fonts ? document.fonts.ready : t, t]).then(go);
    }
  }

  /* ---------------- Nav: scrolled state + chapter tone ---------------- */
  const nav = $('#nav');
  const chapters = $$('.chapter');
  const TOKENS = ['--bg', '--bg-2', '--text', '--text-2', '--rule', '--accent', '--btn-bg', '--btn-fg', '--btn-bg-h'];
  let currentChapter = chapters[0];
  function syncNavTone() {
    if (!currentChapter) return;
    const cs = getComputedStyle(currentChapter);
    TOKENS.forEach((t) => nav.style.setProperty(t, cs.getPropertyValue(t).trim()));
    nav.dataset.tone = currentChapter.classList.contains('chapter-ink') ? 'ink' : 'paper';
  }
  const visible = new Set();
  const pickChapter = () => {
    const y = 36;
    let found = null;
    visible.forEach((s) => {
      const r = s.getBoundingClientRect();
      if (r.top <= y && r.bottom > y) found = s;
    });
    if (found && found !== currentChapter) { currentChapter = found; syncNavTone(); }
  };
  if ('IntersectionObserver' in window) {
    const navIO = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
      pickChapter();
    }, { rootMargin: '0px 0px -94% 0px', threshold: 0 });
    chapters.forEach((c) => navIO.observe(c));
  }
  syncNavTone();

  /* ---------------- Mobile menu ---------------- */
  const menu = $('#menu');
  const menuBtn = $('#menuBtn');
  const menuClose = $('#menuClose');
  const openMenu = () => {
    menu.hidden = false;
    requestAnimationFrame(() => menu.classList.add('is-open'));
    menuBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    const first = $('.menu-links a', menu);
    if (first) first.focus({ preventScroll: true });
  };
  const closeMenu = (restore = true) => {
    if (menu.hidden) return;
    menu.classList.remove('is-open');
    menu.hidden = true;
    menuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (restore) menuBtn.focus({ preventScroll: true });
  };
  menuBtn.addEventListener('click', openMenu);
  menuClose.addEventListener('click', () => closeMenu());
  $$('a', menu).forEach((a) => a.addEventListener('click', () => closeMenu(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });

  /* ---------------- Marquee pause off-screen ---------------- */
  const marquee = $('#marquee');
  if (marquee && 'IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => marquee.classList.toggle('is-off', !e.isIntersecting)).observe(marquee);
  }

  /* ---------------- Método ---------------- */
  const met = $('#metodo');
  const sheet = $('#sheet');
  const steps = $$('#stepper button');
  const panels = $$('#panels .panel');
  const clauses = $$('.clause', sheet);
  const hlts = clauses.map((c) => $('.hlt', c));
  const sigPath = $('.sign-svg path', sheet);
  const SEG = 0.88 / 5;
  let activeStep = -1;
  let signed = false;

  // Small static copy for the stacked (mobile / reduced-motion) layout.
  const mini = $('#sheetMini');
  if (mini && sheet) {
    const c = sheet.cloneNode(true);
    c.removeAttribute('id');
    c.classList.add('is-complete');
    mini.appendChild(c);
  }

  function setStep(k) {
    if (k === activeStep) return;
    activeStep = k;
    steps.forEach((b, i) => b.classList.toggle('is-active', i === k));
    panels.forEach((p, i) => {
      p.classList.toggle('is-active', i === k);
      p.classList.toggle('is-before', i < k);
    });
  }
  setStep(0);

  steps.forEach((b, i) => b.addEventListener('click', () => {
    const total = met.offsetHeight - innerHeight;
    const top = met.getBoundingClientRect().top + scrollY + (i * SEG + SEG * 0.55) * total;
    scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });
  }));

  function updateMetodo() {
    const r = met.getBoundingClientRect();
    const total = r.height - innerHeight;
    if (total <= 0) return;
    const p = clamp(-r.top / total);
    setStep(Math.min(4, Math.floor(p / SEG)));
    clauses.forEach((c, i) => {
      const lp = clamp((p - i * SEG - SEG * 0.08) / (SEG * 0.72));
      hlts[i].style.transform = 'scaleX(' + lp.toFixed(4) + ')';
      c.classList.toggle('is-on', lp > 0);
    });
    const s = clamp((p - 0.88) / 0.09);
    sigPath.style.strokeDashoffset = (1 - s).toFixed(4);
    if (s >= 0.98 && !signed) { signed = true; sheet.classList.add('is-signed'); }
    const y = (4 - p * 7).toFixed(3);
    sheet.style.transform = 'translate3d(0,' + y + 'vh,0)';
  }

  /* ---------------- Statement scrub ---------------- */
  function updateStatement() {
    const r = stText.getBoundingClientRect();
    const vh = innerHeight;
    if (r.bottom < -vh || r.top > vh * 2) return;
    const p = clamp((vh * 0.88 - r.top) / (r.height + vh * 0.38));
    const n = stWords.length;
    const pos = p * (n + 4);
    for (let i = 0; i < n; i++) {
      const o = 0.22 + 0.78 * clamp(pos - i);
      stWords[i].style.opacity = o.toFixed(3);
    }
    stMarks.forEach((m) => {
      const s = clamp((pos - m.start - 0.5) / (m.count + 0.5));
      m.bar.style.transform = 'scaleX(' + s.toFixed(4) + ')';
    });
  }

  /* ---------------- Footer wordmark ---------------- */
  const mark = $('#ftMark');
  function fitMark() {
    if (!mark) return;
    mark.style.fontSize = '100px';
    const w = mark.offsetWidth;
    const target = mark.parentElement.clientWidth;
    if (w > 0) mark.style.fontSize = (100 * target / w).toFixed(2) + 'px';
  }
  function updateMark() {
    const r = mark.getBoundingClientRect();
    const p = clamp((innerHeight - r.top) / (r.height + innerHeight * 0.35));
    mark.style.transform = 'scale(' + (0.94 + 0.06 * p).toFixed(4) + ')';
  }

  /* ---------------- Scroll loop ---------------- */
  let ticking = false;
  function frame() {
    ticking = false;
    nav.classList.toggle('is-scrolled', scrollY > 40);
    if (!reduce) {
      if (stText) updateStatement();
      if (mqPin.matches && met) updateMetodo();
      if (mark) updateMark();
    }
  }
  const request = () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } };
  addEventListener('scroll', request, { passive: true });
  addEventListener('resize', () => { fitMark(); request(); }, { passive: true });
  fitMark();
  if (document.fonts) document.fonts.ready.then(() => { fitMark(); request(); });
  frame();

  /* ---------------- Contact form → WhatsApp ---------------- */
  const form = $('#form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = (n) => (form.elements[n].value || '').trim();
    const nome = val('nome');
    const empresa = val('empresa');
    const edital = val('edital');
    const op = (form.querySelector('input[name="assunto"]:checked') || {}).value || 'licitações públicas';
    let msg;
    if (nome) {
      msg = 'Olá, Matheus. Sou ' + nome + (empresa ? ', da ' + empresa : '') + '. Gostaria de conversar sobre ' + op + '.';
    } else {
      msg = 'Olá, Matheus. Vim pelo site e gostaria de conversar sobre ' + op + '.';
      if (empresa) msg += ' Empresa: ' + empresa + '.';
    }
    if (edital) msg += ' Edital/órgão: ' + edital + '.';
    window.open('https://wa.me/5581996392560?text=' + encodeURIComponent(msg), '_blank', 'noopener');
  });
})();
