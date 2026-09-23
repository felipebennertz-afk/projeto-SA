import { supabase } from './supabase.js';
import { showToast } from './toast.js';

document.addEventListener('DOMContentLoaded', () => {
  const recuperarForm = document.getElementById('recuperarForm');

  recuperarForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;

    // Função do Supabase para enviar email de reset de senha
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/index.html',
    });

    if (error) {
      showToast('Erro ao enviar link de recuperação: ' + error.message, 'error');
    } else {
      showToast('Se este e-mail estiver cadastrado, você receberá um link na sua caixa de entrada.', 'success');
      setTimeout(() => {
        window.location.href = '/index.html';
      }, 1500);
    }
  });
});
