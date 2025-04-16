// components/PlayerEntryAndMatchTools.js
import React from "react";
import ManualGameAdd from "./ManualGameAdd";

export default function ManualTools({
  players,
  setPlayers,
  setGeneratedMatches,
  newPlayerName,
  setNewPlayerName,
  newPlayerGrade,
  setNewPlayerGrade,
  newPlayerGender,
  setNewPlayerGender,
  handleAddPlayer,
}) {
  return (
    <div style={{ padding: "10px" }}>
      <div
        style={{
          display: "flex",
          gap: "20px",
          alignItems: "stretch",
        }}
      >
        {/* Manual Match Section */}
        <div
          className="manual-match-section"
          style={{
            flex: 1,
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            boxSizing: "border-box",
          }}
        >
          <h3>Add New Match</h3>
          <ManualGameAdd
            players={players}
            setPlayers={setPlayers}
            setGeneratedMatches={setGeneratedMatches}
          />
        </div>

        {/* Add New Player Section */}
        <div
          className="player-addition"
          style={{
            flex: 1,
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            boxSizing: "border-box",
          }}
        >
          <h3>Add New Player</h3>
          <input
            type="text"
            placeholder="Player Name"
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
          />
          <select
            value={newPlayerGrade}
            onChange={(e) => setNewPlayerGrade(e.target.value)}
          >
            <option value="S">S</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
          </select>
          <select
            value={newPlayerGender}
            onChange={(e) => setNewPlayerGender(e.target.value)}
          >
            <option value="M">M</option>
            <option value="F">F</option>
          </select>
          <button onClick={handleAddPlayer}>➕ Player</button>
        </div>
      </div>
    </div>
  );
}
