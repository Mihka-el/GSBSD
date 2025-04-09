// components/PlayerList.js
import React from "react";
import ManualGameAdd from "./ManualGameAdd";

const PlayerList = ({ players, setPlayers, setGeneratedMatches, formatPlayer }) => {
  return (
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
  );
};

export default PlayerList;
