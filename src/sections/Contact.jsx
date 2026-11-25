import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { SITE } from '../config'
import { EASE, Letters, Magnetic, Reveal } from '../components/fx'

const CHOICES = ['Licitações públicas', 'Para empresas']

export default function Contact() {
  const reduce = useReducedMotion()
  const [name, setName] = useState('')
  const [choice, setChoice] = useState(0)

  const submit = (e) => {
    e.preventDefault()
    const who = name.trim() || 'um novo contato'
    const text = `Olá, sou ${who}. Tenho interesse em consultoria: ${CHOICES[choice].toLowerCase()}.`
    const url = SITE.whatsapp
      ? `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`
      : `mailto:${SITE.email}?subject=${encodeURIComponent('Contato pelo site')}&body=${encodeURIComponent(text)}`
    window.location.href = url
  }

  return (
    <section id="contato" className="cta" aria-labelledby="contato-h">
      <div className="cta-left">
        <h2 id="contato-h">
          <Letters text="Vamos ao edital" inView stagger={0.04} />
        </h2>
        <Reveal as="p" delay={0.3}>
          Conte o que a sua empresa vende e qual disputa está no radar. Respondemos com os próximos passos.
        </Reveal>
      </div>

      <motion.form
        className="dialog"
        data-ui
        onSubmit={submit}
        initial={reduce ? false : { opacity: 0, y: 48, rotate: 1.5 }}
        whileInView={{ opacity: 1, y: 0, rotate: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.2, ease: EASE, delay: 0.15 }}
      >
        <h3>Fale com a Torres Santos</h3>

        <label className="field">
          <span>Seu nome e empresa</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex.: Maria Souza, Alfa Engenharia"
            autoComplete="name"
          />
        </label>

        <div className="seg" role="radiogroup" aria-label="Tipo de consultoria">
          {CHOICES.map((c, i) => (
            <button
              key={c}
              type="button"
              role="radio"
              aria-checked={choice === i}
              className={choice === i ? 'on' : ''}
              onClick={() => setChoice(i)}
            >
              {choice === i && !reduce && <motion.span layoutId="seg-pill" className="seg-pill" transition={{ duration: 0.4, ease: EASE }} />}
              <span className="seg-label">{c}</span>
            </button>
          ))}
        </div>

        <Magnetic strength={0.15} className="dialog-cta">
          <button type="submit" className="btn btn-block">
            <span>Enviar mensagem</span>
          </button>
        </Magnetic>
        <p className="hint">{SITE.whatsapp ? 'Abre o WhatsApp com a mensagem pronta.' : 'Abre o seu e-mail com a mensagem pronta.'}</p>
      </motion.form>
    </section>
  )
}
