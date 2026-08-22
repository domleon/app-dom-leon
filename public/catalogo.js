/* catalogo.js — fonte única de dados de categorias, itens, combos e bairros.
   Compartilhado entre mod1, mod4, mod8, mod9 e mod10.
   Persistência via Firestore (projeto new-app-dom-leon), coleção 'catalogo', documento 'dados'. */

const firebaseConfig = {
  apiKey: "AIzaSyDnePAezAoipNWXgq298EKT8ugLnPYll4",
  authDomain: "new-app-dom-leon.firebaseapp.com",
  projectId: "new-app-dom-leon",
  storageBucket: "new-app-dom-leon.firebasestorage.app",
  messagingSenderId: "397519162919",
  appId: "1:397519162919:web:3eb60357da2f94ec134802"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();
const CATALOGO_DOC_REF = db.collection('catalogo').doc('dados');
const INTERESSES_COLLECTION = db.collection('interesses_bairro');

/* Bairros reais de Salto de Pirapora/SP (fonte: CEPs dos Correios).
   Por padrão nenhum é atendido — admin marca frete + pedido mínimo na aba Bairros do mod8.
   3 bairros já vêm pré-marcados como atendidos, só para o protótipo não nascer vazio. */
const NOMES_BAIRROS_SALTO_PIRAPORA = [
  'Alpes do Sarapu','Arco Íris','Área Rural','Boa Vista','Campo Largo','Capão Redondo','Capoavinha',
  'Casa Blanca','Centro','Chácara Recanto','Chácaras Reunidas Bela Vista','Chácaras Parque Pirapora',
  'Chácaras Reunidas Dallas','Chácaras Reunidas Eldorado','Chácaras Reunidas Primavera','Corvinho',
  'Da Barra','Distrito Industrial I','Distrito Industrial II','Do Arado','Dos Barros','Dos Castanhos',
  'Dos Leites','Dos Pires','Estância Tropical','Fazendinha','Itinga','Jardim Agenor Leme dos Santos',
  'Jardim Alexandre','Jardim Alvorada','Jardim Amélia','Jardim América','Jardim Ana Guilherme',
  'Jardim Aurea','Jardim Avenida','Jardim Bela Vista','Jardim Cachoeira',
  'Jardim Conde Francisco Matarazzo Júnior','Jardim Daniel David Haddad','Jardim das Bandeiras',
  'Jardim David José Haddad','Jardim Dona Madalena','Jardim Ilha das Flores','Jardim Karina',
  'Jardim Luar','Jardim Maria Clara','Jardim Maria José','Jardim Paulistano','Jardim Primavera',
  'Jardim San Rafael','Jardim Santa Bárbara','Jardim Santa Helena','Jardim Santa Maria',
  'Jardim São Carlos','Jardim São Lucas','Jardim São Lucas II','Jardim São Paulo',
  'Jardim Silva Barros','Jardim Teixeira dos Santos','Jardim Terra Bella','Jardim Vera Lúcia',
  'José Ermírio de Moraes','Jucurupava','Mirante do Sol','Morro Branco','Ourives',
  'Pacaembú Bandeiras','Pacaembú Bandeiras 2','Pirapora','Piraporão','Pirapora Velho','Piraporinha',
  'Portal de Pirapora','Quintas de Pirapora I','Quintas de Pirapora II','Recanto Cidade Nova',
  'Recanto São Manoel I','Recanto São Manoel II','Reserva São José','Residencial Fazenda Alta Vista',
  'Santa Isabel','Sol do Alvorada','Terras de São Francisco','Terras de São João','Vila dos Florianos',
  'Vila Elizabeth','Vila Santa Isabel','Vila Santa Julieta','Vila Xavier'
];

const BAIRROS_ATENDIDOS_PADRAO = {
  'Centro': { frete: 5.00, minimo: 20.00, gratis: false },
  'Jardim Avenida': { frete: 7.00, minimo: 20.00, gratis: false },
  'Campo Largo': { frete: 8.00, minimo: 25.00, gratis: false }
};

function montarBairrosPadrao(){
  return NOMES_BAIRROS_SALTO_PIRAPORA.map(nome => {
    const pre = BAIRROS_ATENDIDOS_PADRAO[nome];
    return pre
      ? { nome, atendido: true, frete: pre.frete, minimo: pre.minimo, gratis: !!pre.gratis }
      : { nome, atendido: false, frete: null, minimo: null, gratis: false };
  });
}

const DIAS_ORDEM_CATALOGO = ['seg','ter','qua','qui','sex','sab','dom'];

/* Monta a semana de horários de um card: por padrão todo mundo disponível o dia inteiro.
   overrides permite deixar dias específicos desativados ou com outro horário. */
function montarSemanaHorarios(overrides){
  const semana = {};
  DIAS_ORDEM_CATALOGO.forEach(dia => {
    semana[dia] = { ativo: true, inicio: '00:00', fim: '23:59' };
  });
  if (overrides) Object.assign(semana, overrides);
  return semana;
}

function montarConfigCardsPadrao(){
  return {
    avulso: { habilitado: true, horarios: montarSemanaHorarios() },
    assinatura: { habilitado: true, horarios: montarSemanaHorarios() },
    // Assados & Menu Almoço: por padrão só sábado e domingo, das 8h às 14h (almoço de fim de semana)
    assados: { habilitado: true, horarios: montarSemanaHorarios({
      seg: { ativo: false, inicio: '00:00', fim: '23:59' },
      ter: { ativo: false, inicio: '00:00', fim: '23:59' },
      qua: { ativo: false, inicio: '00:00', fim: '23:59' },
      qui: { ativo: false, inicio: '00:00', fim: '23:59' },
      sex: { ativo: false, inicio: '00:00', fim: '23:59' },
      sab: { ativo: true,  inicio: '08:00', fim: '14:00' },
      dom: { ativo: true,  inicio: '08:00', fim: '14:00' }
    }) }
  };
}

/* Confere se um card está disponível agora mesmo (habilitado + dentro da janela do dia de hoje) */
function cardDisponivelAgora(configCard){
  if (!configCard || !configCard.habilitado) return false;
  const agora = new Date();
  const diaJs = agora.getDay(); // 0=dom..6=sab
  const mapaDiaJs = {0:'dom', 1:'seg', 2:'ter', 3:'qua', 4:'qui', 5:'sex', 6:'sab'};
  const diaChave = mapaDiaJs[diaJs];
  const horarioDia = (configCard.horarios || {})[diaChave];
  if (!horarioDia || !horarioDia.ativo) return false;

  const horaAtual = String(agora.getHours()).padStart(2, '0') + ':' + String(agora.getMinutes()).padStart(2, '0');
  return horaAtual >= horarioDia.inicio && horaAtual <= horarioDia.fim;
}

function removerAcentos(txt){
  return (txt || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/* Texto padrão de descrição para itens vendidos por porção de peso (obrigação legal
   Inmetro/CDC: venda de pão precisa ter base em peso, não só em unidade). */
function descricaoPorcao(unidadesAprox){
  return `Aproximadamente ${unidadesAprox}. Pesado na hora! O valor do seu pedido é fixo, ` +
    `mas o peso vem caprichado: a balança sempre entrega igual ou mais pão para você.`;
}

const CATALOGO_PADRAO = {
  categorias: ['Pães', 'Laticínios & Padaria', 'Frutas & Extras'],
  itens: [
    // Pães — vendidos por porção de peso (100g/250g), preço fixo, R$/kg exibido como referência
    { id: 'pao-frances-100g',  nome: 'Pão Francês 100g',          categoria: 'Pães', pesoGramas: 100, precoKg: 8.00,
      precoAvulso: 0.80, precoAssinatura: 0.80, modalidades: { avulso: true, assinatura: true },
      descricao: descricaoPorcao('1 a 2 unidades'), ativo: true, imagem: null },
    { id: 'pao-frances-250g',  nome: 'Pão Francês 250g',          categoria: 'Pães', pesoGramas: 250, precoKg: 8.00,
      precoAvulso: 2.00, precoAssinatura: 2.00, modalidades: { avulso: true, assinatura: true },
      descricao: descricaoPorcao('4 a 5 unidades'), ativo: true, imagem: null },
    { id: 'pao-integral-100g', nome: 'Pão Integral 100g',         categoria: 'Pães', pesoGramas: 100, precoKg: 12.00,
      precoAvulso: 1.20, precoAssinatura: 1.20, modalidades: { avulso: true, assinatura: true },
      descricao: descricaoPorcao('1 a 2 unidades'), ativo: true, imagem: null },
    { id: 'pao-integral-250g', nome: 'Pão Integral 250g',         categoria: 'Pães', pesoGramas: 250, precoKg: 12.00,
      precoAvulso: 3.00, precoAssinatura: 3.00, modalidades: { avulso: true, assinatura: true },
      descricao: descricaoPorcao('4 a 5 unidades'), ativo: true, imagem: null },
    { id: 'pao-forma-100g',    nome: 'Pão de Forma Artesanal 100g', categoria: 'Pães', pesoGramas: 100, precoKg: 19.80,
      precoAvulso: 1.98, precoAssinatura: 1.98, modalidades: { avulso: true, assinatura: true },
      descricao: descricaoPorcao('1 a 2 fatias generosas'), ativo: true, imagem: null },
    { id: 'pao-forma-250g',    nome: 'Pão de Forma Artesanal 250g', categoria: 'Pães', pesoGramas: 250, precoKg: 19.80,
      precoAvulso: 4.95, precoAssinatura: 4.95, modalidades: { avulso: true, assinatura: true },
      descricao: descricaoPorcao('4 a 5 fatias generosas'), ativo: true, imagem: null },

    // Laticínios & Padaria e Frutas & Extras — seguem vendidos por unidade normalmente
    { id: 'leite',          nome: 'Leite',                     categoria: 'Laticínios & Padaria', precoAvulso: 5.80,  precoAssinatura: 5.80,  modalidades: { avulso: true, assinatura: true }, ativo: true, imagem: null },
    { id: 'torrada',        nome: 'Torrada',                   categoria: 'Laticínios & Padaria', precoAvulso: 5.90,  precoAssinatura: 5.90,  modalidades: { avulso: true, assinatura: true }, ativo: true, imagem: null },
    { id: 'queijo',         nome: 'Queijo branco 200g',        categoria: 'Laticínios & Padaria', precoAvulso: 8.50,  precoAssinatura: 8.50,  modalidades: { avulso: true, assinatura: true }, ativo: true, imagem: null },
    { id: 'manteiga',       nome: 'Manteiga 200g',             categoria: 'Laticínios & Padaria', precoAvulso: 7.00,  precoAssinatura: 7.00,  modalidades: { avulso: true, assinatura: true }, ativo: true, imagem: null },
    { id: 'fruta',          nome: 'Fruta da estação',          categoria: 'Frutas & Extras',      precoAvulso: 2.50,  precoAssinatura: 2.50,  modalidades: { avulso: true, assinatura: true }, ativo: true, imagem: null },
    { id: 'laranjas-kit6',  nome: 'Laranjas (kit c/ 6)',       categoria: 'Frutas & Extras',      precoAvulso: 10.00, precoAssinatura: 10.00, modalidades: { avulso: true, assinatura: true }, ativo: true, imagem: null },
    { id: 'morango-cx',     nome: 'Caixa de morango',          categoria: 'Frutas & Extras',      precoAvulso: 12.00, precoAssinatura: 12.00, modalidades: { avulso: true, assinatura: true }, ativo: true, imagem: null },
    { id: 'suco',           nome: 'Suco natural 300ml',        categoria: 'Frutas & Extras',      precoAvulso: 6.00,  precoAssinatura: 6.00,  modalidades: { avulso: true, assinatura: true }, ativo: true, imagem: null }
  ],
  combos: [
    { id: 'cafe', nome: 'Café da manhã completo', dias: ['seg', 'qua', 'sex'],               itensPadrao: { 'pao-frances-100g': 1, 'leite': 1, 'torrada': 1 }, imagem: null },
    { id: 'fit',  nome: 'Dom Leon fit',            dias: ['seg', 'ter', 'qua', 'qui', 'sex'], itensPadrao: { 'pao-integral-100g': 1, 'queijo': 1, 'fruta': 1 }, imagem: null },
    { id: 'doce', nome: 'Doce lar',                dias: ['sab', 'dom'],                      itensPadrao: { 'pao-forma-100g': 1, 'fruta': 1 },                 imagem: null }
  ],
  bairros: montarBairrosPadrao(),
  taxaEntregaAssinatura: 2.99,

  // Catálogo próprio do fluxo "Assados & Menu Almoço" — separado do catálogo de Pedido avulso
  categoriasAssados: ['Assados', 'Acompanhamentos'],
  itensAssados: [
    { id: 'frango-assado-inteiro', nome: 'Frango Assado Inteiro',   categoria: 'Assados', precoAvulso: 45.00, ativo: true, imagem: null },
    { id: 'frango-assado-meio',    nome: 'Meio Frango Assado',      categoria: 'Assados', precoAvulso: 25.00, ativo: true, imagem: null },
    { id: 'lasanha-familia',       nome: 'Lasanha à Bolonhesa (P/4)', categoria: 'Assados', precoAvulso: 38.00, ativo: true, imagem: null },
    { id: 'farofa-bacon',          nome: 'Farofa com Bacon 300g',   categoria: 'Acompanhamentos', precoAvulso: 12.00, ativo: true, imagem: null },
    { id: 'batata-assada',         nome: 'Batata Assada c/ Ervas 400g', categoria: 'Acompanhamentos', precoAvulso: 14.00, ativo: true, imagem: null },
    { id: 'vinagrete',             nome: 'Vinagrete 300g',          categoria: 'Acompanhamentos', precoAvulso: 8.00,  ativo: true, imagem: null }
  ],

  // Disponibilidade configurável dos 3 cards da tela inicial (habilitado + janela de horário por dia)
  configCards: montarConfigCardsPadrao()
};

/* Mapeia os ids antigos (por unidade) para os novos ids de porção equivalentes,
   usado só na migração de catálogos salvos antes dessa mudança. */
const MIGRACAO_IDS_PAO_ANTIGOS = {
  'pao-frances': 'pao-frances-100g',
  'pao-integral': 'pao-integral-100g',
  'pao-forma': 'pao-forma-100g'
};

/* ---------- Migração suave: catálogos salvos antes de modalidade/preço duplo,
   porção de peso ou entrega grátis ganham os campos novos automaticamente. ---------- */
function migrarCatalogo(catalogo){
  let precisouMigrar = false;

  // bairros: garante o campo "gratis"
  (catalogo.bairros || []).forEach(b => {
    if (b.gratis === undefined) { b.gratis = false; precisouMigrar = true; }
  });

  // itens: garante modalidades + precoAvulso/precoAssinatura (a partir do antigo "preco", se existir)
  (catalogo.itens || []).forEach(item => {
    if (!item.modalidades) {
      item.modalidades = { avulso: true, assinatura: true };
      precisouMigrar = true;
    }
    if (item.precoAvulso === undefined || item.precoAssinatura === undefined) {
      const precoBase = (item.preco !== undefined) ? item.preco : 0;
      if (item.precoAvulso === undefined) item.precoAvulso = precoBase;
      if (item.precoAssinatura === undefined) item.precoAssinatura = precoBase;
      precisouMigrar = true;
    }
  });

  // pães antigos (por unidade) → substitui pelas porções de peso padrão, se ainda existirem
  const temPaoAntigo = (catalogo.itens || []).some(i => MIGRACAO_IDS_PAO_ANTIGOS[i.id]);
  if (temPaoAntigo) {
    catalogo.itens = catalogo.itens.filter(i => !MIGRACAO_IDS_PAO_ANTIGOS[i.id]);
    const idsExistentes = new Set(catalogo.itens.map(i => i.id));
    CATALOGO_PADRAO.itens
      .filter(i => i.categoria === 'Pães' && !idsExistentes.has(i.id))
      .forEach(i => catalogo.itens.push(JSON.parse(JSON.stringify(i))));

    // atualiza combos que referenciavam os ids antigos
    (catalogo.combos || []).forEach(combo => {
      Object.keys(combo.itensPadrao || {}).forEach(idAntigo => {
        const idNovo = MIGRACAO_IDS_PAO_ANTIGOS[idAntigo];
        if (idNovo) {
          combo.itensPadrao[idNovo] = combo.itensPadrao[idAntigo];
          delete combo.itensPadrao[idAntigo];
        }
      });
    });
    precisouMigrar = true;
  }

  if (catalogo.taxaEntregaAssinatura === undefined) {
    catalogo.taxaEntregaAssinatura = 2.99;
    precisouMigrar = true;
  }

  if (!catalogo.categoriasAssados) {
    catalogo.categoriasAssados = JSON.parse(JSON.stringify(CATALOGO_PADRAO.categoriasAssados));
    precisouMigrar = true;
  }
  if (!catalogo.itensAssados) {
    catalogo.itensAssados = JSON.parse(JSON.stringify(CATALOGO_PADRAO.itensAssados));
    precisouMigrar = true;
  }
  if (!catalogo.configCards) {
    catalogo.configCards = montarConfigCardsPadrao();
    precisouMigrar = true;
  }

  return precisouMigrar;
}

/* ---------- Carregar (leitura única do documento) ---------- */
async function carregarCatalogo(){
  try {
    const snap = await CATALOGO_DOC_REF.get();
    if (!snap.exists) {
      // primeira vez: semeia o Firestore com o catálogo padrão
      await CATALOGO_DOC_REF.set(CATALOGO_PADRAO);
      return JSON.parse(JSON.stringify(CATALOGO_PADRAO));
    }
    const catalogo = snap.data();
    if (!catalogo.bairros) catalogo.bairros = montarBairrosPadrao();

    const precisouMigrar = migrarCatalogo(catalogo);
    if (precisouMigrar) {
      await salvarCatalogo(catalogo); // persiste a migração, só acontece uma vez
    }
    return catalogo;
  } catch (e) {
    console.error('Erro ao ler catálogo do Firestore, usando padrão local (sem persistência).', e);
    return JSON.parse(JSON.stringify(CATALOGO_PADRAO));
  }
}

/* ---------- Salvar (grava o documento inteiro) ---------- */
async function salvarCatalogo(catalogo){
  try {
    await CATALOGO_DOC_REF.set(catalogo);
    return true;
  } catch (e) {
    console.error('Erro ao salvar catálogo no Firestore.', e);
    return false;
  }
}

/* ---------- Escuta em tempo real (opcional — usado onde quisermos refletir mudanças ao vivo) ---------- */
function escutarCatalogo(callback){
  return CATALOGO_DOC_REF.onSnapshot(snap => {
    if (snap.exists) callback(snap.data());
  }, err => console.error('Erro ao escutar catálogo em tempo real.', err));
}

/* ---------- Captura de interesse (bairro não atendido) ---------- */
async function registrarInteresseBairro(nomeBairro, contato){
  try {
    await INTERESSES_COLLECTION.add({
      bairro: nomeBairro,
      contato: contato,
      criadoEm: firebase.firestore.FieldValue.serverTimestamp()
    });
    return true;
  } catch (e) {
    console.error('Erro ao registrar interesse de bairro.', e);
    return false;
  }
}

function gerarIdUnico(nome, listaExistente){
  let base = nome.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove acentos
    .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  if (!base) base = 'item';
  let id = base, n = 2;
  while (listaExistente.some(x => x.id === id)) { id = base + '-' + n; n++; }
  return id;
}

function arquivoParaBase64(file, callback){
  const reader = new FileReader();
  reader.onload = () => callback(reader.result);
  reader.readAsDataURL(file);
}
