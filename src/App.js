import React, { useState } from "react";
import Papa from "papaparse";
import "./App.css";

// Custom Components
import ManualGameAdd from "./components/ManualGameAdd";
import MatchTable from "./components/MatchTable";
import PlayerList from "./components/PlayerList";
import { generateMatch } from "./utils/generateMatch";

function App() {
  // 🔧 App State
  const [players, setPlayers] = useState([]);
  const [generatedMatches, setGeneratedMatches] = useState([]);
  const [showPlayerList, setShowPlayerList] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [allowSpecialPatterns, setAllowSpecialPatterns] = useState(false);
  const [allowMixedGender, setAllowMixedGender] = useState(false);
  const DEMO_MODE = true;

  // 🎨 Grade color for demo mode
  const getGradeColor = (grade) => {
    switch (grade) {
      case "S": return "gold";
      case "A": return "red";
      case "B": return "blue";
      case "C": return "green";
      default: return "white";
    }
  };

  // 🏷️ Format player display
  const formatPlayer = (player) => {
    if (!DEMO_MODE) return player.Name;
    return (
      <span style={{ color: getGradeColor(player.Grade), fontWeight: "bold" }}>
        [{player.Grade}] {player.Name}
      </span>
    );
  };

  // 📂 Upload CSV and parse players
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
          Active: p.Active === "TRUE" || p.Active === true
        }));
        setPlayers(cleaned);
      }
    });
  };

  // 🧠 Match generation logic
  const generateOneMatch = () => {
    let currentPlayers = [...players];
    let match = generateMatch(currentPlayers, generatedMatches, {
      allowSpecialPatterns,
      allowMixedGender,
    });

    if (!match || match.length !== 4) {
      const allInactive = currentPlayers.every((p) => p.Active === false || p.Active === "FALSE");
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
        ? { ...p, Active: false, "Games Played": parseInt(p["Games Played"]) + 1 }
        : p
    );

    setPlayers(updatedPlayers);
    setGeneratedMatches([...generatedMatches, match.map((p) => p.Name)]);
  };

  // 🔄 Reset all player stats and match history
  const resetPlayers = () => {
    const reset = players.map((p) => ({
      ...p,
      Active: true,
      "Games Played": 0,
    }));
    setPlayers(reset);
    setGeneratedMatches([]);
  };

  return (
    <div className="App">
      {/* 🧱 Title */}
      <h1 className="app-title">
        🎮 GSBSD Match Generator
        <span style={{ fontSize: "0.6em", marginLeft: "1rem", color: "#888" }}>
          v0.0.09
        </span>
      </h1>

      {/* 🎮 Main Controls */}
      <div className="match-section">
        <button className="secondary-btn" onClick={() => setShowUpload(!showUpload)}>
          {showUpload ? "Hide CSV Upload" : "📂 Upload CSV"}
        </button>

        {showUpload && (
          <div className="upload-box">
            <input type="file" accept=".csv" onChange={handleFileUpload} />
          </div>
        )}

        <button className="main-btn" onClick={generateOneMatch}>Generate 1 Match</button>

        <button className="secondary-btn" onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}>
          {showAdvancedOptions ? "Hide Advanced Options" : "⚙️ Advanced Options"}
        </button>

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

        {/* 📝 Match History Table */}
        <h2>🎯 Match History</h2>
        <MatchTable generatedMatches={generatedMatches} />
      </div>

      {/* 🔘 Footer Controls */}
      <div className="controls">
        <div className="toggle-btns">
          <button className="secondary-btn" onClick={() => setShowHistory(!showHistory)}>
            {showHistory ? "Hide History" : "Show History"}
          </button>
          <button className="secondary-btn" onClick={() => setShowPlayerList(!showPlayerList)}>
            {showPlayerList ? "Hide Player List" : "Show Player List"}
          </button>
          <button className="main-btn" onClick={resetPlayers}>
            Reset Players & Logs
          </button>
        </div>
      </div>

      {/* 🧾 Match History Detail */}
      {showHistory && (
        <div className="history">
          <h3>📜 Match History</h3>
          <ol>
            {generatedMatches.map((match, idx) => {
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
      )}

      {/* 👥 Player List */}
      {showPlayerList && (
        <PlayerList
          players={players}
          setPlayers={setPlayers}
          setGeneratedMatches={setGeneratedMatches}
          formatPlayer={formatPlayer}
        />
      )}
    </div>
  );
}

export default App;
