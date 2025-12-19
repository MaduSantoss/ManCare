// 1. CONFIGURAÇÃO DO FIREBASE
const firebaseConfig = {
    apiKey: "AIzaSyDS3tYU_swkQ5hxw30H4EKZsOwMmL19Q4s",
    authDomain: "mancare-ceba8.firebaseapp.com",
    projectId: "mancare-ceba8",
    storageBucket: "mancare-ceba8.firebasestorage.app",
    messagingSenderId: "910945656993",
    appId: "1:910945656993:web:e4649a4510b33d18c650e0",
    measurementId: "G-CXFGPJ8LZ3"
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);

// Serviços
const auth = firebase.auth();
const db = firebase.firestore();

document.addEventListener('DOMContentLoaded', () => {

    // --- MENU MÓVEL ---
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const navbarMenu = document.getElementById('navbar-menu');
    const navbar = document.querySelector('.navbar nav');

    if (menuToggle && navbarMenu) {
        menuToggle.addEventListener('click', () => {
            navbarMenu.classList.toggle('active');
            navbar.classList.toggle('active');
        });
    }

    // --- SISTEMA DE LOGIN / LOGOUT (Navbar Dinâmica) ---
    const navbarUl = document.getElementById('navbar-menu');
    
    // Ouve mudanças no estado da autenticação (Login/Logout) em tempo real
    auth.onAuthStateChanged((user) => {
        if (navbarUl) {
            // Limpa botões antigos para não duplicar
            const oldLogin = document.getElementById('login-link-nav');
            const oldLogout = document.getElementById('logout-btn');
            if (oldLogin && oldLogin.parentElement) oldLogin.parentElement.remove();
            if (oldLogout && oldLogout.parentElement) oldLogout.parentElement.remove();

            if (user) {
                // USUÁRIO LOGADO
                const userLi = document.createElement('li');
                // Tenta pegar o nome do email
                const nomeDisplay = user.email.split('@')[0];
                userLi.innerHTML = `<span style="font-weight:700; color:#1a253c; font-size:14px;">Olá, ${nomeDisplay}</span>`;
                userLi.style.alignSelf = "center";

                const logoutLi = document.createElement('li');
                logoutLi.innerHTML = `<a href="#" id="logout-btn" class="cta-button-nav">Sair</a>`;

                navbarUl.appendChild(userLi);
                navbarUl.appendChild(logoutLi);

                // Lógica do botão Sair
                document.getElementById('logout-btn').addEventListener('click', (e) => {
                    e.preventDefault();
                    if (confirm("Deseja realmente sair?")) {
                        auth.signOut().then(() => {
                            window.location.href = 'index.html';
                        });
                    }
                });
            } else {
                // USUÁRIO DESLOGADO
                const loginLi = document.createElement('li');
                loginLi.innerHTML = `<a href="login.html" id="login-link-nav" class="cta-button-nav">Login / Criar Conta</a>`;
                navbarUl.appendChild(loginLi);
            }
        }
    });

    // --- PÁGINA DE CADASTRO (REGISTER) ---
    const registerForm = document.getElementById('register-form');
    const authErrorDiv = document.getElementById('auth-error');

    function showError(element, msg) {
        if (element) {
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

            auth.createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    alert("Conta criada com sucesso! A redirecionar...");
                    window.location.href = 'forum.html';
                })
                .catch((error) => {
                    let msg = "Erro ao criar conta.";
                    if (error.code === 'auth/weak-password') msg = "A senha deve ter pelo menos 6 caracteres.";
                    if (error.code === 'auth/email-already-in-use') msg = "Este email já está em uso.";
                    showError(authErrorDiv, msg);
                });
        });
    }

    // --- PÁGINA DE LOGIN ---
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            auth.signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    window.location.href = 'forum.html';
                })
                .catch((error) => {
                    let msg = "Erro ao entrar.";
                    if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
                        msg = "Email ou senha incorretos.";
                    }
                    showError(authErrorDiv, msg);
                });
        });
    }

    // --- FÓRUM: LISTAR TÓPICOS (forum.html) ---
    const topicListContainer = document.getElementById('forum-topic-list');
    if (topicListContainer) {
        // Busca tópicos do Firestore ordenados por data
        db.collection("topicos").orderBy("dataCriacao", "desc").get()
            .then((querySnapshot) => {
                topicListContainer.innerHTML = ""; // Limpa "A carregar..."

                if (querySnapshot.empty) {
                    topicListContainer.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:40px;">Nenhum tópico encontrado. Seja o primeiro!</td></tr>';
                    return;
                }

                querySnapshot.forEach((doc) => {
                    const topico = doc.data();
                    const id = doc.id;
                    const date = topico.dataCriacao ? topico.dataCriacao.toDate().toLocaleDateString('pt-BR') : 'Data desc.';
                    
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>
                            <a href="ver-topico.html?id=${id}" class="topic-title">${topico.titulo}</a>
                            <div class="topic-meta">por <span class="author-name">${topico.autorEmail}</span> | ${date}</div>
                        </td>
                        <td><span class="tag-category tag-${topico.categoria}">${topico.categoria}</span></td>
                        <td>-</td> 
                        <td>${date}</td>
                    `;
                    topicListContainer.appendChild(tr);
                });
            })
            .catch((error) => {
                console.error("Erro ao buscar tópicos: ", error);
                topicListContainer.innerHTML = '<tr><td colspan="4">Erro ao carregar dados.</td></tr>';
            });
    }

    // --- FÓRUM: CRIAR TÓPICO (novo-topico.html) ---
    const topicForm = document.querySelector('.topic-form');
    // Garante que é o form de tópico
    if (topicForm && !loginForm && !registerForm) {
        topicForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const user = auth.currentUser;

            if (!user) {
                alert("Você precisa estar logado.");
                window.location.href = 'login.html';
                return;
            }

            const title = document.getElementById('topic-title').value;
            const category = document.getElementById('topic-category').value;
            const message = document.getElementById('topic-message').value;

            // Salva no Firestore
            db.collection("topicos").add({
                titulo: title,
                categoria: category,
                mensagem: message,
                autorId: user.uid,
                autorEmail: user.email,
                dataCriacao: firebase.firestore.FieldValue.serverTimestamp() // Data do servidor
            })
            .then((docRef) => {
                alert("Tópico publicado!");
                window.location.href = `ver-topico.html?id=${docRef.id}`;
            })
            .catch((error) => {
                console.error("Erro: ", error);
                alert("Erro ao publicar.");
            });
        });
    }

    // --- FÓRUM: VER TÓPICO E RESPONDER (ver-topico.html) ---
    const topicHeader = document.getElementById('topic-header-dynamic');
    if (topicHeader) {
        const params = new URLSearchParams(window.location.search);
        const topicId = params.get('id');
        const repliesContainer = document.getElementById('replies-container');

        if (topicId) {
            // 1. Carrega Tópico
            db.collection("topicos").doc(topicId).get().then((doc) => {
                if (doc.exists) {
                    const topico = doc.data();
                    const date = topico.dataCriacao ? topico.dataCriacao.toDate().toLocaleDateString('pt-BR') : '';
                    
                    // Cabeçalho
                    topicHeader.innerHTML = `
                        <h1>${topico.titulo}</h1>
                        <div class="topic-details">
                            <span class="tag-category tag-${topico.categoria}">${topico.categoria}</span>
                            <span>Postado por <span class="author-name">${topico.autorEmail}</span> | ${date}</span>
                        </div>
                    `;

                    // Post Original
                    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(topico.autorEmail)}&background=random&color=fff`;
                    document.getElementById('original-post-dynamic').innerHTML = `
                        <aside class="post-author-info">
                            <img src="${avatarUrl}" alt="Avatar" class="author-avatar">
                            <span class="author-name">${topico.autorEmail}</span>
                            <span class="author-role">Autor</span>
                        </aside>
                        <div class="post-content">
                            <p class="post-meta">Publicado em ${date}</p>
                            <div class="post-body"><p>${topico.mensagem.replace(/\n/g, '<br>')}</p></div>
                        </div>
                    `;
                } else {
                    topicHeader.innerHTML = "<h1>Tópico não encontrado.</h1>";
                }
            });

            // 2. Carrega Respostas (Subcoleção)
            const carregarRespostas = () => {
                db.collection("topicos").doc(topicId).collection("respostas")
                  .orderBy("dataCriacao", "asc")
                  .get()
                  .then((snapshot) => {
                      repliesContainer.innerHTML = "";
                      document.getElementById('replies-header').innerText = `${snapshot.size} Respostas`;

                      snapshot.forEach(doc => {
                          const resp = doc.data();
                          const date = resp.dataCriacao ? resp.dataCriacao.toDate().toLocaleString() : '';
                          const avt = `https://ui-avatars.com/api/?name=${encodeURIComponent(resp.autorEmail)}&background=random&color=fff`;

                          const card = document.createElement('article');
                          card.className = 'post-card';
                          card.innerHTML = `
                            <aside class="post-author-info">
                                <img src="${avt}" alt="Avatar" class="author-avatar">
                                <span class="author-name">${resp.autorEmail}</span>
                                <span class="author-role">Membro</span>
                            </aside>
                            <div class="post-content">
                                <p class="post-meta">Respondido em ${date}</p>
                                <div class="post-body"><p>${resp.mensagem.replace(/\n/g, '<br>')}</p></div>
                            </div>
                          `;
                          repliesContainer.appendChild(card);
                      });
                  });
            };
            carregarRespostas();

            // 3. Enviar Nova Resposta
            const replyForm = document.getElementById('reply-form');
            if (replyForm) {
                replyForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const user = auth.currentUser;
                    if (!user) {
                        alert("Faça login para responder.");
                        window.location.href = 'login.html';
                        return;
                    }
                    const msg = document.getElementById('reply-message').value;
                    if(!msg) return;

                    db.collection("topicos").doc(topicId).collection("respostas").add({
                        mensagem: msg,
                        autorId: user.uid,
                        autorEmail: user.email,
                        dataCriacao: firebase.firestore.FieldValue.serverTimestamp()
                    })
                    .then(() => {
                        document.getElementById('reply-message').value = '';
                        carregarRespostas();
                    })
                    .catch(err => console.error(err));
                });
            }

        }
    }

    // --- FERRAMENTAS: CALCULADORA IMC ---
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

    // --- FERRAMENTAS: QUIZ ---
    const startQuizBtn = document.getElementById('start-quiz-btn');
    const quizMain = document.getElementById('quiz-main');
    const quizIntro = document.getElementById('quiz-intro');
    const quizResult = document.getElementById('quiz-result');
    const quizQuestionText = document.getElementById('quiz-question-text');
    const quizAnswerButtons = document.getElementById('quiz-answer-buttons');
    const quizResultContent = document.getElementById('quiz-result-content');
    
    // (A mesma lógica de perguntas e pontuação do script anterior pode ser mantida aqui)
    // Vou incluir a versão completa para garantir que o quiz funcione.
    const quizPerguntas = [
        { pergunta: "Quantas noites por semana você dorme 7-8 horas?", respostas: [{ texto: "Quase todas (5-7)", pontos: 3 }, { texto: "Algumas (3-4)", pontos: 2 }, { texto: "Raramente (0-2)", pontos: 1 }] },
        { pergunta: "Com que frequência você pratica exercícios (mín. 30 min)?", respostas: [{ texto: "4+ vezes por semana", pontos: 3 }, { texto: "1-3 vezes por semana", pontos: 2 }, { texto: "Quase nunca", pontos: 1 }] },
        { pergunta: "Como é sua alimentação diária?", respostas: [{ texto: "Equilibrada", pontos: 3 }, { texto: "Razoável", pontos: 2 }, { texto: "Muitos processados", pontos: 1 }] },
        { pergunta: "Como você lida com o estresse?", respostas: [{ texto: "Tenho hobbies", pontos: 3 }, { texto: "Aguento", pontos: 2 }, { texto: "Sobrecarregado", pontos: 1 }] },
        { pergunta: "Conexão social?", respostas: [{ texto: "Boa", pontos: 3 }, { texto: "Média", pontos: 2 }, { texto: "Isolado", pontos: 1 }] }
    ];
    let pIndex = 0; let pTotal = 0;

    function iniciarQuiz() {
        pIndex = 0; pTotal = 0;
        if(quizIntro) quizIntro.style.display = 'none';
        if(quizResult) quizResult.style.display = 'none';
        if(quizMain) quizMain.style.display = 'block';
        mostrarP();
    }
    function mostrarP() {
        if(quizAnswerButtons) quizAnswerButtons.innerHTML = '';
        if(quizQuestionText) quizQuestionText.innerText = quizPerguntas[pIndex].pergunta;
        quizPerguntas[pIndex].respostas.forEach(r => {
            const btn = document.createElement('button');
            btn.innerText = r.texto;
            btn.addEventListener('click', () => {
                pTotal += r.pontos;
                pIndex++;
                if(pIndex < quizPerguntas.length) mostrarP(); else mostrarRes();
            });
            if(quizAnswerButtons) quizAnswerButtons.appendChild(btn);
        });
    }
    function mostrarRes() {
        if(quizMain) quizMain.style.display = 'none';
        if(quizResult) quizResult.style.display = 'block';
        let msg = '', cls = '';
        if(pTotal >= 12) { msg = "Ótimo! Continue assim."; cls = 'success'; }
        else if(pTotal >= 8) { msg = "Bom, mas atenção a alguns pontos."; cls = 'warning'; }
        else { msg = "Hora de mudar. Cuide da sua saúde."; cls = 'danger'; }
        
        if(quizResultContent) {
            quizResultContent.innerHTML = `<strong>Pontuação: ${pTotal}</strong><br>${msg}`;
            quizResultContent.className = 'resultado-box ' + cls;
            quizResultContent.style.display = 'block';
        }
    }
    
    if(startQuizBtn) startQuizBtn.addEventListener('click', iniciarQuiz);
    if(document.getElementById('restart-quiz-btn')) document.getElementById('restart-quiz-btn').addEventListener('click', iniciarQuiz);


    // --- SLIDESHOW ---
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