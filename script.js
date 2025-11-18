const firebaseConfig = {
    apiKey: "AIzaSyDS3tYU_swkQ5hxw30H4EKZsOwMmL19Q4s",
    authDomain: "mancare-ceba8.firebaseapp.com",
    projectId: "mancare-ceba8",
    storageBucket: "mancare-ceba8.firebasestorage.app",
    messagingSenderId: "910945656993",
    appId: "1:910945656993:web:e4649a4510b33d18c650e0",
    measurementId: "G-CXFGPJ8LZ3"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();


document.addEventListener('DOMContentLoaded', () => {

    const menuToggle = document.getElementById('mobile-menu-toggle');
    const navbarMenu = document.getElementById('navbar-menu');
    const navbar = document.querySelector('.navbar nav');

    if (menuToggle && navbarMenu) {
        menuToggle.addEventListener('click', () => {
            navbarMenu.classList.toggle('active');
            navbar.classList.toggle('active');
        });
    }

    // -AUTENTICAÇÃO 

    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');
    const authErrorDiv = document.getElementById('auth-error');
    const navbarNav = document.querySelector('.navbar nav ul');

    function showAuthError(message) {
        if (authErrorDiv) {
            authErrorDiv.innerText = message;
            authErrorDiv.style.display = 'block';
        }
    }

    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;

            auth.createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    alert("Conta criada com sucesso! Será redirecionado.");
                    window.location.href = 'forum.html';
                })
                .catch((error) => {
                    showAuthError(error.message);
                });
        });
    }

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
                    showAuthError(error.message);
                });
        });
    }

    auth.onAuthStateChanged((user) => {
        if (user) {
            if (navbarMenu) {
                const loginLink = document.getElementById('login-link');
                if (loginLink) loginLink.parentElement.remove();

                if (!document.getElementById('logout-link')) {
                    const userEmailLi = document.createElement('li');
                    userEmailLi.innerText = user.email;
                    userEmailLi.style.color = "#1a253c";
                    userEmailLi.style.fontWeight = "700";
                    userEmailLi.style.alignSelf = "center";
                    userEmailLi.style.fontSize = "14px";
                    
                    const logoutLi = document.createElement('li');
                    logoutLi.innerHTML = '<a href="#" id="logout-link" class="cta-button-nav">Sair</a>';
                    
                    navbarMenu.appendChild(userEmailLi);
                    navbarMenu.appendChild(logoutLi);

                    document.getElementById('logout-link').addEventListener('click', (e) => {
                        e.preventDefault();
                        if (confirm("Tem a certeza que deseja sair?")) {
                            auth.signOut().then(() => {
                                window.location.href = 'index.html';
                            });
                        }
                    });
                }
            }
        } else {
            if (navbarMenu) {
                if (!document.getElementById('login-link')) {
                    const loginLi = document.createElement('li');
                    loginLi.innerHTML = '<a href="login.html" id="login-link" class="cta-button-nav">Login / Criar Conta</a>';
                    navbarMenu.appendChild(loginLi);
                }
            }
        }
    });

    // -FÓRUM

    const topicForm = document.querySelector('.topic-form');
    if (topicForm && !loginForm && !registerForm) {
        
        topicForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = document.getElementById('topic-title').value;
            const category = document.getElementById('topic-category').value;
            const message = document.getElementById('topic-message').value;
            
            const user = auth.currentUser;

            if (user) {
                db.collection("topicos").add({
                    titulo: title,
                    categoria: category,
                    mensagem: message,
                    autorId: user.uid,
                    autorEmail: user.email,
                    dataCriacao: new Date()
                })
                .then((docRef) => {
                    alert("Tópico criado com sucesso!");
                    window.location.href = `ver-topico.html?id=${docRef.id}`;
                })
                .catch((error) => {
                    console.error("Erro ao adicionar documento: ", error);
                    alert("Erro ao criar tópico.");
                });

            } else {
                alert("Precisa de estar logado para criar um tópico.");
                window.location.href = 'login.html';
            }
        });
    }

    const topicListContainer = document.getElementById('forum-topic-list');
    if (topicListContainer) {
        db.collection("topicos")
          .orderBy("dataCriacao", "desc")
          .get()
          .then((querySnapshot) => {
            topicListContainer.innerHTML = "";

            if (querySnapshot.empty) {
                topicListContainer.innerHTML = '<tr><td colspan="4">Nenhum tópico encontrado. Seja o primeiro a postar!</td></tr>';
                return;
            }

            querySnapshot.forEach((doc) => {
                const topico = doc.data();
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>
                        <a href="ver-topico.html?id=${doc.id}" class="topic-title">${topico.titulo}</a>
                        <div class="topic-meta">por <span class="author-name">${topico.autorEmail}</span> | ${topico.dataCriacao.toDate().toLocaleDateString()}</div>
                    </td>
                    <td><span class="tag-category tag-${topico.categoria || 'geral'}">${topico.categoria || 'Geral'}</span></td>
                    <td>0</td>
                    <td>${topico.dataCriacao.toDate().toLocaleDateString()}</td>
                `;
                topicListContainer.appendChild(tr);
            });
        })
        .catch((error) => {
            console.error("Erro ao buscar tópicos: ", error);
            topicListContainer.innerHTML = '<tr><td colspan="4">Erro ao carregar tópicos.</td></tr>';
        });
    }

    const topicHeader = document.getElementById('topic-header-dynamic');
    const originalPostContainer = document.getElementById('original-post-dynamic');
    const repliesContainer = document.getElementById('replies-container');
    const replyForm = document.getElementById('reply-form');

    function getTopicIdFromURL() {
        const params = new URLSearchParams(window.location.search);
        return params.get('id');
    }

    const topicId = getTopicIdFromURL();

    if (topicId && topicHeader) {
                
        db.collection("topicos").doc(topicId).get()
            .then((doc) => {
                if (doc.exists) {
                    const topico = doc.data();
                    
                    topicHeader.innerHTML = `
                        <h1>${topico.titulo}</h1>
                        <div class="topic-details">
                            <span class="tag-category tag-${topico.categoria || 'geral'}">${topico.categoria || 'Geral'}</span>
                            <span>Postado por <span class="author-name">${topico.autorEmail}</span> | ${topico.dataCriacao.toDate().toLocaleDateString()}</span>
                        </div>
                    `;
                    
                    // AVATAR 
                    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(topico.autorEmail)}&background=random&color=fff`;

                    originalPostContainer.innerHTML = `
                        <aside class="post-author-info">
                            <img src="${avatarUrl}" alt="Avatar" class="author-avatar">
                            <span class="author-name">${topico.autorEmail}</span>
                            <span class="author-role">Autor</span>
                        </aside>
                        <div class="post-content">
                            <p class="post-meta">Postado em ${topico.dataCriacao.toDate().toLocaleString()}</p>
                            <div class="post-body">
                                <p>${topico.mensagem.replace(/\n/g, '<br>')}</p>
                            </div>
                        </div>
                    `;
                } else {
                    topicHeader.innerHTML = "<h1>Tópico não encontrado</h1>";
                }
            })
            .catch((error) => console.error("Erro ao buscar tópico:", error));

        function carregarRespostas() {
            if (!repliesContainer) return;
            
            repliesContainer.innerHTML = "";
            
            db.collection("topicos").doc(topicId).collection("respostas")
              .orderBy("dataCriacao", "asc")
              .get()
              .then((querySnapshot) => {
                
                document.getElementById('replies-header').innerText = `${querySnapshot.size} Respostas`;

                querySnapshot.forEach((doc) => {
                    const resposta = doc.data();
                    
                    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(resposta.autorEmail)}&background=random&color=fff`;

                    const postCard = document.createElement('article');
                    postCard.className = 'post-card';
                    postCard.innerHTML = `
                        <aside class="post-author-info">
                            <img src="${avatarUrl}" alt="Avatar" class="author-avatar">
                            <span class="author-name">${resposta.autorEmail}</span>
                            <span class="author-role">Membro</span>
                        </aside>
                        <div class="post-content">
                            <p class="post-meta">Postado em ${resposta.dataCriacao.toDate().toLocaleString()}</p>
                            <div class="post-body">
                                <p>${resposta.mensagem.replace(/\n/g, '<br>')}</p>
                            </div>
                        </div>
                    `;
                    repliesContainer.appendChild(postCard);
                });
              });
        }
        carregarRespostas();
        
        if (replyForm) {
            replyForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const user = auth.currentUser;
                const message = document.getElementById('reply-message').value;

                if (!user) {
                    alert("Precisa de estar logado para responder.");
                    window.location.href = 'login.html';
                    return;
                }
                
                if (!message) {
                    alert("A sua resposta não pode estar vazia.");
                    return;
                }

                db.collection("topicos").doc(topicId).collection("respostas").add({
                    mensagem: message,
                    autorId: user.uid,
                    autorEmail: user.email,
                    dataCriacao: new Date()
                })
                .then(() => {
                    document.getElementById('reply-message').value = '';
                    carregarRespostas();
                })
                .catch((error) => console.error("Erro ao adicionar resposta: ", error));
            });
        }
    }

    // -CALCULADORA IMC

    const calcularBtn = document.getElementById('calcular-btn');
    const alturaInput = document.getElementById('altura');
    const pesoInput = document.getElementById('peso');
    const resultadoDiv = document.getElementById('resultado-imc');
    if (calcularBtn) {
        calcularBtn.addEventListener('click', () => {
            const alturaCm = parseFloat(alturaInput.value);
            const peso = parseFloat(pesoInput.value);
            if (isNaN(alturaCm) || isNaN(peso) || alturaCm <= 0 || peso <= 0) {
                exibirErro('Por favor, preencha valores válidos para altura e peso.');
                return;
            }
            const alturaMetros = alturaCm / 100;
            const imc = peso / (alturaMetros * alturaMetros);
            exibirResultado(imc.toFixed(2));
        });
    }
    function exibirResultado(imc) {
        let categoria = ''; let classeCss = '';
        if (imc < 18.5) { categoria = 'Abaixo do peso'; classeCss = 'warning'; }
        else if (imc < 24.9) { categoria = 'Peso normal'; classeCss = 'success'; }
        else if (imc < 29.9) { categoria = 'Sobrepeso'; classeCss = 'warning'; }
        else if (imc < 34.9) { categoria = 'Obesidade Grau I'; classeCss = 'danger'; }
        else if (imc < 39.9) { categoria = 'Obesidade Grau II'; classeCss = 'danger'; }
        else { categoria = 'Obesidade Grau III (Mórbida)'; classeCss = 'danger'; }
        if (resultadoDiv) {
            resultadoDiv.className = 'resultado-box';
            resultadoDiv.classList.add(classeCss);
            resultadoDiv.innerHTML = `<strong>Seu IMC é ${imc}</strong> Classificação: ${categoria}.`;
            resultadoDiv.style.display = 'block';
        }
    }
    function exibirErro(mensagem) {
        if (resultadoDiv) {
            resultadoDiv.className = 'resultado-box';
            resultadoDiv.classList.add('danger');
            resultadoDiv.innerHTML = mensagem;
            resultadoDiv.style.display = 'block';
        }
    }
    const startQuizBtn = document.getElementById('start-quiz-btn');
    const restartQuizBtn = document.getElementById('restart-quiz-btn');
    const quizIntro = document.getElementById('quiz-intro');
    const quizMain = document.getElementById('quiz-main');
    const quizResult = document.getElementById('quiz-result');
    const quizQuestionText = document.getElementById('quiz-question-text');
    const quizAnswerButtons = document.getElementById('quiz-answer-buttons');
    const quizResultContent = document.getElementById('quiz-result-content');
    const quizPerguntas = [
        { pergunta: "Quantas noites por semana você dorme 7-8 horas?", respostas: [{ texto: "Quase todas (5-7)", pontos: 3 }, { texto: "Algumas (3-4)", pontos: 2 }, { texto: "Raramente (0-2)", pontos: 1 }] },
        { pergunta: "Com que frequência você pratica exercícios (mín. 30 min)?", respostas: [{ texto: "4+ vezes por semana", pontos: 3 }, { texto: "1-3 vezes por semana", pontos: 2 }, { texto: "Quase nunca", pontos: 1 }] },
        { pergunta: "Como é sua alimentação diária?", respostas: [{ texto: "Equilibrada (frutas, vegetais, proteínas)", pontos: 3 }, { texto: "Razoável (às vezes como bem, às vezes não)", pontos: 2 }, { texto: "Muitos processados, fast-food e açúcar", pontos: 1 }] },
        { pergunta: "Como você lida com o estresse?", respostas: [{ texto: "Tenho hobbies e consigo relaxar", pontos: 3 }, { texto: "Fico estressado, mas aguento", pontos: 2 }, { texto: "Me sinto sobrecarregado e ansioso", pontos: 1 }] },
        { pergunta: "Você se sente conectado com amigos ou família?", respostas: [{ texto: "Sim, converso e me encontro regularmente", pontos: 3 }, { texto: "Mais ou menos, falo pouco com as pessoas", pontos: 2 }, { texto: "Me sinto bastante isolado", pontos: 1 }] }
    ];
    let perguntaAtualIndex = 0; let pontuacaoTotal = 0;
    function iniciarQuiz() {
        perguntaAtualIndex = 0; pontuacaoTotal = 0;
        if (quizIntro) quizIntro.style.display = 'none';
        if (quizResult) quizResult.style.display = 'none';
        if (quizMain) quizMain.style.display = 'block';
        mostrarPergunta();
    }
    function mostrarPergunta() {
        if (quizAnswerButtons) quizAnswerButtons.innerHTML = '';
        let pergunta = quizPerguntas[perguntaAtualIndex];
        if (quizQuestionText) quizQuestionText.innerText = pergunta.pergunta;
        pergunta.respostas.forEach(resposta => {
            const button = document.createElement('button');
            button.innerText = resposta.texto;
            button.addEventListener('click', () => selecionarResposta(resposta.pontos));
            if (quizAnswerButtons) quizAnswerButtons.appendChild(button);
        });
    }
    function selecionarResposta(pontos) {
        pontuacaoTotal += pontos;
        perguntaAtualIndex++;
        if (perguntaAtualIndex < quizPerguntas.length) { mostrarPergunta(); } else { mostrarResultado(); }
    }
    function mostrarResultado() {
        if (quizMain) quizMain.style.display = 'none';
        if (quizResult) quizResult.style.display = 'block';
        let mensagem = ''; let classeCss = '';
        if (pontuacaoTotal >= 12) { mensagem = `<strong>Pontuação: ${pontuacaoTotal} (Ótimo!)</strong><br> Você está no caminho certo! Seus hábitos de sono, dieta e exercícios parecem sólidos. Continue assim e explore nossos artigos de 'Fitness' para otimizar seus treinos.`; classeCss = 'success'; }
        else if (pontuacaoTotal >= 8) { mensagem = `<strong>Pontuação: ${pontuacaoTotal} (Bom, mas atenção)</strong><br> Você tem uma base boa, mas alguns pontos precisam de ajuste. Pequenas mudanças na dieta ou na rotina de sono podem fazer uma grande diferença. Confira nossos guias em 'Nutrição' e 'Saúde Mental'.`; classeCss = 'warning'; }
        else { mensagem = `<strong>Pontuação: ${pontuacaoTotal} (Hora de Mudar)</strong><br> Parece que você está sobrecarregado e seus hábitos básicos de saúde (sono, dieta, estresse) precisam de atenção imediata. Não se preocupe, estamos aqui para ajudar. Comece pelo nosso pilar de 'Saúde Mental'.`; classeCss = 'danger'; }
        if (quizResultContent) {
            quizResultContent.innerHTML = mensagem;
            quizResultContent.className = 'resultado-box';
            quizResultContent.classList.add(classeCss);
            quizResultContent.style.display = 'block';
        }
    }
    if (startQuizBtn) { startQuizBtn.addEventListener('click', iniciarQuiz); }
    if (restartQuizBtn) { restartQuizBtn.addEventListener('click', iniciarQuiz); }

    const slides = document.querySelectorAll('.hero-slideshow .slide');
    if (slides.length > 0) {
        let currentSlide = 0;
        const showNextSlide = () => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        };
        setInterval(showNextSlide, 5000);
    }

});