import React from 'react';
import Papa from 'papaparse';

const CSVUploader = ({ onDataLoaded, players }) => {
  const handleFileChangeAndParse = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        const cleanedData = results.data.map((row) => ({
          ...row,
          Name: row.Name?.trim(),
          Grade: row.Grade?.trim().toUpperCase(),
          Gender: row.Gender?.trim(),
          Active:
            typeof row.Active === 'string'
              ? row.Active.trim().toUpperCase() === 'TRUE'
              : row.Active === true,
          'Games Played': isNaN(parseInt(row['Games Played']))
            ? 0
            : parseInt(row['Games Played']),
        }));
        onDataLoaded(cleanedData);
      },
    });
  };

  const handleExport = () => {
    if (!players || players.length === 0) {
      alert("No players to export.");
      return;
    }
    const csv = Papa.unparse(players);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "players_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ backgroundColor: '#1e1e1e', padding: '1rem', borderRadius: '10px', color: '#fff' }}>
      <h3>📂 Upload Player CSV</h3>
      <input type="file" accept=".csv" onChange={handleFileChangeAndParse} />
      <br />
      <button style={{ marginTop: '10px' }} onClick={handleExport}>📤 Export Players</button>
    </div>
  );
};

export default CSVUploader;
