# App Dom Leon Assinatura

Sistema web de pedidos, assinatura mensal e gestão da **Padaria Dom Leon** (Salto de Pirapora, SP).

Projeto **totalmente independente** dos demais sistemas da Dom Leon (Comanda, Monitor Operacional, Custos & Precificação) — sem integração ou compartilhamento de backend com eles.

---

## Stack

- **Frontend:** HTML / CSS / JavaScript puro (sem framework)
- **Backend:** Firebase — Firestore (banco de dados) + Hosting (publicação)
- **Projeto Firebase:** `new-app-dom-leon` (conta natanael.leonardo@gmail.com)
- **Fontes:** Fraunces (títulos) + Inter (corpo)
- **Ícones:** SVG inline (Tabler Icons webfont descartado por instabilidade de carregamento)
- **Identidade visual:** tema "Padaria Artesanal" — marrom `#3B2314`, dourado `#B8873B`, bege `#F5F0E8`

---

## URLs

| Ambiente | URL |
|---|---|
| Produção (início) | https://new-app-dom-leon.web.app |
| Login / Tela inicial | https://new-app-dom-leon.web.app/mod1-cad-catalogo.html |
| Wizard assinatura | https://new-app-dom-leon.web.app/mod4-monte-o-seu.html |
| Confirmar assinatura | https://new-app-dom-leon.web.app/mod2-app-ass.html |
| Catálogo avulso | https://new-app-dom-leon.web.app/mod9-catalogo-avulso.html |
| Checkout avulso | https://new-app-dom-leon.web.app/mod10-checkout-avulso.html |
| Data de assados | https://new-app-dom-leon.web.app/mod14-data-assados.html |
| Catálogo assados | https://new-app-dom-leon.web.app/mod12-catalogo-assados.html |
| Checkout assados | https://new-app-dom-leon.web.app/mod13-checkout-assados.html |
| Admin — Assinantes | https://new-app-dom-leon.web.app/mod3-admin-assinantes.html |
| Admin — Logística | https://new-app-dom-leon.web.app/mod5-entrega.html |
| Admin — Relatórios | https://new-app-dom-leon.web.app/mod7-relatorios.html |
| Admin — Planos/Itens | https://new-app-dom-leon.web.app/mod8-planos.html |
| Admin — Cadastro item | https://new-app-dom-leon.web.app/mod8-item.html |
| Admin — Projetos | https://new-app-dom-leon.web.app/mod-projetos.html |
| Admin — Parceiros | https://new-app-dom-leon.web.app/mod-parceiros.html |
| Console Firebase | https://console.firebase.google.com/project/new-app-dom-leon |
| Repositório GitHub | https://github.com/domleon/app-dom-leon |

---

## Configuração Firebase

```js
const firebaseConfig = {
  apiKey:            "AIzaSyDnePAezAoipNWXgq298EKT8ugLnPYll4",
  authDomain:        "new-app-dom-leon.firebaseapp.com",
  projectId:         "new-app-dom-leon",
  storageBucket:     "new-app-dom-leon.firebasestorage.app",
  messagingSenderId: "397519162919",
  appId:             "1:397519162919:web:3eb60357da2f94ec134802"
};
```

> ⚠️ Projetos Firebase abandonados — **não usar**: `assinatura-dom-leon` (conta padariadomleon@gmail.com) e `app-dom-leon-de67a`.

---

## Estrutura de arquivos (`public/`)

```
public/
├── index.html                       # Redireciona para mod1
├── catalogo.js                      # Fonte única de dados (Firestore)
│
├── — Fluxo do cliente —
├── mod1-cad-catalogo.html           # Login → Tela inicial → Bairro → Catálogo
├── mod2-app-ass.html                # Confirmação da assinatura + pagamento
├── mod4-monte-o-seu.html            # Wizard "Monte o seu" (3 etapas)
├── mod9-catalogo-avulso.html        # Catálogo de compra avulsa
├── mod10-checkout-avulso.html       # Checkout avulso (carrinho → endereço → pagamento → sucesso)
├── mod12-catalogo-assados.html      # Catálogo de assados e menu almoço
├── mod13-checkout-assados.html      # Checkout de assados (sempre retirada na loja)
├── mod14-data-assados.html          # Seleção de data de encomenda de assados
│
├── — Admin —
├── mod3-admin-assinantes.html       # Assinantes · Pedidos avulsos · Produção · Repasses
├── mod5-entrega.html                # Logística de entrega (assinatura)
├── mod7-relatorios.html             # Relatórios · Notificações · Checklist de retirada
├── mod8-planos.html                 # Combos · Itens · Categorias · Bairros
├── mod8-item.html                   # Cadastro/edição full-page de item
│
├── — Projetos (cards da tela inicial) —
├── mod-projetos.html                # Listagem com drag and drop para reordenar
├── mod-projeto-cadastro.html        # Cadastro/edição de projeto: ícone, fluxo, disponibilidade
│
└── — Parceiros —
    ├── mod-parceiros.html           # Listagem de parceiros externos
    └── mod-parceiro-cadastro.html   # Cadastro/edição de parceiro (dados cadastrais + auditoria)
```

