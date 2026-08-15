/* catalogo.js — fonte única de dados de categorias, itens, combos e bairros.
   Compartilhado entre mod1, mod4, mod8, mod9 e mod10.
   Persistência via localStorage (chave 'domleon_catalogo') até a conexão real com Firestore. */

const CATALOGO_STORAGE_KEY = 'domleon_catalogo';

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
  'Centro': { frete: 5.00, minimo: 20.00 },
  'Jardim Avenida': { frete: 7.00, minimo: 20.00 },
  'Campo Largo': { frete: 8.00, minimo: 25.00 }
};

function montarBairrosPadrao(){
  return NOMES_BAIRROS_SALTO_PIRAPORA.map(nome => {
    const pre = BAIRROS_ATENDIDOS_PADRAO[nome];
    return pre
      ? { nome, atendido: true, frete: pre.frete, minimo: pre.minimo }
      : { nome, atendido: false, frete: null, minimo: null };
  });
}

function removerAcentos(txt){
  return (txt || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

const CATALOGO_PADRAO = {
  categorias: ['Pães', 'Laticínios & Padaria', 'Frutas & Extras'],
  itens: [
    { id: 'pao-frances',    nome: 'Pão francês',              categoria: 'Pães',                 preco: 0.80,  ativo: true, imagem: null },
    { id: 'pao-integral',   nome: 'Pão integral',              categoria: 'Pães',                 preco: 1.20,  ativo: true, imagem: null },
    { id: 'pao-forma',      nome: 'Pão de forma artesanal',    categoria: 'Pães',                 preco: 9.90,  ativo: true, imagem: null },
    { id: 'leite',          nome: 'Leite',                     categoria: 'Laticínios & Padaria', preco: 5.80,  ativo: true, imagem: null },
    { id: 'torrada',        nome: 'Torrada',                   categoria: 'Laticínios & Padaria', preco: 5.90,  ativo: true, imagem: null },
    { id: 'queijo',         nome: 'Queijo branco 200g',        categoria: 'Laticínios & Padaria', preco: 8.50,  ativo: true, imagem: null },
    { id: 'manteiga',       nome: 'Manteiga 200g',             categoria: 'Laticínios & Padaria', preco: 7.00,  ativo: true, imagem: null },
    { id: 'fruta',          nome: 'Fruta da estação',          categoria: 'Frutas & Extras',      preco: 2.50,  ativo: true, imagem: null },
    { id: 'laranjas-kit6',  nome: 'Laranjas (kit c/ 6)',       categoria: 'Frutas & Extras',      preco: 10.00, ativo: true, imagem: null },
    { id: 'morango-cx',     nome: 'Caixa de morango',          categoria: 'Frutas & Extras',      preco: 12.00, ativo: true, imagem: null },
    { id: 'suco',           nome: 'Suco natural 300ml',        categoria: 'Frutas & Extras',      preco: 6.00,  ativo: true, imagem: null }
  ],
  combos: [
    { id: 'cafe', nome: 'Café da manhã completo', dias: ['seg', 'qua', 'sex'],               itensPadrao: { 'pao-frances': 2, 'leite': 1, 'torrada': 1 }, imagem: null },
    { id: 'fit',  nome: 'Dom Leon fit',            dias: ['seg', 'ter', 'qua', 'qui', 'sex'], itensPadrao: { 'pao-integral': 2, 'queijo': 1, 'fruta': 1 }, imagem: null },
    { id: 'doce', nome: 'Doce lar',                dias: ['sab', 'dom'],                      itensPadrao: { 'pao-forma': 1, 'fruta': 1 },                 imagem: null }
  ],
  bairros: montarBairrosPadrao(),
  taxaEntregaAssinatura: 2.99
};

function carregarCatalogo(){
  try {
    const raw = localStorage.getItem(CATALOGO_STORAGE_KEY);
    if (!raw) {
      salvarCatalogo(CATALOGO_PADRAO);
      return JSON.parse(JSON.stringify(CATALOGO_PADRAO));
    }
    const catalogo = JSON.parse(raw);
    // migração suave: catálogos salvos antes da existência de bairros ganham a lista padrão
    if (!catalogo.bairros) catalogo.bairros = montarBairrosPadrao();
    if (catalogo.taxaEntregaAssinatura === undefined) catalogo.taxaEntregaAssinatura = 2.99;
    return catalogo;
  } catch (e) {
    console.error('Erro ao ler catálogo do localStorage, usando padrão.', e);
    return JSON.parse(JSON.stringify(CATALOGO_PADRAO));
  }
}

function salvarCatalogo(catalogo){
  try {
    localStorage.setItem(CATALOGO_STORAGE_KEY, JSON.stringify(catalogo));
    return true;
  } catch (e) {
    console.error('Erro ao salvar catálogo no localStorage.', e);
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
