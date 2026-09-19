# App Dom Leon Assinatura

Sistema web de pedidos, assinatura mensal e gestão da **Padaria Dom Leon** (Salto de Pirapora, SP).

Projeto **totalmente independente** dos demais sistemas da Dom Leon (Comanda, Monitor Operacional, Custos & Precificação) — sem integração ou compartilhamento de backend com eles.

---

## Stack

- **Frontend:** HTML / CSS / JavaScript puro (sem framework)
- **Backend:** Firebase — Firestore (banco de dados) + Hosting (publicação)
- **Projeto Firebase:** `new-app-dom-leon` (conta natanael.leonardo@gmail.com)
- **Fontes:** Fraunces (títulos) + Inter (corpo)
- **Ícones:** Tabler Icons webfont hospedado localmente (`tabler-icons.min.css` + `fonts/`) — CDN externo descartado por instabilidade de MIME type
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
├── tabler-icons.min.css             # Ícones hospedados localmente (CDN externo descartado)
├── fonts/
│   ├── tabler-icons.woff2           # Fonte dos ícones
│   └── tabler-icons.woff
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

### 🛒 Pedido Avulso

**Público:** cliente que quer comprar pontualmente, sem compromisso de recorrência.

**Características:**
- Cliente escolhe o bairro **antes** de ver o catálogo — garante que só veja itens e preços aplicáveis à sua região
- Bairro não atendido → popup com duas opções: "Retirar na Loja" (sem frete, sem endereço) ou "Voltar ao início"
- Bairro atendido → catálogo com busca em tempo real + categorias em accordion (só uma aberta por vez)
- Preços filtrados por `projetoId` — dois projetos de fluxo avulso (ex: "Faça seu pedido" e "Gás de cozinha") podem ter itens e preços diferentes
- Stepper de quantidade em cada item; carrinho persiste no `localStorage` (`domleon_carrinho_avulso`)
- Botão flutuante "Ver carrinho" com contador de itens
- Pedido mínimo configurável por bairro — bloqueia avanço se não atingido
- Checkout: nome, endereço completo, forma de pagamento (Pix / Cartão / Pagar na entrega)
- Taxa de entrega fixa por bairro, configurada no admin
- **Resolução de parceiros:** ao confirmar, o sistema identifica automaticamente para cada item se a entrega é da Dom Leon ou de um parceiro externo, com base no bairro do cliente
- Pedido salvo no Firestore com `entregas[]` detalhando o responsável por item e flag `temRepasse`
- Webhook n8n disparado automaticamente se houver repasse, enviando WhatsApp ao parceiro com nome do cliente, bairro, itens e número do pedido
- Pagamento simulado (integração Mercado Pago pendente)

**Navegação:**
```
mod1 → Escolhe bairro
  ├── Bairro atendido → mod9 (catálogo + busca + accordion + carrinho)
  │     → mod10 (carrinho → endereço → pagamento → sucesso)
  └── Bairro não atendido → popup
        ├── Retirar na Loja → mod9 → mod10 (sem endereço/frete)
        └── Voltar ao início → mod1
```

---

### 📅 Assinatura Mensal

**Público:** cliente que quer receber uma cesta de produtos regularmente, com entrega programada todo mês.

**Características:**
- Wizard de 3 etapas guiado — sem acesso direto às telas internas
- **Etapa 1 — Dias da semana:** toggles para cada dia (seg a dom); mínimo 1 obrigatório para avançar
- **Etapa 2 — Monte sua cesta:** fileira de 7 badges de dia no topo indicando estado (cinza = não escolhido · borda dourada = escolhido sem itens · fundo dourado + check = concluído com itens); categorias em accordion; imagem clicável + stepper de quantidade por item; preço parcial do dia atualizado em tempo real; banner automático "Usar os mesmos itens de [dia anterior]?" ao entrar em dia vazio a partir do 2º
- **Etapa 3 — Resumo:** grid consolidado por dia com cards clicáveis para editar; campo de nome da cesta (editável, padrão "Minha cesta Dom Leon"); total do ciclo calculado como `Σ (preço do item × ocorrências do dia no ciclo de 30 dias)`
- Ciclo de 30 dias corridos, iniciando no primeiro dia de entrega válido após a contratação
- **Sempre entrega em domicílio** — retirada na loja desabilitada para assinatura
- Taxa de R$ 2,99 por entrega × número de entregas do ciclo, incluída no total exibido
- Cupom de confirmação estilo recibo térmico: cabeçalho · tabela de itens (Qtd · Item · Unit · Total) · subtotal dos itens · taxa de entrega com detalhe do cálculo (R$ 2,99 × N entregas) · **TOTAL (30 dias)** · rodapé com dias, período e total de entregas
- Itens separados por dia na URL e parseados no mod2 via separador `||` (não usa `·` para evitar conflito com nomes de itens)
- **Sem parceiros externos** — todos os itens de assinatura são entregues exclusivamente pela Dom Leon
- Pagamento via Pix ou Cartão (simulado — Preapproval Mercado Pago pendente)