> `mod6` (cartão recorrente) está embutido no `mod2`, não é arquivo separado.

---

## Fluxos do cliente

### Assinatura mensal
```
mod1 → Escolhe "Assinatura mensal"
  → mod4 Etapa 1: dias da semana (segunda a domingo)
  → mod4 Etapa 2: itens por dia (categorias em accordion, opção de copiar do dia anterior)
  → mod4 Etapa 3: resumo consolidado + total do ciclo
  → mod2: cupom de confirmação → Entrega em domicílio (taxa R$ 2,99 × nº entregas)
  → mod2: forma de pagamento → Confirmação
```

### Compra avulsa
```
mod1 → Escolhe bairro
  ├── Bairro atendido → mod9 (catálogo + busca + accordion) → mod10 (carrinho → endereço → pagamento → sucesso)
  └── Bairro não atendido → popup → Retirar na Loja (sem taxa/endereço) ou Voltar ao início
```

### Assados & Menu Almoço
```
mod1 → Escolhe "Assados & Menu Almoço"
  → mod14: seleção de data de encomenda
  → mod12: catálogo de assados (carrinho separado)
  → mod13: checkout (sempre retirada na loja, sem endereço/frete)
```

---

## Telas — descrição detalhada

### `mod1-cad-catalogo.html` — Entrada do cliente

**Tela de login/cadastro**
- Campos e-mail + senha com Firebase Auth (ainda não conectado ao Auth real — pendência)
- Redireciona para escolha de modalidade após login

**Tela inicial (cards de projetos)**
- Cards renderizados dinamicamente a partir de `CATALOGO.projetos[]` — qualquer projeto novo criado no admin aparece automaticamente aqui, sem alterar código
- Ordenação definida pelo admin (drag and drop em `mod-projetos.html`)
- Card disponível: ícone do projeto (upload base64) ou ícone SVG padrão por fluxo; clicável → navega para o fluxo
- Card fora da janela de horário: cadeado + badge de timer ("Abre quinta às 08:00") + botão **Reservar** (azul `#2563EB`) que permite avançar mesmo fora do horário
- Ao clicar, salva `projetoId` no `localStorage` antes de navegar — catálogos leem esse ID para filtrar itens e preços corretos

**Tela de escolha de bairro (fluxo avulso)**
- Lista apenas bairros com `atendido: true` do catálogo
- Bairro não atendido: popup com formulário de captura de interesse (salva em `interesses_bairro` no Firestore)

---

### `mod4-monte-o-seu.html` — Wizard de assinatura (3 etapas)

**Etapa 1 — Dias da semana**
- Lista de dias com toggle (interruptor liga/desliga)
- Mínimo 1 dia obrigatório para avançar

**Etapa 2 — Itens por dia**
- Fileira de 7 badges de dia no topo: cinza (não escolhido) · borda dourada (escolhido, vazio) · fundo dourado + check (concluído, com itens)
- Categorias em accordion (sanfona) — só uma aberta por vez
- Imagem clicável de cada item com stepper de quantidade
- Preço parcial do dia atualizado em tempo real
- Banner automático "Usar os mesmos itens de [dia anterior]?" ao entrar em novo dia vazio (a partir do 2º)

**Etapa 3 — Resumo + total**
- Grid consolidado por dia: cards clicáveis para editar
- Nome da cesta (editável, padrão "Minha cesta Dom Leon")
- Total do ciclo mensal calculado: `Σ (preço × ocorrências no ciclo de 30 dias)`
- Botão "Ir para pagamento" navega para `mod2` passando todos os dados via URL

---

### `mod2-app-ass.html` — Confirmação da assinatura

