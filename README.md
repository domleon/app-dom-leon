# Assinatura Dom Leon

Sistema de assinatura de pães e produtos de padaria, mais compra avulsa, da **Padaria Dom Leon** (Salto de Pirapora, SP).

Projeto **totalmente independente** dos demais sistemas da Dom Leon (Comanda, Monitor Operacional, Custos & Precificação) — sem integração ou compartilhamento de backend com eles.

## Stack

- HTML / CSS / JavaScript puro (sem framework)
- Firebase (Firestore + Auth + Hosting) — projeto próprio, ainda não conectado de verdade (ver seção "Status")
- Fonte Fraunces (títulos) + Inter (corpo), ícones Tabler, Chart.js — identidade visual "Padaria Artesanal" (marrom/dourado/bege)

## Estrutura

```
public/
├── index.html                    # redireciona para o login
├── catalogo.js                   # fonte única de dados (categorias, itens, combos, bairros)
├── mod1-cad-catalogo.html        # login/cadastro → escolha (avulso/assinatura) → bairro → catálogo
├── mod2-app-ass.html             # assinatura: plano, pagamento (Pix/cartão), confirmação
├── mod3-admin-assinantes.html    # admin: assinantes, pedidos avulsos, produção do dia
├── mod4-monte-o-seu.html         # wizard "monte o seu" (3 etapas) + edição de combo fixo
├── mod5-entrega.html             # admin: logística de entrega (assinatura)
├── mod7-relatorios.html          # admin: relatórios, notificações, checklist de retirada
├── mod8-planos.html              # admin: combos fixos, itens, categorias, bairros/frete
├── mod9-catalogo-avulso.html     # catálogo de compra avulsa (busca + carrinho)
└── mod10-checkout-avulso.html    # checkout avulso: carrinho, endereço, pagamento, sucesso
```

> Módulo 6 (cartão de crédito recorrente) está embutido no `mod2-app-ass.html`, não é arquivo separado.

## Fluxos

### Assinatura mensal
```
Login → Escolha → Assinatura mensal → Catálogo (Monte o seu / Combos prontos)
  → mod4 (wizard: dias da semana → itens por dia → resumo)
  → mod2 (retirada ou entrega [+R$2,99/entrega] → pagamento → sucesso)
```

### Compra avulsa
```
Login → Escolha → Escolha seus produtos → Bairro
  ├── atendido → mod9 (catálogo + busca + carrinho) → mod10 (endereço → pagamento → sucesso)
  └── não atendido → popup → Retirar na Loja (pula endereço) ou Voltar ao início
```

## URLs

### Site em produção (Firebase Hosting)

| Página | URL |
|---|---|
| Início (redireciona pro login) | https://assinatura-dom-leon.web.app |
| Login / Escolha / Bairro / Catálogo | https://assinatura-dom-leon.web.app/mod1-cad-catalogo.html |
| Assinatura — Plano/Pagamento | https://assinatura-dom-leon.web.app/mod2-app-ass.html |
| Admin — Assinantes / Pedidos avulsos / Produção | https://assinatura-dom-leon.web.app/mod3-admin-assinantes.html |
| Monte o seu (wizard) | https://assinatura-dom-leon.web.app/mod4-monte-o-seu.html |
| Admin — Logística | https://assinatura-dom-leon.web.app/mod5-entrega.html |
| Admin — Relatórios / Notificações / Checklist | https://assinatura-dom-leon.web.app/mod7-relatorios.html |
| Admin — Planos / Itens / Categorias / Bairros | https://assinatura-dom-leon.web.app/mod8-planos.html |
| Catálogo avulso | https://assinatura-dom-leon.web.app/mod9-catalogo-avulso.html |
| Checkout avulso | https://assinatura-dom-leon.web.app/mod10-checkout-avulso.html |

### Painéis de gestão

| O quê | URL |
|---|---|
| Repositório GitHub | https://github.com/domleon/assinatura-dom-leon |
| Console do projeto Firebase | https://console.firebase.google.com/project/assinatura-dom-leon/overview |

## Regras de negócio principais

- **Ciclo de assinatura**: 30 dias corridos, iniciando no primeiro dia da semana escolhido após a contratação; próximo ciclo sempre começa no primeiro dia de entrega válido após o vencimento anterior
- **Taxa de entrega da assinatura**: fixa em R$ 2,99 por entrega, multiplicada pelo número de entregas do ciclo (só se modalidade = Entrega)
- **Taxa de entrega do avulso**: fixa por bairro (cadastrada no mod8), sem cálculo por distância; bairro fora da lista de atendidos bloqueia o pedido (com opção de retirada na loja)
- **Pedido mínimo por bairro**: configurável junto com o frete; bloqueia o avanço no carrinho até ser atingido
- **Pagamento**: Pix (QR code + copia-e-cola), cartão online, ou pagar na entrega (dinheiro com troco / cartão na maquininha) — só disponível no avulso

## Deploy

Fluxo atual: upload manual dos arquivos pela página web do GitHub, direto na pasta `public/` do repositório. O GitHub Actions já está configurado (`firebase init hosting:github`) e publica automaticamente no Firebase Hosting a cada commit na branch `main` — não é necessário rodar `firebase deploy` manualmente.

## Status

- Protótipo funcional de navegação/interface, com toda a lógica de cálculo (ciclo, taxas, pedido mínimo) implementada e testada
- **Catálogo de dados** (categorias, itens, combos, bairros) persiste em `localStorage` do navegador — ainda **não conectado ao Firestore**, então os dados não são compartilhados entre dispositivos/usuários
- **Pagamento** (Pix/cartão) é simulado na tela — ainda **não integrado ao Mercado Pago** (gateway já definido: pagamento simples para avulso, Assinaturas/Preapproval para recorrência)
- Autenticação (login/cadastro) ainda não conectada ao Firebase Auth
