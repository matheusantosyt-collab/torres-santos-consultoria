import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import Lenis from 'lenis'
import { Cursor, Nav, Preloader, ProgressBar } from './components/chrome'
import Hero from './sections/Hero'
import Intro, { Marquee } from './sections/Intro'
import Services from './sections/Services'
import Stats, { PhotoBand } from './sections/Stats'
import Method from './sections/Method'
import About from './sections/About'
import Contact from './sections/Contact'
import Footer from './sections/Footer'

export default function App() {
  const reduce = useReducedMotion()
  const [ready, setReady] = useState(!!reduce) // hero começa a animar
  const [loaded, setLoaded] = useState(!!reduce) // cortina já saiu
  const lenisRef = useRef(null)

  // Rolagem suave
  useEffect(() => {
    if (reduce) return
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })
    lenisRef.current = lenis
    window.__lenis = lenis
    let raf
    const loop = (t) => {
      lenis.raf(t)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    lenis.stop() // trava até o pré-carregador sair
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
      window.__lenis = undefined
    }
  }, [reduce])

  // Trava a rolagem enquanto carrega
  useEffect(() => {
    document.documentElement.classList.toggle('is-loading', !loaded)
    if (loaded) lenisRef.current?.start()
  }, [loaded])

  // Links âncora com rolagem suave
  useEffect(() => {
    const onClick = (e) => {
      const a = e.target.closest?.('a[href^="#"]')
      if (!a) return
      const id = a.getAttribute('href')
      const el = id === '#top' ? document.body : document.querySelector(id)
      if (!el) return
      e.preventDefault()
      if (lenisRef.current) lenisRef.current.scrollTo(id === '#top' ? 0 : el, { duration: 1.6 })
      else el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' })
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [reduce])

  return (
    <>
      {!loaded && <Preloader onReveal={() => setReady(true)} onDone={() => setLoaded(true)} />}
      <ProgressBar />
      <Cursor />
      <Nav show={ready} />
      <main>
        <Hero ready={ready} />
        <Intro />
        <Marquee />
        <Services />
        <Stats />
        <PhotoBand />
        <Method />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
