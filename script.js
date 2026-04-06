// =========================
// Configurações / Constantes
// =========================
const totalArcanos = 22;
const pastaImagens = 'images/';

const nomesArcanos = {
  1:  "O Mago", 2:  "A Sacerdotisa", 3:  "A Imperatriz", 4:  "O Imperador",
  5:  "O Hierofante", 6:  "Os Enamorados", 7:  "O Carro", 8:  "A Justiça",
  9:  "O Eremita", 10: "A Roda da Fortuna", 11: "A Força", 12: "O Enforcado",
  13: "A Morte", 14: "A Temperança", 15: "O Diabo", 16: "A Torre",
  17: "A Estrela", 18: "A Lua", 19: "O Sol", 20: "O Julgamento",
  21: "O Mundo", 22: "O Louco"
};

const linksKiwify = {
  1: "https://pay.kiwify.com.br/g9eCxH2", // MAGO
  2: "https://pay.kiwify.com.br/u1vydTB", // SACERDOTISA
  3: "https://pay.kiwify.com.br/JbGRyIb", // IMPERATRIZ
  4: "https://pay.kiwify.com.br/CjctoLz", // IMPERADOR
  5: "https://pay.kiwify.com.br/gC3u3pE", // PAPA (Hierofante)
  6: "https://pay.kiwify.com.br/5KbziRk", // ENAMORADOS
  7: "https://pay.kiwify.com.br/R9cnfoZ", // CARRO
  8: "https://pay.kiwify.com.br/eHObiIZ", // JUSTIÇA
  9: "https://pay.kiwify.com.br/uxBRLdD", // EREMITA
  10: "https://pay.kiwify.com.br/hMZ9ExB", // RODA DA FORTUNA
  11: "https://pay.kiwify.com.br/thXCxL0", // FORÇA
  12: "https://pay.kiwify.com.br/Unin56N", // ENFORCADO (Pendurado)
  13: "https://pay.kiwify.com.br/XZUByEd", // MORTE
  14: "https://pay.kiwify.com.br/QvosYul", // TEMPERANÇA
  15: "https://pay.kiwify.com.br/zytmKdG", // DIABO
  16: "https://pay.kiwify.com.br/IydySSM", // TORRE
  17: "https://pay.kiwify.com.br/M8oQdM6", // ESTRELA
  18: "https://pay.kiwify.com.br/kLrC5G3", // LUA
  19: "https://pay.kiwify.com.br/S2yGUCt", // SOL
  20: "https://pay.kiwify.com.br/L2pGKcO", // JULGAMENTO
  21: "https://pay.kiwify.com.br/TvmLqXb", // MUNDO
  22: "https://pay.kiwify.com.br/Ve4s4rB"  // LOUCO
};

// =========================
/* Utilitários de número */
// =========================
function reduzirNumero(num) {
  while (num > totalArcanos) {
    num = num.toString().split("").reduce((a, d) => a + parseInt(d, 10), 0);
  }
  if (num === 0) num = 22;
  return num;
}

function somaDigitos(strOuNum) {
  return String(strOuNum).replace(/\D/g, "").split("").reduce((a, d) => a + parseInt(d, 10), 0);
}

// =========================
/* Cálculo dos Arcanos Principais e Complementares */
// =========================
function calcularArcanos(dia, mes, ano) {
  const somaTudo = somaDigitos(String(dia) + String(mes) + String(ano));
  const arcanoPessoal = reduzirNumero(somaTudo);
  const arcanoAscendente = reduzirNumero(dia);
  let somaAno = somaDigitos(ano);
  if (somaAno > 22) somaAno = reduzirNumero(somaAno);
  const diaCentral = reduzirNumero(dia);
  const mesCentral = reduzirNumero(mes);
  let central1 = diaCentral + mesCentral + somaAno;
  if (central1 > 22) central1 = reduzirNumero(central1);
  let central2 = diaCentral + mesCentral + somaAno + central1;
  const arcanoCentral = reduzirNumero(central2);

  return { pessoal: arcanoPessoal, ascendente: arcanoAscendente, central: arcanoCentral };
}

