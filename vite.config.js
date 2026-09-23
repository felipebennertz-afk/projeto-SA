import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  // Garante que todos os caminhos no build fiquem relativos (./) e não absolutos (/)
  // Isso resolve os problemas de CSS não carregar e 404 no Github Pages
  base: './', 
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        dashboard: resolve(__dirname, 'dashboard.html'),
        cadastro: resolve(__dirname, 'cadastro.html'),
        esqueciSenha: resolve(__dirname, 'esqueci-senha.html'),
        itens: resolve(__dirname, 'itens.html'),
        problemas: resolve(__dirname, 'problemas.html'),
        registrar: resolve(__dirname, 'registrar.html'),
        retirada: resolve(__dirname, 'retirada.html')
      }
    }
  }
});
