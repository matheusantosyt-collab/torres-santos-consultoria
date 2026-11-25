/* Torres Santos Consultoria — camada de movimento.
   Abertura, rolagem suave (Lenis), letras, números que rolam, linhas que se desenham,
   foto do topo, entrada das seções escuras, faixa com velocidade, botões magnéticos e progresso.
   Desligada quando o visitante escolhe "Reduzir animações" (classe html.reduce). */
import Lenis from 'lenis'

const root = document.documentElement
const reduce = root.classList.contains('reduce')
const $ = (s, c = document) => c.querySelector(s)
const $$ = (s, c = document) => Array.from(c.querySelectorAll(s))
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))

/* ---------- Abertura (uma vez por sessão) ---------- */
window.__curtain = Promise.resolve()
if (!reduce && root.classList.contains('curtain')) {
  const name = 'Torres Santos'
  const c = document.createElement('div')
  c.className = 'curtain'
  c.setAttribute('aria-hidden', 'true')
  c.innerHTML =
    '<div class="curtain-in">' +
    '<span class="cp"><i></i><i></i></span>' +
    '<span class="cn">' +
    [...name].map((ch, i) => `<span class="cm"><span class="cc" style="--c:${i}">${ch === ' ' ? '&nbsp;' : ch}</span></span>`).join('') +
    '</span><span class="cs">Consultoria</span></div>'
  document.body.appendChild(c)
  root.classList.remove('curtain')
  window.__curtain = new Promise((res) => {
    requestAnimationFrame(() => requestAnimationFrame(() => c.classList.add('is-on')))
    setTimeout(() => {
      c.classList.add('is-out')
      try { sessionStorage.setItem('tsc-intro', '1') } catch (e) { /* sem sessionStorage */ }
      res()
    }, 1350)
    setTimeout(() => c.remove(), 2600)
  })
} else {
  root.classList.remove('curtain')
}

/* ---------- Rolagem suave ---------- */
let lenis = null
if (!reduce) {
  root.style.scrollBehavior = 'auto'
  lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.95 })
  window.__lenis = lenis
  lenis.stop()
  window.__curtain.then(() => lenis.start())
  const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf) }
  requestAnimationFrame(raf)

  document.addEventListener('click', (e) => {
    const a = e.target.closest && e.target.closest('a[href^="#"]')
    if (!a) return
    const id = a.getAttribute('href')
    if (id.length < 2) return
    const el = document.querySelector(id)
    if (!el) return
    e.preventDefault()
    lenis.scrollTo(el, { offset: id === '#topo' ? 0 : -64, duration: 1.6 })
    history.pushState(null, '', id)
  })
}

