import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const ServicesGDPLineChart = ({ data, selectedYear }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const yearData = data.filter(d => +d.year === +selectedYear);

    // Group data by continent
    const grouped = d3.group(yearData, d => d.continent);

    // Compute averages per continent
    const avgData = Array.from(grouped, ([continent, values]) => ({
      continent,
      avgGDP: d3.mean(values, d => +d.gdp),
      avgServices: d3.mean(values, d => +d.services)
    }));

    const continents = avgData.map(d => d.continent);

    const margin = { top: 20, right: 80, bottom: 40, left: 60 };
    const width = 380 - margin.left - margin.right;
    const height = 260 - margin.top - margin.bottom;

    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

    const chart = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Scales
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

    // Axis Labels
    chart
      .append("text")
      .attr("x", width / 2)
      .attr("y", height + 35)
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

    // Sort continents by GDP for proper line drawing
    const sortedData = avgData.sort((a, b) => a.avgGDP - b.avgGDP);

    const line = d3
      .line()
      .x(d => x(d.avgGDP))
      .y(d => y(d.avgServices));

    // Draw line
    chart
      .append("path")
      .datum(sortedData)
      .attr("fill", "none")
      .attr("stroke", "#444")
      .attr("stroke-width", 2)
      .attr("d", line);

    // Draw points
    chart
      .selectAll("circle")
      .data(sortedData)
      .enter()
      .append("circle")
      .attr("cx", d => x(d.avgGDP))
      .attr("cy", d => y(d.avgServices))
      .attr("r", 6)
      .attr("fill", d => color(d.continent));

    // Labels near points
    chart
      .selectAll(".label")
      .data(sortedData)
      .enter()
      .append("text")
      .attr("x", d => x(d.avgGDP) + 8)
      .attr("y", d => y(d.avgServices) + 4)
      .style("font-size", "10px")
      .text(d => d.continent);

    // Legend
    const legend = svg
      .append("g")
      .attr("transform", `translate(${width + 20}, 20)`);

    continents.forEach((continent, i) => {
      const row = legend
        .append("g")
        .attr("transform", `translate(0, ${i * 18})`);

      row
        .append("rect")
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", color(continent));

      row
        .append("text")
        .attr("x", 15)
        .attr("y", 9)
        .style("font-size", "10px")
        .text(continent);
    });

  }, [data, selectedYear]);

  return (
    <div>
      <h4 style={{ marginBottom: "10px" }}>
        Avg GDP vs Service Workers ({selectedYear})
      </h4>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default ServicesGDPLineChart;