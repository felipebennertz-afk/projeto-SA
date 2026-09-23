"# projeto-SA" 

## 🚀 Configuração e Integração com o Supabase

Siga os passos abaixo para configurar o banco de dados e rodar o projeto localmente.

### 1. Criar e Configurar o Projeto no Supabase
1. Acesse o painel do [Supabase](https://database.new) e crie uma nova conta ou faça login.
2. Clique em **New Project**, selecione sua organização, dê um nome ao projeto e defina uma senha para o banco de dados.
3. Aguarde o término da criação do projeto (pode levar alguns minutos).
4. No menu lateral esquerdo, vá em **Project Settings** (ícone de engrenagem) > **API**.
5. Localize e copie os seguintes valores:
   - **Project URL** (URL do projeto)
   - **anon / public key** (Chave de API pública)

---

### 2. Configurar as Variáveis de Ambiente (`.env`)

Crie um **arquivo de texto** chamado `.env` (certifique-se de que é um arquivo e não uma pasta) na **raiz do projeto** (no mesmo nível da pasta `src/`). 

Dentro do arquivo, adicione as variáveis com o prefixo `VITE_` e substitua pelos valores reais que você copiou no Passo 1:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-publica-aqui
```

## para rodar o projeto, de um "npm run dev" na pasta do projeto pelo terminal