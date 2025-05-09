import React from "react";

const MatchCard = ({ match, index, deleteMode, handleDeleteMatch }) => {
  return (
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
        <div><strong>Team 1:</strong> {match.slice(0, 2).join(", ")}</div>
        <div><strong>Team 2:</strong> {match.slice(2, 4).join(", ")}</div>
      </div>
    </div>
  );
};

export default MatchCard;