**Navegação:**
```
mod1 → Escolhe "Assinatura mensal"
  → mod4 Etapa 1: dias da semana (mín. 1)
  → mod4 Etapa 2: itens por dia (accordion + stepper + cópia do dia anterior)
  → mod4 Etapa 3: resumo consolidado + nome da cesta + total do ciclo
  → mod2: cupom de confirmação (subtotal + taxa de entrega + total)
  → mod2: forma de pagamento (Pix ou Cartão)
  → mod2: tela de sucesso
```

---

### 🍗 Assados & Menu Almoço

**Público:** cliente que quer encomendar assados ou itens de almoço com antecedência, para retirada em data específica.

**Características:**
- Cliente escolhe a **data de encomenda antes** de ver o catálogo — garante que o pedido seja para uma data disponível
- Datas calculadas dinamicamente pela função `calcularDatasAssados()`: dias recorrentes configurados por dia da semana + datas avulsas adicionadas manualmente + exclusão de datas bloqueadas (feriados, fechamentos)
- Catálogo exclusivo de assados — itens separados do avulso/assinatura, com preços próprios por projeto
- Carrinho separado (`domleon_carrinho_assados`) — não mistura com o avulso
- Checkout simplificado: **sempre retirada na loja** — sem campo de endereço, sem cálculo de frete
- Parceiros externos possíveis: mesmo mecanismo do avulso (resolução por item + bairro), mas sem endereço de entrega — parceiro recebe notificação de que há encomenda a preparar
- Pagamento simulado (Mercado Pago pendente)

**Navegação:**
```
mod1 → Escolhe "Assados & Menu Almoço"
  → mod14: seleção de data de encomenda (datas dinâmicas do Firestore)
  → mod12: catálogo de assados (accordion + stepper + carrinho separado)
  → mod13: checkout (resumo do pedido → pagamento → sucesso — sem endereço/frete)
```

---

### Comparativo rápido

| Característica | Avulso | Assinatura | Assados |
|---|---|---|---|
| Comprometimento | Nenhum | Mensal (30 dias) | Por encomenda |
| Modalidade | Entrega ou retirada | Sempre entrega | Sempre retirada |
| Frete | Fixo por bairro | R$ 2,99 × entregas | Sem frete |
| Parceiros externos | ✅ Sim | ❌ Não | ✅ Sim |
| Catálogo | Geral (por projeto) | Geral (por projeto) | Exclusivo assados |
| Data obrigatória antes do catálogo | ❌ | ❌ | ✅ Data de encomenda |
| Carrinho | `domleon_carrinho_avulso` | Wizard (sem localStorage) | `domleon_carrinho_assados` |
| Notificação parceiro | ✅ WhatsApp via n8n | ❌ | ✅ WhatsApp via n8n |
| Pagamento | Simulado | Simulado | Simulado |

---

## Telas — descrição detalhada

### `mod1-cad-catalogo.html` — Entrada do cliente

**Tela de login/cadastro**
- Campos e-mail + senha com Firebase Auth (ainda não conectado ao Auth real — pendência)
- Redireciona para a tela inicial após login

**Tela inicial (cards de projetos)**
- Cards renderizados dinamicamente a partir de `CATALOGO.projetos[]` — qualquer projeto novo criado no admin aparece automaticamente aqui, sem alterar código
- Ordenação definida pelo admin via drag and drop em `mod-projetos.html`, salva no campo `projeto.ordem` do Firestore
- **Card disponível:** ícone do projeto (imagem base64 cadastrada no admin) ou ícone SVG padrão por fluxo caso não tenha imagem; clicável → salva `projetoId` no `localStorage` e navega para o fluxo correspondente
- **Card fora da janela de horário:** ícone substituído por cadeado; badge com timer de próxima abertura ("Abre quinta às 08:00" — dia por extenso); botão **Reservar** (fundo azul `#2563EB`, texto branco) que permite avançar mesmo fora do horário configurado
- O `projetoId` salvo no `localStorage` é lido pelos catálogos (mod9, mod4, mod12) para filtrar itens e preços corretos — dois projetos de mesmo fluxo podem ter itens diferentes

**Tela de escolha de bairro (fluxo avulso)**
- Lista apenas bairros com `atendido: true` do catálogo
- Bairro não atendido: popup com formulário de captura de interesse (nome + telefone), salvo na coleção `interesses_bairro` do Firestore para análise de expansão futura

---

### `mod4-monte-o-seu.html` — Wizard de assinatura (3 etapas)

**Etapa 1 — Dias da semana**
- Toggle liga/desliga para cada dia da semana (segunda a domingo)
- Mínimo 1 dia obrigatório para avançar — validação exibida em toast
- Dias selecionados ficam em dourado; não selecionados em cinza

