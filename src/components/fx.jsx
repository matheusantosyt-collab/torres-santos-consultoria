import { Fragment, useEffect, useLayoutEffect, useRef, useState } from 'react'
import {
  motion,
  useInView,
  animate,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useScroll,
  useTransform,
} from 'motion/react'

export const EASE = [0.16, 1, 0.3, 1]
export const EASE_IO = [0.76, 0, 0.24, 1]

/** Entrada: sobe e aparece uma vez, quando entra na tela. */
export function Reveal({ as = 'div', delay = 0, y = 28, amount = 0.1, className, children, ...rest }) {
  const reduce = useReducedMotion()
  const Tag = motion[as]
  return (
    <Tag
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
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
export function Letters({ text, play = true, inView = false, delay = 0, stagger = 0.035, className = '' }) {
  const reduce = useReducedMotion()
  const ref = useRef(null)
  const seen = useInView(ref, { once: true, amount: 0.1 })
  const go = reduce ? true : inView ? seen : play
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
                    initial={reduce ? false : { y: '118%', rotate: 5 }}
                    animate={go ? { y: '0%', rotate: 0 } : {}}
                    transition={{ duration: 1.15, ease: EASE, delay: delay + i * stagger }}
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
  const reduce = useReducedMotion()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const fmt = (v) => Math.round(v).toLocaleString('pt-BR')
  const [txt, setTxt] = useState(reduce ? fmt(to) : fmt(0))
  useEffect(() => {
    if (!inView || reduce) return
    const c = animate(0, to, { duration, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => setTxt(fmt(v)) })
    return () => c.stop()
  }, [inView, reduce, to, duration])
  return (
    <span ref={ref} className={`num ${className}`}>
      {txt}
      {suffix}
    </span>
  )
}

/** Número que anima de um valor ao outro quando `value` muda. */
export function TweenNumber({ value, suffix = '', className = '' }) {
  const reduce = useReducedMotion()
  const [txt, setTxt] = useState(value)
  const prev = useRef(value)
  useEffect(() => {
    if (reduce) {
      setTxt(value)
      prev.current = value
      return
    }
    const c = animate(prev.current, value, {
      duration: 0.7,
      ease: EASE,
      onUpdate: (v) => setTxt(Math.round(v)),
    })
    prev.current = value
    return () => c.stop()
  }, [value])
  return (
    <span className={`num ${className}`}>
      {txt}
      {suffix}
    </span>
  )
}

/** Ajusta o tamanho da fonte para o texto ocupar exatamente a largura da caixa. */
export function FitWord({ text, play = true, delay = 0, stagger = 0.045, className = '' }) {
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
    // A fonte Erode vem de fora: refaz o encaixe quando ela de fato chegar
    // (fonts.ready pode resolver antes de o download começar).
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
        <Letters text={text} play={play} delay={delay} stagger={stagger} />
      </span>
    </span>
  )
}

/** Palavras que acendem conforme a rolagem. */
export function ScrollWords({ text, className = '' }) {
  const reduce = useReducedMotion()
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] })
  const words = text.split(' ')
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <ScrollWord key={i} word={w} p={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} off={reduce} />
      ))}
    </p>
  )
}
function ScrollWord({ word, p, range, off }) {
  const o = useTransform(p, range, [0.16, 1])
  return (
    <>
      <motion.span style={off ? undefined : { opacity: o }}>{word}</motion.span>{' '}
    </>
  )
}

/** Botão/área que é puxada de leve em direção ao cursor. */
export function Magnetic({ children, strength = 0.28, className = '' }) {
  const reduce = useReducedMotion()
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.5 })
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.5 })
  const move = (e) => {
    if (reduce) return
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

/** Foto que se abre (clip-path) e desliza conforme a rolagem. */
export function ParallaxPhoto({ src, alt, className = '', pos = '50% 50%', shift = 40, width, height }) {
  const reduce = useReducedMotion()
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [`-${shift / 2}px`, `${shift / 2}px`])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.22, 1.1, 1.18])
  return (
    <motion.figure
      ref={ref}
      className={`photo ${className}`}
      initial={reduce ? false : { clipPath: 'inset(14% 10% 14% 10%)' }}
      whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 1.4, ease: EASE }}
    >
      <motion.img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        style={reduce ? { objectPosition: pos } : { y, scale, objectPosition: pos }}
      />
    </motion.figure>
  )
}
