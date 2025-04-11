// 🎮 PlayerList.js – Compact card layout with scroll, styled as "✅ Edith F - 0"
import React from "react";
import ManualGameAdd from "./ManualGameAdd";

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
  const grades = ["S", "A", "B", "C"];

  return (
    <div className="player-list">
      <h2>👥 Player List</h2>

      <div className="manual-section">
        <h4>➕ Manually Add Game</h4>
        <ManualGameAdd
          players={players}
          setPlayers={setPlayers}
          setGeneratedMatches={setGeneratedMatches}
        />
      </div>

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
