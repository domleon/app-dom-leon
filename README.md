# Assinatura Dom Leon

Sistema de pedidos e assinatura de pães e produtos de padaria da **Padaria Dom Leon** (Salto de Pirapora, SP).

Projeto **totalmente independente** dos demais sistemas da Dom Leon (Comanda, Monitor Operacional, Custos & Precificação) — sem integração ou compartilhamento de backend com eles.

## Stack

- HTML / CSS / JavaScript puro (sem framework)
- Firebase (Firestore + Hosting) — projeto `new-app-dom-leon`
- Fonte Fraunces (títulos) + Inter (corpo), ícones Tabler — identidade visual "Padaria Artesanal" (marrom/dourado/bege)

## Estrutura

```
public/
├── index.html                      # redireciona para o login
├── catalogo.js                     # fonte única de dados (projetos, categorias, itens, combos, bairros, parceiros)
│
├── — Fluxo do cliente —
├── mod1-cad-catalogo.html          # login/cadastro → cards de projetos → bairro → catálogo
├── mod2-app-ass.html               # assinatura: plano, pagamento, confirmação com cupom
├── mod4-monte-o-seu.html           # wizard "monte o seu" (3 etapas) + combos prontos
├── mod9-catalogo-avulso.html       # catálogo de compra avulsa (busca + carrinho)
├── mod10-checkout-avulso.html      # checkout avulso: carrinho, endereço, pagamento, sucesso
├── mod12-catalogo-assados.html     # catálogo de assados e menu almoço
├── mod13-checkout-assados.html     # checkout de assados
├── mod14-data-assados.html         # seleção de data para encomenda de assados
│
├── — Admin —
├── mod3-admin-assinantes.html      # assinantes, pedidos avulsos, produção do dia
├── mod5-entrega.html               # logística de entrega (assinatura)
├── mod7-relatorios.html            # relatórios, notificações, checklist de retirada
├── mod8-planos.html                # combos fixos, itens, categorias, bairros/frete
├── mod8-item.html                  # cadastro/edição full-page de item do catálogo
│
├── — Projetos (cards da tela inicial) —
├── mod-projetos.html               # listagem de projetos com drag and drop para reordenar
├── mod-projeto-cadastro.html       # cadastro/edição de projeto: ícone, fluxo, disponibilidade
│
└── — Parceiros —
    ├── mod-parceiros.html          # listagem de fornecedores/entregadores terceiros
    └── mod-parceiro-cadastro.html  # cadastro/edição de parceiro com vínculos de bairros e itens
```

> Módulo 6 (cartão de crédito recorrente) está embutido no `mod2-app-ass.html`, não é arquivo separado.

## Fluxos

### Assinatura mensal
```
Login → Tela inicial (cards dinâmicos) → Assinatura mensal
  → mod4 (wizard: dias da semana → itens por dia → resumo)
  → mod2 (retirada ou entrega [+R$2,99/entrega] → pagamento → sucesso com cupom)
```

### Compra avulsa
```
Login → Tela inicial → Faça seu pedido → Bairro
  ├── atendido → mod9 (catálogo + busca + carrinho) → mod10 (endereço → pagamento → sucesso)
  └── não atendido → popup → Retirar na Loja ou Voltar ao início
```

### Assados & Menu Almoço
```
Login → Tela inicial → Assados & Menu Almoço
  → mod14 (seleção de data de encomenda)
  → mod12 (catálogo de assados)
  → mod13 (checkout → retirada na loja → sucesso)
```

## URLs

### Site em produção (Firebase Hosting)

| Módulo | URL |
|---|---|
| Início | https://new-app-dom-leon.web.app |
| Login / Tela inicial | https://new-app-dom-leon.web.app/mod1-cad-catalogo.html |
| Assinatura — Plano/Pagamento | https://new-app-dom-leon.web.app/mod2-app-ass.html |
| Admin — Assinantes / Produção | https://new-app-dom-leon.web.app/mod3-admin-assinantes.html |
| Monte o seu (wizard) | https://new-app-dom-leon.web.app/mod4-monte-o-seu.html |
| Admin — Logística | https://new-app-dom-leon.web.app/mod5-entrega.html |
| Admin — Relatórios | https://new-app-dom-leon.web.app/mod7-relatorios.html |
| Admin — Planos / Itens / Categorias / Bairros | https://new-app-dom-leon.web.app/mod8-planos.html |
| Admin — Cadastro de item | https://new-app-dom-leon.web.app/mod8-item.html |
| Catálogo avulso | https://new-app-dom-leon.web.app/mod9-catalogo-avulso.html |
| Checkout avulso | https://new-app-dom-leon.web.app/mod10-checkout-avulso.html |
| Catálogo de assados | https://new-app-dom-leon.web.app/mod12-catalogo-assados.html |
| Checkout de assados | https://new-app-dom-leon.web.app/mod13-checkout-assados.html |
| Seleção de data — assados | https://new-app-dom-leon.web.app/mod14-data-assados.html |
| Admin — Projetos | https://new-app-dom-leon.web.app/mod-projetos.html |
| Admin — Cadastro de projeto | https://new-app-dom-leon.web.app/mod-projeto-cadastro.html |
| Admin — Parceiros | https://new-app-dom-leon.web.app/mod-parceiros.html |
| Admin — Cadastro de parceiro | https://new-app-dom-leon.web.app/mod-parceiro-cadastro.html |

### Painéis de gestão

| O quê | URL |
|---|---|
| Console Firebase | https://console.firebase.google.com/project/new-app-dom-leon/overview |

## Arquitetura de dados — `catalogo.js`

O arquivo `catalogo.js` é a fonte única de dados do app. Ele carrega e persiste o catálogo no Firestore (`/catalogos/dom-leon`) e expõe funções reutilizáveis para todos os módulos.

