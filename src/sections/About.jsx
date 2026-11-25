import { useState } from 'react'
import { asset } from '../config'
import { Letters, ParallaxPhoto, Reveal, Spot } from '../components/fx'

export default function About() {
  const [noPhoto, setNoPhoto] = useState(false)
  return (
    <section id="sobre" className="about" aria-labelledby="sobre-h">
      <div className="about-media">
        {noPhoto ? (
          <div className="monogram" aria-hidden="true">
            <span>MT</span>
          </div>
        ) : (
          <ParallaxPhoto
            className="about-photo"
            src={asset('img/foto.jpg')}
            alt="Matheus Santos Torres, fundador da Torres Santos Consultoria, de paletó escuro, em fundo cinza"
            pos="50% 22%"
            width="1254"
            height="1254"
            shift={50}
            onError={() => setNoPhoto(true)}
          />
        )}
        <span className="float f4">Fundador</span>
        <span className="float f5">Consultoria técnica</span>
      </div>

      <div className="about-body">
        <p className="chip">Quem está por trás</p>
        <h2 id="sobre-h">
          <Letters text="Matheus Santos Torres" inView stagger={0.03} />
        </h2>
        <Reveal as="p" className="about-lead">
          Matheus fundou a Torres Santos Consultoria para fazer do edital um terreno conhecido.
        </Reveal>
        <Reveal as="p" delay={0.05}>
          Seu trabalho está entre o direito administrativo e a gestão: ler o edital com método, organizar a documentação, montar
          propostas consistentes e orientar o empresário sobre quando disputar e quando recuar.
        </Reveal>
        <Reveal as="p" delay={0.1}>
          O mesmo olhar vale para a empresa que não vende ao governo: processos, contratos e decisões organizados para que o
          crescimento não dependa de improviso.
        </Reveal>
        <Spot className="note-card" tilt={false}>
          Consultoria técnica. Não substitui a atuação de advogado inscrito na OAB.
        </Spot>
      </div>
    </section>
  )
}