**Etapa 2 — Itens por dia**
- Fileira de 7 badges de dia no topo com 3 estados visuais: cinza (não escolhido) · borda dourada (escolhido, sem itens ainda) · fundo dourado + ícone de check (concluído, com itens)
- Categorias exibidas em accordion — só uma categoria aberta por vez
- Cada item exibe imagem, nome e preço; stepper de quantidade (+/−) embutido
- Preço parcial do dia (soma dos itens × quantidade) atualizado em tempo real no rodapé
- Banner automático "Usar os mesmos itens de [dia anterior]?" aparece ao entrar em novo dia vazio a partir do 2º dia selecionado — evita retrabalho em cestas iguais todos os dias
- Itens e preços filtrados pelo `projetoId` via `itensPorProjeto()` e `precoPorProjeto()`

**Etapa 3 — Resumo + total**
- Cards por dia com lista de itens e quantidades; clicáveis para voltar e editar aquele dia
- Campo de nome da cesta (editável inline, padrão "Minha cesta Dom Leon")
- Total do ciclo calculado: `Σ (preço do item × quantidade × ocorrências do dia nos 30 dias)`
- Ocorrências calculadas pela função `contarOcorrenciasDias()` — percorre dia a dia o intervalo real do ciclo de 30 dias, contando exatamente quantas vezes cada dia da semana cai no período
- Botão "Ir para pagamento" monta a string de itens no formato `id|Nome` separado por `||` entre dias, e navega para `mod2` via URL params

---

### `mod2-app-ass.html` — Confirmação da assinatura

**Cupom de confirmação** (estilo recibo térmico)
- Cabeçalho: PADARIA DOM LEON · ASSINATURA MENSAL · nome da cesta
- Tabela de itens consolidada: Qtd · Item · Valor unitário · Valor total (valores sem símbolo R$ — só números com vírgula para decimal)
- Itens parseados do param `itens` da URL: formato `Dia: qtd id|Nome, qtd id|Nome || Dia: ...` — separador `||` entre dias para não conflitar com `·` de nomes de itens
- Busca de preço por ID do item primeiro, nome como fallback via `buscarPrecoItem()`
- **Subtotal dos itens** — soma de todos os itens do ciclo
- **Taxa de entrega** — R$ 2,99 × N entregas, com detalhe do cálculo inline
- **TOTAL (30 dias)** — subtotal + taxa
- Rodapé: dias de entrega abreviados · período (DD/MM a DD/MM) · N entregas
- **Ciclo de entrega:** dias por extenso, período completo e data de início do próximo ciclo
- **Modalidade:** sempre Entrega em domicílio — retirada desabilitada para assinatura
- **Pagamento:** Pix ou Cartão — validação obrigatória antes de confirmar (botão bloqueado sem seleção)
- Botão "Continuar" → tela de sucesso com número do pedido

---

### `mod9-catalogo-avulso.html` — Catálogo avulso

- Lê `projetoId` do `localStorage` ao inicializar — filtra itens e categorias exclusivos daquele projeto via `itensPorProjeto()` e `categoriasPorProjeto()`
- Suporte a múltiplos projetos de fluxo avulso: "Faça seu pedido" e "Gás de cozinha" podem exibir catálogos completamente diferentes sem alteração de código
- Campo de busca em tempo real — filtra por nome do item dentro de todas as categorias
- Categorias em accordion (sanfona) — só uma aberta por vez; ao abrir nova, fecha a anterior
- Preço por item via `precoPorProjeto()` — correto mesmo para itens migrados para a nova arquitetura `projetos{}`
- Stepper de quantidade embutido em cada item; zerado → remove do carrinho
- Carrinho persistido no `localStorage` (`domleon_carrinho_avulso`)
- Botão flutuante no rodapé "Ver carrinho (N)" com contador de itens atualizado em tempo real

---

### `mod10-checkout-avulso.html` — Checkout avulso

- **Carrinho:** lista todos os itens com quantidade e preço recalculados via `precoPorProjeto()` — não usa preço em cache, busca do catálogo ao inicializar
- **Endereço:** campos nome do destinatário, bairro (select), rua, número, complemento
- **Formas de pagamento:**
  - Pix: exibe QR code e código copia-cola (simulado)
  - Cartão de crédito: formulário com número, nome, validade e CVV
  - Pagar na entrega: opção Dinheiro (campo de troco) ou Cartão na maquininha