**Cupom de confirmação** (estilo recibo térmico)
- Cabeçalho: PADARIA DOM LEON · ASSINATURA MENSAL · nome da cesta
- Tabela: Qtd · Item · Unit · Total (sem símbolo R$ nos valores, só nos totais)
- Subtotal dos itens
- Taxa de entrega: R$ 2,99 × N entregas (com detalhe do cálculo inline)
- **TOTAL (30 dias)** — soma tudo
- Rodapé: dias de entrega · período (DD/MM a DD/MM) · N entregas

**Modalidade:** sempre **Entrega em domicílio** — retirada foi desabilitada para assinatura

**Ciclo de entrega**
- Dias por extenso (ex: Segunda-feira, Quinta-feira, Sábado)
- Período do ciclo e data do próximo ciclo

**Tela de pagamento**
- Opções de pagamento (Pix / Cartão)
- Validação obrigatória antes de confirmar
- Botão "Continuar" → tela de sucesso

---

### `mod9-catalogo-avulso.html` — Catálogo avulso

- Filtra itens e categorias pelo `projetoId` salvo no `localStorage` (suporte a múltiplos projetos de fluxo avulso, ex: "Faça seu pedido" e "Gás de cozinha" podem ter itens diferentes)
- Campo de busca em tempo real
- Categorias em accordion (sanfona — só uma aberta por vez)
- Preço por item via `precoPorProjeto()` — correto mesmo para itens migrados para nova arquitetura `projetos{}`
- Stepper de quantidade em cada item
- Carrinho no `localStorage` (`domleon_carrinho_avulso`)
- Botão flutuante "Ver carrinho" com contador de itens

---

### `mod10-checkout-avulso.html` — Checkout avulso

- **Carrinho:** lista de itens com quantidade e preço calculados por `precoPorProjeto()`
- **Endereço:** nome, bairro, rua, número, complemento
- **Pagamento:** Pix (QR + copia-cola) / Cartão (formulário) / Pagar na entrega (Dinheiro com troco ou Cartão na maquininha)
- **Resolução de parceiros:** ao confirmar, chama `resolverEntregas()` — identifica para cada item se a entrega é da Dom Leon ou de um parceiro externo (por bairro), salva `entregas[]` e flag `temRepasse` no pedido do Firestore
- **Webhook n8n:** se `temRepasse = true`, dispara mensagem WhatsApp ao parceiro responsável via `montarMensagemParceiro()` (URL configurável via `localStorage.setItem('domleon_n8n_webhook', 'URL')` — pendente configuração do n8n)
- Limpa carrinho e navega para tela de sucesso

---

### `mod12-catalogo-assados.html` — Catálogo de assados

- Mesmo comportamento do `mod9`, mas filtra pelo `projetoId` de assados
- Carrinho separado (`domleon_carrinho_assados`) — não mistura com o avulso
- Preço via `precoPorProjeto()` — correto para estrutura `projetos{}`

---

### `mod13-checkout-assados.html` — Checkout de assados

- Fluxo simplificado: sempre **retirada na loja** — sem tela de endereço/frete
- Mesma resolução de parceiros do mod10 (mesmo assados pode ter parceiros)
- Limpa carrinho ao confirmar

---

### `mod14-data-assados.html` — Seleção de data de encomenda

- Lê `configAssados` do projeto de assados via `getConfigAssados(catalogo)`
- Exibe datas disponíveis calculadas por `calcularDatasAssados()`: dias recorrentes + datas avulsas configuradas + exclui datas bloqueadas
- Cliente seleciona a data antes de montar o pedido de assados

---

### `mod3-admin-assinantes.html` — Admin principal

**Aba Assinantes**
- Lista de assinantes com status (ativo, pausado, pendente)
- Detalhes do ciclo, plano, itens, modalidade, bairro

**Aba Pedidos avulsos**
- Lista de pedidos avulsos

**Aba Produção do dia**
- Consolidado automático de tudo que precisa ser separado/produzido no dia

**Aba Repasses**
- Lista pedidos com `temRepasse: true` (itens entregues por parceiros externos)
- Agrupado por parceiro dentro de cada pedido: parceiro · itens · quantidades
- Badge `!` no sidebar quando há repasses pendentes

---

### `mod5-entrega.html` — Logística

- Gestão das entregas de assinatura do dia
- Rotas e confirmação de entrega por assinante

---

### `mod7-relatorios.html` — Relatórios, notificações e checklist

- **Relatórios:** resumos financeiros e operacionais
- **Notificações:** envio de avisos para clientes
- **Checklist de retirada:** lista de conferência para pedidos de retirada na loja

