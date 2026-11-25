import { Fragment, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react'
import {
  motion,
  useInView,
  animate,
  useMotionValue,
  useSpring,
  useScroll,
  useTransform,
  useVelocity,
  useAnimationFrame,
} from 'motion/react'

export const EASE = [0.16, 1, 0.3, 1]
export const EASE_IO = [0.76, 0, 0.24, 1]

/* ───────── Modo "calmo": as animações ficam LIGADAS por padrão; o visitante pode reduzir ───────── */
const KEY = 'tsc-calm'
const subs = new Set()
let calm = false
try {
  calm = localStorage.getItem(KEY) === '1'
} catch {
  /* sem localStorage */
}
export const getCalm = () => calm
export function setCalm(v) {
  calm = v
  try {
    localStorage.setItem(KEY, v ? '1' : '0')
  } catch {
    /* ignora */
  }
  document.documentElement.classList.toggle('calm', v)
  subs.forEach((f) => f())
}
export function useCalm() {
  return useSyncExternalStore(
    (f) => {
      subs.add(f)
      return () => subs.delete(f)
    },
    () => calm,
    () => false,
  )
}

/** Entrada: sobe e aparece uma vez, quando entra na tela. */
export function Reveal({ as = 'div', delay = 0, y = 32, amount = 0.15, className, children, ...rest }) {
  const off = useCalm()
  const Tag = motion[as]
  return (
    <Tag
      className={className}
      initial={off ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 1.1, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </Tag>
  )
}

/** Texto letra por letra: cada letra sobe de dentro de uma máscara. */
export function Letters({ text, play = true, inView = false, delay = 0, stagger = 0.03, className = '' }) {
  const off = useCalm()
  const ref = useRef(null)
  const seen = useInView(ref, { once: true, amount: 0.1 })
  const go = off ? true : inView ? seen : play
  const words = text.split(' ')
  let k = 0
  return (
    <span ref={ref} className={`letters ${className}`}>
      {words.map((w, wi) => (
        <Fragment key={wi}>
          <span className="word">
            {[...w].map((c, ci) => {
              const i = k++
              return (
                <span className="mask" key={ci}>
                  <motion.span
                    className="ch"
                    initial={off ? false : { y: '118%', rotate: 6 }}
                    animate={go ? { y: '0%', rotate: 0 } : {}}
                    transition={{ duration: 1.1, ease: EASE, delay: delay + i * stagger }}
                  >
                    {c}
                  </motion.span>
                </span>
              )
            })}
          </span>
          {wi < words.length - 1 && ' '}
        </Fragment>
      ))}
    </span>
  )
}

/** Número que conta de 0 até `to` quando entra na tela. */
export function CountUp({ to, duration = 2.4, suffix = '', className = '' }) {
  const off = useCalm()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const fmt = (v) => Math.round(v).toLocaleString('pt-BR')
  const [txt, setTxt] = useState(off ? fmt(to) : fmt(0))
  useEffect(() => {
    if (!inView) return
    if (off) return setTxt(fmt(to))
    const c = animate(0, to, { duration, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => setTxt(fmt(v)) })
    return () => c.stop()
  }, [inView, off, to, duration])
  return (
    <span ref={ref} className={`num ${className}`}>
      {txt}
      {suffix}
    </span>
  )
}

/** Número que anima de um valor ao outro quando `value` muda. */
export function TweenNumber({ value, suffix = '', className = '' }) {
  const off = useCalm()
  const [txt, setTxt] = useState(value)
  const prev = useRef(value)
  useEffect(() => {
    if (off) {
      setTxt(value)
      prev.current = value
      return
    }
    const c = animate(prev.current, value, { duration: 0.7, ease: EASE, onUpdate: (v) => setTxt(Math.round(v)) })
    prev.current = value
    return () => c.stop()
  }, [value, off])
  return (
    <span className={`num ${className}`}>
      {txt}
      {suffix}
    </span>
  )
}

/** Ajusta o tamanho da fonte para o texto ocupar exatamente a largura da caixa. */
export function FitWord({ text, play = true, inView = false, delay = 0, stagger = 0.045, className = '' }) {
  const boxRef = useRef(null)
  const textRef = useRef(null)
  useLayoutEffect(() => {
    const fit = () => {
      const b = boxRef.current
      const t = textRef.current
      if (!b || !t || !b.clientWidth) return
      t.style.fontSize = '100px'
      const w = t.offsetWidth
      if (w) t.style.fontSize = `${(100 * b.clientWidth) / w}px`
    }
    fit()
    document.fonts?.load('500 100px Erode').then(fit)
    document.fonts?.ready.then(fit)
    document.fonts?.addEventListener?.('loadingdone', fit)
    window.addEventListener('load', fit)
    const ro = new ResizeObserver(fit)
    ro.observe(boxRef.current)
    return () => {
      ro.disconnect()
      document.fonts?.removeEventListener?.('loadingdone', fit)
      window.removeEventListener('load', fit)
    }
  }, [text])
  return (
    <span ref={boxRef} className={`fit ${className}`}>
      <span ref={textRef} className="fit-inner">
        <Letters text={text} play={play} inView={inView} delay={delay} stagger={stagger} />
      </span>
    </span>
  )
}

/** Palavras que acendem conforme a rolagem. */
export function ScrollWords({ text, className = '' }) {
  const off = useCalm()
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.9', 'end 0.5'] })
  const words = text.split(' ')
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <ScrollWord key={i} word={w} p={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} off={off} />
      ))}
    </p>
  )
}
function ScrollWord({ word, p, range, off }) {
  const o = useTransform(p, range, [0.14, 1])
  return (
    <>
      <motion.span style={off ? undefined : { opacity: o }}>{word}</motion.span>{' '}
    </>
  )
}

