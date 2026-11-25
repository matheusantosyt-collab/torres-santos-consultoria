import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { asset } from '../config'
import { CountUp, Letters, ParallaxPhoto, Reveal } from '../components/fx'

const ROWS = [
  { to: 14133, unit: '', text: 'é a Lei de Licitações e Contratos Administrativos, de 2021. Cada edital que analisamos é lido contra ela.' },
  { to: 5, unit: '', text: 'modalidades de licitação: pregão, concorrência, concurso, leilão e diálogo competitivo.' },
  { to: 3, unit: ' dias', text: 'úteis, em regra, é o prazo para impugnar um edital ou recorrer. Perder o prazo é perder a disputa.' },
  { to: 27, unit: '', text: 'unidades da federação, 26 estados e o Distrito Federal, compram sob as mesmas normas gerais.' },
]

export default function Stats() {
  return (
    <section id="numeros" className="stats grid12" aria-labelledby="numeros-h">
      <div className="stats-main">
        <h2 id="numeros-h">
          <Letters text="Os números da disputa" inView stagger={0.025} />
        </h2>
        <dl>
          {ROWS.map((r, i) => (
            <Reveal as="div" className="stat" key={i} delay={i * 0.08} amount={0.4}>
              <dt>
                <CountUp to={r.to} suffix={r.unit} duration={2.2 + i * 0.25} />
              </dt>
              <dd>{r.text}</dd>
            </Reveal>
          ))}
        </dl>
      </div>
      <div className="stats-photo">
        <ParallaxPhoto
          src={asset('img/esplanada-noite-jpg.jpg')}
          alt="Vista aérea noturna da Esplanada dos Ministérios, com o Congresso Nacional iluminado ao fundo e a lua cheia no céu"
          pos="46% 52%"
          width="1920"
          height="1280"
          shift={60}
        />
      </div>
    </section>
  )
}

/* Faixa de largura total: o Alvorada em 1960, que se abre conforme a rolagem. */
export function PhotoBand() {
  const reduce = useReducedMotion()
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] })
  const inset = useTransform(scrollYProgress, [0, 1], [14, 0])
  const clip = useTransform(inset, (v) => `inset(${v}% ${v * 0.6}% ${v}% ${v * 0.6}%)`)
  const scale = useTransform(scrollYProgress, [0, 1], [1.25, 1])
  return (
    <figure className="band" ref={ref}>
      <motion.div className="band-in" style={reduce ? undefined : { clipPath: clip }}>
        <motion.img
          src={asset('img/alvorada-1960-jpg.jpg')}
          alt="Palácio da Alvorada, em Brasília, em fotografia noturna de 1960: a fachada iluminada sobre um fundo totalmente negro"
          width="1920"
          height="1151"
          loading="lazy"
          style={reduce ? undefined : { scale }}
        />
      </motion.div>
      <figcaption>Palácio da Alvorada, Brasília, 1960. Imagem de arquivo, domínio público.</figcaption>
    </figure>
  )
}