---

### `mod8-planos.html` — Admin de catálogo

**Aba Combos fixos**
- Combos prontos com itens e preços definidos

**Aba Itens do Monte o seu**
- Listagem de todos os itens agrupados por categoria
- Coluna de responsável: nome do projeto + preço por projeto, ou "Dom Leon" como padrão
- Botão "Novo item" abre `mod8-item.html`
- Excluir bairro: **cascata automática** — remove o bairro dos vínculos de parceiro em todos os itens

**Aba Categorias**
- CRUD de categorias
- Modal dinâmico: lista todos os projetos cadastrados com toggle — admin define em quais projetos cada categoria aparece
- Salva `projetos[]` em vez de `operacoes[]` (arquitetura escalável)

**Aba Bairros**
- CRUD de bairros com campos: nome, atendido (toggle), entrega grátis (toggle), valor do frete, pedido mínimo
- Excluir bairro dispara cascata automática nos itens

---

### `mod8-item.html` — Cadastro full-page de item

**Dados do item**
- Nome (com validação: não aceita `R$`, `·`, `/un`, `/kg`, `peso médio`, parênteses — evita nome com preço embutido que quebra o cupom)
- Hint permanente: "Use só o nome comercial"
- Descrição, categoria (filtrada dinamicamente pelos projetos ativos do item)
- Imagem (upload PNG/WEBP/JPG, máx. 2 MB, preview ao vivo)

**Status**
- Toggle ativo/inativo

**Projetos & preços**
- Renderizado dinamicamente a partir de `CATALOGO.projetos[]`
- Qualquer projeto novo criado no admin aparece automaticamente aqui
- Toggle por projeto: ativo/inativo
- Campo de preço por projeto
- Ao marcar/desmarcar projeto, o select de categoria filtra as categorias compatíveis
- Ao salvar sem parceiro vinculado: toast informativo "Entrega pela Dom Leon em todos os bairros"

**Parceiros & entrega** *(Opção 1 — fonte no item)*
- Aparece automaticamente se houver parceiros cadastrados
- Admin seleciona o parceiro e marca os bairros que ele atende para **este item específico**
- Bairro já atribuído a outro parceiro fica bloqueado (checkbox desabilitado) — evita duplicidade
- Itens sem parceiro → Dom Leon entrega (comportamento padrão, sem configuração necessária)

---

### `mod-projetos.html` — Gestão de projetos (cards da tela inicial)

- Listagem em tabela: ícone, nome, descrição, fluxo, disponibilidade semanal, status
- **Drag and drop** para reordenar — ordem salva no Firestore, refletida na tela inicial do cliente
- Botão excluir com confirmação
- Botão editar → `mod-projeto-cadastro.html`

---

### `mod-projeto-cadastro.html` — Cadastro de projeto

- **Ícone:** upload de imagem (PNG/SVG, máx. 200 KB), preview ao vivo do card
- **Nome e descrição** do card (exibidos na tela inicial do cliente)
- **Fluxo:** `avulso` | `assinatura` | `assados` — define qual catálogo/checkout é aberto ao clicar
- **Disponibilidade por dia da semana:** toggle + horário de início e fim por dia
- **Datas de encomenda** (só para fluxo `assados`): dias recorrentes, horário limite, datas avulsas, datas bloqueadas

---

### `mod-parceiros.html` — Listagem de parceiros

- Tabela com: nome, responsável, telefone, status (ativo/inativo)
- Busca por nome ou responsável
- Botão editar → `mod-parceiro-cadastro.html`
- Excluir parceiro: **cascata automática** — remove o vínculo deste parceiro de todos os itens que o referenciam + aviso com lista dos itens afetados

---

### `mod-parceiro-cadastro.html` — Cadastro de parceiro

**Dados cadastrais**
- Nome, responsável, telefone, e-mail, observações internas
- Toggle ativo/inativo

**Itens vinculados (auditoria — somente leitura)**
- Lista automaticamente todos os itens que referenciam este parceiro via `item.parceiros[]`
- Exibe os bairros que este parceiro atende para cada item
- Link direto "Editar item" para cada registro
- Visível apenas ao editar parceiro existente (não aparece para novo parceiro)

> **Nota:** bairros atendidos e itens fornecidos **não** são configurados aqui. Essa informação fica no cadastro de cada item (`mod8-item.html`), seção "Parceiros & entrega" — fonte única da verdade (Opção 1 da arquitetura).

