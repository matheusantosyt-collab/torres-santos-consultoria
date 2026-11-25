import { useEffect, useRef, useState } from 'react'
import { animate, motion, useInView, useReducedMotion } from 'motion/react'
import { EASE, Letters } from '../components/fx'

/* O glifo gigante é decorativo: o texto vem do CSS (data-g), não do conteúdo da página. */
function CountGlyph({ to, className }) {
  const reduce = useReducedMotion()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })
  const fmt = (v) => Math.round(v).toLocaleString('pt-BR')
  const [txt, setTxt] = useState(reduce ? fmt(to) : fmt(0))
  useEffect(() => {
    if (!inView || reduce) return
    const c = animate(0, to, { duration: 2.8, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => setTxt(fmt(v)) })
    return () => c.stop()
  }, [inView, reduce, to])
  return <span ref={ref} className={className} data-g={txt} aria-hidden="true" />
}

function Glyph({ g, big }) {
  const cls = `glyph ${big ? 'glyph-big' : ''}`
  if (typeof g === 'string') return <span className={cls} data-g={g} aria-hidden="true" />
  if (typeof g === 'number') return <CountGlyph to={g} className={cls} />
  return (
    <span className={cls} aria-hidden="true">
      {g}
    </span>
  )
}

const Check = () => (
  <svg viewBox="0 0 100 100" className="glyph-svg" aria-hidden="true">
    <path d="M12 54 L38 80 L88 20" fill="none" stroke="currentColor" strokeWidth="14" strokeLinecap="square" />
  </svg>
)
const Arrow = () => (
  <svg viewBox="0 0 100 100" className="glyph-svg" aria-hidden="true">
    <path d="M20 80 L80 20 M30 20 H80 V70" fill="none" stroke="currentColor" strokeWidth="12" strokeLinecap="square" />
  </svg>
)

const TILES = [
  {
    id: 'a',
    tone: 'accent',
    glyph: 14133,
    title: 'Licitações públicas',
    text: 'Da leitura do edital à assinatura do contrato, para quem vende ao poder público.',
    big: true,
  },
  {
    id: 'b',
    tone: 'light',
    glyph: 'R$',
    title: 'Consultoria para empresas',
    text: 'Processos, documentos e decisões organizados para a empresa crescer com clareza.',
    big: true,
  },
  { id: 'c', tone: 's1', glyph: '§', title: 'Análise de editais', text: 'Exigências, prazos e riscos lidos antes da decisão.' },
  { id: 'd', tone: 's2', glyph: '3d', title: 'Impugnações e recursos', text: 'Prazos curtos tratados com urgência.' },
  { id: 'e', tone: 's2', glyph: <Check />, title: 'Habilitação', text: 'Documentos em ordem antes da sessão.' },
  { id: 'f', tone: 's1', glyph: '%', title: 'Propostas', text: 'Preço, prazo e exigências no mesmo lugar.' },
  { id: 'g', tone: 's2', glyph: '¶', title: 'Contratos', text: 'Acompanhamento da execução e dos prazos.' },
  { id: 'h', tone: 's1', glyph: <Arrow />, title: 'Diagnóstico empresarial', text: 'Retrato da empresa e do próximo passo.' },
]

export default function Services() {
  const reduce = useReducedMotion()
  return (
    <section id="servicos" className="services" aria-labelledby="servicos-h">
      <div className="board">
        <div className="tile t-head tone-s1">
          <h2 id="servicos-h">
            <Letters text="O que fazemos" inView stagger={0.03} />
          </h2>
        </div>

        {TILES.map((t, i) => (
          <motion.article
            key={t.id}
            className={`tile t-${t.id} tone-${t.tone}`}
            initial={reduce ? false : { opacity: 0, y: 48, clipPath: 'inset(0 0 22% 0)' }}
            whileInView={{ opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)' }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 1.1, ease: EASE, delay: (i % 4) * 0.08 }}
          >
            <Glyph g={t.glyph} big={t.big} />
            <div className="cap">
              <h3>{t.title}</h3>
              <p>{t.text}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
