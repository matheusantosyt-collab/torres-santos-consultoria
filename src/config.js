// ─────────────────────────────────────────────────────────────
//  CONFIGURAÇÃO DO SITE — dados de contato.
// ─────────────────────────────────────────────────────────────
export const SITE = {
  name: 'Torres Santos Consultoria',
  owner: 'Matheus Santos Torres',
  email: 'matheustorresantos@outlook.com',
  // DDI 55 + DDD 81 + número, só dígitos
  whatsapp: '5581996392560',
  whatsappLabel: '(81) 99639-2560',
  year: new Date().getFullYear(),
}

export const asset = (path) => `${import.meta.env.BASE_URL}${path}`

export const NAV = [
  { label: 'Serviços', href: '#servicos', id: 'servicos' },
  { label: 'Método', href: '#metodo', id: 'metodo' },
  { label: 'Dúvidas', href: '#faq', id: 'faq' },
  { label: 'Sobre', href: '#sobre', id: 'sobre' },
]
