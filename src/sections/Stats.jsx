import { CountUp, Letters, Reveal, Spot } from '../components/fx'

const ROWS = [
  { to: 14133, unit: '', label: 'Lei 14.133/2021', text: 'A Lei de Licitações e Contratos Administrativos. Cada edital que analisamos é lido contra ela.' },
  { to: 5, unit: '', label: 'Modalidades', text: 'Pregão, concorrência, concurso, leilão e diálogo competitivo.' },
  { to: 3, unit: ' dias', label: 'Prazo curto', text: 'Úteis, em regra, para impugnar um edital ou recorrer. Perder o prazo é perder a disputa.' },
  { to: 27, unit: '', label: 'Unidades da federação', text: '26 estados e o Distrito Federal compram sob as mesmas normas gerais.' },
]

export default function Stats() {
  return (
    <section id="numeros" className="stats" aria-labelledby="numeros-h">
      <header className="sec-head">
        <h2 id="numeros-h">
          <Letters text="Os números da disputa" inView stagger={0.03} />
        </h2>
      </header>
      <div className="stat-grid">
        {ROWS.map((r, i) => (
          <Reveal key={r.label} delay={i * 0.08}>
            <Spot className="stat-card">
              <p className="stat-label">{r.label}</p>
              <p className="stat-num">
                <CountUp to={r.to} suffix={r.unit} duration={2 + i * 0.3} />
              </p>
              <p className="stat-text">{r.text}</p>
            </Spot>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
