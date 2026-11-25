import { useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { EASE, Letters, TweenNumber, useCalm } from '../components/fx'

const STAGES = [
  {
    name: 'Diagnóstico',
    clause: 'Primeiro, entendemos a sua empresa',
    text: 'Antes de olhar qualquer edital, conhecemos o que a empresa vende, o que já tem em documentos e onde quer chegar.',
    items: ['Quem a empresa é e o que ela vende', 'Certidões e documentos que já existem', 'Histórico de participação em licitações', 'Quais editais valem a disputa'],
  },
  {
    name: 'Edital',
    clause: 'Depois, lemos o edital por inteiro',
    text: 'O edital e os anexos são lidos linha a linha, com os prazos e as exigências organizados antes da decisão.',
    items: ['Leitura integral do edital e dos anexos', 'Mapa de prazos e exigências', 'Pontos para esclarecimento ou impugnação', 'Decisão: participar ou não'],
  },
  {
    name: 'Proposta',
    clause: 'Então, montamos a proposta',
    text: 'Preço, prazo e condições conferidos contra o que o edital pede, com estratégia para a fase de lances.',
    items: ['Composição de custos e preço', 'Conferência da planilha e dos anexos', 'Prazos e condições de entrega', 'Estratégia para a fase de lances'],
  },
  {
    name: 'Habilitação',
    clause: 'Em seguida, a habilitação em ordem',
    text: 'Os documentos são reunidos e conferidos antes da sessão, para não perder a disputa por uma pendência.',
    items: ['Documentos jurídicos, fiscais e trabalhistas', 'Qualificação técnica e atestados', 'Qualificação econômico-financeira', 'Conferência de validade antes da sessão'],
  },
  {
    name: 'Contrato',
    clause: 'Por fim, acompanhamos o contrato',
    text: 'Depois de assinado, o contrato continua exigindo atenção: entregas, pagamentos e eventuais ajustes.',
    items: ['Leitura das cláusulas e obrigações', 'Calendário de entregas e pagamentos', 'Registro de ocorrências na execução', 'Reequilíbrio e prorrogações, quando cabem'],
  },
]

const Tick = ({ delay }) => (
  <svg viewBox="0 0 24 24" className="tick" aria-hidden="true">
    <motion.path
      d="M4 12.5 L9.5 18 L20 6"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.5, ease: EASE, delay }}
    />
  </svg>
)

export default function Process() {
  const off = useCalm()
  const ref = useRef(null)
  const [i, setI] = useState(0)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setI(Math.max(0, Math.min(STAGES.length - 1, Math.floor(v * STAGES.length * 0.9999))))
  })

  const goTo = (k) => {
    const el = ref.current
    if (!el) return
    const total = el.offsetHeight - window.innerHeight
    const y = el.offsetTop + ((k + 0.5) / STAGES.length) * total
    if (window.__lenis) window.__lenis.scrollTo(y, { duration: 1.2 })
    else window.scrollTo({ top: y, behavior: off ? 'auto' : 'smooth' })
  }

  const s = STAGES[i]
  const pct = Math.round(((i + 1) / STAGES.length) * 100)

  return (
    <section id="metodo" ref={ref} className="process" style={{ height: `${STAGES.length * 85 + 40}svh` }} aria-labelledby="metodo-h">
      <div className="process-sticky">
        <div className="process-left">
          <p className="chip">
            <span className="pulse" aria-hidden="true" />
            Como funciona · passo {i + 1} de {STAGES.length}
          </p>
          <h2 id="metodo-h" className="sr-only">
            Como funciona o método
          </h2>
          <AnimatePresence mode="wait">
            <motion.p
              key={i}
              className="clause"
              initial={off ? false : { opacity: 0, y: 36, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={off ? undefined : { opacity: 0, y: -24, filter: 'blur(6px)' }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              {s.clause}
            </motion.p>
          </AnimatePresence>
          <AnimatePresence mode="wait">
            <motion.p
              key={`t${i}`}
              className="process-text"
              initial={off ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={off ? undefined : { opacity: 0 }}
              transition={{ duration: 0.4, ease: EASE, delay: 0.05 }}
            >
              {s.text}
            </motion.p>
          </AnimatePresence>

          <div className="stages" role="tablist" aria-label="Etapas">
            {STAGES.map((st, k) => (
              <button key={st.name} type="button" role="tab" aria-selected={k === i} className={k === i ? 'on' : k < i ? 'done' : ''} onClick={() => goTo(k)}>
                {st.name}
              </button>
            ))}
          </div>
          <p className="process-hint">Role a página ou clique em uma etapa</p>
        </div>

        <div className="process-right">
          <div className="panel" data-ui>
            <AnimatePresence mode="wait">
              <motion.div
                key={i}
                initial={off ? false : { opacity: 0, x: 40, rotateY: -10 }}
                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                exit={off ? undefined : { opacity: 0, x: -30 }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                <p className="panel-kicker">Neste passo</p>
                <p className="panel-title">{s.name}</p>
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
      </div>
    </section>
  )
}
