

"use strict";

const G1 = {
  LIVES: 3,
  BASE_SPEED: 1.8,
  SPEED_INCREMENT: 0.18,
  SPAWN_INTERVAL: 1400,    // ms entre spawns
  MIN_SPAWN: 500,
  MISSION_DURATION: 20,   // segundos por missão
  POINTS_CORRECT: 15,
  POINTS_COMBO_BONUS: 5,
  BLADE_LEN: 18,           // pontos na trilha do corte
  UNIT_RADIUS: 36,
};

let state = {
  running: false,
  paused: false,
  score: 0,
  lives: G1.LIVES,
  combo: 0,
  maxCombo: 0,
  level: 1,
  mission: null,
  missionTime: G1.MISSION_DURATION,
  missionIndex: 0,
  units: [],           // elementos em cena
  slashTrail: [],      // trilha de corte (pontos)
  isSlashing: false,
  lastPos: null,
  spawnTimer: 0,
  lastTime: 0,
  highScore: 0,
  isNewRecord: false,
  animId: null,
};

let canvas, ctx;
let W, H;

function $(id) { return document.getElementById(id); }

const CAT_COLORS = {
  comprimento: "#00d4ff",
  massa:       "#a855f7",
  capacidade:  "#22d3ee",
  tempo:       "#f59e0b",
  temperatura: "#ef4444",
};

function init() {
  canvas = $("game1-canvas");
  ctx = canvas.getContext("2d");
  state.highScore = Storage.getHighScore(1);
  resize();
  setupEvents();
  showOverlay("overlay-start");
  updateHUD();
}

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}

function showOverlay(id) {
  document.querySelectorAll(".game-overlay").forEach(o => o.classList.remove("active"));
  const el = $(id);
  if (el) el.classList.add("active");
}

function hideOverlays() {
  document.querySelectorAll(".game-overlay").forEach(o => o.classList.remove("active"));
}

function startGame() {
  AudioFX.start();
  Object.assign(state, {
    running: true, paused: false,
    score: 0, lives: G1.LIVES, combo: 0, maxCombo: 0, level: 1,
    units: [], slashTrail: [], isSlashing: false, lastPos: null,
    spawnTimer: 0, lastTime: performance.now(),
    missionIndex: 0, missionTime: G1.MISSION_DURATION,
    isNewRecord: false,
  });
  state.mission = nextMission();
  hideOverlays();
  updateHUD();
  updateMissionBanner();
  $("mission-timer-fill").style.width = "100%";
  cancelAnimationFrame(state.animId);
  state.animId = requestAnimationFrame(gameLoop);
}

function nextMission() {
  const missions = shuffleArray([...MISSIONS]);
  return missions[state.missionIndex % missions.length];
}

function advanceMission() {
  state.missionIndex++;
  state.mission = nextMission();
  state.missionTime = G1.MISSION_DURATION;
  state.level++;
  updateMissionBanner();
  AudioFX.levelUp();
}

function updateMissionBanner() {
  const banner = $("mission-banner");
  const txt = $("mission-text");
  const goalText = $("mission-goal-text");
  if (!state.mission) return;
  const cat = UNITS[state.mission.category];
  const preview = UNITS[state.mission.category].units.slice(0, 5).join(" • ");

  txt.textContent = state.mission.text;
  txt.style.color = cat.color;
  banner.style.borderColor = cat.color + "66";
  goalText.textContent = `${cat.emoji} Corte somente: ${preview}`;
  goalText.style.color = cat.color;
  banner.classList.remove("mission-animate");
  void banner.offsetWidth;
  banner.classList.add("mission-animate");
}

function spawnUnit() {
  if (!state.mission) return;
  const pool = buildUnitPool(state.mission.category, 10);
  const data = pool[Math.floor(Math.random() * pool.length)];
  const cat = UNITS[data.category];

  const unit = {
    x: G1.UNIT_RADIUS + Math.random() * (W - G1.UNIT_RADIUS * 2),
    y: -G1.UNIT_RADIUS,
    vx: (Math.random() - 0.5) * 1.5,
    vy: G1.BASE_SPEED + state.level * G1.SPEED_INCREMENT + Math.random() * 1.2,
    r: G1.UNIT_RADIUS,
    label: data.unit,
    isCorrect: data.isCorrect,
    category: data.category,
    color: cat.color,
    rotation: (Math.random() - 0.5) * 0.08,
    angle: Math.random() * Math.PI * 2,
    alive: true,

    cut: false,
    cutTime: 0,
    cutVx: 0, cutVy: 0,

    wobble: Math.random() * Math.PI * 2,
    wobbleSpeed: 0.05 + Math.random() * 0.03,
  };
  state.units.push(unit);
}

