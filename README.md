# Assinatura Dom Leon

Sistema de assinatura de pães e produtos de padaria da **Padaria Dom Leon** (Salto de Pirapora, SP).

Projeto **totalmente independente** dos demais sistemas da Dom Leon (Comanda, Monitor Operacional, Custos & Precificação) — sem integração ou compartilhamento de backend com eles.

## Stack

- HTML / CSS / JavaScript puro (sem framework)
- Firebase (Firestore + Auth + Hosting) — projeto próprio
- Fonte Inter, ícones Tabler, Chart.js — identidade visual alinhada ao Monitor Operacional Dom Leon

## Estrutura

```
public/
├── index.html                    # redireciona para o login
├── mod1-cad-catalogo.html        # cadastro/login + catálogo (combos fixos e monte o seu)
├── mod2-app-ass.html             # assinatura, pagamento (Pix/cartão), confirmação
├── mod3-admin-assinantes.html    # admin: assinantes + produção do dia
├── mod4-monte-o-seu.html         # montagem personalizada de combo
├── mod5-entrega.html             # admin: logística de entrega
├── mod7-relatorios.html          # admin: relatórios + notificações + checklist de retirada
└── mod8-planos.html              # admin: cadastro de combos fixos e itens do monte o seu
```

> Módulo 6 (cartão de crédito recorrente) está embutido no `mod2-app-ass.html`, não é arquivo separado.

## URLs

### Site em produção (Firebase Hosting)

| Página | URL |
|---|---|
| Início (redireciona pro login) | https://assinatura-dom-leon.web.app |
| Módulo 1 — Login/Cadastro/Catálogo | https://assinatura-dom-leon.web.app/mod1-cad-catalogo.html |
| Módulo 2 — Assinatura/Pagamento | https://assinatura-dom-leon.web.app/mod2-app-ass.html |
| Módulo 3 — Admin: Assinantes/Produção | https://assinatura-dom-leon.web.app/mod3-admin-assinantes.html |
| Módulo 4 — Monte o seu | https://assinatura-dom-leon.web.app/mod4-monte-o-seu.html |
| Módulo 5 — Admin: Logística | https://assinatura-dom-leon.web.app/mod5-entrega.html |
| Módulo 7 — Admin: Relatórios/Notificações/Checklist | https://assinatura-dom-leon.web.app/mod7-relatorios.html |
| Módulo 8 — Admin: Planos (config. de combos/itens) | https://assinatura-dom-leon.web.app/mod8-planos.html |

### Painéis de gestão

| O quê | URL |
|---|---|
| Repositório GitHub | https://github.com/domleon/assinatura-dom-leon |
| Console do projeto Firebase | https://console.firebase.google.com/project/assinatura-dom-leon/overview |

## Rodando localmente

Qualquer servidor estático funciona, por exemplo:

```bash
cd public
python3 -m http.server 8000
```

Depois acesse `http://localhost:8000`.

## Deploy (Firebase Hosting)

```bash
npm install -g firebase-tools   # se ainda não tiver
firebase login
firebase init                   # selecionar Hosting + Firestore, apontar para pasta "public"
firebase deploy
```

## Status

Protótipo de navegação/interface — sem persistência real em banco de dados ainda.
Cada módulo tem CRUD ou formulários funcionais na tela, mas os dados não são salvos entre sessões.