- **Resolução de parceiros:** ao confirmar, chama `resolverEntregas()` — percorre cada item do carrinho e, cruzando com o bairro selecionado, identifica se a entrega é da Dom Leon (`responsavel: 'dom-leon'`) ou de um parceiro (`responsavel: 'parceiro', parceiroId, parceiroNome`)
- Pedido salvo no Firestore com: itens, endereço, forma de pagamento, bairro, `entregas[]`, `temRepasse`, `criadoEm`, número do pedido
- **Webhook n8n:** se `temRepasse = true`, agrupa itens por parceiro e dispara mensagem WhatsApp via `montarMensagemParceiro()` para cada parceiro envolvido — URL do webhook configurável via `localStorage.setItem('domleon_n8n_webhook', 'URL')`
- Limpa `domleon_carrinho_avulso` do localStorage ao confirmar
- Navega para tela de sucesso com número do pedido

---

### `mod12-catalogo-assados.html` — Catálogo de assados

- Mesmo comportamento do `mod9`, mas inicializa com o `projetoId` de assados lido do `localStorage`
- Filtra itens e categorias via `itensPorProjeto()` — mostra apenas itens vinculados ao projeto de assados
- Preço via `precoPorProjeto()` — correto para a nova estrutura `projetos{}`
- Carrinho separado (`domleon_carrinho_assados`) — completamente independente do carrinho avulso
- Data da encomenda já selecionada em mod14 e exibida no topo do catálogo como referência

---

### `mod13-checkout-assados.html` — Checkout de assados

- Fluxo simplificado em relação ao avulso: **sempre retirada na loja** — sem campo de endereço, sem cálculo de frete, sem opção de entrega
- Exibe resumo do pedido com data da encomenda, itens e quantidades, total
- Mesma resolução de parceiros do mod10: `resolverEntregas()` identifica se algum item é fornecido por parceiro externo
- Pedido salvo no Firestore com data da encomenda, itens, forma de pagamento, `entregas[]` e `temRepasse`
- Webhook n8n disparado se `temRepasse = true`
- Limpa `domleon_carrinho_assados` ao confirmar
- Pagamento simulado

---

### `mod14-data-assados.html` — Seleção de data de encomenda

- Lê a configuração de datas do projeto de assados via `getConfigAssados(catalogo)` — busca o projeto com `fluxo === 'assados'` e retorna seu `configAssados`
- Datas disponíveis calculadas por `calcularDatasAssados()`:
  - **Dias recorrentes:** ex: toda sexta-feira com horário limite 12:00
  - **Datas avulsas:** datas específicas adicionadas manualmente (ex: 25/12 com horário limite 10:00)
  - **Datas bloqueadas:** datas excluídas mesmo que sejam dia recorrente (feriados, fechamentos)
- Exibe as próximas datas disponíveis em cards clicáveis com data e horário limite de encomenda
- Data selecionada salva no `localStorage` (`domleon_assados_data`) para uso no checkout
- Navega para `mod12` após seleção

---

### `mod3-admin-assinantes.html` — Admin principal

**Aba Assinantes**
- Lista completa de clientes com assinatura ativa, pausada ou pendente
- Para cada assinante: nome, e-mail, dias da semana, itens da cesta, período do ciclo atual, próximo ciclo, modalidade (entrega), bairro
- Ações: visualizar detalhes, pausar, reativar, cancelar assinatura

**Aba Pedidos avulsos**
- Lista cronológica de pedidos avulsos realizados
- Para cada pedido: número, cliente, bairro, itens, total, forma de pagamento, status, data
- Flag visual para pedidos com repasse a parceiro

**Aba Produção do dia**
- Consolidado automático de tudo que precisa ser produzido ou separado no dia
- Agrupa itens de todas as assinaturas ativas com entrega no dia + pedidos avulsos do dia
- Exibe quantidade total por item — facilita o preparo na cozinha

**Aba Repasses**
- Lista pedidos com `temRepasse: true` — itens que serão entregues por parceiros externos
- Agrupado por parceiro dentro de cada pedido: nome do parceiro · itens · quantidades
- Data e bairro do pedido visíveis para facilitar o contato
- Badge `!` no item do sidebar quando há repasses pendentes
- Carregado sob demanda ao clicar na aba (query ao Firestore filtrando `temRepasse == true`)

---

### `mod5-entrega.html` — Logística de entrega

- Painel de gestão das entregas de assinatura do dia
- Lista de assinantes com entrega programada para hoje, com endereço completo e itens
- Controle de status de cada entrega: pendente → em rota → entregue
- Visualização por rota/bairro para otimização do roteiro de entrega
- Confirmação de entrega por assinante (atualiza status no Firestore)

---

### `mod7-relatorios.html` — Relatórios, notificações e checklist

**Aba Relatórios**
- Resumos financeiros: faturamento por período, por modalidade (avulso/assinatura/assados), por bairro
- Resumos operacionais: itens mais pedidos, bairros com mais pedidos, taxa de renovação de assinatura

**Aba Notificações**
- Envio de avisos para clientes via app (push ou e-mail)
- Comunicados de alteração de cardápio, feriados, promoções

