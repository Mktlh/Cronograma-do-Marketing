// ============================================================
//  OPÇÕES DAS "PÍLULAS" (nome → cor). Edite à vontade!
//  Cores disponíveis: orange, green, pink, purple, red, blue, yellow, gray
// ============================================================
const DIAS = {
  "Segunda-Feira": "green",
  "Terça-Feira": "pink",
  "Quarta-Feira": "purple",
  "Quinta-Feira": "red",
  "Sexta-Feira": "blue",
  "Sábado": "orange",
  "Domingo": "yellow",
};

const MODOS = {
  "Reels": "orange",
  "Reels+Story": "purple",
  "Story": "pink",
  "Post": "blue",
  "Carrossel": "green",
  "Relações públicas": "gray",
};

const STATUS = {
  "": "gray",
  "Postado ✅": "green",
  "Agendado": "blue",
  "Em produção": "yellow",
  "Pendente": "red",
};

// ============================================================
//  DADOS DE EXEMPLO (os mesmos da imagem)
// ============================================================
const EXEMPLO = [
  { dia: "Sábado",        modo: "Reels",       assunto: "Detalhes das motinhas",                  part: "Ninguém", horario: "12h/18h", status: "Postado ✅", hora: "+/- 13h", resultado: "1k" },
  { dia: "Segunda-Feira", modo: "Reels",       assunto: "Detalhes das motinhas -2",               part: "Ninguém", horario: "12/18h",  status: "Postado ✅", hora: "21:20",   resultado: "1.7k" },
  { dia: "Terça-Feira",   modo: "Reels",       assunto: "Divulgação do valor das motinhas em reels", part: "Luis", horario: "12/18h",  status: "Postado ✅", hora: "14h",     resultado: "2.8k" },
  { dia: "Terça-Feira",   modo: "Reels",       assunto: "Vídeo com áudio viral",                  part: "Juliana", horario: "12/18",   status: "Postado ✅", hora: "18h",     resultado: "6.6k" },
  { dia: "Quarta-Feira",  modo: "Reels",       assunto: "Tutorial",                               part: "Luis",    horario: "12/18h",  status: "Postado ✅", hora: "16h",     resultado: "1k" },
  { dia: "Quarta-Feira",  modo: "Reels",       assunto: "Valor do Argo",                          part: "Luis",    horario: "12/18h",  status: "Postado ✅", hora: "20:16",   resultado: "1.4k" },
  { dia: "Quinta-Feira",  modo: "Reels+Story", assunto: "<b>Caixinha:</b> Qual a sua maior curiosidade sobre motos elétricas?//<b>Reels:</b> Galela", part: "Luis", horario: "12h/18h", status: "Postado ✅", hora: "", resultado: "" },
  { dia: "Segunda-Feira", modo: "Reels",       assunto: "", part: "", horario: "", status: "", hora: "", resultado: "" },
  { dia: "Segunda-Feira", modo: "Relações públicas", assunto: "Preparar os palestrantes", part: "", horario: "", status: "", hora: "", resultado: "" },
  { dia: "Segunda-Feira", modo: "Relações públicas", assunto: "Moderar a sessão de perguntas e respostas", part: "", horario: "", status: "", hora: "", resultado: "" },
];

const CHAVE = "cronograma-marketing-v1";
const tbody = document.getElementById("tbody");

let linhas = carregar();

// ---------- Salvar / carregar ----------
function carregar() {
  try {
    const salvo = localStorage.getItem(CHAVE);
    if (salvo) return JSON.parse(salvo);
  } catch (e) { /* ignora */ }
  return structuredClone(EXEMPLO);
}

function salvar() {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(linhas));
  } catch (e) { /* ignora */ }
}

// ---------- Criadores de células ----------
function criarPilula(opcoes, valor, aoMudar) {
  const sel = document.createElement("select");
  const atualizarCor = () => {
    const cor = opcoes[sel.value] || "gray";
    sel.className = "pill c-" + cor;
  };

  for (const nome of Object.keys(opcoes)) {
    const op = document.createElement("option");
    op.value = nome;
    op.textContent = nome;
    sel.appendChild(op);
  }
  sel.value = valor in opcoes ? valor : Object.keys(opcoes)[0];
  atualizarCor();

  sel.addEventListener("change", () => {
    atualizarCor();
    aoMudar(sel.value);
  });
  return sel;
}

function criarTexto(valor, aoMudar, html = false) {
  const div = document.createElement("div");
  div.className = "edit";
  div.contentEditable = "true";
  if (html) div.innerHTML = valor; else div.textContent = valor;

  div.addEventListener("input", () => {
    aoMudar(html ? div.innerHTML : div.textContent);
  });
  // Enter não quebra linha, só confirma
  div.addEventListener("keydown", (e) => {
    if (e.key === "Enter") { e.preventDefault(); div.blur(); }
  });
  return div;
}

function celula(conteudo, rotulo = "") {
  const td = document.createElement("td");
  td.dataset.label = rotulo; // usado no layout de celular
  td.appendChild(conteudo);
  return td;
}

// ---------- Desenhar a tabela ----------
function desenhar() {
  tbody.innerHTML = "";

  linhas.forEach((l, i) => {
    const tr = document.createElement("tr");
    const set = (campo) => (v) => { l[campo] = v; salvar(); };

    tr.appendChild(celula(criarPilula(DIAS, l.dia, set("dia")), "Dia da Semana"));
    tr.appendChild(celula(criarPilula(MODOS, l.modo, set("modo")), "Modo de Publicação"));
    tr.appendChild(celula(criarTexto(l.assunto, set("assunto"), true), "Assunto"));
    tr.appendChild(celula(criarTexto(l.part, set("part")), "Participante(s)"));
    tr.appendChild(celula(criarTexto(l.horario, set("horario")), "Horário de Postagem"));
    tr.appendChild(celula(criarPilula(STATUS, l.status, set("status")), "Status"));
    tr.appendChild(celula(criarTexto(l.hora, set("hora")), "Hora Postada"));
    tr.appendChild(celula(criarTexto(l.resultado, set("resultado")), "Resultado"));

    const del = document.createElement("button");
    del.type = "button";
    del.className = "del";
    del.title = "Remover linha";
    del.setAttribute("aria-label", "Remover linha");
    del.textContent = "×";
    del.addEventListener("click", () => {
      linhas.splice(i, 1);
      salvar();
      desenhar();
    });
    tr.appendChild(celula(del));

    tbody.appendChild(tr);
  });
}

// ---------- Botões ----------
document.getElementById("btn-add").addEventListener("click", () => {
  linhas.push({ dia: "Segunda-Feira", modo: "Reels", assunto: "", part: "", horario: "", status: "", hora: "", resultado: "" });
  salvar();
  desenhar();
  tbody.lastElementChild.scrollIntoView({ behavior: "smooth", block: "nearest" });
});

document.getElementById("btn-reset").addEventListener("click", () => {
  if (confirm("Isso apaga suas alterações e volta para os dados de exemplo. Continuar?")) {
    linhas = structuredClone(EXEMPLO);
    salvar();
    desenhar();
  }
});

desenhar();
