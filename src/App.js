import React, { useState, useEffect } from "react";
import "./App.css";
import PlayerList from "./components/PlayerList";
import CSVImporterExporter from "./components/CSVImporterExporter";
import PlayerEntryAndMatchTools from "./components/PlayerEntryAndMatchTools";
import AdvancedOptions from "./components/AdvancedOptions";
import { generateMatch } from "./utils/generateMatch";

function App() {
  const [players, setPlayers] = useState(() => {
    const savedPlayers = localStorage.getItem("players");
    return savedPlayers ? JSON.parse(savedPlayers) : [];
  });
  const [generatedMatches, setGeneratedMatches] = useState(() => {
    const savedMatches = localStorage.getItem("generatedMatches");
    return savedMatches ? JSON.parse(savedMatches) : [];
  });
  const [showUpload, setShowUpload] = useState(false);
  const [showManualAdd, setShowManualAdd] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [showPlayerList, setShowPlayerList] = useState(false);
  const [allowSpecialPatterns, setAllowSpecialPatterns] = useState(false);
  const [allowMixedGender, setAllowMixedGender] = useState(false);
  const [partyAB, setPartyAB] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);

  const [newPlayerName, setNewPlayerName] = useState("");
  const [newPlayerGrade, setNewPlayerGrade] = useState("S");
  const [newPlayerGender, setNewPlayerGender] = useState("M");

  useEffect(() => {
    localStorage.setItem("players", JSON.stringify(players));
    localStorage.setItem("generatedMatches", JSON.stringify(generatedMatches));
  }, [players, generatedMatches]);

  const generateOneMatch = () => {
    let currentPlayers = players.filter((p) => p.Resting !== true);

    let match = generateMatch(currentPlayers, generatedMatches, {
      allowSpecialPatterns,
      allowMixedGender,
      partyAB,
    });

    if (!match || match.length !== 4) {
      const activeBeforeReset = currentPlayers.filter(
        (p) => p.Active === true || p.Active === "TRUE"
      );

      if (activeBeforeReset.length < 4) {
        console.log("🔄 Not enough active players. Resetting all to active.");
        currentPlayers = currentPlayers.map((p) => ({
          ...p,
          Active: true,
          Resting: false,
        }));

        const sortedPlayers = [
          ...activeBeforeReset,
          ...currentPlayers.filter((p) => !activeBeforeReset.includes(p)),
        ];

        match = generateMatch(sortedPlayers, generatedMatches, {
          allowSpecialPatterns,
          allowMixedGender,
          partyAB,
        });
      }

      if (!match || match.length !== 4) {
        alert("❌ No valid match can be generated.");
        return;
      }
    }

    const updatedPlayers = players.map((p) =>
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
      Resting: false,
      "Games Played": 0,
    }));
    setPlayers(reset);
    setGeneratedMatches([]);

    // Clear localStorage for players and matches
    localStorage.removeItem("players");
    localStorage.removeItem("generatedMatches");

    // Log success message to the console
    console.log("✅ Local Storage cleared: players and generated matches have been reset.");
  };

  const handleDeleteMatch = (index) => {
    const matchToDelete = generatedMatches[index];
    const updatedMatches = [...generatedMatches];
    updatedMatches.splice(index, 1);
    setGeneratedMatches(updatedMatches);

    const updatedPlayers = players.map((player) => {
      if (matchToDelete.includes(player.Name)) {
        return {
          ...player,
          Active: true,
          "Games Played": Math.max(0, player["Games Played"] - 1),
        };
      }
      return player;
    });

    setPlayers(updatedPlayers);
  };

  const handleAddPlayer = () => {
    if (newPlayerName.trim() === "") {
      alert("Player name is required");
      return;
    }

    const newPlayer = {
      Name: newPlayerName.trim(),
      Grade: newPlayerGrade,
      Gender: newPlayerGender,
      Active: true,
      "Games Played": 0,
      Resting: false,
    };

    setPlayers((prevPlayers) => [...prevPlayers, newPlayer]);
    setNewPlayerName("");
    setNewPlayerGrade("S");
    setNewPlayerGender("M");
  };

  return (
    <div className="app">
      <header className="header">
        <h1>
          GSBSD Generator{" "}
          <span style={{ fontSize: "0.3em", marginLeft: "1rem", color: "#888" }}>
            v0.2.01
          </span>
        </h1>
        <br />
        <div className="button-container">
          <button onClick={() => setShowUpload(!showUpload)}>
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
      </header>

      {showUpload && (
        <div className="upload-box">
          <CSVImporterExporter onDataLoaded={setPlayers} players={players} />
        </div>
      )}

      {showManualAdd && (
        <PlayerEntryAndMatchTools
          players={players}
          setPlayers={setPlayers}
          setGeneratedMatches={setGeneratedMatches}
          newPlayerName={newPlayerName}
          setNewPlayerName={setNewPlayerName}
          newPlayerGrade={newPlayerGrade}
          setNewPlayerGrade={setNewPlayerGrade}
          newPlayerGender={newPlayerGender}
          setNewPlayerGender={setNewPlayerGender}
          handleAddPlayer={handleAddPlayer}
        />
      )}

      {showAdvancedOptions && (
        <AdvancedOptions
          allowSpecialPatterns={allowSpecialPatterns}
          setAllowSpecialPatterns={setAllowSpecialPatterns}
          allowMixedGender={allowMixedGender}
          setAllowMixedGender={setAllowMixedGender}
          partyAB={partyAB}
          setPartyAB={setPartyAB}
        />
      )}

      <div className="match-grid">
        {generatedMatches.map((match, index) => (
          <div className="match-card" key={index}>
            <div className="match-header">
              Match {index + 1}
              {deleteMode && (
                <span className="delete-button" onClick={() => handleDeleteMatch(index)}>
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
