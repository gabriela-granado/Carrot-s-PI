const botaoMenu = document.getElementById("botao-menu");
const menuPrincipal = document.getElementById("menu-principal");

if (botaoMenu && menuPrincipal) {
    botaoMenu.addEventListener("click", function () {
        const aberto = menuPrincipal.classList.toggle("show");
        botaoMenu.setAttribute("aria-expanded", String(aberto));
        botaoMenu.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
    });

    menuPrincipal.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
            menuPrincipal.classList.remove("show");
            botaoMenu.setAttribute("aria-expanded", "false");
            botaoMenu.setAttribute("aria-label", "Abrir menu");
        });
    });
}

// Carrossel das fotos do produto
const fotos = document.querySelectorAll(".foto-carrossel");
const indicadores = document.querySelectorAll(".indicador");
const botaoAnterior = document.getElementById("foto-anterior");
const botaoProxima = document.getElementById("proxima-foto");
let fotoAtual = 0;

function mostrarFoto(numero) {
    if (fotos.length === 0) {
        return;
    }

    fotos[fotoAtual].classList.remove("ativa");
    if (indicadores[fotoAtual]) {
        indicadores[fotoAtual].classList.remove("ativo");
    }

    fotoAtual = numero;

    if (fotoAtual >= fotos.length) {
        fotoAtual = 0;
    }
    if (fotoAtual < 0) {
        fotoAtual = fotos.length - 1;
    }

    fotos[fotoAtual].classList.add("ativa");
    if (indicadores[fotoAtual]) {
        indicadores[fotoAtual].classList.add("ativo");
    }
}

if (fotos.length > 0 && botaoAnterior && botaoProxima) {
    botaoAnterior.addEventListener("click", function () {
        mostrarFoto(fotoAtual - 1);
    });

    botaoProxima.addEventListener("click", function () {
        mostrarFoto(fotoAtual + 1);
    });

    for (let i = 0; i < indicadores.length; i++) {
        indicadores[i].addEventListener("click", function () {
            mostrarFoto(i);
        });
    }
}

// Envio automático do formulário de contato por E-mail
const formularioContato = document.getElementById("form-contato");
const mensagemContatoStatus = document.getElementById("mensagem-contato-status");
const botaoEnviarContato = document.getElementById("btn-enviar-contato");
const emailDestino = "gabrielaamgv@gmail.com";

if (formularioContato) {
    formularioContato.addEventListener("submit", async function (evento) {
        evento.preventDefault();

        if (!formularioContato.checkValidity()) {
            formularioContato.reportValidity();
            return;
        }

        const nome = document.getElementById("nome-contato").value.trim();
        const email = document.getElementById("email-contato").value.trim();
        const assunto = document.getElementById("assunto-contato").value;
        const mensagem = document.getElementById("mensagem-contato").value.trim();

        botaoEnviarContato.disabled = true;
        botaoEnviarContato.textContent = "Enviando...";
        mensagemContatoStatus.textContent = "Enviando sua mensagem, aguarde...";

        try {
            const dadosForm = new FormData();
            dadosForm.append("Nome", nome);
            dadosForm.append("Email", email);
            dadosForm.append("Assunto", assunto);
            dadosForm.append("Mensagem", mensagem);
            dadosForm.append("_subject", "[Contato Site Carrot's] " + assunto + " - " + nome);
            dadosForm.append("_captcha", "false");
            dadosForm.append("_template", "table");

            const resposta = await fetch("https://formsubmit.co/ajax/" + emailDestino, {
                method: "POST",
                headers: {
                    "Accept": "application/json"
                },
                body: dadosForm
            });

            const resultado = await resposta.json();

            if (resposta.ok) {
                mensagemContatoStatus.textContent = "Mensagem enviada com sucesso! Em breve entraremos em contato.";
                formularioContato.reset();
            } else {
                mensagemContatoStatus.textContent = "Aviso do servidor: " + (resultado.message || "Verifique sua caixa de entrada para ativar o formulário.");
            }
        } catch (erro) {
            mensagemContatoStatus.textContent = "Erro de conexão ao enviar a mensagem.";
        } finally {
            botaoEnviarContato.disabled = false;
            botaoEnviarContato.textContent = "Enviar mensagem";
        }
    });
}

// Comentários e avaliações. Os dados ficam salvos neste navegador.
const formularioAvaliacao = document.getElementById("form-avaliacao");
const listaAvaliacoes = document.getElementById("lista-avaliacoes");
const semAvaliacoes = document.getElementById("sem-avaliacoes");
const chaveAvaliacoes = "carrots-avaliacoes";

function carregarAvaliacoes() {
    if (!listaAvaliacoes) {
        return;
    }

    const avaliacoesSalvas = JSON.parse(localStorage.getItem(chaveAvaliacoes) || "[]");
    listaAvaliacoes.innerHTML = "";

    if (avaliacoesSalvas.length === 0) {
        const aviso = document.createElement("p");
        aviso.className = "sem-avaliacoes";
        aviso.textContent = "Ainda não há avaliações. Seja a primeira pessoa a comentar!";
        listaAvaliacoes.appendChild(aviso);
        return;
    }

    for (let i = 0; i < avaliacoesSalvas.length; i++) {
        const avaliacao = avaliacoesSalvas[i];
        const cartao = document.createElement("article");
        cartao.className = "card-avaliacao";

        const nome = document.createElement("h3");
        nome.textContent = avaliacao.nome;
        const estrelas = document.createElement("p");
        estrelas.className = "estrelas";
        estrelas.textContent = "★".repeat(Number(avaliacao.nota)) + "☆".repeat(5 - Number(avaliacao.nota));
        const comentario = document.createElement("p");
        comentario.textContent = avaliacao.comentario;

        cartao.appendChild(nome);
        cartao.appendChild(estrelas);
        cartao.appendChild(comentario);
        listaAvaliacoes.appendChild(cartao);
    }
}

if (formularioAvaliacao) {
    carregarAvaliacoes();

    formularioAvaliacao.addEventListener("submit", function (evento) {
        evento.preventDefault();

        if (!formularioAvaliacao.checkValidity()) {
            formularioAvaliacao.reportValidity();
            return;
        }

        const nome = document.getElementById("nome-avaliacao").value.trim();
        const nota = document.getElementById("nota-avaliacao").value;
        const comentario = document.getElementById("comentario-avaliacao").value.trim();

        if (nome === "" || nota === "" || comentario.length < 5) {
            document.getElementById("mensagem-avaliacao").textContent = "Preencha todos os campos para enviar sua avaliação.";
            return;
        }

        const avaliacoesSalvas = JSON.parse(localStorage.getItem(chaveAvaliacoes) || "[]");
        avaliacoesSalvas.unshift({ nome: nome, nota: nota, comentario: comentario });
        localStorage.setItem(chaveAvaliacoes, JSON.stringify(avaliacoesSalvas));

        document.getElementById("mensagem-avaliacao").textContent = "Avaliação adicionada com sucesso neste navegador!";
        formularioAvaliacao.reset();
        carregarAvaliacoes();
    });
}