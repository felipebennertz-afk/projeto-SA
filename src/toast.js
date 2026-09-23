export function showToast(message, type = 'info') {
  // Cria o container de toasts se não existir
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  // Cria o elemento do toast
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;

  // Adiciona ao container
  container.appendChild(toast);

  // Gatilha a animação de entrada
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);

  // Remove após 3 segundos
  setTimeout(() => {
    toast.classList.remove('show');
    // Espera a animação de saída terminar para remover do DOM
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}
