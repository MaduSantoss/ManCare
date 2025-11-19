//local storage
const DB = {
    // Ler dados
    getUsers: () => JSON.parse(localStorage.getItem('mancare_users') || '[]'),
    getTopics: () => JSON.parse(localStorage.getItem('mancare_topics') || '[]'),
    getCurrentUser: () => JSON.parse(sessionStorage.getItem('mancare_current_user') || 'null'),

    // Salvar dados
    saveUser: (user) => {
        const users = DB.getUsers();
        users.push(user);
        localStorage.setItem('mancare_users', JSON.stringify(users));
    },
    saveTopic: (topic) => {
        const topics = DB.getTopics();
        topics.push(topic);
        localStorage.setItem('mancare_topics', JSON.stringify(topics));
    },
    updateTopics: (topics) => {
        localStorage.setItem('mancare_topics', JSON.stringify(topics));
    },
    
    // Sessão
    loginUser: (user) => sessionStorage.setItem('mancare_current_user', JSON.stringify(user)),
    logoutUser: () => sessionStorage.removeItem('mancare_current_user')
};

document.addEventListener('DOMContentLoaded', () => {

    //MENU MÓVEL
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const navbarMenu = document.getElementById('navbar-menu');
    const navbar = document.querySelector('.navbar nav');

    if (menuToggle && navbarMenu) {
        menuToggle.addEventListener('click', () => {
            navbarMenu.classList.toggle('active');
            navbar.classList.toggle('active');
        });
    }

    //SESSÃO
    const navbarUl = document.getElementById('navbar-menu');
    const currentUser = DB.getCurrentUser();

    if (navbarUl) {
        
        const oldLogin = document.getElementById('login-link-nav');
        const oldLogout = document.getElementById('logout-btn');
        if(oldLogin && oldLogin.parentElement) oldLogin.parentElement.remove();
        if(oldLogout && oldLogout.parentElement) oldLogout.parentElement.remove();

        if (currentUser) {
            const userLi = document.createElement('li'); 
            const nomeUsuario = currentUser.email.split('@')[0];
            userLi.innerHTML = `<span style="font-weight:700; color:#1a253c; font-size:14px;">Olá, ${nomeUsuario}</span>`;
            userLi.style.alignSelf = "center";
            
            const logoutLi = document.createElement('li');
            logoutLi.innerHTML = `<a href="#" id="logout-btn" class="cta-button-nav">Sair</a>`;
            
            navbarUl.appendChild(userLi);
            navbarUl.appendChild(logoutLi);

            document.getElementById('logout-btn').addEventListener('click', (e) => {
                e.preventDefault();
                if(confirm("Deseja realmente sair?")) {
                    DB.logoutUser();
                    window.location.href = 'index.html';
                }
            });
        } else {
            const loginLi = document.createElement('li');
            loginLi.innerHTML = `<a href="login.html" id="login-link-nav" class="cta-button-nav">Login / Criar Conta</a>`;
            navbarUl.appendChild(loginLi);
        }
    }

    // CADASTRO 
    const registerForm = document.getElementById('register-form');
    const authErrorDiv = document.getElementById('auth-error');

    function showError(element, msg) {
        if(element) {
            element.innerText = msg;
            element.style.display = 'block';
        } else {
            alert(msg);
        }
    }

    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;

            if (password.length < 6) {
                showError(authErrorDiv, "A senha deve ter no mínimo 6 caracteres.");
                return;
            }

            const users = DB.getUsers();
            if (users.find(u => u.email === email)) {
                showError(authErrorDiv, "Este email já está cadastrado.");
                return;
            }

            const newUser = { id: 'usr_' + Date.now(), email, password };
            DB.saveUser(newUser);
            DB.loginUser(newUser); 
            alert("Conta criada com sucesso!");
            window.location.href = 'forum.html';
        });
    }

    // LOGIN
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            const user = DB.getUsers().find(u => u.email === email && u.password === password);

            if (user) {
                DB.loginUser(user);
                window.location.href = 'forum.html';
            } else {
                showError(authErrorDiv, "Email ou senha incorretos.");
            }
        });
    }

    // FÓRUM
    const topicListContainer = document.getElementById('forum-topic-list');
    if (topicListContainer) {
        const topics = DB.getTopics();
        topicListContainer.innerHTML = "";

        if (topics.length === 0) {
            topicListContainer.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:40px;">Nenhum tópico encontrado. Seja o primeiro a postar!</td></tr>';
        } else {
            topics.sort((a, b) => new Date(b.data) - new Date(a.data));

            topics.forEach(topic => {
                const date = new Date(topic.data).toLocaleDateString('pt-BR');
                const respostasCount = topic.respostas ? topic.respostas.length : 0;
                
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>
                        <a href="ver-topico.html?id=${topic.id}" class="topic-title">${topic.titulo}</a>
                        <div class="topic-meta">por <span class="author-name">${topic.autor}</span> | ${date}</div>
                    </td>
                    <td><span class="tag-category tag-${topic.categoria}">${topic.categoria}</span></td>
                    <td>${respostasCount}</td>
                    <td>${date}</td>
                `;
                topicListContainer.appendChild(tr);
            });
        }
    }

    // FÓRUM-CRIAR TÓPICO
    const topicForm = document.querySelector('.topic-form');
    if (topicForm && !loginForm && !registerForm) {
        topicForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!currentUser) {
                alert("Você precisa estar logado para publicar.");
                window.location.href = 'login.html';
                return;
            }

            const newTopic = {
                id: 'topic_' + Date.now(),
                titulo: document.getElementById('topic-title').value,
                categoria: document.getElementById('topic-category').value,
                mensagem: document.getElementById('topic-message').value,
                autor: currentUser.email,
                data: new Date().toISOString(),
                respostas: []
            };

            DB.saveTopic(newTopic);
            alert("Tópico publicado com sucesso!");
            window.location.href = `ver-topico.html?id=${newTopic.id}`;
        });
    }

    //FÓRUM-VER TÓPICO E RESPONDER
    const topicHeader = document.getElementById('topic-header-dynamic');
    if (topicHeader) {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id');
        const topics = DB.getTopics();
        const topic = topics.find(t => t.id === id);

        if (topic) {
            const date = new Date(topic.data).toLocaleDateString('pt-BR');
            // Renderiza Cabeçalho
            topicHeader.innerHTML = `
                <h1>${topic.titulo}</h1>
                <div class="topic-details">
                    <span class="tag-category tag-${topic.categoria}">${topic.categoria}</span>
                    <span>Postado por <span class="author-name">${topic.autor}</span> | ${date}</span>
                </div>
            `;
            
            // Avatar
            const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(topic.autor)}&background=random&color=fff`;
            document.getElementById('original-post-dynamic').innerHTML = `
                <aside class="post-author-info">
                    <img src="${avatarUrl}" alt="Avatar" class="author-avatar">
                    <span class="author-name">${topic.autor}</span>
                    <span class="author-role">Autor</span>
                </aside>
                <div class="post-content">
                    <p class="post-meta">Postado em ${new Date(topic.data).toLocaleString()}</p>
                    <div class="post-body"><p>${topic.mensagem.replace(/\n/g, '<br>')}</p></div>
                </div>
            `;

            // Respostas
            const renderReplies = () => {
                const container = document.getElementById('replies-container');
                container.innerHTML = "";
                
                const count = topic.respostas ? topic.respostas.length : 0;
                document.getElementById('replies-header').innerText = `${count} Respostas`;

                if(topic.respostas) {
                    topic.respostas.forEach(resp => {
                        const avt = `https://ui-avatars.com/api/?name=${encodeURIComponent(resp.autor)}&background=random&color=fff`;
                        const card = document.createElement('article');
                        card.className = 'post-card';
                        card.innerHTML = `
                            <aside class="post-author-info">
                                <img src="${avt}" alt="Avatar" class="author-avatar">
                                <span class="author-name">${resp.autor}</span>
                                <span class="author-role">Membro</span>
                            </aside>
                            <div class="post-content">
                                <p class="post-meta">Postado em ${new Date(resp.data).toLocaleString()}</p>
                                <div class="post-body"><p>${resp.mensagem.replace(/\n/g, '<br>')}</p></div>
                            </div>
                        `;
                        container.appendChild(card);
                    });
                }
            };
            renderReplies();

            // Nova Resposta
            const replyForm = document.getElementById('reply-form');
            if(replyForm) {
                replyForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    if (!currentUser) {
                        alert("Faça login para responder.");
                        window.location.href = 'login.html';
                        return;
                    }
                    const msg = document.getElementById('reply-message').value;
                    if(!msg) return;

                    const newReply = {
                        mensagem: msg,
                        autor: currentUser.email,
                        data: new Date().toISOString()
                    };

                    if(!topic.respostas) topic.respostas = [];
                    topic.respostas.push(newReply);

                    // Atualiza no "Banco"
                    const topicIndex = topics.findIndex(t => t.id === id);
                    topics[topicIndex] = topic;
                    DB.updateTopics(topics);

                    document.getElementById('reply-message').value = '';
                    renderReplies();
                });
            }

        } else {
            topicHeader.innerHTML = "<h1>Tópico não encontrado.</h1>";
        }
    }

    //FERRAMENTAS E SLIDER
    const calcularBtn = document.getElementById('calcular-btn');
    if (calcularBtn) {
        calcularBtn.addEventListener('click', () => {
             const h = parseFloat(document.getElementById('altura').value) / 100;
             const w = parseFloat(document.getElementById('peso').value);
             const resDiv = document.getElementById('resultado-imc');
             
             if(h && w) {
                 const imc = (w / (h*h)).toFixed(2);
                 let cat = imc < 18.5 ? 'Abaixo do peso' : imc < 25 ? 'Peso normal' : 'Sobrepeso';
                 if(imc >= 30) cat = 'Obesidade';
                 
                 resDiv.innerHTML = `<strong>IMC: ${imc}</strong> (${cat})`;
                 resDiv.className = 'resultado-box ' + (cat === 'Peso normal' ? 'success' : 'warning');
                 resDiv.style.display = 'block';
             } else {
                 alert("Preencha altura e peso corretamente.");
             }
        });
    }
    
    const startQuizBtn = document.getElementById('start-quiz-btn');
    const quizMain = document.getElementById('quiz-main');
    const quizIntro = document.getElementById('quiz-intro');
    const quizResult = document.getElementById('quiz-result');
    
    if(startQuizBtn) {
        startQuizBtn.addEventListener('click', () => {
             quizIntro.style.display = 'none';
             if(quizResult) {
                 quizResult.style.display = 'block';
                 document.getElementById('quiz-result-content').innerHTML = "<strong>Parabéns!</strong> Você deu o primeiro passo ao buscar informação. Continue explorando os artigos.";
                 document.getElementById('quiz-result-content').className = 'resultado-box success';
             }
        });
    }

    const slides = document.querySelectorAll('.hero-slideshow .slide');
    if (slides.length > 0) {
        let currentSlide = 0;
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 5000);
    }

});