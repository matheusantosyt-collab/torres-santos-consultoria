import { motion } from 'motion/react'
import { CountUp, EASE, Letters, Reveal, Spot, useCalm } from '../components/fx'

const I = {
  doc: <path d="M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6" />,
  flag: <path d="M6 21V4M6 5h11l-2 4 2 4H6" />,
  shield: <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM8.5 12.5l2.5 2.5 4.5-5" />,
  chart: <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />,
  scale: <path d="M12 4v16M6 20h12M5 8h14M5 8l-3 7a3.5 3.5 0 006 0zM19 8l-3 7a3.5 3.5 0 006 0z" />,
  clock: <path d="M12 7v5l3 2M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
}
const Icon = ({ name }) => (
  <svg viewBox="0 0 24 24" className="ico" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    {I[name]}
  </svg>
)

const BIG = [
  {
    key: 'lic',
    cls: 'b-lic',
    icon: 'flag',
    title: 'Licitações públicas',
    text: 'Para empresas que vendem ou querem vender ao poder público.',
    items: ['Leitura e análise de editais', 'Habilitação e documentos', 'Proposta e estratégia de preço', 'Impugnações, recursos e prazos', 'Acompanhamento do contrato'],
    badge: true,
  },
  {
    key: 'emp',
    cls: 'b-emp',
    icon: 'chart',
    title: 'Consultoria para empresas',
    text: 'Para organizar a casa e decidir com clareza.',
    items: ['Diagnóstico da empresa', 'Processos e rotinas', 'Contratos e documentos', 'Planejamento do crescimento'],
  },
]

const SMALL = [
  { icon: 'doc', title: 'Análise de editais', text: 'Exigências, prazos e riscos lidos antes da decisão.' },
  { icon: 'scale', title: 'Impugnações e recursos', text: 'Prazos curtos tratados com urgência.' },
  { icon: 'shield', title: 'Habilitação', text: 'Documentos em ordem antes da sessão.' },
  { icon: 'clock', title: 'Contratos e prazos', text: 'Execução acompanhada de perto.' },
]

export default function Services() {
  const off = useCalm()
  const pop = (i) => ({
    initial: off ? false : { opacity: 0, y: 50, scale: 0.96 },
    whileInView: { opacity: 1, y: 0, scale: 1 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 1.1, ease: EASE, delay: (i % 4) * 0.08 },
  })
  return (
    <section id="servicos" className="services" aria-labelledby="servicos-h">
      <header className="sec-head">
        <h2 id="servicos-h">
          <Letters text="Como podemos ajudar" inView stagger={0.03} />
        </h2>
        <Reveal as="p" delay={0.2}>
          Duas frentes de trabalho, um mesmo método: ler, organizar e decidir com antecedência.
        </Reveal>
      </header>

      <div className="bento">
        {BIG.map((b, i) => (
          <Spot key={b.key} as="article" className={`card ${b.cls}`} {...pop(i)}>
            <div className="card-top">
              <span className="ico-box">
                <Icon name={b.icon} />
              </span>
              {b.badge && (
                <span className="badge">
                  Lei <CountUp to={14133} duration={2.2} />
                </span>
              )}
            </div>
            <h3>{b.title}</h3>
            <p>{b.text}</p>
            <ul>
              {b.items.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </Spot>
        ))}
        {SMALL.map((s, i) => (
          <Spot key={s.title} as="article" className="card card-s" {...pop(i + 2)}>
            <span className="ico-box">
              <Icon name={s.icon} />
            </span>
            <h3>{s.title}</h3>
            <p>{s.text}</p>
          </Spot>
        ))}
      </div>
    </section>
  )
}
