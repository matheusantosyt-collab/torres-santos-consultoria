# Torres Santos Consultoria

Landing page (React + Vite + Motion + Lenis). Consultoria em licitações públicas e para empresas.

## Onde mudar as coisas

- **Contato (e-mail e WhatsApp):** `src/config.js`
- **Sua foto:** salve como `public/img/foto.jpg` (quadrada ou 4:5, rosto no terço de cima). Sem o arquivo, a seção "Sobre" mostra um monograma "MT".
- **Textos:** cada seção está em `src/sections/` (Hero, Services, Stats, Process, About, Faq, Contact, Footer).
- **Cores e visual:** variáveis no topo de `src/styles.css`.

Textos de exemplo para conferir: "Sobre", "Atendimento" no rodapé, etapas do método e perguntas frequentes.

## Rodar localmente

```powershell
npm install
npm run dev
```

## Publicar no GitHub Pages

A cada `git push` na branch `main`, o workflow `.github/workflows/deploy.yml` faz o build e publica.
(Settings → Pages → Source: GitHub Actions, já configurado.)

## Animações

Ficam ligadas por padrão. O visitante pode reduzi-las no botão "Animações" no rodapé.

## Fotos

Wikimedia Commons (licenças CC). Créditos no rodapé e em `src/credits.json`. Se trocar uma foto, atualize o crédito.
