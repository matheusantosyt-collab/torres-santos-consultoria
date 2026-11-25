import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { EASE, TweenNumber } from '../components/fx'

const STAGES = [
  {
    name: 'Diagnóstico',
    clause: 'Primeiro, o diagnóstico da empresa',
    items: [
      'Quem a empresa é e o que ela vende',
      'Certidões e documentos que já existem',
      'Histórico de participação em licitações',
      'Quais editais valem a disputa',
    ],
  },
  {
    name: 'Edital',
    clause: 'Depois, a leitura do edital',
    items: [
      'Leitura integral do edital e dos anexos',
      'Mapa de prazos e exigências',
      'Pontos para esclarecimento ou impugnação',
      'Decisão: participar ou não',
    ],
  },
  {
    name: 'Proposta',
    clause: 'Então, a proposta sob medida',
    items: [
      'Composição de custos e preço',
      'Conferência da planilha e dos anexos',
      'Prazos e condições de entrega',
      'Estratégia para a fase de lances',
    ],
  },
  {
    name: 'Habilitação',
    clause: 'Em seguida, a habilitação em ordem',
    items: [
      'Documentos jurídicos, fiscais e trabalhistas',
      'Qualificação técnica e atestados',
      'Qualificação econômico-financeira',
      'Conferência de validade antes da sessão',
    ],
  },
  {
    name: 'Contrato',
    clause: 'Por fim, o contrato acompanhado',
    items: [
      'Leitura das cláusulas e obrigações',
      'Calendário de entregas e pagamentos',
      'Registro de ocorrências na execução',
      'Reequilíbrio e prorrogações, quando cabem',
    ],
  },
]

const Tick = ({ delay }) => (
  <svg viewBox="0 0 24 24" className="tick" aria-hidden="true">
    <motion.path
      d="M4 12.5 L9.5 18 L20 6"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="square"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.5, ease: EASE, delay }}
    />
  </svg>
)

export default function Method() {
  const reduce = useReducedMotion()
  const [i, setI] = useState(0)
  const s = STAGES[i]
  const pct = Math.round(((i + 1) / STAGES.length) * 100)

  return (
    <section id="metodo" className="method" aria-labelledby="metodo-h">
      <div className="method-left">
        <AnimatePresence mode="wait">
          <motion.h2
            id="metodo-h"
            key={i}
            className="clause"
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            {s.clause}
          </motion.h2>
        </AnimatePresence>
      </div>

      <div className="method-right">
        <div className="panel" data-ui>
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              <p className="panel-title">{s.name}</p>
              <p className="panel-sub">Neste passo, fazemos:</p>
              <ul>
                {s.items.map((t, k) => (
                  <li key={t}>
                    <Tick delay={0.15 + k * 0.12} />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
          <div className="panel-foot">
            <span>Do diagnóstico ao contrato</span>
            <TweenNumber value={pct} suffix="%" />
          </div>
          <div className="panel-bar" aria-hidden="true">
            <motion.span animate={{ scaleX: pct / 100 }} transition={{ duration: 0.7, ease: EASE }} />
          </div>
        </div>
      </div>

      <div className="method-slider">
        <div className="track">
          <div className="track-fill" style={{ width: `${(i / (STAGES.length - 1)) * 100}%` }} />
          <input
            type="range"
            min={0}
            max={STAGES.length - 1}
            step={1}
            value={i}
            onChange={(e) => setI(Number(e.target.value))}
            aria-label="Etapa do processo"
            aria-valuetext={s.name}
          />
        </div>
        <div className="stage-names">
          {STAGES.map((st, k) => (
            <button key={st.name} type="button" className={k === i ? 'on' : ''} onClick={() => setI(k)} aria-pressed={k === i}>
              {st.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
