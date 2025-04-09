// components/MatchTable.js
import React from "react";

const MatchTable = ({ generatedMatches }) => {
  return (
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
  );
};

export default MatchTable;