---

## Arquitetura de dados — `catalogo.js`

Fonte única de dados do app. Carrega e persiste no Firestore (`/catalogos/dom-leon`) e expõe funções reutilizáveis.

### Estrutura do documento Firestore

```js
{
  projetos: [
    {
      id, nome, descricao, icone,          // icone = base64 PNG/SVG
      fluxo,                               // 'avulso' | 'assinatura' | 'assados'
      ordem, ativo,
      disponibilidade: {                   // janela de horário por dia
        seg: { ativo, inicio, fim },
        ter, qua, qui, sex, sab, dom
      },
      configAssados: {                     // só quando fluxo === 'assados'
        dias: [{ diaSemana, horarioLimite }],
        datasExcluidas: [],
        datasAvulsas: [{ data, horarioLimite }]
      }
    }
  ],
  categorias: [{ nome, projetos: ['avulso', 'assinatura'] }],
  itens: [{
    id, nome, descricao, categoria, ativo, imagem,
    projetos: {
      'avulso':      { ativo: true,  preco: 3.50 },
      'assinatura':  { ativo: true,  preco: 3.00 },
      'gas-cozinha': { ativo: false, preco: 0 }
    },
    parceiros: [                           // entrega por parceiro externo
      { parceiroId: 'ultragas-rep1', bairros: ['Centro', 'Vila Nova'] },
      { parceiroId: 'ultragas-rep2', bairros: ['Jardim América'] }
    ],
    // Campos legado mantidos para compatibilidade:
    precoAvulso, precoAssinatura, precoAssados,
    modalidades: { avulso, assinatura, assados }
  }],
  combos: [...],
  bairros: [{ nome, atendido, gratis, frete, minimo }],
  parceiros: [{
    id, nome, responsavel, telefone, email, obs, ativo, emoji
  }]
}
```

### Funções principais

| Função | Descrição |
|---|---|
| `carregarCatalogo()` | Carrega do Firestore, executa migração automática se necessário |
| `salvarCatalogo(catalogo)` | Persiste no Firestore |
| `cardDisponivelAgora(projeto)` | Verifica ativo + dentro da janela de horário do dia |
| `projetoPorFluxo(catalogo, fluxo)` | Busca projeto pelo fluxo |
| `projetoPorId(catalogo, id)` | Busca projeto pelo ID |
| `getConfigAssados(catalogo)` | Retorna `configAssados` do projeto de assados |
| `calcularDatasAssados(configAssados, max)` | Datas disponíveis (recorrentes + avulsas − bloqueadas) |
| `itensPorProjeto(catalogo, projetoId)` | Filtra itens ativos vinculados a um projeto |
| `precoPorProjeto(item, projetoId, catalogo)` | Retorna o preço do item para um projeto |
| `categoriasPorProjeto(catalogo, projetoId)` | Categorias com itens ativos naquele projeto |
| `resolverParceiro(item, bairro, catalogo)` | Retorna o parceiro responsável pela entrega, ou `null` (Dom Leon) |
| `resolverEntregas(itensPedido, bairro, catalogo)` | Resolve todos os itens → retorna `entregas[]` + `temRepasse` |
| `montarMensagemParceiro(parceiro, itens, cliente, bairro, pedidoId)` | Monta mensagem WhatsApp para o parceiro |
| `migrarCatalogo(catalogo)` | Migração automática de estruturas antigas |

### Migrações automáticas

`migrarCatalogo()` executa na primeira carga e converte automaticamente:

1. `configCards` (antigo) → `projetos[]` unificado
2. `categorias string[]` → objetos `{nome, projetos[]}`
3. `categorias.operacoes` → `categorias.projetos[]`
4. `itensAssados` separados → `itens` com `modalidades.assados`
5. `item.modalidades + precoAvulso/Assinatura/Assados` → `item.projetos{}`
6. `categorias.projetos` com fluxos → IDs de projeto reais

---

## Regras de negócio

### Assinatura
- Ciclo: 30 dias corridos, começa no 1º dia de entrega válido após contratação
- Modalidade: **sempre entrega** (retirada desabilitada)
- Taxa: R$ 2,99 por entrega × número de entregas do ciclo
- Total exibido no cupom: subtotal dos itens + taxa de entrega

### Avulso
- Taxa de entrega: fixa por bairro (configurada no mod8)
- Pedido mínimo: configurável por bairro
- Bairro não atendido: popup com opção de retirada na loja

