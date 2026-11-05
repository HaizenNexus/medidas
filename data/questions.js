

const QUESTIONS = {

  comprimento: [
    {
      question: "1 km equivale a quantos metros?",
      options: ["100 m", "1.000 m", "10.000 m"],
      correct: "1.000 m",
      category: "comprimento",
      difficulty: 1
    },
    {
      question: "1 metro equivale a quantos centímetros?",
      options: ["10 cm", "1.000 cm", "100 cm"],
      correct: "100 cm",
      category: "comprimento",
      difficulty: 1
    },
    {
      question: "1 cm equivale a quantos milímetros?",
      options: ["100 mm", "10 mm", "1 mm"],
      correct: "10 mm",
      category: "comprimento",
      difficulty: 1
    },
    {
      question: "500 cm equivale a quantos metros?",
      options: ["50 m", "5.000 m", "5 m"],
      correct: "5 m",
      category: "comprimento",
      difficulty: 2
    },
    {
      question: "2,5 km equivale a quantos metros?",
      options: ["250 m", "2.500 m", "25.000 m"],
      correct: "2.500 m",
      category: "comprimento",
      difficulty: 2
    },
    {
      question: "3.000 mm equivale a quantos metros?",
      options: ["30 m", "0,3 m", "3 m"],
      correct: "3 m",
      category: "comprimento",
      difficulty: 3
    },
    {
      question: "Qual é maior: 1.500 m ou 1,4 km?",
      options: ["1,4 km", "São iguais", "1.500 m"],
      correct: "1.500 m",
      category: "comprimento",
      difficulty: 3
    },
  ],

  massa: [
    {
      question: "1 kg equivale a quantos gramas?",
      options: ["100 g", "10.000 g", "1.000 g"],
      correct: "1.000 g",
      category: "massa",
      difficulty: 1
    },
    {
      question: "1 tonelada equivale a quantos quilogramas?",
      options: ["100 kg", "1.000 kg", "10.000 kg"],
      correct: "1.000 kg",
      category: "massa",
      difficulty: 1
    },
    {
      question: "500 g equivale a quantos quilogramas?",
      options: ["5 kg", "0,05 kg", "0,5 kg"],
      correct: "0,5 kg",
      category: "massa",
      difficulty: 2
    },
    {
      question: "2,5 kg equivale a quantos gramas?",
      options: ["250 g", "25.000 g", "2.500 g"],
      correct: "2.500 g",
      category: "massa",
      difficulty: 2
    },
    {
      question: "3.500 g equivale a quantos quilogramas?",
      options: ["35 kg", "0,35 kg", "3,5 kg"],
      correct: "3,5 kg",
      category: "massa",
      difficulty: 3
    },
    {
      question: "Qual é maior: 1.200 g ou 1,3 kg?",
      options: ["1.200 g", "São iguais", "1,3 kg"],
      correct: "1,3 kg",
      category: "massa",
      difficulty: 3
    },
  ],

  capacidade: [
    {
      question: "1 litro equivale a quantos mililitros?",
      options: ["10 mL", "100 mL", "1.000 mL"],
      correct: "1.000 mL",
      category: "capacidade",
      difficulty: 1
    },
    {
      question: "500 mL equivale a quantos litros?",
      options: ["5 L", "50 L", "0,5 L"],
      correct: "0,5 L",
      category: "capacidade",
      difficulty: 1
    },
    {
      question: "2 litros equivale a quantos mililitros?",
      options: ["200 mL", "20.000 mL", "2.000 mL"],
      correct: "2.000 mL",
      category: "capacidade",
      difficulty: 2
    },
    {
      question: "250 mL equivale a quantos litros?",
      options: ["2,5 L", "25 L", "0,25 L"],
      correct: "0,25 L",
      category: "capacidade",
      difficulty: 2
    },
    {
      question: "3,5 L equivale a quantos mililitros?",
      options: ["350 mL", "35.000 mL", "3.500 mL"],
      correct: "3.500 mL",
      category: "capacidade",
      difficulty: 3
    },
    {
      question: "Qual é maior: 1.500 mL ou 1,4 L?",
      options: ["1,4 L", "São iguais", "1.500 mL"],
      correct: "1.500 mL",
      category: "capacidade",
      difficulty: 3
    },
  ],

  tempo: [
    {
      question: "1 hora equivale a quantos minutos?",
      options: ["30 min", "120 min", "60 min"],
      correct: "60 min",
      category: "tempo",
      difficulty: 1
    },
    {
      question: "1 minuto equivale a quantos segundos?",
      options: ["30 s", "100 s", "60 s"],
      correct: "60 s",
      category: "tempo",
      difficulty: 1
    },
    {
      question: "1 dia equivale a quantas horas?",
      options: ["12 h", "48 h", "24 h"],
      correct: "24 h",
      category: "tempo",
      difficulty: 1
    },
    {
      question: "2,5 horas equivale a quantos minutos?",
      options: ["120 min", "200 min", "150 min"],
      correct: "150 min",
      category: "tempo",
      difficulty: 2
    },
    {
      question: "90 segundos equivale a quantos minutos?",
      options: ["9 min", "0,9 min", "1,5 min"],
      correct: "1,5 min",
      category: "tempo",
      difficulty: 2
    },
    {
      question: "1 semana equivale a quantos dias?",
      options: ["5 dias", "10 dias", "7 dias"],
      correct: "7 dias",
      category: "tempo",
      difficulty: 1
    },
    {
      question: "3 horas equivale a quantos segundos?",
      options: ["180 s", "1.800 s", "10.800 s"],
      correct: "10.800 s",
      category: "tempo",
      difficulty: 3
    },
  ],

  temperatura: [
    {
      question: "A água ferve a quantos graus Celsius?",
      options: ["50°C", "200°C", "100°C"],
      correct: "100°C",
      category: "temperatura",
      difficulty: 1
    },
    {
      question: "A água congela a quantos graus Celsius?",
      options: ["10°C", "-10°C", "0°C"],
      correct: "0°C",
      category: "temperatura",
      difficulty: 1
    },
    {
      question: "37°C é considerada a temperatura normal do corpo humano. Isso é:",
      options: ["Muito alta (febre forte)", "Normal", "Muito baixa (hipotermia)"],
      correct: "Normal",
      category: "temperatura",
      difficulty: 2
    },
    {
      question: "Qual é mais quente: 50°C ou 120°F?",
      options: ["São iguais", "50°C", "120°F"],
      correct: "120°F",
      category: "temperatura",
      difficulty: 3
    },
  ],

  area: [
    {
      question: "1 m² equivale a quantos cm²?",
      options: ["100 cm²", "10.000 cm²", "1.000 cm²"],
      correct: "10.000 cm²",
      category: "area",
      difficulty: 2
    },
    {
      question: "Um quadrado de lado 3 m tem que área?",
      options: ["6 m²", "12 m²", "9 m²"],
      correct: "9 m²",
      category: "area",
      difficulty: 2
    },
    {
      question: "1 km² equivale a quantos m²?",
      options: ["1.000 m²", "100.000 m²", "1.000.000 m²"],
      correct: "1.000.000 m²",
      category: "area",
      difficulty: 3
    },
    {
      question: "Um retângulo 4 m × 5 m tem que área?",
      options: ["18 m²", "9 m²", "20 m²"],
      correct: "20 m²",
      category: "area",
      difficulty: 2
    },
  ],

  volume: [
    {
      question: "1 m³ equivale a quantos litros?",
      options: ["100 L", "10.000 L", "1.000 L"],
      correct: "1.000 L",
      category: "volume",
      difficulty: 2
    },
    {
      question: "Um cubo de aresta 2 m tem que volume?",
      options: ["6 m³", "4 m³", "8 m³"],
      correct: "8 m³",
      category: "volume",
      difficulty: 2
    },
    {
      question: "1 cm³ equivale a quantos mililitros?",
      options: ["10 mL", "0,1 mL", "1 mL"],
      correct: "1 mL",
      category: "volume",
      difficulty: 3
    },
  ],
};

function getQuestions(maxDifficulty = 3) {
  const all = [];
  for (const cat of Object.values(QUESTIONS)) {
    for (const q of cat) {
      if (q.difficulty <= maxDifficulty) all.push(q);
    }
  }
  return all;
}

function getQuestionsByCategory(category, maxDifficulty = 3) {
  return (QUESTIONS[category] || []).filter(q => q.difficulty <= maxDifficulty);
}

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