function calcularComplementares(pessoal) {
  if (pessoal < 10) return [];
  if (pessoal === 19) return [10, 1];
  const soma = String(pessoal).split('').reduce((acc, digito) => acc + parseInt(digito, 10), 0);
  return [soma];
}

// =========================
// Flip: revelar carta 
// =========================
function ativarFlip(cardId) {
  const card = document.getElementById(cardId);
  if (!card) return;
  const backImg = card.querySelector(".flip-back img");
  const sound = document.getElementById("flip-sound");

  const idTextoMap = {
    cardPessoal: 'arcanoPessoal', cardComplementar1: 'arcanoComplementar1', cardComplementar2: 'arcanoComplementar2'  
  };
  const txtEl = document.getElementById(idTextoMap[cardId]);

  if (!backImg) return;

  const handleClick = () => {
    card.classList.add("flipped");
    if (sound) {
      try { sound.currentTime = 0; sound.play(); } catch (e) { }
    }
    if (txtEl && txtEl.dataset && txtEl.dataset.final) {
      txtEl.textContent = txtEl.dataset.final;
    }

    // ========================================================
    // REVELA A OFERTA (CTA) QUANDO A CARTA FOR VIRADA
    // ========================================================
    const cta = document.getElementById("call-to-action");
    if (cta && cta.classList.contains("cta-oculto")) {
        // Espera 500ms (o tempo da carta estar no meio do giro) para revelar o texto de baixo
        setTimeout(() => {
            cta.classList.remove("cta-oculto");
            cta.classList.add("cta-animado");
        }, 500); 
    }

    backImg.removeEventListener("click", handleClick);
  };
  backImg.addEventListener("click", handleClick);
}