### Assados
- Encomenda antecipada: cliente seleciona data antes de montar o pedido
- Entrega: sempre retirada na loja
- Datas: recorrentes por dia da semana + avulsas + bloqueadas

### Parceiros externos (Opção 1 — fonte no item)
- O vínculo parceiro+bairros fica no **item** (`item.parceiros[]`), não no parceiro
- Um item pode ter parceiros diferentes para bairros diferentes (ex: Rep. Norte → Centro; Rep. Sul → Jardim América)
- Dois parceiros **nunca** atende o mesmo bairro para o mesmo item (bloqueio na UX)
- Item sem parceiro → Dom Leon entrega (padrão, sem configuração necessária)
- Parceiro desativado: `resolverParceiro()` ignora e trata como Dom Leon
- Excluir parceiro: cascata automática remove vínculos de todos os itens
- Excluir bairro: cascata automática remove bairro dos vínculos de parceiro nos itens
- Notificação WhatsApp: disparada via n8n ao confirmar pedido com repasse (pendente configuração)

### Projetos / cards da tela inicial
- Qualquer projeto novo criado no admin aparece automaticamente na tela inicial do cliente
- Disponibilidade por janela de horário por dia da semana
- Fora da janela: cadeado + timer de próxima abertura + botão "Reservar"
- Itens e preços são filtrados pelo `projetoId` — dois projetos de mesmo fluxo podem ter itens diferentes

---

## Deploy

Upload manual dos arquivos pela página web do GitHub, diretamente na pasta `public/`. GitHub Actions publica automaticamente no Firebase Hosting a cada commit em `main`.

- **Workflow:** `.github/workflows/firebase-hosting-merge.yml`
- **Secret:** `FIREBASE_SERVICE_ACCOUNT_NEW_APP_DOM_LEON`
- **SDK Firebase nos módulos:** `firebase-app-compat.js` + `firebase-firestore-compat.js` v10.14.1 — devem aparecer **antes** do `catalogo.js` em todos os módulos que o utilizam (mod1, mod2, mod4, mod8, mod9, mod10, mod12, mod13, mod14)

> ⚠️ **Nunca subir na raiz do repositório** — causou bugs graves anteriormente. Sempre na pasta `public/`.

> 💡 **Lição aprendida:** ao pedir ao usuário para colar conteúdo de um arquivo, sempre entregar o arquivo real via `present_files` para abrir no Bloco de notas — copiar texto do chat perde quebras de linha e quebra YAML/JSON.

---

## Status

| Funcionalidade | Status |
|---|---|
| Tela inicial com cards dinâmicos | ✅ Funcional |
| Wizard de assinatura (3 etapas) | ✅ Funcional |
| Catálogo e checkout avulso | ✅ Funcional |
| Catálogo e checkout de assados | ✅ Funcional |
| Cupom de confirmação (assinatura) | ✅ Funcional |
| Parceiros externos por item/bairro | ✅ Funcional |
| Aba "Repasses" no admin | ✅ Funcional |
| Gestão de projetos (drag and drop) | ✅ Funcional |
| Gestão de parceiros | ✅ Funcional |
| Migração automática de dados | ✅ Funcional |
| Webhook n8n (WhatsApp parceiro) | ⏳ Estrutura pronta — aguardando n8n |
| Pagamento (Pix/cartão) | ⏳ Simulado — aguardando Mercado Pago |
| Firebase Authentication real | ⏳ Não conectado ao Auth |
| `firestore.rules` | ⏳ Aplicar manualmente no Console Firebase |

---

## Backlog pendente

| # | Item |
|---|---|
| 1 | Classificação de bairros por região (mod8) — em análise |
| 2 | Aba Pedidos avulsos (mod3) — pausado |
| 3 | Integração Mercado Pago — Pix + cartão avulso / Preapproval recorrente |
| 4 | Firebase Authentication real |
| 5 | Deploy das `firestore.rules` no Console Firebase |
| 6 | Redesenhar tela "Confirmar assinatura" (Etapa 3 mod4) — grid consolidado |
| 7 | Timer-row desalinhado (mod1) — badge relógio e botão Reservar na mesma linha |
| 8 | Preço de pão pesável: `R$ 0,95/un (peso médio 50g · R$ 19,00/kg)` (mod4 e mod9) |
| 9 | Campo "nome curto" no cadastro de item — para cupom de confirmação (aguardando decisão de escopo) |
| 10 | Configuração do n8n para notificações WhatsApp aos parceiros |
