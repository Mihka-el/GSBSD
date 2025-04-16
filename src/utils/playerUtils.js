export const getGradeColor = (grade) => {
  switch (grade) {
    case "S": return "gold";
    case "A": return "red";
    case "B": return "blue";
    case "C": return "green";
    default: return "white";
  }
};

export const formatPlayer = (player) => {
  return (
    <span style={{ color: getGradeColor(player.Grade), fontWeight: "bold" }}>
      [{player.Grade}] {player.Name}
    </span>
  );
};