**Aba Checklist de retirada**
- Lista de pedidos de retirada na loja do dia
- Check item a item para conferência antes da entrega ao cliente
- Status: aguardando preparo → pronto para retirada → retirado

---

### `mod8-planos.html` — Admin de catálogo

**Aba Combos fixos**
- Cadastro de combos prontos com nome, itens incluídos e preço total
- Combos aparecem como opção rápida no wizard de assinatura (mod4)

**Aba Itens**
- Listagem de todos os itens agrupados por categoria
- Cada linha exibe: imagem, nome, categoria, projetos em que está ativo com preço por projeto, status
- Items sem parceiro mostram "Dom Leon" como responsável (padrão)
- Botão "Novo item" abre `mod8-item.html`
- Excluir item remove de todos os combos que o referenciam (cascata automática)

**Aba Categorias**
- CRUD completo de categorias
- Modal dinâmico: exibe todos os projetos cadastrados com toggle — admin define em quais projetos cada categoria aparece
- Salva `categoria.projetos[]` com IDs de projeto (não mais operações fixas `avulso/assinatura/assados`) — escalável para qualquer número de projetos

**Aba Bairros**
- CRUD de bairros com campos: nome, atendido (toggle — aparece para o cliente?), entrega grátis (toggle), valor do frete, pedido mínimo
- Excluir bairro dispara **cascata automática**: remove o bairro dos vínculos de parceiro em todos os itens que o referenciam

---

### `mod8-item.html` — Cadastro full-page de item

**Dados do item**
- Nome com validação em tempo real: não aceita `R$`, `·`, `/un`, `/kg`, `peso médio`, parênteses — evita nome com preço embutido que quebra o parser do cupom de assinatura
- Hint permanente abaixo do campo: "Use só o nome comercial — preço, peso e unidade são configurados nos campos abaixo"
- Aviso laranja ao digitar caracteres inválidos; bloqueio no save com mensagem explicativa
- Descrição, categoria (select filtrado dinamicamente pelos projetos ativos do item)
- Imagem (upload PNG/WEBP/JPG, máx. 2 MB, preview ao vivo, remoção com um clique)

**Status**
- Toggle ativo/inativo — inativo não aparece em nenhum catálogo

**Projetos & preços**
- Lista renderizada dinamicamente a partir de `CATALOGO.projetos[]` — qualquer projeto novo aparece automaticamente aqui sem alterar código
- Toggle por projeto: ativo/inativo com preço individual
- Ao marcar/desmarcar projetos, o select de categoria filtra automaticamente as categorias compatíveis com os projetos ativos
- Categoria já selecionada nunca desaparece da lista ao filtrar — preserva a seleção
- Ao salvar sem parceiro: toast informativo "Entrega pela Dom Leon em todos os bairros" (comportamento padrão esperado, não é erro)

**Parceiros & entrega** *(Opção 1 — fonte no item)*
- Seção visível automaticamente se houver ao menos 1 parceiro cadastrado
- Admin seleciona o parceiro em um dropdown e marca os bairros que ele atende **para este item especificamente**
- Bairro já atribuído a outro parceiro fica com checkbox desabilitado — impede duplicidade por design
- Múltiplos parceiros por item: ex: Rep. Norte atende Centro e Vila Nova; Rep. Sul atende Jardim América
- Itens sem parceiro → Dom Leon entrega em todos os bairros (padrão — sem configuração necessária)
- Ao excluir parceiro no admin: cascata automática remove o vínculo deste item
- Ao excluir bairro no admin: cascata automática remove o bairro do vínculo deste item

---

### `mod-projetos.html` — Gestão de projetos (cards da tela inicial)

- Listagem em tabela com: alça de drag, ícone, nome + descrição, fluxo (badge colorido), disponibilidade semanal resumida, status (ativo/inativo)
- **Drag and drop:** arrastar pela alça reordena os cards — nova ordem salva automaticamente no Firestore ao soltar; refletida imediatamente na tela inicial do cliente
- Botão excluir com confirmação — remove o projeto do catálogo
- Botão "Editar" → `mod-projeto-cadastro.html?id=xxx`
- Rodapé com contador de projetos ativos/total

---

### `mod-projeto-cadastro.html` — Cadastro de projeto

- **Ícone:** upload de imagem (PNG/SVG/JPG/WEBP, máx. 200 KB), preview ao vivo do card como o cliente vai ver; removível
- **Nome** do card (exibido como título na tela inicial do cliente)
- **Descrição** curta (subtítulo do card na tela inicial)
- **Fluxo:** `avulso` | `assinatura` | `assados` — determina qual catálogo/checkout é aberto ao clicar no card; define também quais itens e categorias são associados
- **Disponibilidade por dia da semana:** toggle ativo/inativo + horário de início e fim por dia; fora da janela o card aparece com cadeado + timer
- **Datas de encomenda** (seção visível apenas para fluxo `assados`):
  - Dias recorrentes: dia da semana + horário limite de encomenda
  - Datas avulsas: data específica + horário limite (para eventos, feriados trabalhados)
  - Datas bloqueadas: datas em que não haverá atendimento mesmo sendo dia recorrente