/* Tudo que depende do texto já dividido em palavras roda depois do site.js. */
document.addEventListener('DOMContentLoaded', () => {
  if (reduce) return

  /* ---------- Letras: título do topo ---------- */
  let ci = 0
  $$('#hero-title .w > span').forEach((w) => {
    const txt = w.textContent
    w.textContent = ''
    for (const ch of txt) {
      const s = document.createElement('span')
      s.className = 'ch'
      s.style.setProperty('--c', ci++)
      s.textContent = ch
      w.appendChild(s)
    }
  })
  root.classList.add('letters')

  /* ---------- Letras: letreiro do rodapé ---------- */
  const mark = $('#ftMark')
  if (mark) {
    const txt = mark.textContent
    mark.textContent = ''
    ;[...txt].forEach((ch, i) => {
      const s = document.createElement('span')
      s.className = 'fc'
      s.style.setProperty('--c', i)
      s.textContent = ch === ' ' ? ' ' : ch
      mark.appendChild(s)
    })
    window.dispatchEvent(new Event('resize'))
  }

  /* ---------- Números que rolam (odômetro) ---------- */
  const rollDigits = (el) => {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
    const nodes = []
    while (walker.nextNode()) if (/\d/.test(walker.currentNode.textContent)) nodes.push(walker.currentNode)
    nodes.forEach((n) => {
      const frag = document.createDocumentFragment()
      const sr = document.createElement('span')
      sr.className = 'sr-only'
      sr.textContent = n.textContent
      frag.appendChild(sr)
      for (const ch of n.textContent) {
        if (/\d/.test(ch)) {
          const d = document.createElement('span')
          d.className = 'dg'
          d.setAttribute('aria-hidden', 'true')
          const col = document.createElement('span')
          col.className = 'dg-col'
          col.style.setProperty('--d', ch)
          col.innerHTML = '0123456789'.split('').map((x) => `<span>${x}</span>`).join('')
          d.appendChild(col)
          frag.appendChild(d)
        } else {
          const t = document.createElement('span')
          t.setAttribute('aria-hidden', 'true')
          t.textContent = ch
          frag.appendChild(t)
        }
      }
      n.replaceWith(frag)
    })
  }
  $$('.stat-n, .idx-n').forEach(rollDigits)

  /* ---------- Entradas: linhas, números e letreiro ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return
      e.target.classList.add('is-in')
      io.unobserve(e.target)
    })
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.2 })
  $$('.idx, .stat, .ft-mark-wrap').forEach((el) => io.observe(el))

  /* ---------- Botões magnéticos (só com mouse) ---------- */
  if (matchMedia('(pointer: fine)').matches) {
    $$('.btn').forEach((b) => {
      b.classList.add('mag')
      b.addEventListener('pointermove', (e) => {
        const r = b.getBoundingClientRect()
        const x = (e.clientX - r.left - r.width / 2) * 0.22
        const y = (e.clientY - r.top - r.height / 2) * 0.35
        b.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`
      })
      b.addEventListener('pointerleave', () => { b.style.transform = '' })
    })
  }

  /* ---------- Movimento ligado à rolagem ---------- */
  const heroPhoto = $('.hero-photo')
  const heroTitle = $('#hero-title')
  const inks = $$('.chapter-ink:not(.footer)')
  const nav = $('#nav')
  const marquee = $('#marquee')
  const track = marquee && $('.marquee-track', marquee)
  let mx = 0
  let last = performance.now()
  let marqueeOn = true
  if (marquee) new IntersectionObserver(([e]) => { marqueeOn = e.isIntersecting }).observe(marquee)
  root.classList.add('js-marquee')

  const tick = (now) => {
    const dt = Math.min(64, now - last)
    last = now
    const vh = innerHeight
    const y = scrollY

    // progresso de leitura no menu
    const max = document.documentElement.scrollHeight - vh
    if (nav) nav.style.setProperty('--p', max > 0 ? (y / max).toFixed(4) : 0)

    // topo: foto e título acompanham a rolagem
    if (y < vh * 1.2) {
      const p = clamp(y / vh)
      if (heroPhoto) heroPhoto.style.transform = `translate3d(0, ${(-p * 90).toFixed(1)}px, 0)`
      if (heroTitle) heroTitle.style.transform = `translate3d(0, ${(p * 50).toFixed(1)}px, 0)`
    }

    // seções escuras entram como uma folha que se abre
    inks.forEach((s) => {
      const r = s.getBoundingClientRect()
      if (r.top > vh || r.bottom < 0) return
      const p = clamp((vh - r.top) / (vh * 0.75))
      const side = ((1 - p) * 4).toFixed(2)
      const rad = ((1 - p) * 32).toFixed(1)
      s.style.clipPath = p >= 1 ? '' : `inset(0 ${side}vw round ${rad}px ${rad}px 0 0)`
    })

    // faixa: velocidade base + velocidade da rolagem
    if (track && marqueeOn) {
      const half = track.scrollWidth / 2
      const v = lenis ? Math.abs(lenis.velocity) : 0
      mx -= (0.04 + Math.min(v, 60) * 0.02) * dt
      if (half && mx <= -half) mx += half
      track.style.transform = `translate3d(${mx.toFixed(1)}px, 0, 0)`
    }
    requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
})