function checkSlash(x, y, px, py) {
  if (!state.running || state.paused) return;
  state.units.forEach(u => {
    if (!u.alive || u.cut) return;

    if (segmentIntersectsCircle(px, py, x, y, u.x, u.y, u.r)) {
      cutUnit(u, x, y);
    }
  });
}

function segmentIntersectsCircle(ax, ay, bx, by, cx, cy, r) {
  const dx = bx - ax, dy = by - ay;
  const fx = ax - cx, fy = ay - cy;
  const a = dx * dx + dy * dy;
  if (a < 0.001) return Math.hypot(fx, fy) <= r;
  const b = 2 * (fx * dx + fy * dy);
  const c = fx * fx + fy * fy - r * r;
  let disc = b * b - 4 * a * c;
  if (disc < 0) return false;
  disc = Math.sqrt(disc);
  const t1 = (-b - disc) / (2 * a);
  const t2 = (-b + disc) / (2 * a);
  return (t1 >= 0 && t1 <= 1) || (t2 >= 0 && t2 <= 1) ||
         (t1 < 0 && t2 > 1);
}

function cutUnit(u, x, y) {
  u.alive = false;
  u.cut = true;
  u.cutTime = 0;
  u.cutVx = (Math.random() - 0.5) * 4;
  u.cutVy = -3 - Math.random() * 2;

  if (u.isCorrect) {
    state.combo++;
    if (state.combo > state.maxCombo) state.maxCombo = state.combo;
    const bonus = state.combo > 2 ? (state.combo - 2) * G1.POINTS_COMBO_BONUS : 0;
    state.score += G1.POINTS_CORRECT + bonus;
    AudioFX.correct();
    showCombo(state.combo);
    showFloatingScore(u.x, u.y, G1.POINTS_CORRECT + bonus, true);
    flashScreen("rgba(0, 212, 255, 0.08)");
  } else {
    state.combo = 0;
    loseLife();
    AudioFX.wrong();
    showFloatingScore(u.x, u.y, "✗", false);
    flashScreen("rgba(239, 68, 68, 0.12)");
  }

  AudioFX.slash();
  updateHUD();
}

function loseLife() {
  state.lives--;
  updateHUD();
  if (state.lives <= 0) endGame();
}

function updateHUD() {
  $("score-val").textContent = state.score.toLocaleString("pt-BR");
  $("record-val").textContent = Math.max(state.score, state.highScore).toLocaleString("pt-BR");

  const livesEl = $("lives-display");
  if (!livesEl) return;
  livesEl.innerHTML = "";
  for (let i = 0; i < G1.LIVES; i++) {
    const span = document.createElement("span");
    span.className = "life-icon" + (i >= state.lives ? " lost" : "");
    span.textContent = "❤️";
    livesEl.appendChild(span);
  }
}

function endGame() {
  state.running = false;
  cancelAnimationFrame(state.animId);
  AudioFX.gameOver();
  state.isNewRecord = Storage.setHighScore(1, state.score);
  Storage.updateStats(1, state.score);

  $("result-score").textContent = state.score.toLocaleString("pt-BR");
  $("result-combo").textContent = state.maxCombo;
  const badge = $("result-record-badge");
  if (badge) badge.style.display = state.isNewRecord ? "inline-flex" : "none";
  if (state.isNewRecord) AudioFX.newRecord();

  showOverlay("overlay-result");
}

function togglePause() {
  if (!state.running) return;
  state.paused = !state.paused;
  $("pause-btn-label").textContent = state.paused ? "▶ CONTINUAR" : "⏸ PAUSAR";
  if (state.paused) {
    showOverlay("overlay-pause");
  } else {
    hideOverlays();
    state.lastTime = performance.now();
    state.animId = requestAnimationFrame(gameLoop);
  }
}

function gameLoop(timestamp) {
  if (state.paused) return;
  const dt = Math.min((timestamp - state.lastTime) / 1000, 0.1);
  state.lastTime = timestamp;

  update(dt);
  draw();

  if (state.running) state.animId = requestAnimationFrame(gameLoop);
}

