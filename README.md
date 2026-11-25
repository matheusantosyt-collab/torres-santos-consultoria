# Torres Santos Consultoria

Landing page (React + Vite + Motion + Lenis). Consultoria em licitações públicas e para empresas.

## Antes de publicar

Edite `src/config.js`:

- `email`: e-mail real da consultoria (hoje é um texto de exemplo).
- `whatsapp` (opcional): só dígitos, com DDI e DDD, por exemplo `5561999999999`. Vazio = o formulário abre o e-mail.

Textos de exemplo que você deve conferir: seção "Sobre" (`src/sections/About.jsx`), "Atendimento" no rodapé
(`src/sections/Footer.jsx`) e as etapas do método (`src/sections/Method.jsx`).

## Rodar localmente

```powershell
npm install
npm run dev
```

## Publicar no GitHub Pages

1. Crie um repositório no GitHub e envie esta pasta (branch `main`).
2. No repositório: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. A cada push na `main`, o workflow `.github/workflows/deploy.yml` faz o build e publica.

O site usa caminhos relativos (`base: './'`), então funciona em `usuario.github.io/nome-do-repo/` e em domínio próprio.

## Fotos

Fotografias de Brasília de domínio público e licenças Creative Commons (Wikimedia Commons). Os créditos aparecem no
rodapé e ficam em `src/credits.json`. Se trocar uma foto, atualize o crédito.
