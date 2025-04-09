const isRecentlyPlayed = (player, recentMatches) => {
  for (let match of recentMatches.slice(-2)) {
    if (match.includes(player.Name)) {
      return true;
    }
  }
  return false;
};

const isValidPair = (p1, p2, allowSpecialPatterns = false) => {
  const gradePair = [p1.Grade, p2.Grade].sort().join("+");

  const validPairs = ["A+A", "B+B", "S+B", "A+C"];
  const invalidPairs = ["S+A", "S+C"];

  if (allowSpecialPatterns) {
    return (
      gradePair === "S+S" ||
      gradePair === "A+S" ||
      validPairs.includes(gradePair) ||
      p1.Grade === p2.Grade
    );
  }

  if (invalidPairs.includes(gradePair)) return false;
  return validPairs.includes(gradePair) || p1.Grade === p2.Grade;
};

const isMixedGenderValid = (group) => {
  const genders = group.map((p) => p.Gender);
  const team1 = genders.slice(0, 2);
  const team2 = genders.slice(2, 4);

  const isMF = (team) => team.includes("M") && team.includes("F");
  const isFF = (team) => team.every((g) => g === "F");

  return (isMF(team1) && isMF(team2)) || (isFF(team1) && isFF(team2));
};

export function generateMatch(players, recentMatches, options = {}) {
  const {
    allowSpecialPatterns = false,
    allowMixedGender = false,
    advancedOption = false,
  } = options;

  let pool = players;

  if (advancedOption) {
    // Force only S and A players, ignore Active, recent, etc.
    pool = players.filter((p) => p.Grade === "S" || p.Grade === "A");
  } else if (!(allowSpecialPatterns || allowMixedGender)) {
    pool = players.filter(
      (p) =>
        (p.Active === true || p.Active === "TRUE") &&
        !isRecentlyPlayed(p, recentMatches)
    );

    if (pool.length < 4) {
      players.forEach((p) => {
        p.Active = true;
      });

      pool = players.filter(
        (p) =>
          (p.Active === true || p.Active === "TRUE") &&
          !isRecentlyPlayed(p, recentMatches)
      );
    }
  }

  const eligible = [...pool].sort(
    (a, b) =>
      advancedOption
        ? 0 // ignore Games Played sorting
        : parseInt(a["Games Played"]) - parseInt(b["Games Played"])
  );

  const validPairs = [];
  for (let i = 0; i < eligible.length; i++) {
    for (let j = i + 1; j < eligible.length; j++) {
      const p1 = eligible[i];
      const p2 = eligible[j];

      if (p1.Name === p2.Name) continue;
      if (isValidPair(p1, p2, allowSpecialPatterns || advancedOption)) {
        validPairs.push([p1, p2]);
      }
    }
  }

  // Shuffle all valid pairs to randomize
  for (let i = validPairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [validPairs[i], validPairs[j]] = [validPairs[j], validPairs[i]];
  }

  // 1?? Try prioritize S+S vs S+S first
  const sGradePairs = validPairs.filter(
    ([a, b]) => a.Grade === "S" && b.Grade === "S"
  );

  for (let i = 0; i < sGradePairs.length; i++) {
    for (let j = 0; j < sGradePairs.length; j++) {
      if (i === j) continue;
      const [p1a, p1b] = sGradePairs[i];
      const [p2a, p2b] = sGradePairs[j];

      const names = [p1a.Name, p1b.Name, p2a.Name, p2b.Name];
      if (new Set(names).size === 4) {
        return [p1a, p1b, p2a, p2b];
      }
    }
  }

  // 2?? If not enough S+S, try all other valid randomized combos
  for (let i = 0; i < validPairs.length; i++) {
    for (let j = 0; j < validPairs.length; j++) {
      if (i === j) continue;
      const [p1a, p1b] = validPairs[i];
      const [p2a, p2b] = validPairs[j];

      const names = [p1a.Name, p1b.Name, p2a.Name, p2b.Name];
      if (new Set(names).size !== 4) continue;

      const match = [p1a, p1b, p2a, p2b];
      if (allowMixedGender && !isMixedGenderValid(match)) continue;

      return match;
    }
  }

  return null;
}