function update(dt) {

  state.missionTime -= dt;
  const pct = Math.max(0, state.missionTime / G1.MISSION_DURATION);
  $("mission-timer-fill").style.width = (pct * 100) + "%";
  if (state.missionTime <= 0) advanceMission();

  state.spawnTimer -= dt * 1000;
  const interval = Math.max(G1.MIN_SPAWN, G1.SPAWN_INTERVAL - state.level * 60);
  if (state.spawnTimer <= 0) {
    spawnUnit();
    state.spawnTimer = interval;
  }

  state.units = state.units.filter(u => {
    if (u.cut) {
      u.cutTime += dt;
      u.x += u.cutVx;
      u.y += u.cutVy;
      u.cutVy += 6 * dt; // gravidade para os fragmentos
      return u.cutTime < 0.6;
    }
    u.x += u.vx;
    u.y += u.vy * (1 + state.level * 0.04);
    u.angle += u.rotation;
    u.wobble += u.wobbleSpeed;

    if (u.y > H + u.r * 2) {

      if (u.isCorrect) state.combo = 0;
      return false;
    }
    return true;
  });

  state.slashTrail = state.slashTrail.filter(p => {
    p.life -= dt * 6;
    return p.life > 0;
  });
}

function draw() {
  ctx.clearRect(0, 0, W, H);

  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, "#050a14");
  grad.addColorStop(1, "#080d1e");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  drawGrid();

  state.units.forEach(u => drawUnit(u));

  drawSlashTrail();
}

function drawGrid() {
  ctx.strokeStyle = "rgba(0, 212, 255, 0.03)";
  ctx.lineWidth = 1;
  const step = 60;
  for (let x = 0; x < W; x += step) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }
  for (let y = 0; y < H; y += step) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }
}

