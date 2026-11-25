import { ScrollWords, VelocityMarquee } from '../components/fx'

const TEXT =
  'Toda licitação é uma disputa que se decide antes da sessão pública: no edital lido com atenção, na habilitação sem pendências, na proposta que cabe no preço e no prazo. Nós cuidamos desses detalhes para a sua empresa focar no que faz melhor.'

const MODS = ['Pregão', 'Concorrência', 'Concurso', 'Leilão', 'Diálogo competitivo']
const WORDS = ['Editais', 'Habilitação', 'Propostas', 'Recursos', 'Contratos', 'Prazos']

export default function Statement() {
  return (
    <>
      <section id="statement" className="statement" aria-label="Apresentação">
        <ScrollWords text={TEXT} className="statement-text" />
      </section>
      <div className="marquees" role="img" aria-label={`Modalidades de licitação: ${MODS.join(', ')}`}>
        <VelocityMarquee items={MODS} />
        <VelocityMarquee items={WORDS} reverse className="vm-outline" />
      </div>
    </>
  )
}