### Estrutura do documento Firestore

```js
{
  projetos: [          // cards da tela inicial, ordenados por .ordem
    {
      id, nome, descricao, icone,  // icone = base64 PNG/SVG
      fluxo,                       // 'avulso' | 'assinatura' | 'assados'
      ordem, ativo,
      disponibilidade: {           // janela de horário por dia da semana
        seg: { ativo, inicio, fim },
        ter, qua, qui, sex, sab, dom
      },
      configAssados: {             // só presente quando fluxo === 'assados'
        dias: [{ diaSemana, horarioLimite }],
        datasExcluidas: [],
        datasAvulsas: [{ data, horarioLimite }]
      }
    }
  ],
  categorias: [{ nome, operacoes }],   // operacoes: ['avulso','assinatura','assados']
  itens: [{ id, nome, categoria, precoAvulso, precoAssinatura, precoAssados,
            modalidades: { avulso, assinatura, assados }, ativo, imagem }],
  combos: [...],
  bairros: [{ nome, atendido, gratis, frete, minimo }],
  parceiros: [{ id, nome, responsavel, telefone, email, obs, ativo, bairros[], itens[], emoji }]
}
```

### Funções principais

| Função | Descrição |
|---|---|
| `carregarCatalogo()` | Carrega do Firestore, executa migração automática se necessário |
| `salvarCatalogo(catalogo)` | Persiste no Firestore |
| `cardDisponivelAgora(projeto)` | Verifica se projeto está ativo + dentro da janela do dia |
| `projetoPorFluxo(catalogo, fluxo)` | Busca projeto pelo fluxo |
| `getConfigAssados(catalogo)` | Retorna `configAssados` do projeto de assados |
| `calcularDatasAssados(configAssados, max)` | Datas disponíveis (recorrentes + avulsas) |
| `categoriasPorOperacao(catalogo, operacao)` | Filtra categorias por operação |
| `itensPorOperacao(catalogo, operacao)` | Filtra itens por operação |
| `precoPorOperacao(item, operacao)` | Retorna o preço correto por operação |

### Migração automática

`migrarCatalogo()` é executada automaticamente ao carregar. Converte estruturas antigas:
- `configCards` + `configAssados` (separados) → `projetos[]` (estrutura unificada)
- `categorias` como `string[]` → objetos `{nome, operacoes}`
- `itensAssados` separados → `itens` com `modalidades.assados: true`

## Regras de negócio

### Assinatura
- **Ciclo**: 30 dias corridos, iniciando no primeiro dia de entrega válido após a contratação
- **Taxa de entrega**: R$ 2,99 por entrega × número de entregas do ciclo (só se modalidade = Entrega)
- **Cupom**: calculado com `contarOcorrenciasDias()` — percorre dia a dia o intervalo real do ciclo

### Avulso
- **Taxa de entrega**: fixa por bairro (cadastrada no mod8)
- **Pedido mínimo**: configurável por bairro; bloqueia avanço no carrinho
- **Bairro não atendido**: popup com opção de retirada na loja
- **Card "Faça seu pedido"**: timer exibe dia por extenso ("Abre quinta às 08:00"); botão "Reservar pedido agora" em azul (#2563EB)

### Assados
- **Encomenda**: cliente seleciona data antes de montar o pedido
- **Datas disponíveis**: recorrentes por dia da semana + avulsas (feriados, eventos) + bloqueadas
- **Entrega**: sempre retirada na loja (sem opção de entrega)

### Pão pesável
- Exibição jurídica (INMETRO/CDC): `R$ 0,95/un (peso médio 50g · R$ 19,00/kg)`
- "Peso médio" é o termo correto; mostrar preço/kg é exigência para produtos a granel

### Disponibilidade de cards
- Cada projeto define sua própria janela de horário por dia da semana
- Fora da janela: card aparece com cadeado + timer de próxima abertura
- Assados: disponibilidade calculada pelas datas de encomenda (não por horário)

### Parceiros
- Fornecedores/entregadores terceiros vinculados a bairros e itens específicos
- Cada parceiro atende seus próprios bairros (sem sobreposição)
- Itens e bairros não vinculados a parceiros são atendidos pela operação padrão da Dom Leon

## Deploy

Upload manual dos arquivos pela página web do GitHub, diretamente na pasta `public/` do repositório. O GitHub Actions (`firebase init hosting:github`) publica automaticamente no Firebase Hosting a cada commit na branch `main`.

## Status

| Funcionalidade | Status |
|---|---|
| Navegação e interface | ✅ Funcional |
| Catálogo (categorias, itens, combos, bairros) | ✅ Firestore |
| Projetos / cards dinâmicos da tela inicial | ✅ Firestore |
| Parceiros com vínculos de bairros e itens | ✅ Firestore |
| Datas de encomenda de assados (recorrentes + avulsas) | ✅ Firestore |
| Cálculo de ciclo de assinatura | ✅ Implementado |
| Pagamento (Pix/cartão) | ⏳ Simulado — aguardando Mercado Pago |
| Autenticação (login/cadastro) | ⏳ Não conectado ao Firebase Auth |
| `firestore.rules` | ⏳ Não deployadas — fazer no Console Firebase |

## Backlog pendente

- **Integração Mercado Pago**: Pix + cartão avulso / Preapproval recorrente
- **Firebase Authentication**: conectar login/cadastro ao Auth real
- **Deploy das `firestore.rules`**: aplicar manualmente no Console Firebase
- **Preço de pão pesável**: aplicar formato `R$ 0,95/un (peso médio 50g · R$ 19,00/kg)` no mod4 e mod9
- **Aba Pedidos avulsos (mod3)**: pausado
- **Testar fluxo assados** com datas avulsas no Firebase real
