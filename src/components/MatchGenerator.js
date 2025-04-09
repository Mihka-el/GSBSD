// src/components/MatchGenerator.js

import React from "react";

const MatchGenerator = ({ matches, players, DEMO_MODE }) => {
  if (!Array.isArray(matches) || !Array.isArray(players)) {
    return <p>No match history available.</p>;
  }

  return (
    <div className="history">
      <h3>📜 Match History</h3>
      <ol>
        {matches.map((match, idx) => {
          const team1 = match.slice(0, 2).map((name) => {
            const p = players.find((pl) => pl.Name === name);
            return DEMO_MODE && p ? `[${p.Grade}] ${p.Name}` : name;
          }).join(", ");
          const team2 = match.slice(2, 4).map((name) => {
            const p = players.find((pl) => pl.Name === name);
            return DEMO_MODE && p ? `[${p.Grade}] ${p.Name}` : name;
          }).join(", ");
          return <li key={idx}>Match {idx + 1}: {team1} vs {team2}</li>;
        })}
      </ol>
    </div>
  );
};

export default MatchGenerator;
