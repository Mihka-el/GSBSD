import React from "react";

function AdvancedOptions({ partyKeras, setPartyKeras, partyMix, setPartyMix }) {
  return (
    <div className="advanced-options" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <div className="party-keras-checkboxes-row">
        <div>
          <input
            type="checkbox"
            checked={partyKeras}
            onChange={(e) => setPartyKeras(e.target.checked)}
          />
          <span>Party Keras</span>
        </div>
        <div>
          <input
            type="checkbox"
            checked={partyMix}
            onChange={(e) => setPartyMix(e.target.checked)}
          />
          <span>Party Mix</span>
        </div>
      </div>
    </div>
  );
}

export default AdvancedOptions;
