# **ManCare – O Manual Moderno da Saúde Masculina**

Aplicação web voltada para a saúde e bem-estar do homem, oferecendo artigos informativos, ferramentas interativas e um espaço comunitário para partilha de experiências.

---

## 📋 **Funcionalidades**

### **📚 Artigos Informativos**

Conteúdos sobre:

* Saúde mental
* Fitness
* Nutrição
* Prevenção de doenças

### **🧮 Ferramentas Interativas**

* **Calculadora de IMC (Índice de Massa Corporal)**
* **Quiz de Bem-Estar** com pontuação e recomendações personalizadas

### **💬 Comunidade (Fórum)**

* Sistema de autenticação completo (Login e Registo) via **Firebase Authentication**
* Criação e visualização de tópicos
* Sistema de respostas
* Avatares automáticos gerados a partir do nome do utilizador (UI Avatars API)

### **💻 Design Responsivo**

Interface moderna (**ManCare Theme**) totalmente adaptada para desktop e mobile.

---

## 🛠️ **Tecnologias Utilizadas**

### **Frontend**

* HTML5
* CSS3 (Flexbox & Grid)
* JavaScript (ES6+)

### **Backend (BaaS)**

* **Google Firebase**

  * *Firebase Authentication* — gestão de utilizadores
  * *Cloud Firestore* — base de dados NoSQL em tempo real

### **Outros Recursos**

* Google Fonts (Poppins e Lato)
* UI Avatars API

---

## 🚀 **Como Executar o Projeto**

1. Clone este repositório:

   ```bash
   git clone https://github.com/MaduSantoss/ManCare.git
   ```

2. Abra a pasta do projeto no **VS Code**.

3. Inicie o projeto utilizando a extensão **Live Server** abrindo o ficheiro:
   `templates/index.html`

> **Importante:** Devido às políticas de segurança do Firebase, o Login/Registo pode não funcionar se o ficheiro for aberto diretamente pelo navegador via `file://`. Utilize sempre um servidor local.

---

## ⚙️ **Configuração**

O projeto já inclui as chaves públicas necessárias para funcionamento do Firebase no modo de teste.

---

## 📁 **Estrutura de Pastas**

```
/
├── assets/          # Imagens e ícones
├── templates/       # Ficheiros HTML (index, login, forum, etc.)
├── style.css        # Estilos globais
├── script.js        # Lógica da aplicação e integração com Firebase
└── README.md        # Documentação
```

---

## 🤝 **Contribuição**

Sinta-se à vontade para fazer um **fork** do projeto e enviar **pull requests** com melhorias.

---

Desenvolvido com foco na saúde masculina. 💙

---


