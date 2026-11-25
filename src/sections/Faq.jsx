import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { EASE, Letters, Reveal } from '../components/fx'

const FAQ = [
  {
    q: 'O que é a Lei 14.133/2021?',
    a: 'É a Lei de Licitações e Contratos Administrativos. Ela reúne as regras para as compras e contratações da administração pública e substitui a antiga Lei 8.666/1993.',
  },
  {
    q: 'A consultoria participa da licitação no lugar da minha empresa?',
    a: 'Atuamos como consultoria: analisamos o edital, organizamos documentos e propostas e orientamos as decisões. A participação e a assinatura continuam sendo da sua empresa.',
  },
  {
    q: 'Preciso de advogado?',
    a: 'A consultoria técnica não substitui a atuação de advogado inscrito na OAB. Quando o caso exigir peça jurídica ou representação, indicamos esse caminho.',
  },
  {
    q: 'Serve para quem nunca participou de uma licitação?',
    a: 'Sim. Começamos pelo diagnóstico: o que a empresa vende, quais documentos já tem e quais editais fazem sentido para o seu momento.',
  },
  {
    q: 'Como começo?',
    a: 'Envie uma mensagem pelo formulário de contato ou pelo WhatsApp. Respondemos com os próximos passos.',
  },
]

function Item({ q, a, open, onToggle, id }) {
  return (
    <div className={`faq-item ${open ? 'is-open' : ''}`}>
      <h3>
        <button type="button" aria-expanded={open} aria-controls={`faq-${id}`} onClick={onToggle}>
          <span>{q}</span>
          <span className="plus" aria-hidden="true" />
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`faq-${id}`}
            className="faq-a"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <p>{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Faq() {
  const [open, setOpen] = useState(0)
  return (
    <section id="faq" className="faq" aria-labelledby="faq-h">
      <header className="sec-head">
        <h2 id="faq-h">
          <Letters text="Dúvidas frequentes" inView stagger={0.03} />
        </h2>
        <Reveal as="p" delay={0.2}>
          O básico sobre licitações e sobre como a consultoria funciona.
        </Reveal>
      </header>
      <Reveal className="faq-list">
        {FAQ.map((f, i) => (
          <Item key={f.q} id={i} {...f} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />
        ))}
      </Reveal>
    </section>
  )
}
