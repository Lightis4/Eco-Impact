
document.addEventListener("DOMContentLoaded", () => {
    const formImpacto = document.getElementById("formImpacto");
    const resultadoImpacto = document.getElementById("resultadoImpacto");
    const tituloImpacto = document.getElementById("tituloImpacto");
    const notaImpacto = document.getElementById("notaImpacto");
    const textoImpacto = document.getElementById("textoImpacto");
    const sugestoesImpacto = document.getElementById("sugestoesImpacto");
    const progressoImpacto = document.getElementById("progressoImpacto");
    const barraImpacto = document.getElementById("barraImpacto");

    const progressoDesafios = document.getElementById("progressoDesafios");
    const pontosVerdes = document.getElementById("pontosVerdes");
    const progressoBarraDesafios = document.getElementById("progressoBarraDesafios");
    const barraDesafios = document.getElementById("barraDesafios");

    const painelPontos = document.getElementById("painelPontos");
    const painelDesafios = document.getElementById("painelDesafios");
    const painelPerfil = document.getElementById("painelPerfil");
    const painelPerfilTexto = document.getElementById("painelPerfilTexto");
    const reiniciarProjeto = document.getElementById("reiniciarProjeto");

    const desafios = [
        { id: "agua", pontos: 10 },
        { id: "residuos", pontos: 10 },
        { id: "energia", pontos: 10 },
        { id: "transporte", pontos: 15 },
        { id: "descartaveis", pontos: 10 },
        { id: "natureza", pontos: 15 }
    ];

    const CHAVE_ARMAZENAMENTO = "ecoimpact_dados_v1";

    let dados = carregarDados();

    function carregarDados() {
        const dadosPadrao = {
            desafiosConcluidos: [],
            avaliacao: null
        };

        try {
            const armazenado = localStorage.getItem(CHAVE_ARMAZENAMENTO);

            if (!armazenado) {
                return dadosPadrao;
            }

            const convertido = JSON.parse(armazenado);

            if (
                !convertido ||
                !Array.isArray(convertido.desafiosConcluidos)
            ) {
                return dadosPadrao;
            }

            return {
                desafiosConcluidos: convertido.desafiosConcluidos.filter(
                    id => desafios.some(desafio => desafio.id === id)
                ),
                avaliacao: validarAvaliacao(convertido.avaliacao)
            };
        } catch {
            return dadosPadrao;
        }
    }

    function validarAvaliacao(avaliacao) {
        if (
            !avaliacao ||
            !Number.isInteger(avaliacao.nota) ||
            avaliacao.nota < 0 ||
            avaliacao.nota > 100 ||
            typeof avaliacao.perfil !== "string" ||
            !Array.isArray(avaliacao.sugestoes)
        ) {
            return null;
        }

        return {
            nota: avaliacao.nota,
            perfil: avaliacao.perfil,
            texto: String(avaliacao.texto || ""),
            sugestoes: avaliacao.sugestoes
                .filter(item => typeof item === "string")
                .slice(0, 10)
        };
    }

    function salvarDados() {
        try {
            localStorage.setItem(
                CHAVE_ARMAZENAMENTO,
                JSON.stringify(dados)
            );
        } catch {
            alert(
                "Não foi possível salvar os dados neste navegador. " +
                "O projeto continuará funcionando durante esta sessão."
            );
        }
    }

    function adicionarItem(lista, texto) {
        const item = document.createElement("li");
        item.textContent = texto;
        lista.appendChild(item);
    }

    function avaliarHabitos(respostas) {
        let nota = 0;
        const sugestoes = [];

        if (respostas.transporte === "sustentavel") {
            nota += 25;
        } else if (respostas.transporte === "misto") {
            nota += 15;
            sugestoes.push(
                "Quando for viável, considere caminhar, pedalar ou usar transporte coletivo."
            );
        } else {
            nota += 5;
            sugestoes.push(
                "Avalie alternativas de transporte coletivo, caminhada ou bicicleta em trajetos adequados."
            );
        }

        if (respostas.banho === "curto") {
            nota += 25;
        } else if (respostas.banho === "medio") {
            nota += 15;
            sugestoes.push(
                "Experimente reduzir alguns minutos do banho para evitar desperdício de água."
            );
        } else {
            nota += 5;
            sugestoes.push(
                "Reduzir o tempo do banho e fechar o chuveiro ao se ensaboar pode ajudar a economizar água."
            );
        }

        if (respostas.reciclagem === "sempre") {
            nota += 25;
        } else if (respostas.reciclagem === "asvezes") {
            nota += 15;
            sugestoes.push(
                "Organize os recicláveis e verifique os pontos de coleta disponíveis na sua região."
            );
        } else {
            nota += 5;
            sugestoes.push(
                "Comece separando os resíduos recicláveis e descubra como funciona a coleta local."
            );
        }

        if (respostas.energia === "consciente") {
            nota += 25;
        } else if (respostas.energia === "parcial") {
            nota += 15;
            sugestoes.push(
                "Crie o hábito de apagar as luzes e desligar equipamentos que não estão em uso."
            );
        } else {
            nota += 5;
            sugestoes.push(
                "Observe o consumo de energia em casa e desligue luzes e equipamentos desnecessários."
            );
        }

        let perfil;
        let texto;

        if (nota >= 85) {
            perfil = "Consciente";
            texto =
                "Você relatou hábitos positivos em várias áreas. Continue praticando " +
                "e procure novas formas de reduzir seu impacto ambiental.";
        } else if (nota >= 60) {
            perfil = "Em evolução";
            texto =
                "Você já possui alguns hábitos sustentáveis. Pequenas melhorias " +
                "nas áreas indicadas podem fortalecer sua rotina.";
        } else if (nota >= 35) {
            perfil = "Em aprendizado";
            texto =
                "Você tem oportunidades de desenvolver hábitos mais sustentáveis. " +
                "Comece por uma mudança simples e realista.";
        } else {
            perfil = "Começando";
            texto =
                "Este é um ponto de partida. Escolha uma ou duas ações possíveis " +
                "para começar a cuidar melhor dos recursos naturais.";
        }

        if (sugestoes.length === 0) {
            sugestoes.push(
                "Continue com seus hábitos e compartilhe boas práticas com outras pessoas."
            );
            sugestoes.push(
                "Conheça iniciativas de reciclagem e conservação ambiental da sua comunidade."
            );
        }

        return { nota, perfil, texto, sugestoes };
    }

    formImpacto.addEventListener("submit", evento => {
        evento.preventDefault();

        if (!formImpacto.checkValidity()) {
            formImpacto.reportValidity();
            return;
        }

        const respostas = {
            transporte: document.getElementById("transporte").value,
            banho: document.getElementById("banho").value,
            reciclagem: document.getElementById("reciclagem").value,
            energia: document.getElementById("energia").value
        };

        if (Object.values(respostas).some(valor => !valor)) {
            formImpacto.reportValidity();
            return;
        }

        const resultado = avaliarHabitos(respostas);

        dados.avaliacao = resultado;
        salvarDados();

        mostrarResultado(resultado);
        atualizarPainel();

        resultadoImpacto.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });
    });

    function mostrarResultado(resultado) {
        tituloImpacto.textContent = resultado.perfil;
        notaImpacto.textContent = resultado.nota;
        textoImpacto.textContent = resultado.texto;

        progressoImpacto.style.width = `${resultado.nota}%`;
        barraImpacto.setAttribute("aria-valuenow", resultado.nota);

        sugestoesImpacto.replaceChildren();

        resultado.sugestoes.forEach(sugestao => {
            adicionarItem(sugestoesImpacto, sugestao);
        });

        resultadoImpacto.hidden = false;
    }

    function concluirDesafio(id) {
        const desafio = desafios.find(item => item.id === id);

        if (!desafio || dados.desafiosConcluidos.includes(id)) {
            return;
        }

        dados.desafiosConcluidos.push(id);

        salvarDados();
        atualizarPainel();
    }

    document.querySelectorAll(".btn-challenge").forEach(botao => {
        botao.addEventListener("click", () => {
            const id = botao.dataset.id;

            if (!id) {
                return;
            }

            concluirDesafio(id);
        });
    });

    function calcularPontosVerdes() {
        return desafios.reduce((total, desafio) => {
            return dados.desafiosConcluidos.includes(desafio.id)
                ? total + desafio.pontos
                : total;
        }, 0);
    }

    function atualizarDesafios() {
        const concluidos = dados.desafiosConcluidos.length;
        const total = desafios.length;
        const percentual = Math.round((concluidos / total) * 100);
        const pontos = calcularPontosVerdes();

        progressoDesafios.textContent =
            `${concluidos} de ${total} concluídos`;

        pontosVerdes.textContent = pontos;
        progressoBarraDesafios.style.width = `${percentual}%`;
        barraDesafios.setAttribute("aria-valuenow", percentual);

        desafios.forEach(desafio => {
            const cartao = document.querySelector(
                `.challenge-card[data-desafio="${desafio.id}"]`
            );

            if (!cartao) {
                return;
            }

            const botao = cartao.querySelector(".btn-challenge");
            const concluido = dados.desafiosConcluidos.includes(desafio.id);

            cartao.classList.toggle("completed", concluido);
            botao.disabled = concluido;
            botao.textContent = concluido
                ? "✓ Desafio concluído"
                : "Concluir desafio +";

            if (concluido) {
                botao.setAttribute("aria-label", "Desafio já concluído");
            } else {
                botao.removeAttribute("aria-label");
            }
        });
    }

    function atualizarPainel() {
        const pontos = calcularPontosVerdes();
        const concluidos = dados.desafiosConcluidos.length;

        painelPontos.textContent = pontos;
        painelDesafios.textContent = `${concluidos}/${desafios.length}`;

        if (!dados.avaliacao) {
            painelPerfil.textContent = "Começando";
            painelPerfilTexto.textContent =
                "Faça a avaliação de hábitos";
        } else {
            painelPerfil.textContent = dados.avaliacao.perfil;
            painelPerfilTexto.textContent =
                `Índice educativo: ${dados.avaliacao.nota}/100`;
        }

        atualizarDesafios();
    }

    function reiniciarExperiencia() {
        const confirmou = window.confirm(
            "Deseja reiniciar a experiência? Sua avaliação e seus desafios " +
            "concluídos serão apagados deste navegador."
        );

        if (!confirmou) {
            return;
        }

        dados = {
            desafiosConcluidos: [],
            avaliacao: null
        };

        try {
            localStorage.removeItem(CHAVE_ARMAZENAMENTO);
        } catch {
            salvarDados();
        }

        formImpacto.reset();
        resultadoImpacto.hidden = true;

        atualizarPainel();

        document.getElementById("inicio").scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }

    reiniciarProjeto.addEventListener("click", reiniciarExperiencia);

    if (dados.avaliacao) {
        mostrarResultado(dados.avaliacao);
    }

    atualizarPainel();
});
