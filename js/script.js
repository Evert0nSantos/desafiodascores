const cores = [
  { nome: "vermelho", corHex: "#ff0000" },
  { nome: "azul", corHex: "#0000ff" },
  { nome: "verde", corHex: "#008000" },
  { nome: "amarelo", corHex: "#ffff00" },
  { nome: "roxo", corHex: "#800080" },
  { nome: "laranja", corHex: "#ffa500" }
];

const gridElement = document.getElementById("grid");
const corAlvoElement = document.getElementById("corAlvo");
const pontuacaoElement = document.getElementById("pontuacao");
const tempoElement = document.getElementById("tempo");
const nomeJogadorInput = document.getElementById("nomeJogador");
const nomeFinal = document.getElementById("nomeFinal");
const pontuacaoFinal = document.getElementById("pontuacaoFinal");

let corAlvo = {};
let pontuacao = 0;
let tempo = 30;
let intervalo;
let coresAtuaisNoGrid = [];

document.getElementById("btnJogar").addEventListener("click", iniciarJogo);

function iniciarJogo() {
  const nome = nomeJogadorInput.value.trim();
  if (!nome) {
    alert("Digite seu nome para jogar!");
    return;
  }

  document.getElementById("entradaJogador").classList.add("escondido");
  document.getElementById("jogo").classList.remove("escondido");

  pontuacao = 0;
  tempo = 30;
  atualizarPontuacao();
  atualizarTempo();
  criarGrid();
  escolherNovaCor();

  intervalo = setInterval(() => {
    tempo--;
    atualizarTempo();
    if (tempo <= 0) {
      clearInterval(intervalo);
      fimDoJogo();
    }
  }, 1000);
}

function atualizarPontuacao() {
  pontuacaoElement.textContent = pontuacao;
}

function atualizarTempo() {
  tempoElement.textContent = tempo;
}

function criarGrid() {
  gridElement.innerHTML = "";
  coresAtuaisNoGrid = [];

  for (let i = 0; i < 16; i++) {
    const cor = cores[Math.floor(Math.random() * cores.length)];
    coresAtuaisNoGrid.push(cor);
    const div = document.createElement("div");
    div.classList.add("quadrado");
    div.style.backgroundColor = cor.corHex;
    div.dataset.cor = cor.nome;
    div.addEventListener("click", () => verificarClique(div));
    gridElement.appendChild(div);
  }
}

function escolherNovaCor() {
  const corSorteada = coresAtuaisNoGrid[Math.floor(Math.random() * coresAtuaisNoGrid.length)];
  corAlvo = corSorteada;
  corAlvoElement.textContent = corAlvo.nome;
}

function verificarClique(div) {
  const corClicada = div.dataset.cor;
  if (corClicada === corAlvo.nome) {
    pontuacao += 10;
  } else {
    pontuacao -= 5;
    if (pontuacao < 0) pontuacao = 0;
  }
  atualizarPontuacao();
  criarGrid();
  escolherNovaCor();
}

function fimDoJogo() {
  document.getElementById("jogo").classList.add("escondido");
  document.getElementById("resultado").classList.remove("escondido");
  const nome = nomeJogadorInput.value;
  nomeFinal.textContent = nome;
  pontuacaoFinal.textContent = pontuacao;

  salvarRanking(nome, pontuacao);
  atualizarRanking();
}

function reiniciarJogo() {
  document.getElementById("resultado").classList.add("escondido");
  document.getElementById("entradaJogador").classList.remove("escondido");
  nomeJogadorInput.value = "";
}

function salvarRanking(nome, pontos) {
  const ranking = JSON.parse(localStorage.getItem("rankingCores")) || [];
  ranking.push({ nome: nome, pontos: pontos });
  ranking.sort((a, b) => b.pontos - a.pontos);
  const top5 = ranking.slice(0, 5);
  localStorage.setItem("rankingCores", JSON.stringify(top5));
}

function atualizarRanking() {
  const lista = document.getElementById("listaRanking");
  lista.innerHTML = "";
  const ranking = JSON.parse(localStorage.getItem("rankingCores")) || [];

  ranking.forEach((jogador) => {
    const item = document.createElement("li");
    item.textContent = `${jogador.nome} - ${jogador.pontos} pts`;
    lista.appendChild(item);
  });
}