---

### `mod-parceiros.html` — Listagem de parceiros

- Tabela com: nome do parceiro, nome do responsável, telefone, status (ativo/inativo)
- Busca por nome ou responsável em tempo real
- Botão "Novo parceiro" → `mod-parceiro-cadastro.html`
- Botão "Editar" → `mod-parceiro-cadastro.html?id=xxx`
- Excluir parceiro:
  - Antes de excluir, lista todos os itens que referenciam este parceiro via `item.parceiros[]`
  - Exibe aviso com os itens afetados e pede confirmação
  - Ao confirmar: **cascata automática** remove o vínculo deste parceiro de todos os itens antes de excluir o parceiro

---

### `mod-parceiro-cadastro.html` — Cadastro de parceiro

**Dados cadastrais**
- Nome da empresa/representante
- Nome do responsável pelo atendimento
- Telefone (usado para notificações WhatsApp via n8n)
- E-mail
- Observações internas (visíveis apenas no admin)
- Toggle ativo/inativo — inativo é ignorado por `resolverParceiro()` mesmo que itens ainda o referenciem

**Itens vinculados (auditoria — somente leitura)**
- Visível apenas ao editar parceiro existente
- Lista automaticamente todos os itens do catálogo que têm este parceiro em `item.parceiros[]`
- Para cada item: nome do item + bairros que este parceiro atende para ele
- Link direto "Editar item" para acessar rapidamente `mod8-item.html?id=xxx`
- Se nenhum item vincular este parceiro, a seção fica oculta

> **Nota arquitetural:** bairros atendidos e itens fornecidos **não** são configurados aqui — essa informação fica no cadastro de cada item (`mod8-item.html`), seção "Parceiros & entrega". Esta seção de auditoria é apenas leitura, gerada automaticamente cruzando `catalogo.itens`. Esta é a **Opção 1** da arquitetura de parceiros: fonte da verdade no item.

---

## Arquitetura de dados — `catalogo.js`

Fonte única de dados do app. Carrega e persiste no Firestore na coleção `catalogo`, documento `dados` (`db.collection('catalogo').doc('dados')`), e expõe funções reutilizáveis para todos os módulos.

### Estrutura do documento Firestore

```js
{
  projetos: [
    {
      id,                              // slug único ex: 'avulso', 'gas-cozinha'
      nome,                            // exibido no card da tela inicial
      descricao,                       // subtítulo do card
      icone,                           // base64 PNG/SVG/JPG — null usa SVG padrão por fluxo
      fluxo,                           // 'avulso' | 'assinatura' | 'assados'
      ordem,                           // posição na tela inicial (1, 2, 3...)
      ativo,                           // false → card não aparece
      disponibilidade: {               // janela de horário por dia da semana
        seg: { ativo: true, inicio: '07:00', fim: '11:00' },
        ter, qua, qui, sex, sab, dom
      },
      configAssados: {                 // só presente quando fluxo === 'assados'
        dias: [{ diaSemana: 'sex', horarioLimite: '12:00' }],
        datasExcluidas: ['2026-12-25'],
        datasAvulsas: [{ data: '2026-12-31', horarioLimite: '10:00' }]
      }
    }
  ],
  categorias: [
    {
      nome: 'Pães',
      projetos: ['avulso', 'assinatura']   // IDs dos projetos onde aparece
    }
  ],
  itens: [{
    id,                                    // slug único ex: 'pao-frances'
    nome,                                  // nome limpo, sem preço embutido
    descricao,
    categoria,                             // nome da categoria
    ativo,
    imagem,                                // base64
    projetos: {                            // preço e disponibilidade por projeto
      'avulso':      { ativo: true,  preco: 0.95 },
      'assinatura':  { ativo: true,  preco: 0.90 },
      'gas-cozinha': { ativo: false, preco: 0 }
    },
    parceiros: [                           // entrega por parceiro externo (Opção 1)
      { parceiroId: 'ultragas-rep1', bairros: ['Centro', 'Vila Nova'] },
      { parceiroId: 'ultragas-rep2', bairros: ['Jardim América'] }
    ],
    // Campos legado mantidos para compatibilidade com módulos ainda não migrados:
    precoAvulso, precoAssinatura, precoAssados,
    modalidades: { avulso, assinatura, assados }
  }],
  combos: [{ id, nome, itens: [{ itemId, qtd }], preco }],
  bairros: [{
    nome,
    atendido,    // true = aparece para o cliente selecionar
    gratis,      // true = frete grátis
    frete,       // valor do frete em R$
    minimo       // pedido mínimo em R$
  }],
  parceiros: [{
    id, nome, responsavel, telefone, email, obs, ativo
  }]
}
```

