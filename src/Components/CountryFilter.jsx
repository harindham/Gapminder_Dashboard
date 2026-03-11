import React, { useState, useMemo } from "react";

const CountryFilter = ({ data, selectedCountries, setSelectedCountries, initiallyCollapsed = true }) => {
  const [expandedContinent, setExpandedContinent] = useState(null); // only one open

  // Memoize continentsMap
  const continentsMap = useMemo(() => {
    const map = {};
    data.forEach(d => {
      if (!map[d.continent]) map[d.continent] = [];
      if (!map[d.continent].includes(d.country)) map[d.continent].push(d.country);
    });
    return map;
  }, [data]);

  // Handlers
  const handleCountryChange = (continent, country, checked) => {
    setSelectedCountries(prev => {
      const updated = { ...prev };
      if (checked) updated[continent].add(country);
      else updated[continent].delete(country);
      return updated;
    });
  };

  const handleContinentChange = (continent, checked) => {
    setSelectedCountries(prev => {
      const updated = { ...prev };
      if (checked) updated[continent] = new Set(continentsMap[continent]);
      else updated[continent] = new Set();
      return updated;
    });
  };

  const toggleCollapse = (continent) => {
    setExpandedContinent(prev => (prev === continent ? null : continent));
  };

  return (
    <div style={styles.container}>
      <h4 style={styles.sectionTitle}>Filter by Country</h4>
      <div style={styles.scrollArea}>
        {Object.entries(continentsMap).map(([continent, countries]) => {
          const allSelected = selectedCountries[continent]?.size === countries.length;
          const isCollapsed = expandedContinent !== continent;

          return (
            <div key={continent} style={{ marginBottom: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <label style={{ fontWeight: "bold" }}>
                  <input
                    type="checkbox"
                    checked={allSelected || false}
                    onChange={e => handleContinentChange(continent, e.target.checked)}
                  />{" "}
                  {continent}
                </label>
                <button
                  onClick={() => toggleCollapse(continent)}
                  style={styles.collapseButton}
                >
                  {isCollapsed ? "+" : "-"}
                </button>
              </div>

              {!isCollapsed && (
                <div style={{ marginLeft: "15px", marginTop: "5px" }}>
                  {countries.map(country => (
                    <div key={country}>
                      <label>
                        <input
                          type="checkbox"
                          checked={selectedCountries[continent]?.has(country) || false}
                          onChange={e =>
                            handleCountryChange(continent, country, e.target.checked)
                          }
                        />{" "}
                        {country}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const styles = {
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  sectionTitle: {
    marginBottom: "10px",
    fontWeight: "bold",
  },
  scrollArea: {
    overflowY: "auto",
    flex: 1,
    padding: "10px",
    backgroundColor: "#f0f0f0",
    borderRadius: "8px",
  },
  collapseButton: {
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "16px",
  },
};

export default CountryFilter;