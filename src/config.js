// ─────────────────────────────────────────────────────────────
//  CONFIGURAÇÃO DO SITE — edite aqui os dados de contato.
// ─────────────────────────────────────────────────────────────
export const SITE = {
  name: 'Torres Santos Consultoria',
  owner: 'Matheus Santos Torres',

  // TODO: troque pelo e-mail real da consultoria.
  email: 'contato@seudominio.com.br',

  // TODO (opcional): WhatsApp só com dígitos, com DDI e DDD. Ex.: '5561999999999'.
  // Se ficar vazio, o formulário abre o e-mail.
  whatsapp: '',

  year: new Date().getFullYear(),
}

export const asset = (path) => `${import.meta.env.BASE_URL}${path}`

export const NAV = [
  { label: 'Serviços', href: '#servicos' },
  { label: 'Método', href: '#metodo' },
  { label: 'Sobre', href: '#sobre' },
  { label: 'Contato', href: '#contato' },
]
