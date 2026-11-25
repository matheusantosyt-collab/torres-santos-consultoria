import { asset } from '../config'
import { Letters, ParallaxPhoto, Reveal } from '../components/fx'

export default function About() {
  return (
    <section id="sobre" className="about grid12" aria-labelledby="sobre-h">
      <div className="about-sticky">
        <h2 id="sobre-h">
          <Letters text="Matheus" inView stagger={0.05} />
          <br />
          <Letters text="Santos Torres" inView delay={0.25} stagger={0.045} />
        </h2>
      </div>

      <div className="about-body">
        <Reveal as="p" className="about-lead">
          Bacharel em Direito, fundou a Torres Santos Consultoria para fazer do edital um terreno conhecido.
        </Reveal>

        <ParallaxPhoto
          className="about-photo"
          src={asset('img/itamaraty-meteoro-jpg.jpg')}
          alt="Palácio do Itamaraty, em Brasília, à noite: arcos iluminados em laranja refletidos no espelho d'água, ao lado de uma escultura branca"
          pos="68% 50%"
          width="1920"
          height="1280"
          shift={70}
        />

        <Reveal as="p" delay={0.05}>
          Seu trabalho está entre o direito administrativo e a gestão: ler o edital com método, organizar a documentação,
          montar propostas consistentes e orientar o empresário sobre quando disputar e quando recuar.
        </Reveal>
        <Reveal as="p" delay={0.1}>
          O mesmo olhar vale para a empresa que não vende ao governo: processos, contratos e decisões organizados para que
          o crescimento não dependa de improviso.
        </Reveal>
        <Reveal as="p" className="note" delay={0.15}>
          Consultoria técnica. Não substitui a atuação de advogado inscrito na OAB.
        </Reveal>
      </div>
    </section>
  )
}
