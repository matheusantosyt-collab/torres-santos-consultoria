import { useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import { Cursor, Nav, Preloader, ProgressBar } from './components/chrome'
import { useCalm } from './components/fx'
import Hero from './sections/Hero'
import Statement from './sections/Statement'
import Services from './sections/Services'
import Stats from './sections/Stats'
import Process from './sections/Process'
import About from './sections/About'
import Faq from './sections/Faq'
import Contact from './sections/Contact'
import Footer from './sections/Footer'

export default function App() {
  const calm = useCalm()
  const [ready, setReady] = useState(calm) // o hero começa a animar
  const [loaded, setLoaded] = useState(calm) // a cortina já saiu
  const lenisRef = useRef(null)

  // Rolagem suave (desligada no modo calmo)
  useEffect(() => {
    if (calm) return
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
    if (!loaded) lenis.stop()
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
      lenisRef.current = null
      window.__lenis = undefined
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calm])

  // Trava a rolagem enquanto carrega
  useEffect(() => {
    document.documentElement.classList.toggle('is-loading', !loaded)
    if (loaded) lenisRef.current?.start()
  }, [loaded])

  useEffect(() => {
    if (calm) {
      setReady(true)
      setLoaded(true)
    }
  }, [calm])

  // Links âncora
  useEffect(() => {
    const onClick = (e) => {
      const a = e.target.closest?.('a[href^="#"]')
      if (!a) return
      const id = a.getAttribute('href')
      const el = id === '#top' ? document.body : document.querySelector(id)
      if (!el) return
      e.preventDefault()
      if (lenisRef.current) lenisRef.current.scrollTo(id === '#top' ? 0 : el, { duration: 1.6 })
      else el.scrollIntoView({ behavior: calm ? 'auto' : 'smooth' })
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [calm])

  return (
    <>
      {!loaded && <Preloader onReveal={() => setReady(true)} onDone={() => setLoaded(true)} />}
      <ProgressBar />
      <Cursor />
      <Nav show={ready} />
      <main>
        <Hero ready={ready} />
        <Statement />
        <Services />
        <Stats />
        <Process />
        <About />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
