# ManCare – Saúde do Homem (MVP)

O **ManCare** é uma plataforma web completa focada na saúde e bem-estar do homem. O projeto vai além de um simples site informativo, integrando funcionalidades de rede social e ferramentas de saúde personalizadas através de uma arquitetura **Serverless** com **Google Firebase**.

---

## 🎯 Objetivo do Projeto

Criar um ecossistema digital seguro onde homens possam:

* **Aprender**: Aceder a artigos baseados em evidências sobre saúde mental, física e nutricional.
* **Monitorizar**: Utilizar ferramentas como Calculadora de IMC e Quiz de Saúde.
* **Partilhar**: Interagir numa comunidade (fórum) em tempo real para tirar dúvidas e partilhar experiências.

---

## ✨ Funcionalidades Principais

### 🔐 Autenticação & Segurança

* **Sistema de Login Completo**: Registo e login de utilizadores via Email/Senha.
* **Gestão de Sessão**: O site mantém o utilizador autenticado em todas as páginas.
* **Proteção de Rotas**: Apenas utilizadores autenticados podem criar tópicos ou responder no fórum.

### 💬 Comunidade em Tempo Real (Fórum)

* **Feed Dinâmico**: Tópicos carregados diretamente do banco de dados na nuvem.
* **Interação**: Sistema de respostas/comentários em cada tópico.
* **Identidade Visual**: Avatares gerados automaticamente com base no email do utilizador (UI Avatars).

### 🛠️ Ferramentas de Saúde

* **Calculadora de IMC**: Cálculo instantâneo com feedback visual de classificação.
* **Quiz de Bem-Estar**: Avaliação interativa com pontuação e recomendações personalizadas.

---

## 🚀 Tecnologias Utilizadas

Este projeto utiliza uma stack moderna e eficiente:

* **Frontend**: HTML5, CSS3 (Flexbox/Grid), JavaScript (ES6+)
* **Backend-as-a-Service (BaaS)**: Google Firebase
* **Firebase Authentication**: Gestão segura de identidades
* **Cloud Firestore**: Banco de dados NoSQL para armazenamento de tópicos e respostas em tempo real
* **Hospedagem**: Vercel (CI/CD integrado com GitHub)
* **Design**: Interface responsiva (*Mobile-First*) com tema personalizado

---

## ⚙️ Como Executar o Projeto

### Opção 1: Acesso Online

Aceda à aplicação em tempo real:

🔗 [https://man-care.vercel.app/]

### Opção 2: Executar Localmente

Clone este repositório:

```bash
git clone https://github.com/MaduSantoss/ManCare.git
```

Abra a pasta do projeto no **VS Code**.

Utilize a extensão **Live Server** para abrir o ficheiro:

```text
templates/index.html
```

> **Nota**: Para que o projeto funcione localmente, é necessário que as chaves de API do Firebase no ficheiro `script.js` estejam ativas e com as permissões de segurança configuradas corretamente no **Google Cloud Console**.

---

## 📄 Estrutura de Pastas

```text
/
├── assets/          # Imagens, ícones e recursos gráficos
├── templates/       # Páginas da aplicação (Login, Fórum, Home, etc.)
├── style.css        # Folha de estilos global (CSS)
├── script.js        # Lógica da aplicação e integração Firebase SDK
└── README.md        # Documentação do projeto
```

---

## 🤝 Contribuição

Este é um projeto **open-source**. Sinta-se à vontade para sugerir melhorias ou novas funcionalidades através de **Issues** ou **Pull Requests**.

---

## 👩‍💻 Autoria

Desenvolvido por **Maria Eduarda**.
