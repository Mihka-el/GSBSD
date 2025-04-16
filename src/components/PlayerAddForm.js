// components/PlayerAddForm.js
export default function PlayerAddForm({ newPlayerName, setNewPlayerName, newPlayerGrade, setNewPlayerGrade, newPlayerGender, setNewPlayerGender, handleAddPlayer }) {
  return (
    <div className="player-addition">
      <h3>Add New Player</h3>
      <input value={newPlayerName} onChange={(e) => setNewPlayerName(e.target.value)} />
      <select value={newPlayerGrade} onChange={(e) => setNewPlayerGrade(e.target.value)}>
        <option value="S">S</option>
        <option value="A">A</option>
        <option value="B">B</option>
        <option value="C">C</option>
      </select>
      <select value={newPlayerGender} onChange={(e) => setNewPlayerGender(e.target.value)}>
        <option value="M">M</option>
        <option value="F">F</option>
      </select>
      <button onClick={handleAddPlayer}>➕ Player</button>
    </div>
  );
}