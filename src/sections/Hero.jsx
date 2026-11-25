import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { asset } from '../config'
import { Aurora, EASE, Letters, Magnetic, useCalm } from '../components/fx'
import EditalMock from '../components/Mock'

const Arrow = () => (
  <svg viewBox="0 0 24 24" className="arrow" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default function Hero({ ready }) {
  const off = useCalm()
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '22%'])
  const textY = useTransform(scrollYProgress, [0, 1], [0, 90])
  const textOp = useTransform(scrollYProgress, [0, 0.75], [1, 0])
  const mockY = useTransform(scrollYProgress, [0, 1], [0, -110])
  const mockRot = useTransform(scrollYProgress, [0, 1], [0, -9])
  const mockScale = useTransform(scrollYProgress, [0, 1], [1, 0.92])

  const rise = (d) => ({
    initial: off ? false : { opacity: 0, y: 30 },
    animate: ready ? { opacity: 1, y: 0 } : {},
    transition: { duration: 1.1, ease: EASE, delay: d },
  })

  return (
    <header id="top" ref={ref} className="hero">
      <div className="hero-bg" aria-hidden="true">
        <motion.img src={asset('img/contrato.jpg')} alt="" width="1920" height="1440" style={off ? undefined : { y: bgY }} fetchPriority="high" />
      </div>
      <Aurora />

      <motion.div className="hero-copy" style={off ? undefined : { y: textY, opacity: textOp }}>
        <motion.p className="chip" {...rise(0.2)}>
          <span className="pulse" aria-hidden="true" />
          Consultoria em licitações · Lei 14.133/2021
        </motion.p>

        <h1>
          <span className="h1-line">
            <Letters text="Licitações públicas," play={ready} delay={0.3} stagger={0.028} />
          </span>
          <span className="h1-line accent-line">
            <Letters text="do edital ao contrato." play={ready} delay={0.75} stagger={0.028} />
          </span>
        </h1>

        <motion.p className="hero-sub" {...rise(1.2)}>
          A Torres Santos Consultoria ajuda empresas a participar de licitações com método e organiza a rotina de quem quer
          crescer.
        </motion.p>

        <motion.div className="hero-actions" {...rise(1.4)}>
          <Magnetic>
            <a className="btn" href="#contato">
              Falar com a consultoria <Arrow />
            </a>
          </Magnetic>
          <a className="btn btn-ghost" href="#metodo">
            Ver como funciona
          </a>
        </motion.div>

        <motion.ul className="hero-points" {...rise(1.6)}>
          <li>Leitura de editais</li>
          <li>Documentos em ordem</li>
          <li>Prazos sob controle</li>
        </motion.ul>
      </motion.div>

      <motion.div
        className="hero-visual"
        initial={off ? false : { opacity: 0, y: 60, rotateX: 14 }}
        animate={ready ? { opacity: 1, y: 0, rotateX: 0 } : {}}
        transition={{ duration: 1.6, ease: EASE, delay: 0.9 }}
      >
        <motion.div className="hero-visual-in" style={off ? undefined : { y: mockY, rotateX: mockRot, scale: mockScale }}>
          <EditalMock />
          <span className="float f1">Prazos sob controle</span>
          <span className="float f2">Documentos em ordem</span>
          <span className="float f3">Proposta conferida</span>
        </motion.div>
      </motion.div>

      <a href="#statement" className="scroll-cue" aria-label="Rolar para baixo">
        <span />
      </a>
    </header>
  )
}
