import React, { useState } from "react";
import Papa from "papaparse";
import "./App.css";
import PlayerList from "./components/PlayerList";
import { generateMatch } from "./utils/generateMatch";
import CSVUploader from "./components/CSVUploader";
import ManualGameAdd from "./components/ManualGameAdd"; // ✅ import manual add

function App() {
  const [players, setPlayers] = useState([]);
  const [generatedMatches, setGeneratedMatches] = useState([]);
  const [showPlayerList, setShowPlayerList] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showManualAdd, setShowManualAdd] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [allowSpecialPatterns, setAllowSpecialPatterns] = useState(false);
  const [allowMixedGender, setAllowMixedGender] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [newPlayerGrade, setNewPlayerGrade] = useState("S");
  const [newPlayerGender, setNewPlayerGender] = useState("M"); // Updated gender field
  const DEMO_MODE = false;

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

  const generateOneMatch = () => {
    let currentPlayers = [...players];
    let match = generateMatch(currentPlayers, generatedMatches, {
      allowSpecialPatterns,
      allowMixedGender,
    });

    if (!match || match.length !== 4) {
      const allInactive = currentPlayers.every(
        (p) => p.Active === false || p.Active === "FALSE"
      );
      if (allInactive) {
        currentPlayers = currentPlayers.map((p) => ({ ...p, Active: true }));
        match = generateMatch(currentPlayers, generatedMatches, {
          allowSpecialPatterns,
          allowMixedGender,
        });
      }

      if (!match || match.length !== 4) {
        alert("No valid match can be generated.");
        return;
      }
    }

    const updatedPlayers = currentPlayers.map((p) =>
      match.find((m) => m.Name === p.Name)
        ? {
            ...p,
            Active: false,
            "Games Played": parseInt(p["Games Played"]) + 1,
          }
        : p
    );

    setPlayers(updatedPlayers);
    setGeneratedMatches([...generatedMatches, match.map((p) => p.Name)]);
  };

  const resetPlayers = () => {
    const reset = players.map((p) => ({
      ...p,
      Active: true,
      "Games Played": 0,
    }));
    setPlayers(reset);
    setGeneratedMatches([]);
  };

  const handleDeleteMatch = (index) => {
    const updated = [...generatedMatches];
    updated.splice(index, 1);
    setGeneratedMatches(updated);
  };

  const handleAddPlayer = () => {
    if (newPlayerName.trim() === "") {
      alert("Player name is required");
      return;
    }

    const newPlayer = {
      Name: newPlayerName.trim(),
      Grade: newPlayerGrade,
      Gender: newPlayerGender, // Add gender here
      Active: true,
      "Games Played": 0,
    };

    setPlayers((prevPlayers) => [...prevPlayers, newPlayer]);
    setNewPlayerName("");
    setNewPlayerGrade("S"); // Reset grade to S
    setNewPlayerGender("M"); // Reset gender to M (Male)
  };

  return (
    <div className="app">
      <header className="header">
        <h1>
          GSBSD Generator
          <span
            style={{ fontSize: "0.3em", marginLeft: "1rem", color: "#888" }}
          >
            v0.1.00
          </span>
        </h1>
        <br />
        <div className="button-container">
          <div className="menu">
            <button
              className="upload-button"
              onClick={() => setShowUpload(!showUpload)}
            >
              {showUpload ? "Hide Upload" : "📂"}
            </button>
            <button onClick={generateOneMatch}>➕ Match</button>
            <button onClick={() => setShowManualAdd(!showManualAdd)}>
              {showManualAdd ? "Hide Manual" : "➕ Manual"}
            </button>
            <button onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}>
              ⚙️
            </button>
            <button onClick={() => setDeleteMode(!deleteMode)}>
              {deleteMode ? "🔒" : "🗑️"}
            </button>
          </div>
        </div>
      </header>

      {showUpload && (
        <div className="upload-box">
          <CSVUploader onDataLoaded={setPlayers} players={players} />
        </div>
      )}


{showManualAdd && (
  <div style={{ padding: "10px" }}>
    <div
      style={{
        display: "flex",
        gap: "20px",
        alignItems: "stretch",
      }}
    >
      {/* Manual Match Box */}
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

      {/* Add New Player Box */}
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
        <button onClick={handleAddPlayer}>➕ Add Player</button>
      </div>
    </div>
  </div>
)}






      {showAdvancedOptions && (
        <div className="advanced-options">
          <label>
            <input
              type="checkbox"
              checked={allowSpecialPatterns}
              onChange={(e) => setAllowSpecialPatterns(e.target.checked)}
            />
            Party Keras
          </label>
          <label>
            <input
              type="checkbox"
              checked={allowMixedGender}
              onChange={(e) => setAllowMixedGender(e.target.checked)}
            />
            Party Mix
          </label>
        </div>
      )}

      <div className="match-grid">
        {generatedMatches.map((match, index) => (
          <div className="match-card" key={index}>
            <div className="match-header">
              Match {index + 1}
              {deleteMode && (
                <span
                  className="delete-button"
                  onClick={() => handleDeleteMatch(index)}
                >
                  ❌
                </span>
              )}
            </div>
            <div className="teams">
              <div>
                <strong>Team 1:</strong> {match.slice(0, 2).join(", ")}
              </div>
              <div>
                <strong>Team 2:</strong> {match.slice(2, 4).join(", ")}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="actions">
        <button onClick={() => setShowPlayerList(!showPlayerList)}>
          {showPlayerList ? "Hide Player List" : "Show Player List"}
        </button>
        <button onClick={resetPlayers}>Reset Players & Logs</button>
      </div>

      {showPlayerList && (
        <PlayerList
          players={players}
          setPlayers={setPlayers}
          setGeneratedMatches={setGeneratedMatches}
        />
      )}
    </div>
  );
}

export default App;
