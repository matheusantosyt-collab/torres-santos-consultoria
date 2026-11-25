import { useState } from 'react'
import { motion } from 'motion/react'
import { SITE } from '../config'
import { Aurora, EASE, Letters, Magnetic, Reveal, useCalm } from '../components/fx'

const CHOICES = ['Licitações públicas', 'Para empresas']

export default function Contact() {
  const off = useCalm()
  const [name, setName] = useState('')
  const [choice, setChoice] = useState(0)

  const message = () => {
    const who = name.trim() || 'um novo contato'
    return `Olá, sou ${who}. Tenho interesse em consultoria: ${CHOICES[choice].toLowerCase()}.`
  }

  const submit = (e) => {
    e.preventDefault()
    const text = message()
    const url = SITE.whatsapp
      ? `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`
      : `mailto:${SITE.email}?subject=${encodeURIComponent('Contato pelo site')}&body=${encodeURIComponent(text)}`
    window.open(url, '_blank', 'noopener')
  }

  return (
    <section id="contato" className="cta" aria-labelledby="contato-h">
      <Aurora className="aurora-cta" />
      <div className="cta-left">
        <h2 id="contato-h">
          <Letters text="Vamos ao edital?" inView stagger={0.035} />
        </h2>
        <Reveal as="p" delay={0.3}>
          Conte o que a sua empresa vende e qual disputa está no radar. Respondemos com os próximos passos.
        </Reveal>
        <Reveal className="cta-direct" delay={0.4}>
          <a className="btn btn-ghost" href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener noreferrer">
            WhatsApp {SITE.whatsappLabel}
          </a>
          <a className="btn btn-ghost" href={`mailto:${SITE.email}`}>
            {SITE.email}
          </a>
        </Reveal>
      </div>

      <motion.form
        className="dialog"
        data-ui
        onSubmit={submit}
        initial={off ? false : { opacity: 0, y: 60, rotate: 1.5 }}
        whileInView={{ opacity: 1, y: 0, rotate: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.2, ease: EASE, delay: 0.15 }}
      >
        <h3>Envie uma mensagem</h3>

        <label className="field">
          <span>Seu nome e empresa</span>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex.: Maria Souza, Alfa Engenharia" autoComplete="name" />
        </label>

        <div className="seg" role="radiogroup" aria-label="Tipo de consultoria">
          {CHOICES.map((c, i) => (
            <button key={c} type="button" role="radio" aria-checked={choice === i} className={choice === i ? 'on' : ''} onClick={() => setChoice(i)}>
              {choice === i && !off && <motion.span layoutId="seg-pill" className="seg-pill" transition={{ duration: 0.4, ease: EASE }} />}
              <span className="seg-label">{c}</span>
            </button>
          ))}
        </div>

        <Magnetic strength={0.15} className="dialog-cta">
          <button type="submit" className="btn btn-block">
            Enviar pelo WhatsApp
          </button>
        </Magnetic>
        <p className="hint">Abre o WhatsApp com a mensagem pronta.</p>
      </motion.form>
    </section>
  )
}
