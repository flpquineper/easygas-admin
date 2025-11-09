# 🚀 EasyGas - Painel Administrativo

Este é o front-end do painel de administração do projeto EasyGas. Esta aplicação é usada pela equipe interna para gerenciar todas as operações da plataforma, incluindo o monitoramento de pedidos, gerenciamento de produtos, clientes e entregadores.

## 💻 Tecnologias Utilizadas

* **Next.js:** Framework React para a construção da interface administrativa.
* **TypeScript:** Para garantir um código mais seguro e tipado.
* **Axios:** Cliente HTTP para realizar a comunicação com a nossa API back-end (`easygas-api`).
* **React Toastify:** Para exibir notificações de feedback em operações (ex: "Produto criado!").
* **Autenticação:** O sistema utiliza **Cookies httpOnly** para o gerenciamento seguro de sessões de administrador, garantindo que os tokens JWT não fiquem expostos no navegador.

## ⚙️ Arquitetura

Este projeto (`easygas-admin`) é o painel de controle que consome a API central (`easygas-be`) para todas as operações de gerenciamento.

* **Front-end (Admin):** `https://easygas-admin.onrender.com`
* **Back-end (API):** `https://easygas-api-ohsz.onrender.com`

---

## 🧪 Como Testar o Software (Avaliação)

Para avaliar a aplicação administrativa, utilize as credenciais de administrador fornecidas abaixo.

### 1. URL de Acesso

A aplicação está hospedada e disponível no Render:

* **URL:** **`https://easygas-admin.onrender.com`**

### 2. Credenciais de Teste

Utilize os seguintes dados para acessar o painel:

* **E-mail:** `easygas@admin.com`
* **Senha:** `!Teste123`

### 3. Fluxos de Teste Recomendados

1.  Acesse a URL de login.
2.  Insira as credenciais de administrador e clique em "ENTRAR".
3.  Você será redirecionado para o **Dashboard Principal**.
    * *Verificação:* O dashboard deve carregar os indicadores (Pedidos Recebidos, Pedidos Entregues), confirmando que a sessão (`httpOnly cookie`) foi validada com sucesso.
4.  Navegue pelo menu lateral:
    * Acesse **"Pedidos"** para ver a lista de pedidos feitos (inclusive o que você pode ter criado no teste do `easygas-fe`).
    * Acesse **"Produtos"** para ver, criar ou editar produtos.
    * Acesse **"Clientes"** para ver a lista de usuários cadastrados (incluindo o que você criou).
    * Acesse **"Entregadores"** para gerenciar os entregadores.
5.  Ao final, clique no seu nome no menu e em **"Sair da conta"** para testar o fluxo de logout.
