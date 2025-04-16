export function generateMatch(players, matchHistory, options = {}) {
  // Destructure options with default values
  const {
    allowSpecialPatterns = false,
    allowMixedGender = false,
  } = options;

  // Clone function to deep clone objects (used in some parts if necessary)
  const clone = (obj) => JSON.parse(JSON.stringify(obj));

  // Filter out only active players
  const activePlayers = players.filter((p) => p.Active === true || p.Active === "TRUE");

  // Grade priority order (used to prioritize matchups)
  const gradePriority = ["S", "A", "B", "C"];

  // Helper function to group players by a specified key (e.g., Grade, Gender)
  const groupBy = (arr, key) => arr.reduce((acc, obj) => {
    const val = obj[key];
    acc[val] = acc[val] || [];
    acc[val].push(obj);
    return acc;
  }, {});

  // Get the list of players from the last match
  const getLastMatchPlayers = () => {
    if (matchHistory.length === 0) return [];
    const lastMatch = matchHistory[matchHistory.length - 1];
    return lastMatch || [];
  };

  // Store players from the last match
  const lastMatchPlayers = getLastMatchPlayers();

  // Check if the current team includes players from the last match (back-to-back)
  const isBackToBack = (team) => {
    return team.some(p => lastMatchPlayers.includes(p.Name));
  };

  // Store all possible team combinations
  const allCombos = [];

  // Nested loops to generate all possible teams
  for (let i = 0; i < activePlayers.length; i++) {
    for (let j = i + 1; j < activePlayers.length; j++) {
      for (let k = 0; k < activePlayers.length; k++) {
        for (let l = k + 1; l < activePlayers.length; l++) {
          // Form team1 and team2 from selected players
          const team1 = [activePlayers[i], activePlayers[j]];
          const team2 = [activePlayers[k], activePlayers[l]];

          // Ensure the teams have at least 4 unique players
          const names = new Set([...team1.map(p => p.Name), ...team2.map(p => p.Name)]);
          if (names.size < 4) continue;

          // Combine both teams into one array
          const team = [...team1, ...team2];

          // Check for special patterns (e.g., all S-grade players)
          if (allowSpecialPatterns) {
            const allS = team.every(p => p.Grade === "S");
            if (!allS) continue;
          }

          // Check for mixed gender teams
          if (allowMixedGender) {
            const team1M = team1.filter(p => p.Gender === "M").length;
            const team1F = team1.filter(p => p.Gender === "F").length;
            const team2M = team2.filter(p => p.Gender === "M").length;
            const team2F = team2.filter(p => p.Gender === "F").length;

            // Ensure each team has 1 male and 1 female player
            if (!(team1M === 1 && team1F === 1 && team2M === 1 && team2F === 1)) {
              continue;
            }
          }

          // Create the match combo with both teams and the full team list
          const combo = { team1, team2, team };

          // Back-to-back check
          if (isBackToBack(team)) {
            combo.skipReason = "B2B"; // Mark as back-to-back match
          }

          // Add the valid combo to the list
          allCombos.push(combo);
        }
      }
    }
  }

  // If no valid combos, return null
  if (allCombos.length === 0) return null;

  // Filter out B2B matches first
  const nonB2BCombos = allCombos.filter(c => !c.skipReason);

  // Randomly select a non-B2B combo if available, else fall back to B2B
  const chosen = nonB2BCombos.length > 0
    ? nonB2BCombos[Math.floor(Math.random() * nonB2BCombos.length)]
    : allCombos[Math.floor(Math.random() * allCombos.length)];

  // If the chosen match was B2B, log a warning
  if (chosen.skipReason === "B2B") {
    console.log("⚠️ No non-B2B matches available. Using a B2B match as fallback.");
  }

  // Return the chosen team (both teams)
  return chosen.team;
}
