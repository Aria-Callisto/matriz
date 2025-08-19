const totalArcanos = 22;
const pastaImagens = 'images/';

// Funções de cálculo
function reduzirNumero(num){
  while(num > totalArcanos){
    num = num.toString().split("").reduce((a,d)=>a+parseInt(d),0);
  }
  return num;
}

function somaDigitos(str){
  return str.split("").reduce((a,d)=>a+parseInt(d),0);
}

// Calcula arcanos Pessoal, Ascendente e Central
function calcularArcanos(dia, mes, ano){
  // Arcano Pessoal
  const somaTudo = somaDigitos(String(dia) + String(mes) + String(ano));
  console.log("Soma dos dígitos da data (Pessoal):", somaTudo);
  const arcanoPessoal = reduzirNumero(somaTudo);
  console.log("Arcano Pessoal reduzido:", arcanoPessoal);

  // Arcano Ascendente
  console.log("Dia do nascimento (Ascendente, antes de reduzir):", dia);
  let arcanoAscendente = reduzirNumero(dia);
  console.log("Arcano Ascendente reduzido:", arcanoAscendente);

  // Arcano Central
  let somaAno = somaDigitos(String(ano));
  console.log("Soma dos dígitos do ano (antes de reduzir):", somaAno);
  if(somaAno > 22) somaAno = reduzirNumero(somaAno);
  console.log("Soma dos dígitos do ano (reduzida):", somaAno);

  // Reduzir qualquer parcela maior que 22 antes de somar
  let diaCentral = reduzirNumero(dia);
  let mesCentral = reduzirNumero(mes);

  let central1 = diaCentral + mesCentral + somaAno;
  console.log("Primeira soma para Arcano Central (dia+mes+somaAno):", central1);
  if(central1 > 22) central1 = reduzirNumero(central1);
  console.log("Central1 reduzido:", central1);

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

// Confete
function gerarConfeteIntensivo(){
  const container = document.getElementById("cartasConfete");
  container.innerHTML = '';
  for(let i=0; i<200; i++){
    const img = document.createElement("img");
    const idx = Math.floor(Math.random()*totalArcanos) + 1;
    img.src = `${pastaImagens}${String(idx).padStart(2,'0')}.png`; 
    img.className = 'confete';
    img.style.left = Math.random()*100+'vw';
    img.style.top = Math.random()*-20+'vh';
    img.style.width = (30 + Math.random()*30)+'px';
    img.style.opacity = (0.4 + Math.random()*0.6);
    img.style.animationDuration = (3 + Math.random()*5)+'s';
    img.style.transform = `rotate(${Math.random()*360}deg)`;
    container.appendChild(img);
  }
}

function removerConfete(){ 
  document.getElementById("cartasConfete").innerHTML=''; 
}

// Ativa flip ao clicar no back_card
function ativarFlip(cardId){
  const card = document.getElementById(cardId);
  const back = card.querySelector(".flip-back img");
  back.addEventListener("click", ()=>{
    card.classList.add("flipped");
  });
}

// Evento do formulário
document.getElementById("tarotForm").addEventListener("submit", function(e){
  e.preventDefault();
  const nome = document.getElementById("nome").value.trim();
  const data = document.getElementById("data").value;
  if(!nome || !data) return;
  const [ano, mes, dia] = data.split("-").map(Number);

  const arcanos = calcularArcanos(dia, mes, ano);

  gerarConfeteIntensivo();

  setTimeout(()=>{
    removerConfete();

    // Atualiza imagens das cartas
    document.getElementById("imgPessoal").src = `${pastaImagens}${String(arcanos.pessoal).padStart(2,'0')}.png`;
    document.getElementById("imgAscendente").src = `${pastaImagens}${String(arcanos.ascendente).padStart(2,'0')}.png`;
    document.getElementById("imgCentral").src = `${pastaImagens}${String(arcanos.central).padStart(2,'0')}.png`;

    // Atualiza textos
    document.getElementById("arcanoPessoal").textContent = `Arcano Pessoal: ${arcanos.pessoal}`;
    document.getElementById("arcanoAscendente").textContent = `Arcano Ascendente: ${arcanos.ascendente}`;
    document.getElementById("arcanoCentral").textContent = `Arcano Central: ${arcanos.central}`;

    document.getElementById("resultado").classList.remove("hidden");

    // Ativa flip ao clicar no back_card
    ativarFlip("cardPessoal");
    ativarFlip("cardAscendente");
    ativarFlip("cardCentral");

  }, 3000);
});
