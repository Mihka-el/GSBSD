import React, { useState } from "react";
import Papa from "papaparse";
import "./App.css";
import { generateMatch } from "./utils/generateMatch";
import ManualGameAdd from "./components/ManualGameAdd";

function App() {
  const [players, setPlayers] = useState([]);
  const [generatedMatches, setGeneratedMatches] = useState([]);
  const [showPlayerList, setShowPlayerList] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [allowSpecialPatterns, setAllowSpecialPatterns] = useState(false);
  const [allowMixedGender, setAllowMixedGender] = useState(false);
  const DEMO_MODE = false;

  const getGradeColor = (grade) => {
    switch (grade) {
      case "S": return "gold";
      case "A": return "red";
      case "B": return "blue";
      case "C": return "green";
      default: return "white";
    }
  };

  const formatPlayer = (player) => {
    if (!DEMO_MODE) return player.Name;
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
          Active: p.Active === "TRUE" || p.Active === true
        }));
        setPlayers(cleaned);
      }
    });
  };

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
<h1 className="app-title">
  🎮 GSBSD Match Generator
  <span style={{ fontSize: "0.6em", marginLeft: "1rem", color: "#888" }}>
    v0.0.09
  </span>
</h1>


      {/* Match Section */}
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
        <h2>🎯 Match History</h2>
        <div className="scroll-container">
          <table className="team-table">
            <thead>
              <tr><th>Match #</th><th>Team 1</th><th>Team 2</th></tr>
            </thead>
            <tbody>
              {generatedMatches.map((match, index) => {
                const team1 = match.slice(0, 2).join(", ");
                const team2 = match.slice(2, 4).join(", ");
                return (
                  <tr key={index}>
                    <td>{`Match ${index + 1}`}</td>
                    <td>{team1}</td>
                    <td>{team2}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Controls */}
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

      {/* Match History Detail */}
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

      {/* Player List */}
      {showPlayerList && (
        <div className="preview">
          <h2>👥 Player List</h2>

          <h4 style={{ marginTop: "1rem" }}>➕ Manually Add Game</h4>
          <ManualGameAdd
  players={players}
  setPlayers={setPlayers}
  setGeneratedMatches={setGeneratedMatches}
/>


          <table className="player-table">
            <thead>
              <tr>
                {["Name", "Grade", "Gender", "Games", "Active"].map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {players.map((player, index) => (
                <tr key={index}>
                  {[formatPlayer(player), player.Grade, player.Gender, player["Games Played"], player.Active]
                    .map((val, i) => <td key={i}>{val}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;
