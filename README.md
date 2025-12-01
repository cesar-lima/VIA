<!-- # Via - Viabilizando Inclusão e Acessibilidade -->

<img width="1161" height="655" alt="image" src="https://github.com/user-attachments/assets/f3f07abe-993c-43ac-8588-a456ca276e94" />

Via é uma plataforma web dedicada a promover inclusão e acessibilidade,
permitindo que usuários encontrem, avaliem e classifiquem restaurantes
com base em suas características de acessibilidade. O projeto tem como
objetivo criar um guia colaborativo para pessoas com necessidades
específicas de acessibilidade.

## ⚙️ Funcionalidades 

-   **Descoberta de Restaurantes**: Pesquise restaurantes por nome ou
    endereço.
-   **Ordenação por Localização**: Utiliza a geolocalização do
    dispositivo para ordenar restaurantes por proximidade.
-   **Avaliações de Acessibilidade**: Usuários podem enviar avaliações
    detalhadas, incluindo nota em estrelas, comentário escrito e um
    checklist de recursos de acessibilidade (como rampas e banheiros
    acessíveis).
-   **Conteúdo Colaborativo**: Usuários podem indicar novos restaurantes
    para serem adicionados à plataforma.
-   **Painel Administrativo**: Um painel dedicado para administradores
    revisarem e aprovarem novos restaurantes enviados pelos usuários.
-   **Autenticação de Usuário**: Sistema seguro de registro e login,
    utilizando Supabase Auth.
-   **Perfis de Usuário**: Usuários registrados podem gerenciar suas
    informações pessoais.
-   **Sistema de Votação**: Vote positiva ou negativamente em avaliações
    para destacar o feedback mais útil.

## 🛠️ Stack

-   **Framework**: [Next.js](https://nextjs.org/) (App Router)
-   **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
-   **Backend e Banco de Dados**: [Supabase](https://supabase.io/)
-   **Estilização**: [Tailwind CSS](https://tailwindcss.com/) & CSS Modules
-   **Ícones**: [Lucide React](https://lucide.dev/)
-   **Deploy**: Vercel

## 🧱 Estrutura do Projeto

O projeto segue a estrutura padrão do Next.js com App Router:

-   `app/`: Contém todas as rotas, páginas e componentes da aplicação.
    -   `api/`: Handlers de rotas da API para lógica do lado do
        servidor.
    -   `auth/`: Lida com páginas de autenticação (login, cadastro) e
        callbacks.
    -   `components/`: Componentes React reutilizáveis, como `Card`,
        `Navbar` e `Comment`.
    -   `pages/`: Páginas principais, como `profile` (perfil), painel
        `admin` e página de indicação de restaurantes.
    -   `utils/supabase/`: Configurações do cliente/servidor do Supabase
        e funções de acesso ao banco de dados.
-   `middleware.ts`: Gerencia autenticação e autorização para rotas
    protegidas.
-   `next.config.ts`: Arquivo de configuração do Next.js.

<!--
## Começando

Para rodar este projeto localmente, siga os passos abaixo.

### Pré-requisitos

-   Node.js (v18 ou superior)
-   npm, yarn ou pnpm
-   Uma conta no Supabase

### Instalação

1.  **Clone o repositório:**
    ```bash
      git clone https://github.com/cesar-lima/via.git
      cd via
    ```

3.  **Instale as dependências:**
    ```bash
    npm install
    # ou
    yarn install
    # ou
    pnpm install
    ```

5.  **Configure as variáveis de ambiente:** Crie um arquivo chamado
    `.env.local` na raiz do projeto e adicione a URL do seu projeto
    Supabase e a Anon Key:
    ```bash
    NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
    ```

7.  **Execute o servidor de desenvolvimento:**
    ```bash
      npm run dev
    ```

Abra http://localhost:3000 no navegador para visualizar o resultado.
