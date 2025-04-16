import React, { useState } from "react";

const PlayerManagement = ({ players, setPlayers }) => {
  const [isRestButtonDisabled, setIsRestButtonDisabled] = useState(true); // Flag to disable Rest button

  const toggleRest = (playerName) => {
    const updatedPlayers = players.map((p) =>
      p.name === playerName ? { ...p, rest: !p.rest } : p
    );
    setPlayers(updatedPlayers);
  };

  const groupedByGrade = players.reduce((acc, player) => {
    if (player.rest) return acc; // Skip resting players here
    if (!acc[player.grade]) {
      acc[player.grade] = [];
    }
    acc[player.grade].push(player);
    return acc;
  }, {});

  const sortedGrades = Object.keys(groupedByGrade).sort();

  const restingPlayers = players.filter((p) => p.rest);

  return (
    <div className="player-cards-wrapper">
      {sortedGrades.map((grade) => (
        <div key={grade} className="player-grade-card">
          <h3>Grade {grade}</h3>
          <ul>
            {groupedByGrade[grade]
              .sort((a, b) => (a.name || "").localeCompare(b.name || ""))
              .map((player) => (
                <li key={player.name}>
                  {player.name} ({player.gamesPlayed})
                  {!isRestButtonDisabled && ( // Only render button when isRestButtonDisabled is false
                    <button
                      onClick={() => toggleRest(player.name)}
                      style={{
                        marginLeft: "10px",
                        fontSize: "0.8rem",
                        padding: "2px 6px",
                        backgroundColor: "#333",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Rest
                    </button>
                  )}
                </li>
              ))}
          </ul>
        </div>
      ))}

      {restingPlayers.length > 0 && (
        <div className="player-grade-card">
          <h3 style={{ color: "#999" }}>Resting Players</h3>
          <ul>
            {restingPlayers
              .sort((a, b) => (a.name || "").localeCompare(b.name || ""))
              .map((player) => (
                <li key={player.name}>
                  {player.name} ({player.gamesPlayed})
                  {!isRestButtonDisabled && ( // Only render button when isRestButtonDisabled is false
                    <button
                      onClick={() => toggleRest(player.name)}
                      style={{
                        marginLeft: "10px",
                        fontSize: "0.8rem",
                        padding: "2px 6px",
                        backgroundColor: "#444",
                        color: "#ccc",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Activate
                    </button>
                  )}
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PlayerManagement;
