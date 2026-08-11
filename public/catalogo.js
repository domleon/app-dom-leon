/* catalogo.js — fonte única de dados de categorias, itens e combos.
   Compartilhado entre mod1 (catálogo), mod4 (monte o seu) e mod8 (admin de planos).
   Persistência via localStorage (chave 'domleon_catalogo') até a conexão real com Firestore. */

const CATALOGO_STORAGE_KEY = 'domleon_catalogo';

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
  ]
};

function carregarCatalogo(){
  try {
    const raw = localStorage.getItem(CATALOGO_STORAGE_KEY);
    if (!raw) {
      salvarCatalogo(CATALOGO_PADRAO);
      return JSON.parse(JSON.stringify(CATALOGO_PADRAO));
    }
    return JSON.parse(raw);
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
