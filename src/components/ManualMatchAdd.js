// components/ManualGameAdd.js
import React, { useState } from "react";

const ManualGameAdd = ({ players, setPlayers, setGeneratedMatches }) => {
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [matchName, setMatchName] = useState(""); // Optional, for naming the match

  const handleSelectPlayer = (player) => {
    if (selectedPlayers.includes(player)) {
      setSelectedPlayers(selectedPlayers.filter((p) => p !== player));
    } else {
      setSelectedPlayers([...selectedPlayers, player]);
    }
  };

  const handleAddMatch = () => {
    if (selectedPlayers.length !== 4) {
      alert("Please select exactly 4 players for the match.");
      return;
    }

    const newMatch = selectedPlayers.map((player) => player.Name);
    setGeneratedMatches((prevMatches) => [...prevMatches, newMatch]);

    // Optionally, update the player active status or games played
    const updatedPlayers = players.map((p) =>
      selectedPlayers.find((sp) => sp.Name === p.Name)
        ? { ...p, Active: false, "Games Played": p["Games Played"] + 1 }
        : p
    );
    setPlayers(updatedPlayers);

    // Reset selected players after match is added
    setSelectedPlayers([]);
  };

  return (
    <div className="manual-game-add">
      <h4>Select Players for the Match</h4>
      <div className="player-selection">
        {players.map((player) => (
          <div key={player.Name} className="player-item">
            <input
              type="checkbox"
              checked={selectedPlayers.includes(player)}
              onChange={() => handleSelectPlayer(player)}
            />
            <span>{player.Name} - {player.Grade} - {player.Gender}</span>
          </div>
        ))}
      </div>
      <button onClick={handleAddMatch}>Add Match</button>
    </div>
  );
};

export default ManualGameAdd;
