

"use strict";

const G2 = {
  LIVES: 3,
  POINTS_CORRECT: 20,
  ANSWER_DELAY: 850,
};

let state = {
  running: false,
  paused: false,
  score: 0,
  lives: G2.LIVES,
  highScore: 0,
  isNewRecord: false,
  animId: null,
  lastTime: 0,
  selectedCategory: "comprimento",
  currentQuestion: null,
  answerLocked: false,
  correctCount: 0,
};

let canvas, ctx;
let W, H;

function $(id) {
  return document.getElementById(id);
}

function init() {
  canvas = $("game2-canvas");
  ctx = canvas.getContext("2d");
  state.highScore = Storage.getHighScore(2);
  resize();
  setupEvents();
  showOverlay("overlay-start");
  updateHUD();
  drawBackground();
}

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}

function showOverlay(id) {
  document.querySelectorAll(".game-overlay").forEach(o => o.classList.remove("active"));
  $(id)?.classList.add("active");
}

function hideOverlays() {
  document.querySelectorAll(".game-overlay").forEach(o => o.classList.remove("active"));
}

function startGame(category = state.selectedCategory) {
  const selected = category && QUESTIONS[category] ? category : "comprimento";
  AudioFX.start();
  Object.assign(state, {
    running: true,
    paused: false,
    score: 0,
    lives: G2.LIVES,
    isNewRecord: false,
    lastTime: performance.now(),
    selectedCategory: selected,
    currentQuestion: null,
    answerLocked: false,
    correctCount: 0,
  });

  hideOverlays();
  updateHUD();
  nextQuestion();
  cancelAnimationFrame(state.animId);
  state.animId = requestAnimationFrame(gameLoop);
}

function gameLoop() {
  if (!state.running || state.paused) return;
  draw();
  state.animId = requestAnimationFrame(gameLoop);
}

function updateHUD() {
  $("score2-val").textContent = state.score.toLocaleString("pt-BR");
  $("record2-val").textContent = Math.max(state.score, state.highScore).toLocaleString("pt-BR");

  const label = state.selectedCategory
    ? state.selectedCategory.charAt(0).toUpperCase() + state.selectedCategory.slice(1)
    : "Comprimento";
  $("level2-val").textContent = label;

  const livesEl = $("lives2-display");
  if (!livesEl) return;
  livesEl.innerHTML = "";
  for (let i = 0; i < G2.LIVES; i++) {
    const s = document.createElement("span");
    s.className = "life-icon" + (i >= state.lives ? " lost" : "");
    s.textContent = "❤️";
    livesEl.appendChild(s);
  }
}

function getCategoryIcon(category) {
  const icons = {
    comprimento: "📏",
    massa: "⚖️",
    capacidade: "🥛",
    tempo: "⏱️",
    temperatura: "🌡️",
    area: "📐",
    volume: "🧴",
  };
  return icons[category] || "🎯";
}

function updateQuestionPanel(q) {
  const cat = $("question-category");
  const text = $("question-text");
  const tip = $("question-tip");

  if (!q) {
    cat.textContent = "";
    text.textContent = "Escolha a categoria e comece!";
    if (tip) tip.textContent = "Clique na resposta correta.";
    return;
  }

  const categoryName = (UNITS[q.category]?.label || q.category).toUpperCase();
  cat.textContent = `${getCategoryIcon(q.category)} ${categoryName}`;
  text.textContent = q.question;
  if (tip) tip.textContent = "Escolha a resposta correta para continuar.";
}

function getRandomQuestion(category) {
  const pool = getQuestionsByCategory(category, 2);
  if (!pool.length) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

function nextQuestion() {
  if (!state.running) return;
  const q = getRandomQuestion(state.selectedCategory);
  state.currentQuestion = q;
  state.answerLocked = false;
  updateQuestionPanel(q);
  renderAnswers(q);
}

function renderAnswers(q) {
  const grid = $("answer-grid");
  if (!grid || !q) return;
  grid.innerHTML = "";

  const options = shuffleArray([...q.options]);
  options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.className = "answer-btn";
    btn.textContent = opt;
    btn.addEventListener("click", () => submitAnswer(opt, btn));
    grid.appendChild(btn);
  });
}

