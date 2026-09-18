const modules = [...document.querySelectorAll('[data-module]')];
const home = document.querySelector('.home-view');
const main = document.querySelector('main');
const menuButton = document.querySelector('.menu-toggle');
const menuLabel = menuButton.querySelector('.sr-only');
const nav = document.querySelector('nav');
const toast = document.querySelector('.toast');

let toastTimer;

// ========================================
// MENU
// ========================================

function setMenuState(isOpen) {
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuLabel.textContent = isOpen ? 'Fechar menu' : 'Abrir menu';
}

// ========================================
// NAVEGAÇÃO
// ========================================

function updateView() {
    const route = location.hash.slice(1);

    const active = modules.find(module => module.id === route);

    modules.forEach(module => {
        module.hidden = module !== active;
    });

    home.hidden = Boolean(active);

    if (active) {
        window.scrollTo(0, 0);
        main.focus();
    }

    setMenuState(false);
}

window.addEventListener('hashchange', updateView);
window.addEventListener('DOMContentLoaded', updateView);

// ========================================
// BOTÃO DO MENU
// ========================================

menuButton.addEventListener('click', () => {
    const isOpen =
        menuButton.getAttribute('aria-expanded') === 'true';

    setMenuState(!isOpen);
});

nav.addEventListener('click', () => {
    setMenuState(false);
});

// ========================================
// TOAST
// ========================================

document.querySelectorAll('[data-toast]').forEach(button => {

    button.addEventListener('click', () => {

        toast.textContent = button.dataset.toast;

        toast.classList.add('show');

        clearTimeout(toastTimer);

        toastTimer = setTimeout(() => {
            toast.classList.remove('show');
        }, 3500);

    });

});

// ========================================
// TRANSCRIÇÕES
// ========================================

document.querySelectorAll('[data-disclosure]').forEach(button => {

    button.addEventListener('click', () => {

        const transcript = document.getElementById(
            button.getAttribute('aria-controls')
        );

        if (!transcript) {
            return;
        }

        const willOpen = transcript.hidden;

        transcript.hidden = !willOpen;

        button.setAttribute(
            'aria-expanded',
            String(willOpen)
        );

        const itemName =
            transcript.id === 'transcricao-video'
                ? 'do documentário'
                : 'do podcast';

        button.textContent =
            `${willOpen ? 'Ocultar' : 'Mostrar'} transcrição ${itemName}`;

    });

});

// ========================================
// CARREGAR TRANSCRIÇÃO DO PODCAST
// ========================================

fetch("podcast/Coltecast_Transcricao.txt")
    .then(resposta => {

        if (!resposta.ok) {
            throw new Error(
                `Erro HTTP ${resposta.status}`
            );
        }

        return resposta.text();

    })
    .then(texto => {

        const elemento =
            document.getElementById("transcricao-conteudo");

        if (elemento) {
            elemento.innerText = texto;
        }

    })
    .catch(erro => {

        const elemento =
            document.getElementById("transcricao-conteudo");

        if (elemento) {

            elemento.innerText =
                "Não foi possível carregar a transcrição.";

        }

        console.error(
            "Erro ao carregar a transcrição:",
            erro
        );

    });

// ========================================
// PLAYER DO PODCAST
// ========================================

const playerPodcast =
    document.getElementById("coltecast-audio");


// ========================================
// DEBUG DO PLAYER
// ========================================

if (playerPodcast) {

    playerPodcast.addEventListener("loadedmetadata", () => {

        console.log(
            "Podcast carregado."
        );

        console.log(
            "Duração:",
            playerPodcast.duration,
            "segundos"
        );

        console.log(
            "Estado:",
            playerPodcast.readyState
        );

    });

    playerPodcast.addEventListener("error", () => {

        console.error(
            "Erro no áudio:",
            playerPodcast.error
        );

    });

}


// ========================================
// TIMESTAMPS DO PODCAST
// ========================================
document.querySelectorAll(".episodes button").forEach(button => {

    button.addEventListener("click", () => {

        if (!playerPodcast) {
            console.error("Player #coltecast-audio não encontrado.");
            return;
        }

        const tempo = Number(button.dataset.time);

        if (!Number.isFinite(tempo)) {
            console.error("Timestamp inválido:", button.dataset.time);
            return;
        }

        console.log("=================================");
        console.log("Timestamp clicado:", tempo);
        console.log("Duração:", playerPodcast.duration);
        console.log("currentTime antes:", playerPodcast.currentTime);
        console.log("readyState:", playerPodcast.readyState);
        console.log("networkState:", playerPodcast.networkState);
        console.log("=================================");


        // Verifica se o navegador consegue fazer seek
        if (!playerPodcast.seekable.length) {

            console.log("Nenhuma área de seek disponível.");
            console.log("Forçando carregamento do áudio...");

            playerPodcast.load();

            playerPodcast.addEventListener(
                "progress",
                () => {

                    if (playerPodcast.seekable.length) {

                        console.log(
                            "Área de seek disponível:",
                            playerPodcast.seekable.start(0),
                            "até",
                            playerPodcast.seekable.end(
                                playerPodcast.seekable.length - 1
                            )
                        );

                        fazerSeek();

                    }

                },
                { once: true }
            );

            return;
        }


        fazerSeek();


        function fazerSeek() {

            try {

                const inicio =
                    playerPodcast.seekable.start(0);

                const fim =
                    playerPodcast.seekable.end(
                        playerPodcast.seekable.length - 1
                    );

                console.log(
                    "Área disponível para seek:",
                    inicio,
                    "até",
                    fim
                );


                if (tempo < inicio || tempo > fim) {

                    console.error(
                        "O timestamp está fora da área de seek disponível."
                    );

                    return;
                }


                // Pausa antes do seek
                playerPodcast.pause();


                // Faz o seek
                playerPodcast.currentTime = tempo;


                console.log(
                    "currentTime depois do seek:",
                    playerPodcast.currentTime
                );


                // Reproduz
                const promessa =
                    playerPodcast.play();

                if (promessa !== undefined) {

                    promessa.catch(erro => {

                        console.error(
                            "Erro ao iniciar o podcast:",
                            erro
                        );

                    });

                }

            } catch (erro) {

                console.error(
                    "Erro ao fazer seek:",
                    erro
                );

            }

        }

    });

});

fetch("video/bolinho.txt")
    .then(resposta => resposta.text())
    .then(texto => {
        document.getElementById("transcricao-video-conteudo").innerText = texto;
    })
    .catch(erro => {
        document.getElementById("transcricao-video-conteudo").innerText =
            "Não foi possível carregar a transcrição do documentário.";
        console.error(erro);
    });
