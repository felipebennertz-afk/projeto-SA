import { supabase } from './supabase.js';
import { showToast } from './toast.js';

console.log("Script login.js carregado!");

document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM carregado no login.js");
  const loginForm = document.getElementById('loginForm');
  const googleLoginBtn = document.getElementById('googleLoginBtn');
  
  console.log("Formulário de login encontrado?", !!loginForm);
  console.log("Botão do Google encontrado?", !!googleLoginBtn);

  // Verifica se já está logado
  checkUser();

  async function checkUser() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      window.location.href = '/dashboard.html';
    }
  }

  // Login com Google
  googleLoginBtn.addEventListener('click', async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/dashboard.html'
      }
    });
    
    if (error) {
      showToast('Erro no login com Google: ' + error.message, 'error');
    }
  });

  // Login com Email/Senha
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message === 'Invalid login credentials') {
        showToast('E-mail não encontrado ou senha incorreta.', 'error');
      } else {
        showToast('Erro de login: ' + error.message, 'error');
      }
    } else {
      showToast('Login realizado com sucesso!', 'success');
      setTimeout(() => {
        window.location.href = '/dashboard.html';
      }, 1000);
    }
  });
});
