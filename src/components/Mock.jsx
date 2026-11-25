/* Ilustração do trabalho: um edital sendo lido, com pontos de atenção que se acendem. É um exemplo ilustrativo. */

const Tick = () => (
  <svg viewBox="0 0 24 24" className="mock-tick" aria-hidden="true">
    <path d="M4 12.5 L9.5 18 L20 6" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const CHECKS = ['Objeto e exigências lidos', 'Documentos de habilitação', 'Proposta conferida', 'Prazos no calendário']

export default function EditalMock() {
  return (
    <div className="mock" data-ui>
      <div className="mock-bar">
        <i />
        <i />
        <i />
        <b>Edital · exemplo ilustrativo</b>
      </div>
      <div className="mock-body">
        <p className="mock-kicker">Pregão eletrônico</p>
        <p className="mock-title">Aquisição de materiais de escritório</p>

        <div className="mock-doc" aria-hidden="true">
          <span style={{ width: '92%' }} />
          <span style={{ width: '78%' }} className="hl hl-1" />
          <span style={{ width: '88%' }} />
          <span style={{ width: '64%' }} className="hl hl-2" />
          <span style={{ width: '82%' }} />
          <span style={{ width: '58%' }} className="hl hl-3" />
        </div>

        <ul className="mock-checks">
          {CHECKS.map((c, i) => (
            <li key={c} style={{ '--i': i }}>
              <Tick />
              <span>{c}</span>
            </li>
          ))}
        </ul>

        <div className="mock-deadline">
          <span className="pulse" aria-hidden="true" />
          Impugnação: até 3 dias úteis antes da abertura
        </div>
      </div>
    </div>
  )
}