function drawUnit(u) {
  ctx.save();
  ctx.translate(u.x, u.y);
  ctx.rotate(u.angle);

  const alpha = u.cut ? Math.max(0, 1 - u.cutTime * 1.8) : 1;
  ctx.globalAlpha = alpha;

  const wobbleOffset = Math.sin(u.wobble) * 2;
  const r = u.r + wobbleOffset;

  ctx.shadowColor = u.color;
  ctx.shadowBlur = u.isCorrect ? 16 : 6;

  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  const bgGrad = ctx.createRadialGradient(0, -4, 0, 0, 0, r);
  bgGrad.addColorStop(0, u.color + "30");
  bgGrad.addColorStop(1, u.color + "08");
  ctx.fillStyle = bgGrad;
  ctx.fill();

  ctx.strokeStyle = u.isCorrect ? u.color + "cc" : u.color + "44";
  ctx.lineWidth = u.isCorrect ? 2 : 1.5;
  ctx.stroke();

  if (u.isCorrect) {
    ctx.beginPath();
    ctx.arc(0, 0, r * 1.15, 0, Math.PI * 2);
    ctx.strokeStyle = u.color + "bb";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, r * 0.75, 0, Math.PI * 2);
    ctx.strokeStyle = u.color + "22";
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  ctx.shadowBlur = 0;

  const fontSize = Math.min(r * 0.65, 22);
  ctx.font = `bold ${fontSize}px 'Exo 2', sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = u.isCorrect ? u.color : u.color + "88";
  ctx.fillText(u.label, 0, 0);

  if (u.cut) {
    ctx.strokeStyle = u.color;
    ctx.lineWidth = 2;
    for (let i = 0; i < 3; i++) {
      const angle = (i / 3) * Math.PI * 2 + u.cutTime * 3;
      const dist = r * (0.5 + u.cutTime * 2);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(angle) * dist, Math.sin(angle) * dist);
      ctx.stroke();
    }
  }

  ctx.restore();
}

function drawSlashTrail() {
  if (state.slashTrail.length < 2) return;
  ctx.save();
  for (let i = 1; i < state.slashTrail.length; i++) {
    const p0 = state.slashTrail[i - 1];
    const p1 = state.slashTrail[i];
    const life = Math.min(p0.life, p1.life);
    ctx.strokeStyle = `rgba(255, 255, 255, ${life * 0.8})`;
    ctx.lineWidth = life * 4;
    ctx.lineCap = "round";
    ctx.shadowColor = "rgba(0, 212, 255, 0.8)";
    ctx.shadowBlur = life * 8;
    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    ctx.lineTo(p1.x, p1.y);
    ctx.stroke();
  }
  ctx.restore();
}

function showFloatingScore(x, y, value, correct) {
  const el = document.createElement("div");
  el.style.cssText = `
    position: fixed;
    left: ${x}px; top: ${y}px;
    transform: translate(-50%, -50%);
    font-family: 'Exo 2', sans-serif;
    font-size: ${correct ? "1.4rem" : "1.2rem"};
    font-weight: 900;
    color: ${correct ? "#00d4ff" : "#ef4444"};
    text-shadow: 0 0 12px ${correct ? "#00d4ff" : "#ef4444"};
    pointer-events: none;
    z-index: 30;
    animation: floatScore 0.8s ease-out forwards;
  `;
  el.textContent = correct ? `+${value}` : "✗";
  document.body.appendChild(el);

  if (!document.getElementById("float-style")) {
    const s = document.createElement("style");
    s.id = "float-style";
    s.textContent = `
      @keyframes floatScore {
        0%   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        100% { opacity: 0; transform: translate(-50%, -150%) scale(1.3); }
      }`;
    document.head.appendChild(s);
  }
  setTimeout(() => el.remove(), 800);
}

function showCombo(n) {
  if (n < 2) return;
  const el = $("combo-display");
  el.innerHTML = `<div class="combo-text">${n}× COMBO!</div>`;
  el.style.opacity = "1";
  setTimeout(() => { el.style.opacity = "0"; }, 700);
}

function flashScreen(color) {
  const overlay = $("flash-overlay");
  overlay.style.background = color;
  overlay.style.opacity = "1";
  requestAnimationFrame(() => {
    overlay.style.transition = "opacity 0.3s";
    overlay.style.opacity = "0";
    setTimeout(() => { overlay.style.transition = ""; }, 300);
  });
}

function setupEvents() {
  window.addEventListener("resize", resize);

  canvas.addEventListener("mousedown", e => {
    state.isSlashing = true;
    state.lastPos = { x: e.clientX, y: e.clientY };
    addTrailPoint(e.clientX, e.clientY);
  });
  canvas.addEventListener("mousemove", e => {
    if (!state.isSlashing || state.paused) return;
    const x = e.clientX, y = e.clientY;
    const lp = state.lastPos;
    if (lp) checkSlash(x, y, lp.x, lp.y);
    addTrailPoint(x, y);
    state.lastPos = { x, y };
  });
  canvas.addEventListener("mouseup", () => { state.isSlashing = false; state.lastPos = null; });
  canvas.addEventListener("mouseleave", () => { state.isSlashing = false; state.lastPos = null; });

  canvas.addEventListener("touchstart", e => {
    e.preventDefault();
    const t = e.changedTouches[0];
    state.isSlashing = true;
    state.lastPos = { x: t.clientX, y: t.clientY };
    addTrailPoint(t.clientX, t.clientY);
  }, { passive: false });
  canvas.addEventListener("touchmove", e => {
    e.preventDefault();
    if (state.paused) return;
    const t = e.changedTouches[0];
    const x = t.clientX, y = t.clientY;
    const lp = state.lastPos;
    if (lp) checkSlash(x, y, lp.x, lp.y);
    addTrailPoint(x, y);
    state.lastPos = { x, y };
  }, { passive: false });
  canvas.addEventListener("touchend", () => { state.isSlashing = false; state.lastPos = null; });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape" || e.key === "p" || e.key === "P") {
      if (state.running) togglePause();
    }
  });

  $("pause-btn")?.addEventListener("click", togglePause);
  $("back-btn")?.addEventListener("click", () => { window.location.href = "index.html"; });

  $("btn-start")?.addEventListener("click", startGame);
  $("btn-restart")?.addEventListener("click", startGame);
  $("btn-home")?.addEventListener("click", () => { window.location.href = "index.html"; });
  $("btn-restart-pause")?.addEventListener("click", () => { hideOverlays(); startGame(); });
  $("btn-home-pause")?.addEventListener("click", () => { window.location.href = "index.html"; });
  $("btn-resume")?.addEventListener("click", togglePause);
}

function addTrailPoint(x, y) {
  state.slashTrail.push({ x, y, life: 1 });
  if (state.slashTrail.length > G1.BLADE_LEN) state.slashTrail.shift();
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
