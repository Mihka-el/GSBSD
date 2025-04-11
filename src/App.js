// 🎮 App.js (Revamped with Card Layout)
import React, { useState } from "react";
import Papa from "papaparse";
import "./App.css";
import PlayerList from "./components/PlayerList";
import { generateMatch } from "./utils/generateMatch";

function App() {
  const [players, setPlayers] = useState([]);
  const [generatedMatches, setGeneratedMatches] = useState([]);
  const [showPlayerList, setShowPlayerList] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [allowSpecialPatterns, setAllowSpecialPatterns] = useState(false);
  const [allowMixedGender, setAllowMixedGender] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
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

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const cleaned = results.data.map((p, i) => ({
          Name: p.Name?.trim() || `Player ${i + 1}`,
          Grade: p.Grade?.trim().toUpperCase() || "C",
          Gender: p.Gender?.trim().toUpperCase() || "M",
          "Games Played": parseInt(p["Games Played"] || "0", 10),
          Active: p.Active === "TRUE" || p.Active === true,
        }));
        setPlayers(cleaned);
      },
    });
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

  return (
    <div className="app">
      <header className="header">
        <h1>
          🎮 GSBSD Match Generator
          <span
            style={{ fontSize: "0.6em", marginLeft: "1rem", color: "#888" }}
          >
            v0.1.00
          </span>
        </h1>
        <div className="menu">
          <button onClick={() => setShowUpload(!showUpload)}>
            {showUpload ? "Hide Upload" : "📂 Upload CSV"}
          </button>
          <button onClick={generateOneMatch}>➕ Match</button>
          <button onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}>
            ⚙️
          </button>
          <button onClick={() => setDeleteMode(!deleteMode)}>
            {deleteMode ? "🔒" : "🗑️"}
          </button>
        </div>
      </header>

      {showUpload && (
        <div className="upload-box">
          <input type="file" accept=".csv" onChange={handleFileUpload} />
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
