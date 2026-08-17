# App Dom Leon

Sistema de assinatura de pães e produtos de padaria, mais compra avulsa, da **Padaria Dom Leon** (Salto de Pirapora, SP).

Projeto **totalmente independente** dos demais sistemas da Dom Leon (Comanda, Monitor Operacional, Custos & Precificação) — sem integração ou compartilhamento de backend com eles.

## Stack

- HTML / CSS / JavaScript puro (sem framework)
- Firebase (Firestore + Auth + Hosting) — projeto `new-app-dom-leon`, conta natanael.leonardo@gmail.com
- Fonte Fraunces (títulos) + Inter (corpo), ícones Tabler, Chart.js — identidade visual "Padaria Artesanal" (marrom/dourado/bege)

## Estrutura

```
public/
├── index.html                    # redireciona para o login
├── catalogo.js                   # fonte única de dados (categorias, itens, combos, bairros) — Firestore
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

## Catálogo de dados — agora no Firestore

`catalogo.js` lê e grava no Firestore (coleção `catalogo`, documento `dados`), não mais em `localStorage`. Isso significa que o que o admin cadastra no `mod8` (itens, combos, categorias, bairros) já aparece pra qualquer cliente, em qualquer dispositivo, sem precisar do mesmo navegador.

Arquivos que usam `catalogo.js` (mod1, mod4, mod8, mod9, mod10) carregam o SDK do Firebase (`firebase-app-compat.js` + `firebase-firestore-compat.js`) antes dele.

## Fluxos

### Assinatura mensal
```
Login → Escolha → Assinatura mensal → Catálogo (Monte o seu / Combos prontos)
  → mod4 (wizard: dias da semana → itens por dia → resumo)
  → mod2 (retirada ou entrega [+R$2,99/entrega] → pagamento → sucesso)
```

### Compra avulsa
```
Login → Escolha → Faça seu Pedido → Bairro
  ├── atendido → mod9 (catálogo + busca + carrinho) → mod10 (endereço → pagamento → sucesso)
  └── não atendido → popup → Retirar na Loja (pula endereço) ou Voltar ao início
```

## URLs

### Site em produção (Firebase Hosting)

| Página | URL |
|---|---|
| Início (redireciona pro login) | https://new-app-dom-leon.web.app |
| Login / Escolha / Bairro / Catálogo | https://new-app-dom-leon.web.app/mod1-cad-catalogo.html |
| Assinatura — Plano/Pagamento | https://new-app-dom-leon.web.app/mod2-app-ass.html |
| Admin — Assinantes / Pedidos avulsos / Produção | https://new-app-dom-leon.web.app/mod3-admin-assinantes.html |
| Monte o seu (wizard) | https://new-app-dom-leon.web.app/mod4-monte-o-seu.html |
| Admin — Logística | https://new-app-dom-leon.web.app/mod5-entrega.html |
| Admin — Relatórios / Notificações / Checklist | https://new-app-dom-leon.web.app/mod7-relatorios.html |
| Admin — Planos / Itens / Categorias / Bairros | https://new-app-dom-leon.web.app/mod8-planos.html |
| Catálogo avulso | https://new-app-dom-leon.web.app/mod9-catalogo-avulso.html |
| Checkout avulso | https://new-app-dom-leon.web.app/mod10-checkout-avulso.html |

### Painéis de gestão

| O quê | URL |
|---|---|
| Repositório GitHub | https://github.com/domleon/app-dom-leon |
| Console do projeto Firebase | https://console.firebase.google.com/project/new-app-dom-leon/overview |

## Regras de negócio principais

- **Ciclo de assinatura**: 30 dias corridos, iniciando no primeiro dia da semana escolhido após a contratação; próximo ciclo sempre começa no primeiro dia de entrega válido após o vencimento anterior
- **Taxa de entrega da assinatura**: fixa em R$ 2,99 por entrega, multiplicada pelo número de entregas do ciclo (só se modalidade = Entrega)
- **Taxa de entrega do avulso**: fixa por bairro (cadastrada no mod8), sem cálculo por distância; bairro fora da lista de atendidos bloqueia o pedido (com opção de retirada na loja)
- **Pedido mínimo por bairro**: configurável junto com o frete; bloqueia o avanço no carrinho até ser atingido
- **Pagamento**: Pix (QR code + copia-e-cola), cartão online, ou pagar na entrega (dinheiro com troco / cartão na maquininha) — só disponível no avulso

## Deploy

Fluxo atual: upload manual dos arquivos pela página web do GitHub, direto na pasta `public/` do repositório (**nunca** na raiz — esse foi o erro que causou a maior confusão até aqui). O GitHub Actions publica automaticamente no Firebase Hosting a cada commit na branch `main`.

**Checklist antes de subir qualquer arquivo:**
1. Confirme que está DENTRO da pasta `public/` antes de clicar em "Add file → Upload files"
2. `firebase.json`, `.firebaserc`, `firestore.rules` vão na RAIZ (fora de `public/`)
3. O workflow (`.github/workflows/firebase-hosting-merge.yml`) só é editado, nunca duplicado solto em outro lugar

## Status

- Protótipo funcional de navegação/interface, com toda a lógica de cálculo (ciclo, taxas, pedido mínimo) implementada e testada
- **Catálogo de dados** (categorias, itens, combos, bairros) agora persiste no **Firestore** de verdade — compartilhado entre todos os dispositivos/usuários
- **Pagamento** (Pix/cartão) é simulado na tela — ainda **não integrado ao Mercado Pago** (gateway já definido: pagamento simples para avulso, Assinaturas/Preapproval para recorrência)
- Autenticação (login/cadastro) ainda não conectada ao Firebase Auth
