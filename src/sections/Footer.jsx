import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { NAV, SITE } from '../config'
import { FitWord, Reveal, setCalm, useCalm } from '../components/fx'
import credits from '../credits.json'

export default function Footer() {
  const off = useCalm()
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] })
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1])

  return (
    <footer ref={ref} className="footer">
      <Reveal className="footer-cols" amount={0.1}>
        <div>
          <p className="f-first">Contato</p>
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener noreferrer">
            WhatsApp {SITE.whatsappLabel}
          </a>
        </div>
        <div>
          <p className="f-first">Navegação</p>
          {NAV.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
          <a href="#contato">Contato</a>
        </div>
        <div>
          <p className="f-first">Atendimento</p>
          <p>Remoto, em todo o Brasil</p>
          <p>Segunda a sexta, em horário comercial</p>
        </div>
        <div>
          <p className="f-first">{SITE.owner}</p>
          <p>Bacharel em Direito</p>
          <p>Consultoria técnica. Não substitui a atuação de advogado inscrito na OAB.</p>
        </div>
      </Reveal>

      <motion.div className="footer-mark" style={off ? undefined : { scale }}>
        <FitWord text="Torres Santos" inView stagger={0.04} />
      </motion.div>

      <div className="footer-legal">
        <div className="legal-row">
          <p>
            © {SITE.year} {SITE.name}. Todos os direitos reservados.
          </p>
          <button type="button" className="calm-toggle" aria-pressed={off} onClick={() => setCalm(!off)}>
            Animações: {off ? 'reduzidas' : 'ligadas'} · {off ? 'ligar' : 'reduzir'}
          </button>
        </div>
        <ul className="credits" aria-label="Créditos das fotografias">
          {credits.map((c) => (
            <li key={c.page}>
              <a href={c.page}>“{c.title}”</a>
              <span>
                {' '}
                por {c.creator}, <a href={c.licenseUrl}>{c.license}</a>, via Wikimedia Commons
              </span>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}
