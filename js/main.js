
const MATH_SYMBOLS = [
  "📏", "⚖️", "⏱️", "🥛", "📐", "🌡️", "m", "kg", "L", "km", "g", "cm", "s",
  "°C", "m²", "m³",
];

function spawnParticle() {
  const container = document.getElementById("math-particles");
  if (!container) return;
  const el = document.createElement("span");
  el.className = "particle";
  el.textContent = MATH_SYMBOLS[Math.floor(Math.random() * MATH_SYMBOLS.length)];
  el.style.left = Math.random() * 100 + "vw";
  el.style.animationDuration = (12 + Math.random() * 18) + "s";
  el.style.animationDelay = (Math.random() * 4) + "s";
  el.style.fontSize = (12 + Math.random() * 16) + "px";
  el.style.opacity = (0.05 + Math.random() * 0.12).toFixed(2);
  container.appendChild(el);
  el.addEventListener("animationend", () => el.remove(), { once: true });
}

function startParticles() {
  for (let i = 0; i < 20; i++) setTimeout(spawnParticle, i * 200);
  setInterval(spawnParticle, 800);
}

function initStars() {
  const canvas = document.getElementById("stars-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let stars = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    stars = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.3,
      a: Math.random(),
      speed: 0.003 + Math.random() * 0.007,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
      s.a += s.speed;
      const alpha = 0.2 + 0.6 * Math.abs(Math.sin(s.a));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 212, 255, ${alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize);
  resize();
  draw();
}

function renderCredits() {
  if (typeof EQUIPE === "undefined") return;

  const container = document.getElementById("credits-team");
  if (!container) return;
  container.innerHTML = "";

  EQUIPE.desenvolvedores.forEach(d => {
    if (!d.nome) return;
    container.innerHTML += `
      <div class="credit-person">
        <span class="credit-name">${d.nome}</span>
        <span class="credit-role">${d.papel}</span>
      </div>`;
  });

  EQUIPE.colaboradores.forEach(c => {
    if (!c.nome) return;
    container.innerHTML += `
      <div class="credit-person">
        <span class="credit-name">${c.nome}</span>
        <span class="credit-role">${c.papel}</span>
      </div>`;
  });

  const extra = document.getElementById("credits-extra");
  if (extra) {
    const parts = [];
    if (EQUIPE.orientador?.nome) parts.push(`Orientação: ${EQUIPE.orientador.nome}`);
    if (EQUIPE.instituicao?.nome) parts.push(EQUIPE.instituicao.nome);
    if (EQUIPE.ano) parts.push(EQUIPE.ano);
    extra.textContent = parts.join(" · ");
  }
}

function renderStats() {
  const hs1 = Storage.getHighScore(1);
  const hs2 = Storage.getHighScore(2);
  const s1 = Storage.getStats(1);
  const s2 = Storage.getStats(2);

  const el = (id) => document.getElementById(id);
  if (el("stat-rec1")) el("stat-rec1").textContent = hs1.toLocaleString("pt-BR");
  if (el("stat-rec2")) el("stat-rec2").textContent = hs2.toLocaleString("pt-BR");
  if (el("stat-partidas")) el("stat-partidas").textContent = (s1.partidas + s2.partidas).toLocaleString("pt-BR");
}

function openModal(id) {
  const overlay = document.getElementById(id);
  if (overlay) overlay.classList.add("open");
}

function closeModal(id) {
  const overlay = document.getElementById(id);
  if (overlay) overlay.classList.remove("open");
}

function renderRecordsModal() {
  const hs1 = Storage.getHighScore(1);
  const hs2 = Storage.getHighScore(2);
  const el = (id) => document.getElementById(id);
  if (el("rec-score1")) el("rec-score1").textContent = hs1.toLocaleString("pt-BR");
  if (el("rec-score2")) el("rec-score2").textContent = hs2.toLocaleString("pt-BR");
}

function drawGame1Preview(canvas) {
  const ctx = canvas.getContext("2d");
  const W = canvas.width = canvas.offsetWidth * devicePixelRatio;
  const H = canvas.height = canvas.offsetHeight * devicePixelRatio;
  ctx.scale(devicePixelRatio, devicePixelRatio);
  const w = canvas.offsetWidth, h = canvas.offsetHeight;

  ctx.fillStyle = "#050a14";
  ctx.fillRect(0, 0, w, h);

  const units = ["km", "g", "mL", "m", "kg", "L", "s", "cm"];
  const colors = ["#00d4ff", "#a855f7", "#22d3ee", "#2563eb", "#f59e0b"];
  units.forEach((u, i) => {
    const x = 20 + (i % 4) * (w / 4);
    const y = 15 + Math.floor(i / 4) * 55 + (i % 3) * 10;
    const col = colors[i % colors.length];
    ctx.fillStyle = col + "22";
    ctx.strokeStyle = col + "66";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(x - 20, y, 44, 30, 8);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = col;
    ctx.font = `bold ${Math.min(w, 400) > 200 ? 14 : 11}px 'Exo 2', sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText(u, x + 2, y + 20);
  });

  ctx.strokeStyle = "rgba(0, 212, 255, 0.6)";
  ctx.lineWidth = 2;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(10, h * 0.6);
  ctx.quadraticCurveTo(w * 0.5, h * 0.3, w - 10, h * 0.7);
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawGame2Preview(canvas) {
  const ctx = canvas.getContext("2d");
  const W = canvas.width = canvas.offsetWidth * devicePixelRatio;
  const H = canvas.height = canvas.offsetHeight * devicePixelRatio;
  ctx.scale(devicePixelRatio, devicePixelRatio);
  const w = canvas.offsetWidth, h = canvas.offsetHeight;

  ctx.fillStyle = "#050a14";
  ctx.fillRect(0, 0, w, h);

  const laneW = w / 3;
  for (let i = 0; i < 3; i++) {
    if (i % 2 === 0) {
      ctx.fillStyle = "rgba(37,99,235,0.06)";
      ctx.fillRect(i * laneW, 0, laneW, h);
    }
  }

  ctx.strokeStyle = "rgba(255,255,255,0.1)";
  ctx.lineWidth = 1;
  ctx.setLineDash([6, 8]);
  for (let i = 1; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo(i * laneW, 0);
    ctx.lineTo(i * laneW, h);
    ctx.stroke();
  }
  ctx.setLineDash([]);

  const px = laneW * 1.5, py = h * 0.72;
  ctx.fillStyle = "#00d4ff";
  ctx.beginPath();
  ctx.roundRect(px - 10, py - 18, 20, 28, 6);
  ctx.fill();
  ctx.fillStyle = "#e2e8f0";
  ctx.beginPath();
  ctx.arc(px, py - 26, 10, 0, Math.PI * 2);
  ctx.fill();

  const gateLabels = ["100 m", "1.000 m", "10 m"];
  const gateColors = ["#64748b", "#22c55e", "#64748b"];
  gateLabels.forEach((lbl, i) => {
    const gx = i * laneW + laneW / 2;
    const gy = h * 0.2;
    const gw = laneW * 0.7;
    ctx.fillStyle = gateColors[i] + "33";
    ctx.strokeStyle = gateColors[i] + "88";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(gx - gw / 2, gy - 12, gw, 28, 6);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = gateColors[i];
    ctx.font = `bold 10px 'Exo 2', sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText(lbl, gx, gy + 5);
  });

  ctx.strokeStyle = "rgba(0,212,255,0.15)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 6; i++) {
    const sx = (i / 5) * w;
    ctx.beginPath();
    ctx.moveTo(sx, h * 0.4);
    ctx.lineTo(sx - 8, h);
    ctx.stroke();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initStars();
  startParticles();
  renderCredits();
  renderStats();

  const c1 = document.getElementById("preview1");
  const c2 = document.getElementById("preview2");
  if (c1) drawGame1Preview(c1);
  if (c2) drawGame2Preview(c2);

  document.getElementById("btn-play")?.addEventListener("click", () => {
    AudioFX.ui();
    const section = document.getElementById("game-selection");
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  document.getElementById("btn-records")?.addEventListener("click", () => {
    AudioFX.ui();
    renderRecordsModal();
    openModal("modal-records");
  });

  document.getElementById("btn-howto")?.addEventListener("click", () => {
    AudioFX.ui();
    openModal("modal-howto");
  });

  document.querySelectorAll(".modal-close, .modal-overlay").forEach(el => {
    el.addEventListener("click", (e) => {
      if (e.target === el) {
        AudioFX.ui();
        closeModal(el.closest(".modal-overlay")?.id || el.dataset.target);
      }
    });
  });

  document.querySelectorAll("[data-modal-close]").forEach(el => {
    el.addEventListener("click", () => {
      AudioFX.ui();
      closeModal(el.dataset.modalClose);
    });
  });

  document.getElementById("card-game1")?.addEventListener("click", () => {
    AudioFX.ui();
    window.location.href = "game1.html";
  });
  document.getElementById("card-game2")?.addEventListener("click", () => {
    AudioFX.ui();
    window.location.href = "game2.html";
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.querySelectorAll(".modal-overlay.open").forEach(m => m.classList.remove("open"));
    }
  });

  document.getElementById("btn-sound")?.addEventListener("click", (e) => {
    const on = AudioFX.toggle();
    e.currentTarget.textContent = on ? "🔊" : "🔇";
  });
});
