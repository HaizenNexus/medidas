

const AudioFX = (() => {
  let ctx = null;
  let enabled = true;

  function getCtx() {
    if (!ctx) {
      try {
        ctx = new (window.AudioContext || window.webkitAudioContext)();
      } catch { enabled = false; }
    }
    return ctx;
  }

  function beep({ freq = 440, type = "sine", duration = 0.15, volume = 0.3, decay = 0.1 } = {}) {
    if (!enabled) return;
    const ac = getCtx();
    if (!ac) return;

    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.connect(gain);
    gain.connect(ac.destination);

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ac.currentTime);
    gain.gain.setValueAtTime(volume, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + duration);

    osc.start(ac.currentTime);
    osc.stop(ac.currentTime + duration);
  }

  function chord(freqs, opts = {}) {
    freqs.forEach(f => beep({ ...opts, freq: f }));
  }

  const sounds = {
    correct() {
      beep({ freq: 523, type: "sine", duration: 0.12, volume: 0.25 });
      setTimeout(() => beep({ freq: 659, type: "sine", duration: 0.15, volume: 0.25 }), 80);
      setTimeout(() => beep({ freq: 784, type: "sine", duration: 0.2, volume: 0.25 }), 160);
    },
    wrong() {
      beep({ freq: 220, type: "sawtooth", duration: 0.25, volume: 0.2 });
      setTimeout(() => beep({ freq: 180, type: "sawtooth", duration: 0.25, volume: 0.15 }), 120);
    },
    slash() {
      beep({ freq: 800, type: "square", duration: 0.06, volume: 0.15 });
      setTimeout(() => beep({ freq: 1200, type: "square", duration: 0.04, volume: 0.1 }), 30);
    },
    levelUp() {
      [523, 659, 784, 1047].forEach((f, i) =>
        setTimeout(() => beep({ freq: f, duration: 0.15, volume: 0.3 }), i * 100)
      );
    },
    gameOver() {
      [440, 349, 277, 220].forEach((f, i) =>
        setTimeout(() => beep({ freq: f, type: "sawtooth", duration: 0.3, volume: 0.25 }), i * 180)
      );
    },
    start() {
      [330, 440, 550, 660].forEach((f, i) =>
        setTimeout(() => beep({ freq: f, duration: 0.12, volume: 0.2 }), i * 70)
      );
    },
    newRecord() {
      const seq = [784, 880, 988, 1047, 1175];
      seq.forEach((f, i) =>
        setTimeout(() => beep({ freq: f, duration: 0.18, volume: 0.3 }), i * 90)
      );
    },
    ui() {
      beep({ freq: 660, type: "sine", duration: 0.08, volume: 0.15 });
    },
  };

  function toggle() { enabled = !enabled; return enabled; }
  function isEnabled() { return enabled; }

  return { ...sounds, toggle, isEnabled };
})();
