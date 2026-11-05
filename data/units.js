

const UNITS = {
  comprimento: {
    label: "Comprimento",
    emoji: "📏",
    color: "#00d4ff",
    units: ["mm", "cm", "dm", "m", "dam", "hm", "km"],
  },
  massa: {
    label: "Massa",
    emoji: "⚖️",
    color: "#a855f7",
    units: ["mg", "g", "dag", "hg", "kg", "t"],
  },
  capacidade: {
    label: "Capacidade",
    emoji: "🧪",
    color: "#22d3ee",
    units: ["mL", "cL", "dL", "L", "daL", "hL", "kL"],
  },
  tempo: {
    label: "Tempo",
    emoji: "⏱️",
    color: "#f59e0b",
    units: ["s", "min", "h", "d", "sem"],
  },
  temperatura: {
    label: "Temperatura",
    emoji: "🌡️",
    color: "#ef4444",
    units: ["°C", "°F", "K"],
  },
};

const MISSIONS = [
  { category: "comprimento", text: "Corte as unidades de COMPRIMENTO!", duration: 20 },
  { category: "massa",       text: "Corte as unidades de MASSA!",        duration: 20 },
  { category: "capacidade",  text: "Corte as unidades de CAPACIDADE!",   duration: 20 },
  { category: "tempo",       text: "Corte as unidades de TEMPO!",        duration: 20 },
  { category: "temperatura", text: "Corte as unidades de TEMPERATURA!",  duration: 20 },
];

function buildUnitPool(missionCategory, total = 12) {
  const correct = UNITS[missionCategory].units;
  const incorrect = [];
  for (const [cat, data] of Object.entries(UNITS)) {
    if (cat !== missionCategory) incorrect.push(...data.units);
  }

  const pool = [];
  const correctCount = Math.ceil(total * 0.45);
  const incorrectCount = total - correctCount;

  for (let i = 0; i < correctCount; i++) {
    pool.push({ unit: correct[i % correct.length], isCorrect: true, category: missionCategory });
  }
  for (let i = 0; i < incorrectCount; i++) {
    const u = incorrect[Math.floor(Math.random() * incorrect.length)];

    let cat = "comprimento";
    for (const [c, d] of Object.entries(UNITS)) {
      if (d.units.includes(u)) { cat = c; break; }
    }
    pool.push({ unit: u, isCorrect: false, category: cat });
  }

  return shuffleArray(pool);
}

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
