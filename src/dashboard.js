import { supabase } from './../.env/supabase.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Verifica se o usuário está logado
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    // Redireciona para o login se não estiver logado
    window.location.href = '/index.html';
    return;
  }
  
  // Mostra o email do usuário na navbar
  document.getElementById('userEmail').textContent = session.user.email;
  
  // Lógica de Logout
  document.getElementById('logoutBtn').addEventListener('click', async () => {
    await supabase.auth.signOut();
    window.location.href = '/index.html';
  });
});