/** Botão puxado de leve em direção ao cursor. */
export function Magnetic({ children, strength = 0.3, className = '' }) {
  const off = useCalm()
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.5 })
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.5 })
  const move = (e) => {
    if (off) return
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * strength)
    y.set((e.clientY - (r.top + r.height / 2)) * strength)
  }
  const leave = () => {
    x.set(0)
    y.set(0)
  }
  return (
    <motion.span ref={ref} className={`magnetic ${className}`} style={{ x: sx, y: sy }} onMouseMove={move} onMouseLeave={leave}>
      {children}
    </motion.span>
  )
}

/** Cartão com brilho que segue o mouse e leve inclinação 3D. */
export function Spot({ as = 'div', tilt = true, className = '', children, ...rest }) {
  const off = useCalm()
  const ref = useRef(null)
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const srx = useSpring(rx, { stiffness: 180, damping: 20 })
  const sry = useSpring(ry, { stiffness: 180, damping: 20 })
  const move = (e) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = e.clientX - r.left
    const y = e.clientY - r.top
    el.style.setProperty('--mx', `${x}px`)
    el.style.setProperty('--my', `${y}px`)
    if (tilt && !off) {
      ry.set((x / r.width - 0.5) * 7)
      rx.set(-(y / r.height - 0.5) * 7)
    }
  }
  const leave = () => {
    rx.set(0)
    ry.set(0)
  }
  const Tag = motion[as]
  return (
    <Tag
      ref={ref}
      className={`spot ${className}`}
      style={off ? undefined : { rotateX: srx, rotateY: sry, transformPerspective: 1000 }}
      onMouseMove={move}
      onMouseLeave={leave}
      {...rest}
    >
      {children}
    </Tag>
  )
}

/** Faixa de texto que corre sozinha e acelera/entorta com a velocidade da rolagem. */
export function VelocityMarquee({ items, reverse = false, className = '' }) {
  const off = useCalm()
  const { scrollY } = useScroll()
  const vel = useVelocity(scrollY)
  const sm = useSpring(vel, { stiffness: 400, damping: 50 })
  const skew = useTransform(sm, [-2500, 2500], [-7, 7])
  const x = useMotionValue(0)
  const ref = useRef(null)
  const base = reverse ? 0.045 : -0.045
  useAnimationFrame((_, delta) => {
    if (off) return
    const half = ref.current ? ref.current.scrollWidth / 2 : 0
    if (!half) return
    const boost = 1 + Math.abs(sm.get()) / 350
    let nx = x.get() + base * delta * boost
    if (nx <= -half) nx += half
    if (nx > 0) nx -= half
    x.set(nx)
  })
  const row = [...items, ...items]
  return (
    <div className={`vmarquee ${className}`} aria-hidden="true">
      <motion.div ref={ref} className="vmarquee-track" style={{ x, skewX: off ? 0 : skew }}>
        {[0, 1].map((n) =>
          row.map((m, i) => (
            <span key={`${n}-${i}`}>
              {m}
              <b>§</b>
            </span>
          )),
        )}
      </motion.div>
    </div>
  )
}

/** Foto que se abre (clip-path) e desliza conforme a rolagem. */
export function ParallaxPhoto({ src, alt, className = '', pos = '50% 50%', shift = 60, width, height, onError }) {
  const off = useCalm()
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [`-${shift / 2}px`, `${shift / 2}px`])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.25, 1.12, 1.2])
  return (
    <motion.figure
      ref={ref}
      className={`photo ${className}`}
      initial={off ? false : { clipPath: 'inset(12% 8% 12% 8% round 24px)' }}
      whileInView={{ clipPath: 'inset(0% 0% 0% 0% round 24px)' }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1.4, ease: EASE }}
    >
      <motion.img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        onError={onError}
        style={off ? { objectPosition: pos } : { y, scale, objectPosition: pos }}
      />
    </motion.figure>
  )
}

/** Fundo animado (manchas de cor que flutuam). */
export function Aurora({ className = '' }) {
  return (
    <div className={`aurora ${className}`} aria-hidden="true">
      <i />
      <i />
      <i />
    </div>
  )
}
