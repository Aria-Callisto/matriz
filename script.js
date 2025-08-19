// =========================
// Configurações / Constantes
// =========================
const totalArcanos = 22;
const pastaImagens = 'images/';

// Mapa dos Arcanos 1..22 (22 = O Louco)
const nomesArcanos = {
  1:  "O Mago",
  2:  "A Sacerdotisa",
  3:  "A Imperatriz",
  4:  "O Imperador",
  5:  "O Hierofante",
  6:  "Os Enamorados",
  7:  "O Carro",
  8:  "A Justiça",
  9:  "O Eremita",
  10: "A Roda da Fortuna",
  11: "A Força",
  12: "O Enforcado",
  13: "A Morte",
  14: "A Temperança",
  15: "O Diabo",
  16: "A Torre",
  17: "A Estrela",
  18: "A Lua",
  19: "O Sol",
  20: "O Julgamento",
  21: "O Mundo",
  22: "O Louco"
};

// =========================
/* Utilitários de número */
// =========================
function reduzirNumero(num) {
  // Reduz até ficar entre 1 e 22
  while (num > totalArcanos) {
    num = num.toString().split("").reduce((a, d) => a + parseInt(d, 10), 0);
  }
  // Evitar 0 por segurança (não deve acontecer com as regras atuais)
  if (num === 0) num = 22;
  return num;
}

function somaDigitos(strOuNum) {
  return String(strOuNum)
    .replace(/\D/g, "")
    .split("")
    .reduce((a, d) => a + parseInt(d, 10), 0);
}

// =========================
/* Cálculo dos Arcanos (regras combinadas)
   - Pessoal: soma de todos os dígitos de (dia, mes, ano) e reduz até <= 22
   - Ascendente: dia do nascimento reduzido se > 22; se 22 fica 22
   - Central:
        somaAno = soma dos dígitos do ano reduzida até <= 22
        diaCentral = dia reduzido até <= 22
        mesCentral = mês reduzido até <= 22
        central1 = diaCentral + mesCentral + somaAno (reduzido até <= 22)
        central2 = diaCentral + mesCentral + somaAno + central1 (reduzido até <= 22)
*/
// =========================
function calcularArcanos(dia, mes, ano) {
  // Arcano Pessoal
  const somaTudo = somaDigitos(String(dia) + String(mes) + String(ano));
  console.log("Soma dos dígitos da data (Pessoal):", somaTudo);
  const arcanoPessoal = reduzirNumero(somaTudo);
  console.log("Arcano Pessoal reduzido:", arcanoPessoal);

  // Arcano Ascendente
  console.log("Dia do nascimento (Ascendente, antes de reduzir):", dia);
  const arcanoAscendente = reduzirNumero(dia);
  console.log("Arcano Ascendente reduzido:", arcanoAscendente);

  // Soma dos dígitos do ano
  let somaAno = somaDigitos(ano);
  console.log("Soma dos dígitos do ano (antes de reduzir):", somaAno);
  if (somaAno > 22) somaAno = reduzirNumero(somaAno);
  console.log("Soma dos dígitos do ano (reduzida):", somaAno);

  // Reduzir parcelas antes de somar (garantir <= 22)
  const diaCentral = reduzirNumero(dia);
  const mesCentral = reduzirNumero(mes);

  // Primeira soma para o Central
  let central1 = diaCentral + mesCentral + somaAno;
  console.log("Primeira soma para Arcano Central (dia+mes+somaAno):", central1);
  if (central1 > 22) central1 = reduzirNumero(central1);
  console.log("Central1 reduzido:", central1);

  // Segunda soma para o Central
  let central2 = diaCentral + mesCentral + somaAno + central1;
  console.log("Segunda soma para Arcano Central (dia+mes+somaAno+central1):", central2);
  const arcanoCentral = reduzirNumero(central2);
  console.log("Arcano Central reduzido:", arcanoCentral);

  return {
    pessoal: arcanoPessoal,
    ascendente: arcanoAscendente,
    central: arcanoCentral
  };
}

// =========================
// Confete (borboletinha/estrelinha)
// =========================
function gerarConfeteIntensivo() {
  const container = document.getElementById("cartasConfete");
  if (!container) return;
  container.innerHTML = '';

  const imagensConfete = ["borboletinha.png", "estrelinha.png"];

  for (let i = 0; i < 170; i++) {
    const img = document.createElement("img");
    const idx = i % 2; // alterna 0/1
    img.src = `${pastaImagens}${imagensConfete[idx]}`;

    img.className = 'confete';
    img.style.left = Math.random() * 100 + 'vw';
    img.style.top = Math.random() * -20 + 'vh';
    img.style.width = (20 + Math.random() * 30) + 'px';
    img.style.opacity = (0.4 + Math.random() * 0.6);
    img.style.animationDuration = (3 + Math.random() * 5) + 's';
    img.style.transform = `rotate(${Math.random() * 360}deg)`;
    container.appendChild(img);
  }
}

