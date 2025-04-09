// src/components/AdvancedOptions.js

import React from "react";

const AdvancedOptions = ({
  allowSpecialPatterns,
  setAllowSpecialPatterns,
  allowMixedGender,
  setAllowMixedGender,
}) => {
  return (
    <div className="advanced-options">
      <label>
        <input
          type="checkbox"
          checked={allowSpecialPatterns}
          onChange={(e) => setAllowSpecialPatterns(e.target.checked)}
        />
        Allow special patterns (S S vs S S, S A vs S A)
      </label>
      <label>
        <input
          type="checkbox"
          checked={allowMixedGender}
          onChange={(e) => setAllowMixedGender(e.target.checked)}
        />
        Allow mixed gender teams (M F vs M F, F F vs F F)
      </label>
    </div>
  );
};

export default AdvancedOptions;
