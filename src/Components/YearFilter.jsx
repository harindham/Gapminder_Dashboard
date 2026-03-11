import React from "react";

const YearFilter = ({ data, selectedYear, setSelectedYear }) => {

  const years = [...new Set(data.map(d => +d.year))].sort((a,b) => a-b);

  const minYear = years[0];
  const maxYear = years[years.length - 1];

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Filter by Year</h3>

      <div style={styles.sliderContainer}>
        <input
          type="range"
          min={minYear}
          max={maxYear}
          step={1}
          value={selectedYear}
          onChange={(e) => setSelectedYear(+e.target.value)}
          style={styles.slider}
        />

        <div style={styles.yearLabel}>
          {selectedYear}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "10px",
    backgroundColor: "#f0f0f0",
    borderRadius: "8px"
  },
  title: {
    marginBottom: "10px",
    fontWeight: "bold"
  },
  sliderContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  slider: {
    width: "100%"
  },
  yearLabel: {
    marginTop: "8px",
    fontWeight: "bold",
    fontSize: "16px"
  }
};

export default YearFilter;