const voInput = document.getElementById("vo");
const vsInput = document.getElementById("vs");
const somInput = document.getElementById("vSom");
const freqInput = document.getElementById("frequencia");

const dirObs = document.getElementById("dirObs");
const dirFonte = document.getElementById("dirFonte");

const resultado = document.getElementById("resultado");
const situacao = document.getElementById("situacao");
const descricao = document.getElementById("descricao");
const freqOriginal = document.getElementById("freqOriginal");
const variacao = document.getElementById("variacao");
const percentual = document.getElementById("percentual");
const erro = document.getElementById("erro");

const botaoCalcular = document.getElementById("calcular");
const botaoResetar = document.getElementById("resetar");

function formatar(numero, casas = 2) {
  return numero.toLocaleString("pt-BR", {
    minimumFractionDigits: casas,
    maximumFractionDigits: casas
  });
}

function calcularDoppler() {
  erro.textContent = "";

  const vo = Number(voInput.value);
  const vs = Number(vsInput.value);
  const v = Number(somInput.value);
  const f = Number(freqInput.value);

  // Validar entradas numéricas e fisicamente possíveis.
  const valores = [vo, vs, v, f];

  if (
    valores.some(valor => !Number.isFinite(valor)) ||
    voInput.value.trim() === "" ||
    vsInput.value.trim() === "" ||
    somInput.value.trim() === "" ||
    freqInput.value.trim() === "" ||
    vo < 0 ||
    vs < 0 ||
    v <= 0 ||
    f <= 0
  ) {
    erro.textContent =
      "Informe valores válidos. As velocidades devem ser não negativas, e a velocidade do som e a frequência devem ser positivas.";
    return;
  }

  if (vo >= v) {
    erro.textContent =
      "A velocidade do observador deve ser menor que a velocidade do som neste modelo.";
    return;
  }

  if (vs >= v) {
    erro.textContent =
      "A velocidade da fonte deve ser menor que a velocidade do som neste modelo.";
    return;
  }

  // Observador se aproximando: v + vo.
  // Observador se afastando: v - vo.
  const numerador =
    dirObs.value === "aproxima" ? v + vo : v - vo;

  // Fonte se aproximando: v - vs.
  // Fonte se afastando: v + vs.
  const denominador =
    dirFonte.value === "aproxima" ? v - vs : v + vs;

  const frequenciaPercebida = f * numerador / denominador;

  if (!Number.isFinite(frequenciaPercebida)) {
    erro.textContent = "Não foi possível calcular esse resultado.";
    return;
  }

  const diferenca = frequenciaPercebida - f;
  const porcentagem = (diferenca / f) * 100;

  resultado.textContent = formatar(frequenciaPercebida);
  freqOriginal.textContent = `${formatar(f)} Hz`;

  variacao.textContent =
    `${diferenca > 0 ? "+" : ""}${formatar(diferenca)} Hz`;

  percentual.textContent =
    `${porcentagem > 0 ? "+" : ""}${formatar(porcentagem)}%`;

  if (Math.abs(diferenca) < 0.000001) {
    situacao.textContent = "Frequência inalterada";
    descricao.textContent =
      "A frequência percebida é igual à frequência emitida.";
  } else if (diferenca > 0) {
    situacao.textContent = "Som mais agudo";
    descricao.textContent =
      "A frequência percebida é maior que a frequência emitida.";
  } else {
    situacao.textContent = "Som mais grave";
    descricao.textContent =
      "A frequência percebida é menor que a frequência emitida.";
  }
}

function restaurar() {
  voInput.value = 0;
  vsInput.value = 20;
  somInput.value = 343;
  freqInput.value = 440;

  dirObs.value = "aproxima";
  dirFonte.value = "aproxima";

  calcularDoppler();
}

botaoCalcular.addEventListener("click", calcularDoppler);
botaoResetar.addEventListener("click", restaurar);

// Recalcular automaticamente ao alterar os parâmetros.
[
  voInput,
  vsInput,
  somInput,
  freqInput,
  dirObs,
  dirFonte
].forEach(elemento => {
  elemento.addEventListener("input", calcularDoppler);
  elemento.addEventListener("change", calcularDoppler);
});

calcularDoppler();