// =========================
// Evento do formulário e Animação de Carregamento Suave
// =========================
const form = document.getElementById("tarotForm");
if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const nomeCompleto = document.getElementById("nome")?.value.trim();
    const data = document.getElementById("data")?.value;
    if (!nomeCompleto || !data) return;
    
    // Pega apenas o primeiro nome para ficar mais amigável no texto de vendas
    const nomePrimeiro = nomeCompleto.split(" ")[0];

    // ========================================================
    // DISPARA O EVENTO DE LEAD NO PIXEL DO FACEBOOK
    // ========================================================
    if (typeof fbq === 'function') {
      fbq('track', 'Lead');
    }

    const [dia, mes, ano] = data.split("/").map(Number);
    const arcanos = calcularArcanos(dia, mes, ano);
    const complementares = calcularComplementares(arcanos.pessoal);

    // Esconde o form E O TEXTO para dar espaço limpo
    const inputNome = document.getElementById("nome");
    const inputData = document.getElementById("data");
    const btnSubmit = form.querySelector("button[type='submit']");
    const textoSubtitulo = document.querySelector(".container > p"); 
    
    if (inputNome) inputNome.style.display = "none";
    if (inputData) inputData.style.display = "none";
    if (btnSubmit) btnSubmit.style.display = "none";
    if (textoSubtitulo) textoSubtitulo.style.display = "none"; 

    // 1. Inicia o GIF com Fade-in
    const loadingScreen = document.getElementById("loading-screen");
    const progressBar = document.getElementById("progress-bar");
    const progressText = document.getElementById("progress-text");
    
    loadingScreen.classList.remove("hidden"); 
    
    void loadingScreen.offsetWidth; 
    loadingScreen.classList.add("visible"); 
    
    let progress = 0;
    const duration = 7000; 
    const intervalTime = 50; 
    const step = (100 / (duration / intervalTime));

    const progressInterval = setInterval(() => {
        progress += step;
        if (progress >= 100) {
            progress = 100;
            clearInterval(progressInterval);
        }
        progressBar.style.width = `${progress}%`;
        progressText.textContent = `${Math.floor(progress)}%`;
    }, intervalTime);

    // 2. Transição final após 7 segundos
    setTimeout(() => {
      // Inicia o Fade-out do GIF
      loadingScreen.classList.remove("visible");

      // Espera 800ms (tempo do CSS) pro GIF sumir e então monta a tela de resultado
      setTimeout(() => {
          loadingScreen.classList.add("hidden"); 

          // Prepara os textos e imagens das cartas
          const imgP = document.getElementById("imgPessoal");
          const txtP = document.getElementById("arcanoPessoal");
          if (imgP) imgP.src = `${pastaImagens}${String(arcanos.pessoal).padStart(2, '0')}.png`;
          if (txtP) { 
              txtP.textContent = `Arcano Pessoal: ${arcanos.pessoal} [${nomesArcanos[arcanos.pessoal]}]`;
              txtP.dataset.final = txtP.textContent; 
              txtP.textContent = "*************"; 
          }
          ativarFlip("cardPessoal");

          const boxC1 = document.getElementById("boxComplementar1");
          const boxC2 = document.getElementById("boxComplementar2");
          if (boxC1) boxC1.classList.add("hidden");
          if (boxC2) boxC2.classList.add("hidden");

          if (complementares.length > 0) {
              boxC1.classList.remove("hidden");
              const imgC1 = document.getElementById("imgComplementar1");
              const txtC1 = document.getElementById("arcanoComplementar1");
              if (imgC1) imgC1.src = `${pastaImagens}${String(complementares[0]).padStart(2, '0')}.png`;
              if (txtC1) {
                  txtC1.textContent = `Arcano Complementar: ${complementares[0]} [${nomesArcanos[complementares[0]]}]`;
                  txtC1.dataset.final = txtC1.textContent;
                  txtC1.textContent = "*************";
              }
              ativarFlip("cardComplementar1");
          }

          if (complementares.length > 1) {
              boxC2.classList.remove("hidden");
              const imgC2 = document.getElementById("imgComplementar2");
              const txtC2 = document.getElementById("arcanoComplementar2");
              if (imgC2) imgC2.src = `${pastaImagens}${String(complementares[1]).padStart(2, '0')}.png`;
              if (txtC2) {
                  txtC2.textContent = `2º Arcano Complementar: ${complementares[1]} [${nomesArcanos[complementares[1]]}]`;
                  txtC2.dataset.final = txtC2.textContent;
                  txtC2.textContent = "*************";
              }
              ativarFlip("cardComplementar2");
          }
          
          // ========================================================
          // INJEÇÃO DAS VARIÁVEIS DINÂMICAS NO TEXTO DO CTA
          // ========================================================
          const spanNomePessoa = document.getElementById("span-nome-pessoa");
          const spanNomeArcano = document.getElementById("span-nome-arcano");
          
          if (spanNomePessoa) {
              spanNomePessoa.textContent = nomePrimeiro;
          }
          if (spanNomeArcano) {
              spanNomeArcano.textContent = nomesArcanos[arcanos.pessoal];
          }

          // Prepara o Mockup
          const numeroImagem = arcanos.pessoal === 22 ? 0 : arcanos.pessoal;
          const imgMockup = document.getElementById("mockup-ebook");
          if (imgMockup) imgMockup.src = `${pastaImagens}M${numeroImagem}.png`;

          const btnCompra = document.getElementById("btn-compra");
          if (btnCompra) {
              const linkCheckout = linksKiwify[arcanos.pessoal] || "#"; 
              btnCompra.onclick = () => { window.location.href = linkCheckout; };
          }

          // Refaz o botão de Submit
          if (btnSubmit) {
            btnSubmit.textContent = "Refazer";
            btnSubmit.style.display = "block";
            btnSubmit.onclick = () => { window.location.href = "index.html"; };
          }

          // FINALMENTE: Faz o Fade-in maravilhoso do resultado
          const resultado = document.getElementById("resultado");
          resultado.classList.remove("hidden");
          
          void resultado.offsetWidth; 
          resultado.classList.add("visible"); 

      }, 800); 

    }, duration); 
  });
}

// Máscara para data
const inputData = document.getElementById("data");
if (inputData) {
  inputData.addEventListener("input", function (e) {
    let v = e.target.value.replace(/\D/g, ""); 
    if (v.length > 8) v = v.slice(0, 8); 
    let formatado = "";
    if (v.length > 4) { formatado = v.replace(/(\d{2})(\d{2})(\d{0,4})/, "$1/$2/$3"); } 
    else if (v.length > 2) { formatado = v.replace(/(\d{2})(\d{0,2})/, "$1/$2"); } 
    else { formatado = v; }
    e.target.value = formatado;
  });
}