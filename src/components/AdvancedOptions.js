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
