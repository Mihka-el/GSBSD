import React, { useState } from "react";

export default function ManualGameAdd({ players, setPlayers, setGeneratedMatches }) {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const names = input.trim().split(/\s+/); // split by space

    if (names.length !== 4) {
      alert("Please enter exactly 4 player names (e.g. mike topan keke edith)");
      return;
    }

    const matchPlayers = names.map((name) => {
      const found = players.find((p) => p.Name.toLowerCase() === name.toLowerCase());
      if (!found) {
        alert(`Player "${name}" not found.`);
        throw new Error("Player not found");
      }
      return found;
    });

    const updatedPlayers = players.map((p) => {
      const inMatch = matchPlayers.find((m) => m.Name === p.Name);
      if (inMatch) {
        return {
          ...p,
          Active: false, // still mark as inactive after playing
          "Games Played": p["Games Played"] + 1,
        };
      }
      return p;
    });

    setPlayers(updatedPlayers);
    setGeneratedMatches((prev) => [...prev, names]); // push to match history
    setInput("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
      <input
        type="text"
        placeholder="e.g. mike topan keke edith"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ padding: "5px", marginRight: "10px", borderRadius: "5px" }}
      />
      <button type="submit" style={{ padding: "5px 10px" }}>➕ Add Manual Match</button>
    </form>
  );
}
