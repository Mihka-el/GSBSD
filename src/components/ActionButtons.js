import React from "react";

const ActionButtons = ({ showPlayerList, setShowPlayerList, resetPlayers }) => {
  return (
    <div className="actions">
      <button onClick={() => setShowPlayerList(!showPlayerList)}>
        {showPlayerList ? "Hide Player List" : "Show Player List"}
      </button>
      <button onClick={resetPlayers}>Reset Players & Logs</button>
    </div>
  );
};

export default ActionButtons;
