import React, { useState } from "react";
import Papa from "papaparse";
import "./App.css";

import PlayerList from "./components/PlayerList";
import CSVUploader from "./components/CSVUploader";
import ManualTools from "./components/ManualTools";
import MatchCard from "./components/MatchCard";
import AdvancedOptions from "./components/AdvancedOptions";

import { generateMatch } from "./utils/generateMatch";
import { getGradeColor, formatPlayer } from "./utils/playerUtils";

function App() {
  const [players, setPlayers] = useState([]);
  const [generatedMatches, setGeneratedMatches] = useState([]);
  const [showPlayerList, setShowPlayerList] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showManualAdd, setShowManualAdd] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);

  const [partyKeras, setPartyKeras] = useState(false);
  const [partyMix, setPartyMix] = useState(false);

  const [newPlayerName, setNewPlayerName] = useState("");
  const [newPlayerGrade, setNewPlayerGrade] = useState("S");
  const [newPlayerGender, setNewPlayerGender] = useState("M");

  const generateOneMatch = () => {
    let currentPlayers = [...players];
    let match = generateMatch(currentPlayers, generatedMatches, {
      allowSpecialPatterns: partyKeras,
      allowMixedGender: partyMix,
    });

    if (!match || match.length !== 4) {
      const activeBeforeReset = currentPlayers.filter(
        (p) => p.Active === true || p.Active === "TRUE"
      );

      if (activeBeforeReset.length < 4) {
        console.log("🔄 Not enough active players. Resetting all to active.");
        currentPlayers = currentPlayers.map((p) => ({ ...p, Active: true }));

        const sortedPlayers = [
          ...activeBeforeReset,
          ...currentPlayers.filter((p) => !activeBeforeReset.includes(p)),
        ];

        match = generateMatch(sortedPlayers, generatedMatches, {
          allowSpecialPatterns: partyKeras,
          allowMixedGender: partyMix,
        });
      }

      if (!match || match.length !== 4) {
        alert("❌ No valid match can be generated.");
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

const handleDeleteMatch = (index) => {
  const matchToDelete = generatedMatches[index];
  const updatedPlayers = [...players];

  // Decrement "Games Played" and reset "Active" status for players in the deleted match
  matchToDelete.forEach(playerName => {
    const playerIndex = updatedPlayers.findIndex(p => p.Name === playerName);
    if (playerIndex !== -1) {
      updatedPlayers[playerIndex] = {
        ...updatedPlayers[playerIndex],
        "Games Played": updatedPlayers[playerIndex]["Games Played"] - 1,
        Active: true, // Resetting back to active since the match was deleted
      };
    }
  });

  // Remove the match from the generated matches
  const updatedMatches = [...generatedMatches];
  updatedMatches.splice(index, 1);

  // Update the state with the new players and matches
  setPlayers(updatedPlayers);
  setGeneratedMatches(updatedMatches);
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
          GSBSD Generator
          <span style={{ fontSize: "0.3em", marginLeft: "1rem", color: "#888" }}>
            v0.2.00
          </span>
        </h1>
        <br />
        <div className="button-container">
          <div className="menu">
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
        </div>
      </header>

      {showUpload && (
        <div className="upload-box">
          <CSVUploader onDataLoaded={setPlayers} players={players} />
        </div>
      )}

      {showManualAdd && (
        <ManualTools
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
          partyKeras={partyKeras}
          setPartyKeras={setPartyKeras}
          partyMix={partyMix}
          setPartyMix={setPartyMix}
        />
      )}

      <div className="match-grid">
        {generatedMatches.map((match, index) => (
          <MatchCard
            key={index}
            match={match}
            index={index}
            deleteMode={deleteMode}
            onDelete={handleDeleteMatch}
          />
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
