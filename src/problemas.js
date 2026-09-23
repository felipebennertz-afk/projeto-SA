import { supabase } from './../.env/supabase.js';
import { showToast } from './toast.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Verifica auth
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    window.location.href = '/index.html';
    return;
  }

  const form = document.getElementById('problemaForm');
  const limparBtn = document.getElementById('limparBtn');
  const problemaSelect = document.getElementById('problema');
  const dicaBox = document.getElementById('dicaSolucao');

  problemaSelect.addEventListener('change', () => {
    const val = problemaSelect.value;
    let dica = "";
    
    switch (val) {
      case "Meu computador nao liga":
          dica = "Verifique a memória RAM e a fonte.";
          break;
      case "A tela do meu notebook nao liga":
          dica = "Verifique a bateria.";
          break;
      case "A tela do meu notebook quebrou":
      case "Meu notebook esta com problema para carregar":
      case "O touchpad do meu notebook nao esta funcionando":
      case "Meu monitor liga mas nao da imagem":
      case "Meu monitor quebrou":
      case "Meu computador esta travando":
      case "O meu teclado esta desgastado":
          dica = "Aguarde o suporte entrar em contato.";
          break;
      case "Meu monitor nao liga":
          dica = "Verifique a conexão com a fonte.";
          break;
      case "Meu computador esta com pouco amarzenamento":
          dica = "Avisar o DevOps/TI para limpeza ou upgrade.";
          break;
      case "A internet do computador nao esta funcionando":
          dica = "Verificar cabo de rede ou conexão com Wi-Fi.";
          break;
      case "O horario do meu computador esta errado":
          dica = "Acesse configurações > data/hora > ajuste automaticamente.";
          break;
      case "Outros...":
          dica = "Descreva detalhadamente quando o suporte entrar em contato.";
          break;
      default:
          dica = "Selecione um problema.";
    }
    
    dicaBox.textContent = dica;
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const userId = session.user.id;
    const usuario = document.getElementById('usuario').value;
    const problema = problemaSelect.value;
    const diaDisponivel = document.getElementById('diaDisponivel').value;

    const { error } = await supabase
      .from('problema')
      .insert([{
        nome_usuario: usuario,
        tipo_problema: problema,
        dia_disponivel: diaDisponivel,
        user_id: userId
      }]);

    if (error) {
      showToast('Erro ao registrar chamado: ' + error.message, 'error');
    } else {
      showToast('Problema cadastrado para o suporte com sucesso!', 'success');
      form.reset();
      dicaBox.textContent = "Selecione um problema para ver possíveis soluções rápidas.";
    }
  });

  limparBtn.addEventListener('click', () => {
    form.reset();
    dicaBox.textContent = "Selecione um problema para ver possíveis soluções rápidas.";
  });
});
