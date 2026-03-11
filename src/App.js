import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import BubbleScatterChart from "./Components/BubbleScatterChart";
import CountryFilter from "./Components/CountryFilter";
import ContinentComparisonChart from "./Components/ContinentComparisonChart";
import YearFilter from "./Components/YearFilter";
import GDPHDIScatterChart from "./Components/GDPHDIScatterChart";
import GDPRangeFilter from "./Components/GDPRangeFilter";
import ServicesGDPLineChart from "./Components/ServicesGDPLineChart";

function App() {
  const [data, setData] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState({});
  const [selectedYear, setSelectedYear] = useState(2005);
  const [gdpRange, setGdpRange] = useState([0, 100000]);

  useEffect(() => {
    d3.csv("/gapminder_data_graphs.csv").then(res => {
      setData(res);
      console.log("Data loaded:", res);
      const initialSelection = {};
      res.forEach(d => {
        if (!initialSelection[d.continent]) initialSelection[d.continent] = new Set();
        initialSelection[d.continent].add(d.country);
      });
      setSelectedCountries(initialSelection);
    });
  }, []);

  const filteredData = data.filter(
    d =>
      selectedCountries[d.continent]?.has(d.country) &&
      +d.gdp >= gdpRange[0] &&
      +d.gdp <= gdpRange[1]
  );

  return (
    <div style={styles.pageWrapper}>
      {/* Filters Panel */}
      <div style={styles.filtersPanel}>
        <h2 style={styles.panelTitle}>Filters</h2>
        <div style={styles.filtersContainer}>
          {/* Country Filter */}
          <div style={styles.countryFilterSection}>
            <CountryFilter
              data={data}
              selectedCountries={selectedCountries}
              setSelectedCountries={setSelectedCountries}
              initiallyCollapsed={true}
            />
          </div>

          {/* Year Filter */}
          <div style={styles.otherFilterSection}>
            <YearFilter
              data={data}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
            />
          </div>

          {/* GDP Filter */}
          <div style={styles.otherFilterSection}>
            <GDPRangeFilter
              data={data}
              gdpRange={gdpRange}
              setGdpRange={setGdpRange}
            />
          </div>
        </div>
      </div>

      {/* Dashboard */}
      <div style={styles.dashboard}>
        <div style={styles.chartContainer}>
          <div style={styles.firstRow}>
            <div style={{ ...styles.card, width: "70%" }}>
              <BubbleScatterChart
                data={filteredData}
                selectedYear={selectedYear}
              />
            </div>

            <div style={{ ...styles.card, width: "40%" }}>
              <ServicesGDPLineChart
                data={filteredData}
                selectedYear={selectedYear}
              />
            </div>
          </div>
          <div style={styles.chartRow}>
            <div style={{ ...styles.card, width: "50%" }}>
              <ContinentComparisonChart
                data={filteredData}
                selectedYear={selectedYear}
              />
            </div>

            <div style={{ ...styles.card, width: "50%" }}>
              <GDPHDIScatterChart
                data={filteredData}
                selectedYear={selectedYear}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageWrapper: {
    display: "flex",
    height: "100vh",
    backgroundColor: "#f4f6f9",
    padding: "20px",
  },
  filtersPanel: {
    width: "250px",
    backgroundColor: "white",
    padding: "15px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    marginRight: "20px",
    display: "flex",
    flexDirection: "column",
    height: "calc(100vh - 40px)",
  },
  panelTitle: {
    marginBottom: "10px",
    fontWeight: "bold",
  },
  filtersContainer: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    gap: "8px", // small gap between filters
  },
  countryFilterSection: {
    height: "50%",       // 50% of panel height
    overflowY: "auto",   // scrollable if content overflows
  },
  otherFilterSection: {
    height: "18%",       // fixed 25% height for Year/GDP filters
  },
  firstRow: {
    display: "flex",
    gap: "20px",
    width: "100%",
  },
  dashboard: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  chartContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "25px",
  },
  chartRow: {
    display: "flex",
    gap: "20px",
    width: "100%",
  },
  card: {
    backgroundColor: "white",
    padding: "15px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};

export default App;