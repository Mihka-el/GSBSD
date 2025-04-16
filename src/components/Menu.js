import React from "react";

const Menu = ({
  showUpload,
  showManualAdd,
  setShowUpload,
  setShowManualAdd,
  setShowAdvancedOptions,
  setDeleteMode,
  deleteMode,
}) => {
  return (
    <div className="menu">
      <button onClick={() => setShowUpload(!showUpload)}>
        {showUpload ? "Hide Upload" : "📂"}
      </button>
      <button onClick={() => setShowManualAdd(!showManualAdd)}>
        {showManualAdd ? "Hide Manual" : "➕ Manual"}
      </button>
      <button onClick={() => setShowAdvancedOptions((prev) => !prev)}>⚙️</button>
      <button onClick={() => setDeleteMode(!deleteMode)}>
        {deleteMode ? "🔒" : "🗑️"}
      </button>
    </div>
  );
};

export default Menu;
