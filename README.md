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