function removerConfete() {
  const container = document.getElementById("cartasConfete");
  if (container) container.innerHTML = '';
}

// =========================
// Flip: revelar carta ao clicar no verso
// =========================
function ativarFlip(cardId) {
  const card = document.getElementById(cardId);
  if (!card) return;
  const backImg = card.querySelector(".flip-back img");
  const sound = document.getElementById("flip-sound");

  // ADICIONADO: mapear card -> elemento de texto correspondente
  const idTextoMap = {
    cardPessoal: 'arcanoPessoal',
    cardAscendente: 'arcanoAscendente',
    cardCentral: 'arcanoCentral'
  };
  const txtEl = document.getElementById(idTextoMap[cardId]);
  // FIM ADICIONADO

  if (!backImg) return;

  const handleClick = () => {
    card.classList.add("flipped");
    if (sound) {
      try {
        sound.currentTime = 0;
        sound.play();
      } catch (e) { /* ignore */ }
    }

    // ADICIONADO: ao virar, revelar o texto salvo no dataset.final
    if (txtEl && txtEl.dataset && txtEl.dataset.final) {
      txtEl.textContent = txtEl.dataset.final;
    }
    // FIM ADICIONADO

    // Evita "desvirar": remove o listener após a primeira virada
    backImg.removeEventListener("click", handleClick);
  };

  backImg.addEventListener("click", handleClick);
}

// =========================
// Evento do formulário (IDs do seu index base)
// =========================
const form = document.getElementById("tarotForm");
if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const nome = document.getElementById("nome")?.value.trim();
    const data = document.getElementById("data")?.value;
    if (!nome || !data) return;

    const [dia, mes, ano] = data.split("/").map(Number);

    const arcanos = calcularArcanos(dia, mes, ano);

    gerarConfeteIntensivo();

    setTimeout(() => {
      removerConfete();

      // Atualiza imagens com 01..22.png
      const imgP = document.getElementById("imgPessoal");
      const imgA = document.getElementById("imgAscendente");
      const imgC = document.getElementById("imgCentral");

      if (imgP) imgP.src = `${pastaImagens}${String(arcanos.pessoal).padStart(2, '0')}.png`;
      if (imgA) imgA.src = `${pastaImagens}${String(arcanos.ascendente).padStart(2, '0')}.png`;
      if (imgC) imgC.src = `${pastaImagens}${String(arcanos.central).padStart(2, '0')}.png`;

      // Atualiza textos: número + [nome]
      const txtP = document.getElementById("arcanoPessoal");
      const txtA = document.getElementById("arcanoAscendente");
      const txtC = document.getElementById("arcanoCentral");

      if (txtP) txtP.textContent = `Arcano Pessoal: ${arcanos.pessoal} [${nomesArcanos[arcanos.pessoal]}]`;
      if (txtA) txtA.textContent = `Arcano Ascendente: ${arcanos.ascendente} [${nomesArcanos[arcanos.ascendente]}]`;
      if (txtC) txtC.textContent = `Arcano Central: ${arcanos.central} [${nomesArcanos[arcanos.central]}]`;

      // ADICIONADO: guardar o texto final e mascarar com ************* até virar
      if (txtP) { txtP.dataset.final = txtP.textContent; txtP.textContent = "*************"; }
      if (txtA) { txtA.dataset.final = txtA.textContent; txtA.textContent = "*************"; }
      if (txtC) { txtC.dataset.final = txtC.textContent; txtC.textContent = "*************"; }
      // FIM ADICIONADO

      // Revelar seção de resultado
      document.getElementById("resultado")?.classList.remove("hidden");

      // Ativar flip ao clicar no verso de cada carta
      ativarFlip("cardPessoal");
      ativarFlip("cardAscendente");
      ativarFlip("cardCentral");
    }, 3000);
  });
} else {
  console.warn('Formulário "tarotForm" não encontrado no DOM.');
}

// Máscara para data (dd/mm/aaaa)
const inputData = document.getElementById("data");
if (inputData) {
  inputData.addEventListener("input", function (e) {
    let v = e.target.value.replace(/\D/g, ""); // remove tudo que não for número
    if (v.length > 8) v = v.slice(0, 8); // limita a 8 dígitos
    let formatado = "";
    if (v.length > 4) {
      formatado = v.replace(/(\d{2})(\d{2})(\d{0,4})/, "$1/$2/$3");
    } else if (v.length > 2) {
      formatado = v.replace(/(\d{2})(\d{0,2})/, "$1/$2");
    } else {
      formatado = v;
    }
    e.target.value = formatado;
  });
}
