import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { asset } from '../config'
import { ParallaxPhoto, Reveal, ScrollWords } from '../components/fx'

const TEXT =
  'Toda licitação é uma disputa que se decide antes da sessão pública: no edital lido com atenção, na habilitação sem pendências, na proposta que cabe no preço e no prazo. A Torres Santos Consultoria acompanha empresas que vendem ao poder público e empresas que querem organizar a própria casa para crescer, com método, clareza e prazos cumpridos.'

export default function Intro() {
  return (
    <section className="intro grid12" aria-label="Apresentação">
      <ScrollWords text={TEXT} className="intro-text" />
      <div className="intro-photo">
        <ParallaxPhoto
          src={asset('img/catedral-noite-jpg.jpg')}
          alt="Catedral Metropolitana de Brasília iluminada à noite, com as colunas curvas em branco contra o céu preto"
          pos="50% 40%"
          width="1920"
          height="1272"
          shift={50}
        />
        <Reveal as="p" className="note" delay={0.2}>
          Catedral de Brasília. As licitações de que falamos acontecem em todo o país, nas três esferas de governo.
        </Reveal>
      </div>
    </section>
  )
}

/* Faixa de texto que desliza com a rolagem: as cinco modalidades da Lei 14.133. */
const MODS = ['Pregão', 'Concorrência', 'Concurso', 'Leilão', 'Diálogo competitivo']

export function Marquee() {
  const reduce = useReducedMotion()
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const x = useTransform(scrollYProgress, [0, 1], ['4%', '-38%'])
  const row = [...MODS, ...MODS]
  return (
    <div className="marquee" ref={ref} role="img" aria-label={`Modalidades de licitação: ${MODS.join(', ')}`}>
      <motion.div className="marquee-track" style={reduce ? undefined : { x }} aria-hidden="true">
        {row.map((m, i) => (
          <span key={i}>
            {m} <b>§</b>{' '}
          </span>
        ))}
      </motion.div>
    </div>
  )
}