### Funções principais

| Função | Descrição |
|---|---|
| `carregarCatalogo()` | Carrega do Firestore (`catalogo/dados`), executa migração automática, retorna catálogo |
| `salvarCatalogo(catalogo)` | Persiste documento inteiro no Firestore |
| `cardDisponivelAgora(projeto)` | Retorna `true` se projeto está ativo e dentro da janela de horário do dia atual |
| `projetoPorFluxo(catalogo, fluxo)` | Retorna o primeiro projeto com aquele fluxo |
| `projetoPorId(catalogo, id)` | Retorna projeto pelo ID |
| `getConfigAssados(catalogo)` | Retorna `configAssados` do projeto com `fluxo === 'assados'` |
| `calcularDatasAssados(configAssados, max)` | Calcula próximas datas disponíveis (recorrentes + avulsas − bloqueadas) |
| `assadosPossuiDatasDisponiveis(catalogo)` | Retorna `true` se há ao menos 1 data futura de assados disponível |
| `itensPorProjeto(catalogo, projetoId)` | Retorna itens ativos vinculados ao projeto, com fallback para `modalidades` legado |
| `precoPorProjeto(item, projetoId, catalogo)` | Retorna preço do item para o projeto, com fallback para estrutura legada |
| `categoriasPorProjeto(catalogo, projetoId)` | Retorna categorias vinculadas ao projeto que têm itens ativos |
| `resolverParceiro(item, bairro, catalogo)` | Retorna o parceiro responsável pela entrega (verifica `ativo`), ou `null` se Dom Leon |
| `resolverEntregas(itensPedido, bairro, catalogo)` | Resolve todos os itens → retorna `{ entregas[], temRepasse }` |
| `montarMensagemParceiro(parceiro, itens, cliente, bairro, pedidoId)` | Monta mensagem WhatsApp no formato combinado para envio via n8n |
| `migrarCatalogo(catalogo)` | Migração automática de estruturas antigas — retorna `true` se houve migração |
| `gerarIdUnico(nome, lista)` | Gera slug único para novo item/projeto a partir do nome |
| `montarProjetosPadrao()` | Retorna os 3 projetos padrão (avulso, assinatura, assados) para primeiro acesso |

### Migrações automáticas

`migrarCatalogo()` executa sempre que o catálogo é carregado e converte automaticamente estruturas antigas — cada migração só roda uma vez (detecta se já foi aplicada):

1. `configCards` + `configAssados` separados (estrutura v1) → `projetos[]` unificado (v2)
2. `categorias` como `string[]` → objetos `{ nome, projetos[] }`
3. `categorias.operacoes` → `categorias.projetos[]` com IDs de projeto reais
4. `itensAssados` como coleção separada → `itens` com `modalidades.assados: true`
5. `item.modalidades + precoAvulso/precoAssinatura/precoAssados` → `item.projetos{}` com preço por projeto
6. `categorias.projetos` contendo nomes de fluxo (`'avulso'`, `'assados'`) → IDs de projeto reais

---

## Regras de negócio

### Assinatura mensal
- **Ciclo:** 30 dias corridos, iniciando no primeiro dia de entrega válido após a contratação
- **Modalidade:** sempre entrega em domicílio — retirada desabilitada por decisão de negócio
- **Taxa de entrega:** R$ 2,99 por entrega × total de entregas no ciclo (calculado pelo número de ocorrências dos dias selecionados nos 30 dias)
- **Total do cupom:** subtotal dos itens + taxa de entrega total do ciclo
- **Sem parceiros externos:** todos os itens de assinatura são entregues pela Dom Leon — itens de parceiro só são aceitos nos fluxos avulso e assados

### Pedido avulso
- **Taxa de entrega:** valor fixo por bairro, configurado no `mod8-planos.html` — cada bairro pode ter frete diferente ou frete grátis
- **Pedido mínimo:** configurável por bairro — cliente não avança no checkout se o total do carrinho for menor que o mínimo do bairro
- **Bairro não atendido:** popup com opção de retirada na loja (sem frete, sem endereço) ou voltar ao início
- **Parceiros externos:** resolução automática por item + bairro no momento da confirmação do pedido

### Assados & Menu Almoço
- **Encomenda antecipada:** cliente obrigatoriamente seleciona data antes de ver o catálogo
- **Modalidade:** sempre retirada na loja — sem entrega, sem frete
- **Datas:** calculadas dinamicamente combinando dias recorrentes + datas avulsas − datas bloqueadas; configuráveis no `mod-projeto-cadastro.html`
- **Parceiros:** possível ter parceiros externos para items de assados (ex: fornecedor de frango assado) — mesmo mecanismo do avulso

