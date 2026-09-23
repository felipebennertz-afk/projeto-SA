import { supabase } from './supabase.js';
import { showToast } from './toast.js';

console.log("Script registrar.js carregado!");

document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM carregado no registrar.js");
  const registrarForm = document.getElementById('registrarForm');
  console.log("Formulário de registro encontrado?", !!registrarForm);

  registrarForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Função do Supabase para criar novo usuário
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      showToast('Erro ao criar conta: ' + error.message, 'error');
    } else {
      showToast('Conta criada com sucesso! Você já pode fazer login.', 'success');
      setTimeout(() => {
        window.location.href = './index.html';
      }, 1500);
    }
  });
});
