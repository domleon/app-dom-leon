(function(){
  const NAV_ITEMS = [
    { label: 'Dashboard',        icon: 'ti-layout-dashboard', href: 'mod3-admin-assinantes.html' },
    { label: 'Assinantes',       icon: 'ti-users',            href: 'mod3-admin-assinantes.html' },
    { label: 'Pedidos avulsos',  icon: 'ti-shopping-bag',     href: 'mod3-admin-assinantes.html?tab=avulsos' },
    { label: 'Produção do dia',  icon: 'ti-clipboard-list',   href: 'mod3-admin-assinantes.html?tab=producao' },
    { label: 'Cadastro',         icon: 'ti-package',          href: 'mod8-planos.html' },
    { label: 'Logística',        icon: 'ti-truck-delivery',   href: 'mod5-entrega.html' },
    { label: 'Checklist retirada', icon: 'ti-checklist',      href: 'mod7-relatorios.html?tab=checklist' },
    { label: 'Financeiro',       icon: 'ti-cash',             href: '' },
    { label: 'Relatórios',       icon: 'ti-chart-bar',        href: 'mod7-relatorios.html' },
  ];

  // Detectar página ativa pela URL
  const path = window.location.pathname.split('/').pop();
  const params = window.location.search;

  function isActive(item){
    if (!item.href) return false;
    const [itemFile, itemQuery] = item.href.split('?');
    if (path !== itemFile) return false;
    // Se o item tem query string, verificar se bate
    if (itemQuery){
      const itemParams = new URLSearchParams('?' + itemQuery);
      const curParams  = new URLSearchParams(params);
      for (const [k,v] of itemParams){
        if (curParams.get(k) !== v) return false;
      }
    }
    return true;
  }

  // Se algum item aponta para mod8-planos.html e estamos em mod-projetos ou mod-parceiros → ativo Cadastro
  function isActiveCadastro(){
    return ['mod-projetos.html','mod-parceiros.html','mod-projeto-cadastro.html','mod-parceiro-cadastro.html']
      .includes(path);
  }

  const html = `
    <div class="sidebar-brand">
      <i class="ti ti-bread" style="font-size:20px;color:var(--accent-text);"></i>
      <span>Dom Leon Admin</span>
    </div>
    ${NAV_ITEMS.map(item => {
      const active = item.label === 'Cadastro'
        ? (isActive(item) || isActiveCadastro())
        : isActive(item);
      const onclick = item.href ? `onclick="window.location.href='${item.href}'"` : '';
      return `<div class="nav-item${active ? ' active' : ''}" ${onclick}><i class="ti ${item.icon}"></i>${item.label}</div>`;
    }).join('\n    ')}
  `;

  const el = document.getElementById('sidebar');
  if (el) el.innerHTML = html;
})();