### Parceiros externos — Opção 1 (fonte no item)
- O vínculo parceiro + bairros fica **no item** (`item.parceiros[]`), não no cadastro do parceiro
- Flexibilidade máxima: um item pode ter parceiros diferentes para bairros diferentes (Rep. Norte → Centro; Rep. Sul → Jardim América)
- **Regra de exclusividade:** dois parceiros nunca atendem o mesmo bairro para o mesmo item — bloqueio por design na UX do `mod8-item.html`
- **Padrão Dom Leon:** item sem parceiro → Dom Leon entrega em todos os bairros, sem nenhuma configuração necessária
- **Parceiro inativo:** `resolverParceiro()` verifica `parceiro.ativo !== false` — parceiro desativado é tratado como Dom Leon
- **Excluir parceiro:** cascata automática remove o vínculo deste parceiro de todos os itens antes de excluir
- **Excluir bairro:** cascata automática remove o bairro dos vínculos de parceiro em todos os itens
- **Notificação WhatsApp:** disparada via n8n ao confirmar pedido com repasse; mensagem inclui nome do parceiro, itens, quantidades, nome do cliente, bairro e número do pedido

### Cards / Projetos da tela inicial
- Qualquer projeto criado no admin aparece automaticamente na tela inicial — sem alterar código
- Ordenação por `projeto.ordem` (drag and drop no admin)
- **Disponibilidade:** cada projeto tem janela de horário por dia da semana; fora da janela → cadeado + timer + botão "Reservar"
- **projetoId:** ao clicar no card, o ID do projeto é salvo no `localStorage`; todos os catálogos leem esse ID para filtrar itens e preços — permite dois projetos de mesmo fluxo com catálogos completamente diferentes

---

## Deploy

Upload manual dos arquivos pela página web do GitHub, diretamente na pasta `public/`. GitHub Actions publica automaticamente no Firebase Hosting a cada commit em `main`.

- **Workflow:** `.github/workflows/firebase-hosting-merge.yml`
- **Secret:** `FIREBASE_SERVICE_ACCOUNT_NEW_APP_DOM_LEON`
- **SDK Firebase nos módulos:** `firebase-app-compat.js` + `firebase-firestore-compat.js` v10.14.1 — devem aparecer **antes** do `catalogo.js` em todos os módulos que o utilizam (mod1, mod2, mod4, mod8, mod9, mod10, mod12, mod13, mod14)
- **Ícones Tabler:** hospedados localmente em `public/tabler-icons.min.css` + `public/fonts/` — CDN externo descartado por retornar MIME `text/plain` ao invés de `text/css`

> ⚠️ **Nunca subir na raiz do repositório** — causou bugs graves anteriormente. Sempre na pasta `public/`.

> 💡 **Lição aprendida:** ao pedir ao usuário para colar conteúdo de um arquivo, sempre entregar o arquivo real via `present_files` para abrir no Bloco de notas — copiar texto do chat perde quebras de linha e quebra YAML/JSON.

---

## Firestore Rules

Regras atuais (temporárias — abertas enquanto Firebase Auth não está implementado):

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

Regras de produção (aplicar após implementar Firebase Auth):

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /catalogo/{doc} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /pedidos/{doc} {
      allow read, write: if request.auth != null;
    }
    match /interesses_bairro/{doc} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }
  }
}
```

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
| Ícones Tabler hospedados localmente | ✅ Funcional |
| Webhook n8n (WhatsApp parceiro) | ⏳ Estrutura pronta — aguardando n8n |
| Pagamento (Pix/cartão) | ⏳ Simulado — aguardando Mercado Pago |
| Firebase Authentication real | ⏳ Não conectado ao Auth |
| Firestore Rules de produção | ⏳ Aplicar após implementar Auth |

---

## Backlog pendente

| # | Item |
|---|---|
| 1 | Classificação de bairros por região dentro da cidade (mod8) — em análise |
| 2 | Aba Pedidos avulsos (mod3) — pausado, usuário não lembra o que queria mudar |
| 3 | Integração Mercado Pago — Pix + cartão avulso / Preapproval recorrente (assinatura) |
| 4 | Firebase Authentication real — conectar login/cadastro ao Auth |
| 5 | Firestore Rules de produção — reverter para regras com `request.auth` após implementar Auth |
| 6 | Redesenhar tela "Confirmar assinatura" (Etapa 3 mod4) — grid consolidado sem separação por dia |
| 7 | Timer-row desalinhado (mod1) — badge relógio e botão "Reservar" não estão na mesma linha horizontal |
| 8 | Preço de pão pesável: exibir `R$ 0,95/un (peso médio 50g · R$ 19,00/kg)` no mod4 e mod9 |
| 9 | Campo "nome curto" no cadastro de item — para uso no cupom de confirmação — aguardando decisão de estender para avulso e assados também |
| 10 | Configuração do n8n para notificações WhatsApp aos parceiros — aguardando decisão de onde hospedar |
