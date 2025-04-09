import React, { useState } from 'react';
import Papa from 'papaparse';

const CSVUploader = ({ onDataLoaded }) => {
  const [csvFile, setCsvFile] = useState(null);

  const handleFileChange = (e) => {
    setCsvFile(e.target.files[0]);
  };

  const handleParse = () => {
    if (!csvFile) return;

    Papa.parse(csvFile, {
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

  return (
    <div style={{ backgroundColor: '#1e1e1e', padding: '1rem', borderRadius: '10px', color: '#fff' }}>
      <h3>📂 Upload Player CSV</h3>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button onClick={handleParse} style={{ marginTop: '1rem' }}>Upload</button>
    </div>
  );
};

export default CSVUploader;
