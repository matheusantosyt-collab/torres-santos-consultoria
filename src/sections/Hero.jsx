import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { asset } from '../config'
import { EASE, FitWord, Magnetic } from '../components/fx'

export default function Hero({ ready }) {
  const reduce = useReducedMotion()
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '16%'])
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.14])
  const nameScale = useTransform(scrollYProgress, [0, 1], [1, 0.93])
  const nameY = useTransform(scrollYProgress, [0, 1], ['0%', '-8%'])

  return (
    <header id="top" ref={ref} className="hero">
      <motion.div
        className="hero-photo"
        initial={reduce ? false : { clipPath: 'inset(9% 7% 9% 7%)' }}
        animate={ready ? { clipPath: 'inset(0% 0% 0% 0%)' } : {}}
        transition={{ duration: 2, ease: EASE }}
      >
        <motion.div
          className="hero-photo-in"
          initial={reduce ? false : { scale: 1.3 }}
          animate={ready ? { scale: 1 } : {}}
          transition={{ duration: 2.8, ease: EASE }}
        >
          <motion.img
            src={asset('img/congresso-lua-jpg.jpg')}
            alt="Congresso Nacional em Brasília à noite, com as duas torres iluminadas e a lua cheia ao fundo"
            width="1920"
            height="1260"
            style={reduce ? undefined : { y: imgY, scale: imgScale }}
            fetchPriority="high"
          />
        </motion.div>
      </motion.div>

      <motion.div
        className="hero-strip"
        initial={reduce ? false : { opacity: 0, y: 24 }}
        animate={ready ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1.2, ease: EASE, delay: 0.9 }}
      >
        <p>
          Consultoria em licitações públicas e para empresas que querem crescer, do edital ao contrato assinado.
        </p>
      </motion.div>

      <motion.h1 className="hero-name" style={reduce ? undefined : { scale: nameScale, y: nameY }}>
        <span className="name-d">
          <FitWord text="Torres Santos" play={ready} delay={0.45} />
        </span>
        <span className="name-m">
          <FitWord text="Torres" play={ready} delay={0.45} />
          <FitWord text="Santos" play={ready} delay={0.75} />
        </span>
        <span className="sr-only"> Consultoria</span>
      </motion.h1>

      <motion.div
        className="hero-cta"
        initial={reduce ? false : { opacity: 0, y: 24 }}
        animate={ready ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1.2, ease: EASE, delay: 1.05 }}
      >
        <Magnetic>
          <a className="btn" href="#contato">
            <span>Falar com a consultoria</span>
          </a>
        </Magnetic>
      </motion.div>
    </header>
  )
}
