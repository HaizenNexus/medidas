

const Storage = (() => {
  const KEYS = {
    game1High: "math_game1_highscore",
    game2High: "math_game2_highscore",
    game1Stats: "math_game1_stats",
    game2Stats: "math_game2_stats",
  };

  function get(key) {
    try {
      const val = localStorage.getItem(key);
      return val ? JSON.parse(val) : null;
    } catch { return null; }
  }

  function set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {  }
  }

  function getHighScore(game) {
    return get(game === 1 ? KEYS.game1High : KEYS.game2High) || 0;
  }

  function setHighScore(game, score) {
    const key = game === 1 ? KEYS.game1High : KEYS.game2High;
    const current = getHighScore(game);
    if (score > current) {
      set(key, score);
      return true; // novo recorde!
    }
    return false;
  }

  function getStats(game) {
    const key = game === 1 ? KEYS.game1Stats : KEYS.game2Stats;
    return get(key) || { partidas: 0, melhorPontos: 0, totalPontos: 0 };
  }

  function updateStats(game, score) {
    const key = game === 1 ? KEYS.game1Stats : KEYS.game2Stats;
    const stats = getStats(game);
    stats.partidas++;
    stats.totalPontos += score;
    if (score > stats.melhorPontos) stats.melhorPontos = score;
    set(key, stats);
    return stats;
  }

  function resetAll() {
    Object.values(KEYS).forEach(k => localStorage.removeItem(k));
  }

  return { getHighScore, setHighScore, getStats, updateStats, resetAll };
})();
