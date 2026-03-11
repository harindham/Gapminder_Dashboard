import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const ContinentComparisonChart = ({ data,selectedYear }) => {

  const svgRef = useRef();
  const wrapperRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const yearData = data.filter(d => +d.year === selectedYear);

    const aggregated = Array.from(
      d3.group(yearData, d => d.continent),
      ([continent, values]) => ({
        continent,
        avgGDP: d3.mean(values, d => +d.gdp),
        avgCO2: d3.mean(values, d => +d.co2_consump)
      })
    ).filter(d => d.avgGDP && d.avgCO2);

    const width = wrapperRef.current.offsetWidth;
    const height = 300;

    const margin = { top: 40, right: 40, bottom: 60, left: 70 };

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    svg.attr("width", width).attr("height", height);

    // Add padding to log scale domain
    const minGDP = d3.min(aggregated, d => d.avgGDP);
    const maxGDP = d3.max(aggregated, d => d.avgGDP);

    const xScale = d3.scaleLog()
      .domain([minGDP * 0.8, maxGDP * 1.2])
      .range([margin.left, width - margin.right])
      .clamp(true);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(aggregated, d => d.avgCO2)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const colorScale = d3.scaleOrdinal()
      .domain(aggregated.map(d => d.continent))
      .range(d3.schemeTableau10);

    // X Axis
    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(
        d3.axisBottom(xScale)
          .ticks(4, "~s")
      );

    // Y Axis
    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale));

    // X label
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height - 15)
      .attr("text-anchor", "middle")
      .style("font-weight", "bold")
      .text("GDP per Capita (Log Scale)");

    // Y label
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", 20)
      .attr("text-anchor", "middle")
      .style("font-weight", "bold")
      .text("Average CO₂ Emission");

    const barWidth = 28;

    // Bars
    svg.selectAll("rect")
      .data(aggregated)
      .enter()
      .append("rect")
      .attr("x", d => xScale(d.avgGDP) - barWidth / 2)
      .attr("y", d => yScale(d.avgCO2))
      .attr("width", barWidth)
      .attr("height", d => height - margin.bottom - yScale(d.avgCO2))
      .attr("fill", d => colorScale(d.continent))
      .attr("opacity", 0.85);

    // Continent labels
    svg.selectAll(".continent-label")
      .data(aggregated)
      .enter()
      .append("text")
      .attr("x", d => xScale(d.avgGDP))
      .attr("y", d => yScale(d.avgCO2) - 6)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .text(d => d.continent);

  }, [data,selectedYear]);

  return (
    <div ref={wrapperRef} style={{ width: "100%" }}>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default ContinentComparisonChart;