// src/components/MatchControls.js
import React from 'react';

function MatchControls({
  showUpload,
  showManualAdd,
  setShowUpload,
  setShowManualAdd,
  generateOneMatch,
  setShowAdvancedOptions,
  setDeleteMode,
  deleteMode
}) {
  return (
    <div className="button-container">
      <div className="menu">
        <button
          className="upload-button"
          onClick={() => setShowUpload(!showUpload)}
        >
          {showUpload ? "Hide Upload" : "📂"}
        </button>
        <button onClick={generateOneMatch}>➕ Match</button>
        <button onClick={() => setShowManualAdd(!showManualAdd)}>
          {showManualAdd ? "Hide Manual" : "➕ Manual"}
        </button>
        <button onClick={() => setShowAdvancedOptions(prev => !prev)}>
          ⚙️
        </button>
        <button onClick={() => setDeleteMode(!deleteMode)}>
          {deleteMode ? "🔒" : "🗑️"}
        </button>
      </div>
    </div>
  );
}

export default MatchControls;
