# Torres Santos Consultoria

Landing page estática (HTML + CSS + JavaScript puros, sem frameworks), empacotada pelo Vite e publicada no GitHub Pages.
Direção de arte "Papel timbrado": papel, tinta e vermelho-lacre, seções numeradas como cláusulas.

## Onde mudar as coisas

- **Textos e estrutura:** `index.html` (cada seção está marcada com um comentário `§ 0X`).
- **Visual:** `src/site.css` (cores e tipografia nas variáveis do topo).
- **Animações e interações:** `src/site.js`.
- **Sua foto:** salve como `public/img/foto.jpg` (4:5, por exemplo 1200×1500, rosto no terço de cima). Sem o arquivo,
  a seção "Fundador" mostra um layout só com texto.
- **Imagem de prévia (WhatsApp, LinkedIn):** `public/og.png` (1200×630).
- **Ícone:** `public/favicon.svg` e `public/apple-touch-icon.png`.

## Rodar localmente

```powershell
npm install
npm run dev
```

## Publicar

A cada `git push` na branch `main`, o workflow `.github/workflows/deploy.yml` faz o build e publica no GitHub Pages.

## Animações

Ficam ligadas por padrão. O visitante pode desligá-las no botão "Reduzir animações" no rodapé (a escolha fica salva
no navegador). Também é possível abrir o site com `?movimento=nao`.

## Fotos

“Legal Contract & Signature - Warm Tones” por Blogtrepreneur, CC BY 2.0, via Wikimedia Commons. O crédito aparece no
rodapé ("Créditos das imagens"). Se trocar a foto, atualize o crédito.
