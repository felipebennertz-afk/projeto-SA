import { supabase } from './supabase.js';
import { showToast } from './toast.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Verifica auth
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    window.location.href = '/index.html';
    return;
  }

  const form = document.getElementById('cadastroForm');
  const limparBtn = document.getElementById('limparBtn');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const userId = session.user.id;
    const nome = document.getElementById('nome').value;
    const quantidade = parseInt(document.getElementById('quantidade').value);
    const condicao = document.getElementById('condicao').value;

    // Verificar se já existe
    const { data: existente, error: errBusca } = await supabase
      .from('item')
      .select('*')
      .eq('nome', nome)
      .eq('condicao', condicao)
      .eq('user_id', userId)
      .single();

    if (existente) {
      // Soma quantidade
      const { error: errUpdate } = await supabase
        .from('item')
        .update({ quantidade: existente.quantidade + quantidade })
        .eq('id', existente.id)
        .eq('user_id', userId); // Segurança extra
        
      if (errUpdate) {
        showToast('Erro ao atualizar quantidade: ' + errUpdate.message, 'error');
      } else {
        showToast('Quantidade somada ao item existente com sucesso!', 'success');
        form.reset();
      }
    } else {
      // Insere novo
      const { error: errInsert } = await supabase
        .from('item')
        .insert([{ nome, quantidade, condicao, user_id: userId }]);
        
      if (errInsert) {
        showToast('Erro ao cadastrar: ' + errInsert.message, 'error');
      } else {
        showToast('Item cadastrado com sucesso!', 'success');
        form.reset();
      }
    }
  });

  limparBtn.addEventListener('click', () => {
    form.reset();
  });
});
