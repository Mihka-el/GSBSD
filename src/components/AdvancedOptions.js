import React from 'react';

const AdvancedOptions = ({ 
  allowSpecialPatterns, 
  setAllowSpecialPatterns, 
  allowMixedGender, 
  setAllowMixedGender, 
  partyAB, 
  setPartyAB 
}) => {

  return (
    <div className="advanced-options">
      <div>
        <input
          type="checkbox"
          checked={allowSpecialPatterns}
          onChange={(e) => setAllowSpecialPatterns(e.target.checked)}
        />
        <span>Allow Special Patterns</span>
      </div>

      <div>
        <input
          type="checkbox"
          checked={allowMixedGender}
          onChange={(e) => setAllowMixedGender(e.target.checked)}
        />
        <span>Allow Mixed Gender</span>
      </div>

      <div>
        <input
          type="checkbox"
          checked={partyAB}
          onChange={(e) => setPartyAB(e.target.checked)}
        />
        <span>Party A B vs A B</span>
      </div>
    </div>
  );
};

export default AdvancedOptions;  // This line is crucial for default export
