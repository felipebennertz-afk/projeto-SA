import { supabase } from './supabase.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Verifica auth
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    window.location.href = '/index.html';
    return;
  }

  const tbodyEstoque = document.getElementById('itensBody');
  const tbodyHistorico = document.getElementById('historicoBody');
  
  const tabEstoque = document.getElementById('tab-estoque');
  const tabHistorico = document.getElementById('tab-historico');
  const btnTabEstoque = document.getElementById('btn-tab-estoque');
  const btnTabHistorico = document.getElementById('btn-tab-historico');

  // Lógica de troca de abas
  btnTabEstoque.addEventListener('click', () => {
    tabEstoque.style.display = 'block';
    tabHistorico.style.display = 'none';
    btnTabEstoque.className = 'btn';
    btnTabEstoque.style.backgroundColor = 'var(--accent-color)';
    btnTabHistorico.className = 'btn btn-secondary';
    btnTabHistorico.style.backgroundColor = 'transparent';
    if(document.getElementById('searchInput')) {
      document.getElementById('searchInput').value = '';
      document.getElementById('searchInput').dispatchEvent(new Event('input'));
    }
  });

  btnTabHistorico.addEventListener('click', () => {
    tabEstoque.style.display = 'none';
    tabHistorico.style.display = 'block';
    btnTabHistorico.className = 'btn';
    btnTabHistorico.style.backgroundColor = 'var(--accent-color)';
    btnTabEstoque.className = 'btn btn-secondary';
    btnTabEstoque.style.backgroundColor = 'transparent';
    if(document.getElementById('searchInput')) {
      document.getElementById('searchInput').value = '';
      document.getElementById('searchInput').dispatchEvent(new Event('input'));
    }
  });

  // Lógica de pesquisa (Filtro)
  const searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const activeTbody = tabEstoque.style.display !== 'none' ? tbodyEstoque : tbodyHistorico;
    const rows = activeTbody.querySelectorAll('tr');
    
    rows.forEach(row => {
      // Se for a linha de "Carregando" ou "Nenhum item", ignora o filtro
      if (row.cells.length === 1 && row.cells[0].colSpan > 1) return;
      
      const text = row.textContent.toLowerCase();
      if (text.includes(term)) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  });

  // Carregar as duas tabelas
  await carregarItens();
  await carregarHistorico();

  async function carregarItens() {
    const userId = session.user.id;
    const { data: itens, error } = await supabase
      .from('item')
      .select('*')
      .eq('user_id', userId)
      .order('id', { ascending: true });

    if (error) {
      tbodyEstoque.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--danger-color);">Erro ao carregar: ${error.message}</td></tr>`;
      return;
    }

    if (itens.length === 0) {
      tbodyEstoque.innerHTML = `<tr><td colspan="4" style="text-align: center;">Nenhum item cadastrado no estoque.</td></tr>`;
      return;
    }

    tbodyEstoque.innerHTML = '';
    itens.forEach(item => {
      const tr = document.createElement('tr');
      const badgeClass = item.condicao === 'Novo' ? 'badge-new' : 'badge-used';
      
      tr.innerHTML = `
        <td>#${item.id}</td>
        <td style="font-weight: 500;">${item.nome}</td>
        <td>${item.quantidade}</td>
        <td><span class="badge ${badgeClass}">${item.condicao}</span></td>
      `;
      tbodyEstoque.appendChild(tr);
    });
  }

  async function carregarHistorico() {
    const userId = session.user.id;
    // Faz um join com a tabela 'item' para pegar o nome
    const { data: retiradas, error } = await supabase
      .from('retirada')
      .select('*, item(nome)')
      .eq('user_id', userId)
      .order('id', { ascending: false });

    if (error) {
      tbodyHistorico.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--danger-color);">Erro ao carregar histórico: ${error.message}</td></tr>`;
      return;
    }

    if (retiradas.length === 0) {
      tbodyHistorico.innerHTML = `<tr><td colspan="6" style="text-align: center;">Nenhuma retirada registrada.</td></tr>`;
      return;
    }

    tbodyHistorico.innerHTML = '';
    retiradas.forEach(ret => {
      const tr = document.createElement('tr');
      const nomeItem = ret.item ? ret.item.nome : 'Item Excluído';
      const dataDevolucao = ret.data_devolucao ? ret.data_devolucao : '<span style="color:var(--text-secondary)">Não definida</span>';
      
      tr.innerHTML = `
        <td>#${ret.id}</td>
        <td style="font-weight: 500;">${nomeItem}</td>
        <td>${ret.nome_usuario}</td>
        <td><span class="badge badge-used" style="color:var(--danger-color)">- ${ret.quantidade_retirada}</span></td>
        <td>${ret.data_retirada}</td>
        <td>${dataDevolucao}</td>
      `;
      tbodyHistorico.appendChild(tr);
    });
  }
});
