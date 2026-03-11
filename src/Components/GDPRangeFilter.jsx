import React, { useState, useEffect } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const GDPRangeFilter = ({ data, gdpRange, setGdpRange }) => {
  const [minGDP, setMinGDP] = useState(0);
  const [maxGDP, setMaxGDP] = useState(100000);

  useEffect(() => {
    if (!data || data.length === 0) return;
    const gdpValues = data.map(d => +d.gdp).filter(v => v);
    const minVal = Math.floor(Math.min(...gdpValues));
    const maxVal = Math.ceil(Math.max(...gdpValues));
    setMinGDP(minVal);
    setMaxGDP(maxVal);
    setGdpRange([minVal, maxVal]);
  }, [data, setGdpRange]);

  return (
    <div style={styles.container}>
      <h4 style={styles.title}>Filter by GDP Range</h4>
      <Slider
        range={true}
        min={minGDP}
        max={maxGDP}
        defaultValue={[minGDP, maxGDP]}
        value={gdpRange}
        tipFormatter={value => `$${value.toLocaleString()}`}
        onChange={range => setGdpRange(range)}
        railStyle={{ backgroundColor: "#ddd", height: 6 }}
        trackStyle={[{ backgroundColor: "#4a90e2", height: 6 }]}
        handleStyle={[
          { borderColor: "#4a90e2", height: 20, width: 20, marginLeft: -10, marginTop: -7 },
          { borderColor: "#4a90e2", height: 20, width: 20, marginLeft: -10, marginTop: -7 }
        ]}
      />
      <div style={styles.rangeValues}>
        <span>${gdpRange[0].toLocaleString()}</span>
        <span>${gdpRange[1].toLocaleString()}</span>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "10px",
    backgroundColor: "#f0f0f0", // same as YearFilter
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  title: {
    marginBottom: "8px",
    fontWeight: "bold",
  },
  rangeValues: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "12px",
    marginTop: "8px",
  },
};

export default GDPRangeFilter;