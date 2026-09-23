import { supabase } from './supabase.js';
import { showToast } from './toast.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Verifica auth
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    window.location.href = './index.html';
    return;
  }

  const form = document.getElementById('retiradaForm');
  const limparBtn = document.getElementById('limparBtn');
  const itemSelect = document.getElementById('itemSelect');
  
  let itensEstoque = [];

  await carregarSelect();

  async function carregarSelect() {
    const userId = session.user.id;
    const { data: itens, error } = await supabase
      .from('item')
      .select('*')
      .gt('quantidade', 0)
      .eq('user_id', userId)
      .order('nome', { ascending: true });

    if (error) {
      itemSelect.innerHTML = `<option value="" disabled>Erro ao carregar</option>`;
      return;
    }

    itensEstoque = itens;
    
    if (itens.length === 0) {
      itemSelect.innerHTML = `<option value="" disabled selected>Nenhum item em estoque</option>`;
      return;
    }

    itemSelect.innerHTML = '<option value="" disabled selected>Selecione um item</option>';
    itens.forEach(item => {
      const option = document.createElement('option');
      option.value = item.id;
      // Ex: "Teclado - Novo (Estoque: 10)"
      option.textContent = `${item.nome} - ${item.condicao} (Estoque: ${item.quantidade})`;
      itemSelect.appendChild(option);
    });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const itemId = parseInt(itemSelect.value);
    const usuario = document.getElementById('usuario').value;
    const qtdRetirada = parseInt(document.getElementById('quantidade').value);
    const dataRetirada = document.getElementById('dataRetirada').value;
    const dataDevolucao = document.getElementById('dataDevolucao').value || null;

    // Achar item no array carregado
    const itemSelecionado = itensEstoque.find(i => i.id === itemId);
    
    if (!itemSelecionado) return;

    if (qtdRetirada > itemSelecionado.quantidade) {
      showToast('Quantidade insuficiente em estoque!', 'error');
      return;
    }

    const novaQuantidade = itemSelecionado.quantidade - qtdRetirada;

    // 1. Atualizar estoque na tabela 'item'
    const { error: errUpdate } = await supabase
      .from('item')
      .update({ quantidade: novaQuantidade })
      .eq('id', itemId);

    if (errUpdate) {
      showToast('Erro ao atualizar estoque: ' + errUpdate.message, 'error');
      return;
    }

    const userId = session.user.id;

    // 2. Registrar no histórico 'retirada'
    const { error: errInsert } = await supabase
      .from('retirada')
      .insert([{
        item_id: itemId,
        nome_usuario: usuario,
        quantidade_retirada: qtdRetirada,
        data_retirada: dataRetirada,
        data_devolucao: dataDevolucao,
        user_id: userId
      }]);

    if (errInsert) {
      showToast('Estoque atualizado, mas erro ao gerar histórico de retirada: ' + errInsert.message, 'error');
    } else {
      showToast('Retirada registrada com sucesso!', 'success');
      form.reset();
      await carregarSelect(); // Recarrega select com estoque novo
    }
  });

  limparBtn.addEventListener('click', () => {
    form.reset();
  });
});
