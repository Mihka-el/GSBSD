import React, { useState } from "react";

const getGradeColor = (grade) => {
  switch (grade) {
    case "S":
      return "gold";
    case "A":
      return "red";
    case "B":
      return "blue";
    case "C":
      return "green";
    default:
      return "white";
  }
};

const formatPlayer = (player) => {
  return (
    <span style={{ color: getGradeColor(player.Grade), fontWeight: "bold" }}>
      [{player.Grade}] {player.Name}
    </span>
  );
};

const PlayerList = ({ players, setPlayers, setGeneratedMatches }) => {
  const [restingPlayers, setRestingPlayers] = useState([]);
  const [isRestButtonDisabled, setIsRestButtonDisabled] = useState(true); // Flag to disable Rest button

  const handleRestToggle = (player) => {
    // Toggle resting status
    const updatedPlayers = players.map((p) =>
      p.Name === player.Name ? { ...p, Active: !p.Active } : p
    );
    setPlayers(updatedPlayers);

    // Add/remove from restingPlayers list
    if (player.Active) {
      setRestingPlayers([...restingPlayers, player.Name]);
    } else {
      setRestingPlayers(restingPlayers.filter((name) => name !== player.Name));
    }
  };

  const grades = ["S", "A", "B", "C"];

  return (
    <div className="player-list">
      <h2>👥 Player List</h2>
      <div className="player-cards-wrapper">
        {grades.map((grade) => {
          const group = players.filter((p) => p.Grade === grade);
          if (group.length === 0) return null;
          return (
            <div key={grade} className="player-grade-card">
              <h3 style={{ color: getGradeColor(grade) }}>Grade {grade}</h3>
              <ul className="scrollable-player-list">
                {group.map((player, i) => (
                  <li key={i}>
                    {player.Active ? "✅" : "❌"} {player.Name} {player.Gender}{" "}
                    - {player["Games Played"]}
                    {/* Button will be completely hidden if isRestButtonDisabled is true */}
                    {!isRestButtonDisabled && (
                      <button
                        onClick={() => handleRestToggle(player)}
                        style={{ marginLeft: "10px" }}
                      >
                        {player.Active ? "Rest" : "Unrest"}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlayerList;
