export function generateMatch(players, matchHistory, options = {}) {
  const {
    allowSpecialPatterns = false,
    allowMixedGender = false,
  } = options;

  const clone = (obj) => JSON.parse(JSON.stringify(obj));

  const activePlayers = players.filter((p) => p.Active === true || p.Active === "TRUE");

  const gradePriority = ["S", "A", "B", "C"];
  const groupBy = (arr, key) => arr.reduce((acc, obj) => {
    const val = obj[key];
    acc[val] = acc[val] || [];
    acc[val].push(obj);
    return acc;
  }, {});

  const getLastMatchPlayers = () => {
    if (matchHistory.length === 0) return [];
    const lastMatch = matchHistory[matchHistory.length - 1];
    return lastMatch || [];
  };

  const lastMatchPlayers = getLastMatchPlayers();

  const isBackToBack = (team) => {
    return team.some(p => lastMatchPlayers.includes(p.Name));
  };

  const allCombos = [];

  for (let i = 0; i < activePlayers.length; i++) {
    for (let j = i + 1; j < activePlayers.length; j++) {
      for (let k = 0; k < activePlayers.length; k++) {
        for (let l = k + 1; l < activePlayers.length; l++) {
          const team1 = [activePlayers[i], activePlayers[j]];
          const team2 = [activePlayers[k], activePlayers[l]];

          const names = new Set([...team1.map(p => p.Name), ...team2.map(p => p.Name)]);
          if (names.size < 4) continue;

          const team = [...team1, ...team2];

          if (allowSpecialPatterns) {
            const allS = team.every(p => p.Grade === "S");
            if (!allS) continue;
          }

          if (allowMixedGender) {
            const team1M = team1.filter(p => p.Gender === "M").length;
            const team1F = team1.filter(p => p.Gender === "F").length;
            const team2M = team2.filter(p => p.Gender === "M").length;
            const team2F = team2.filter(p => p.Gender === "F").length;

            if (!(team1M === 1 && team1F === 1 && team2M === 1 && team2F === 1)) {
              continue;
            }
          }

          const combo = { team1, team2, team };

          // B2B check
          if (isBackToBack(team)) {
            combo.skipReason = "B2B";
          }

          allCombos.push(combo);
        }
      }
    }
  }

  if (allCombos.length === 0) return null;

  // Filter non-B2B options first
  const nonB2BCombos = allCombos.filter(c => !c.skipReason);
  const chosen = nonB2BCombos.length > 0
    ? nonB2BCombos[Math.floor(Math.random() * nonB2BCombos.length)]
    : allCombos[Math.floor(Math.random() * allCombos.length)];

  if (chosen.skipReason === "B2B") {
    console.log("⚠️ No non-B2B matches available. Using a B2B match as fallback.");
  }

  return chosen.team;
}