function submitAnswer(selectedValue, button) {
  if (!state.running || state.answerLocked || !state.currentQuestion) return;
  state.answerLocked = true;

  const isCorrect = selectedValue === state.currentQuestion.correct;
  const buttons = document.querySelectorAll(".answer-btn");

  buttons.forEach((btn) => {
    const value = btn.textContent;
    if (value === state.currentQuestion.correct) {
      btn.classList.add("correct");
    } else if (value === selectedValue && !isCorrect) {
      btn.classList.add("wrong");
    }
    btn.disabled = true;
  });

  if (isCorrect) {
    state.score += G2.POINTS_CORRECT;
    state.correctCount++;
    AudioFX.correct();
    showFeedback("✓ CORRETO!", true);
  } else {
    state.lives--;
    AudioFX.wrong();
    showFeedback("✗ ERRADO!", false);
  }

  updateHUD();

  if (state.lives <= 0) {
    setTimeout(() => endGame(), G2.ANSWER_DELAY);
    return;
  }

  setTimeout(() => {
    if (state.running) nextQuestion();
  }, G2.ANSWER_DELAY);
}

function showFeedback(text, correct, duration = 700) {
  const el = document.createElement("div");
  el.className = "feedback-correct" + (correct ? "" : " feedback-wrong");
  el.textContent = text;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), duration);
}

function endGame() {
  state.running = false;
  cancelAnimationFrame(state.animId);
  AudioFX.gameOver();
  state.isNewRecord = Storage.setHighScore(2, state.score);
  Storage.updateStats(2, state.score);

  $("result2-score").textContent = state.score.toLocaleString("pt-BR");
  $("result2-level").textContent = state.selectedCategory
    ? state.selectedCategory.charAt(0).toUpperCase() + state.selectedCategory.slice(1)
    : "Comprimento";
  $("result2-correct").textContent = state.correctCount;

  const badge = $("result2-record-badge");
  if (badge) badge.style.display = state.isNewRecord ? "inline-flex" : "none";
  if (state.isNewRecord) AudioFX.newRecord();
  showOverlay("overlay-result");
}

function togglePause() {
  if (!state.running) return;
  state.paused = !state.paused;
  $("pause2-btn-label").textContent = state.paused ? "▶ CONTINUAR" : "⏸ PAUSAR";
  if (state.paused) showOverlay("overlay-pause");
  else {
    hideOverlays();
    state.lastTime = performance.now();
    state.animId = requestAnimationFrame(gameLoop);
  }
}

function draw() {
  ctx.clearRect(0, 0, W, H);

  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, "#030710");
  grad.addColorStop(0.5, "#081826");
  grad.addColorStop(1, "#0a1428");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  const accent = getCategoryIcon(state.selectedCategory || "comprimento");
  ctx.fillStyle = "rgba(0, 212, 255, 0.08)";
  ctx.fillRect(40, 90, W - 80, H - 170);

  ctx.fillStyle = "rgba(255,255,255,0.12)";
  ctx.font = "900 42px 'Exo 2', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(accent, W / 2, H * 0.42);

  for (let i = 0; i < 18; i++) {
    const x = 40 + (i * 83) % (W - 80);
    const y = 120 + (i * 47) % (H - 220);
    ctx.fillStyle = "rgba(0, 212, 255, 0.08)";
    ctx.fillRect(x, y, 46, 46);
  }
}

function setupEvents() {
  window.addEventListener("resize", resize);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" || e.key === "p" || e.key === "P") {
      if (state.running) togglePause();
    }
  });

  document.querySelectorAll(".category-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.selectedCategory = btn.dataset.category || "comprimento";
      document.querySelectorAll(".category-btn").forEach((b) => {
        b.classList.toggle("active", b === btn);
      });
    });
  });

  $("touch-left")?.addEventListener("click", () => {
    if (!state.running) return;
    const q = state.currentQuestion;
    if (!q) return;
    const current = document.querySelectorAll(".answer-btn");
    current[0]?.click();
  });

  $("touch-right")?.addEventListener("click", () => {
    if (!state.running) return;
    const q = state.currentQuestion;
    if (!q) return;
    const current = document.querySelectorAll(".answer-btn");
    current[Math.min(1, current.length - 1)]?.click();
  });

  $("back-btn2")?.addEventListener("click", () => {
    window.location.href = "index.html";
  });
  $("pause-btn2")?.addEventListener("click", togglePause);

  $("btn-start2")?.addEventListener("click", () => startGame(state.selectedCategory));
  $("btn-restart2")?.addEventListener("click", () => startGame(state.selectedCategory));
  $("btn-home2")?.addEventListener("click", () => {
    window.location.href = "index.html";
  });
  $("btn-restart2-pause")?.addEventListener("click", () => {
    hideOverlays();
    startGame(state.selectedCategory);
  });
  $("btn-home2-pause")?.addEventListener("click", () => {
    window.location.href = "index.html";
  });
  $("btn-resume2")?.addEventListener("click", togglePause);
}

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

document.addEventListener("DOMContentLoaded", init);
