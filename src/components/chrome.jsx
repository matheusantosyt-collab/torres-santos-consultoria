import { useEffect, useState } from 'react'
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useReducedMotion,
} from 'motion/react'
import { NAV, SITE } from '../config'
import { EASE, EASE_IO, Letters } from './fx'

/* ───────────── Pré-carregador: contador + cortina que sobe ───────────── */
export function Preloader({ onReveal, onDone }) {
  const [n, setN] = useState(0)
  const [lift, setLift] = useState(false)

  useEffect(() => {
    let t
    const c = animate(0, 100, {
      duration: 1.8,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => setN(Math.round(v)),
      onComplete: () => {
        t = setTimeout(() => {
          setLift(true)
          onReveal()
        }, 200)
      },
    })
    return () => {
      c.stop()
      clearTimeout(t)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <motion.div
      className="preloader"
      initial={false}
      animate={{ y: lift ? '-100%' : '0%' }}
      transition={{ duration: 1.1, ease: EASE_IO }}
      onAnimationComplete={() => lift && onDone()}
      role="status"
      aria-label="Carregando"
    >
      <div className="pre-top">
        <span className="pre-name">
          <Letters text="Torres Santos Consultoria" delay={0.15} stagger={0.03} />
        </span>
        <span className="pre-side">Licitações e empresas</span>
      </div>
      <div className="pre-bottom">
        <span className="pre-count" aria-hidden="true">
          {n}
        </span>
        <div className="pre-bar" aria-hidden="true">
          <span style={{ transform: `scaleX(${n / 100})` }} />
        </div>
      </div>
    </motion.div>
  )
}

/* ───────────── Cursor que segue o mouse (só com mouse de verdade) ───────────── */
export function Cursor() {
  const reduce = useReducedMotion()
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 380, damping: 34, mass: 0.5 })
  const sy = useSpring(y, { stiffness: 380, damping: 34, mass: 0.5 })
  const [on, setOn] = useState(false)
  const [big, setBig] = useState(false)

  useEffect(() => {
    if (reduce || !window.matchMedia('(pointer: fine)').matches) return
    setOn(true)
    const move = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }
    const over = (e) => setBig(!!e.target.closest?.('a, button, input, label, [data-cursor]'))
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseover', over)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', over)
    }
  }, [reduce, x, y])

  if (!on) return null
  return (
    <motion.div className="cursor" style={{ x: sx, y: sy }} aria-hidden="true">
      <motion.span animate={{ scale: big ? 2.4 : 1, opacity: big ? 0.9 : 0.6 }} transition={{ duration: 0.35, ease: EASE }} />
    </motion.div>
  )
}

/* ───────────── Barra de progresso de leitura ───────────── */
export function ProgressBar() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28, restDelta: 0.001 })
  return <motion.div className="progress" style={{ scaleX }} aria-hidden="true" />
}

/* ───────────── Navegação ───────────── */
function Roll({ children }) {
  return (
    <span className="roll">
      <span>{children}</span>
      <span aria-hidden="true">{children}</span>
    </span>
  )
}

export function Nav({ show }) {
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const on = () => setSolid(window.scrollY > window.innerHeight * 0.7)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('menu-open', open)
    if (open) window.__lenis?.stop()
    else window.__lenis?.start()
  }, [open])

  return (
    <>
      <motion.header
        className={`nav ${solid ? 'is-solid' : ''}`}
        initial={{ opacity: 0, y: -16 }}
        animate={show ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, ease: EASE, delay: 0.9 }}
      >
        <a href="#top" className="nav-mark" aria-label={SITE.name}>
          Torres Santos
        </a>
        <nav aria-label="Principal" className="nav-links">
          {NAV.map((l) => (
            <a key={l.href} href={l.href}>
              <Roll>{l.label}</Roll>
            </a>
          ))}
        </nav>
        <button
          type="button"
          className="nav-menu"
          aria-expanded={open}
          aria-controls="menu-overlay"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? 'Fechar' : 'Menu'}
        </button>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-overlay"
            className="menu-overlay"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.8, ease: EASE_IO }}
          >
            <ul>
              {NAV.map((l, i) => (
                <li key={l.href}>
                  <motion.a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    initial={{ y: 60, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.9, ease: EASE, delay: 0.25 + i * 0.07 }}
                  >
                    {l.label}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
