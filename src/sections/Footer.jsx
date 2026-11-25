import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { NAV, SITE } from '../config'
import { FitWord, Reveal } from '../components/fx'
import credits from '../credits.json'

export default function Footer() {
  const reduce = useReducedMotion()
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] })
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1])
  const mail = `mailto:${SITE.email}`
  const wa = SITE.whatsapp ? `https://wa.me/${SITE.whatsapp}` : null

  return (
    <footer ref={ref} className="footer">
      <Reveal className="footer-cols" amount={0.1}>
        <div>
          <p className="f-first">Contato</p>
          <a href={mail}>{SITE.email}</a>
          {wa && <a href={wa}>WhatsApp</a>}
        </div>
        <div>
          <p className="f-first">Navegação</p>
          {NAV.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
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

      <motion.div className="footer-mark" style={reduce ? undefined : { scale }}>
        <FitWord text="Torres Santos" inView stagger={0.04} />
      </motion.div>

      <div className="footer-legal">
        <p>
          © {SITE.year} {SITE.name}. Todos os direitos reservados.
        </p>
        <ul className="credits" aria-label="Créditos das fotografias">
          {credits.map((c) => (
            <li key={c.page}>
              <a href={c.page}>“{c.title}”</a>
              <span>
                {' '}
                por {c.creator},{' '}
                <a href={c.licenseUrl}>{c.license}</a>, via Wikimedia Commons
              </span>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}
