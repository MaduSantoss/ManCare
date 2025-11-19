# **ManCare – Saúde do Homem (MVP)**

O **ManCare** é uma plataforma web desenvolvida para o ** MVP Saúde do Homem da UNINASSAU Aracaju**. O projeto tem como objetivo promover o bem-estar masculino por meio de informação acessível, ferramentas de autoavaliação e uma comunidade de apoio segura.

---

## 🎯 **Objetivo do Projeto**

Criar uma solução tecnológica que incentive os homens a cuidarem da saúde física e mental, quebrando tabus e facilitando o acesso à informação preventiva.
O projeto está alinhado aos **ODS 3 (Saúde e Bem-Estar)** e **ODS 5 (Igualdade de Gênero)** da ONU.

---

## ✨ **Funcionalidades Principais**

### **Portal de Conteúdo**

* Artigos informativos sobre **Fitness**, **Nutrição** e **Saúde Mental**.

### **Ferramentas Interativas**

* **Calculadora de IMC (Índice de Massa Corporal)**
* **Quiz de Bem-Estar** com feedback imediato

### **Comunidade (Fórum)**

* Sistema de criação de contas e login
* Publicação de tópicos e dúvidas
* Sistema de respostas e interação
* Avatares gerados automaticamente (UI Avatars)

### **Design Responsivo**

* Interface moderna adaptada para desktop e dispositivos móveis.

---

## 🛠️ **Tecnologias Utilizadas**

* **Frontend:** HTML5, CSS3 (Flexbox/Grid), JavaScript ES6+
* **Armazenamento:** LocalStorage e SessionStorage
* **Estilização:** CSS puro (sem frameworks como Bootstrap)
* **Ícones e Avatares:** Google Fonts, UI Avatars

**Técnica:**
Todo o sistema de autenticação e armazenamento foi **simulado localmente** no navegador.

---

## 🚀 **Como Executar o Projeto**

### **Opção 1: Acesso Online (Recomendado)**

Acesse a versão mais recente em:
🔗 [https://man-care.vercel.app/templates/index.html]

### **Opção 2: Executar Localmente**

1. Clone o repositório:

   ```bash
   git clone https://github.com/MaduSantoss/ManCare.git
   ```
2. Abra a pasta do projeto no VS Code.
3. Utilize a extensão **Live Server** para abrir o arquivo `templates/index.html` ou o arquivo de redirecionamento na raiz.

---

## 📱 **Detalhes da Implementação**

O sistema simula um ambiente *full-stack* utilizando apenas JavaScript no cliente:

### 🔐 **Registo/Login**

* Credenciais salvas no LocalStorage
* Validação baseada em um objeto JSON armazenado localmente

### 📌 **Persistência**

* Tópicos e comentários do fórum permanecem armazenados mesmo após recarregar a página

### 🔒 **Segurança**

* Páginas restritas (ex.: Criar Tópico) só podem ser acessadas com sessão ativa

---

## 👥 **Apresentação**
Projeto desenvolvido e apresentado no **MVP Saúde do Homem 2025**.

---
