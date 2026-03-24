import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const ServicesGDPLineChart = ({ data, selectedYear }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const yearData = data.filter(d => +d.year === +selectedYear);

    const grouped = d3.group(yearData, d => d.continent);

    const avgData = Array.from(grouped, ([continent, values]) => ({
      continent,
      avgGDP: d3.mean(values, d => +d.gdp),
      avgServices: d3.mean(values, d => +d.services)
    }));

    const continents = avgData.map(d => d.continent);

    const margin = { top: 70, right: 40, bottom: 40, left: 60 };
    const width = 380 - margin.left - margin.right;
    const height = 260 - margin.top - margin.bottom;

    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

    const legend = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, 10)`);

    const itemsPerRow = 2;
    const colWidth = width / itemsPerRow;

    continents.forEach((continent, i) => {
      const row = Math.floor(i / itemsPerRow);
      const col = i % itemsPerRow;

      const group = legend
        .append("g")
        .attr(
          "transform",
          `translate(${col * colWidth}, ${row * 18})`
        );

      group
        .append("rect")
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", d3.schemeTableau10[i % 10]);

      group
        .append("text")
        .attr("x", 15)
        .attr("y", 9)
        .style("font-size", "10px")
        .text(continent);
    });

    // ===== CHART =====
    const chart = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleLinear()
      .domain([0, d3.max(avgData, d => d.avgGDP)])
      .nice()
      .range([0, width]);

    const y = d3
      .scaleLinear()
      .domain([0, 100])
      .range([height, 0]);

    const color = d3
      .scaleOrdinal()
      .domain(continents)
      .range(d3.schemeTableau10);

    // Axes
    chart
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(5));

    chart.append("g").call(d3.axisLeft(y));

    // Axis labels
    chart
      .append("text")
      .attr("x", width / 2)
      .attr("y", height + 30)
      .attr("text-anchor", "middle")
      .style("font-size", "11px")
      .text("Average GDP");

    chart
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -45)
      .attr("text-anchor", "middle")
      .style("font-size", "11px")
      .text("% Service Workers");

    // Sort data
    const sortedData = avgData.sort((a, b) => a.avgGDP - b.avgGDP);

    const line = d3
      .line()
      .x(d => x(d.avgGDP))
      .y(d => y(d.avgServices));

    // Line
    chart
      .append("path")
      .datum(sortedData)
      .attr("fill", "none")
      .attr("stroke", "#444")
      .attr("stroke-width", 2)
      .attr("d", line);

    // Points
    chart
      .selectAll("circle")
      .data(sortedData)
      .enter()
      .append("circle")
      .attr("cx", d => x(d.avgGDP))
      .attr("cy", d => y(d.avgServices))
      .attr("r", 6)
      .attr("fill", d => color(d.continent));

    // Labels

  }, [data, selectedYear]);

  return (
    <div>
      <h5 style={{ marginBottom: "10px", textAlign: "center" }}>
        Avg GDP vs Service Workers(salaried class) ({selectedYear})
      </h5>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default ServicesGDPLineChart;