import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const GDPHDIScatterChart = ({ data, selectedYear }) => {
  const svgRef = useRef();
  const wrapperRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Filter by selected year and only include rows with GDP and HDI
    const yearData = data
      .filter(d => +d.year === selectedYear)
      .filter(d => d.gdp && d.hdi_index);

    if (yearData.length === 0) return;

    const width = wrapperRef.current.offsetWidth;
    const height = 300;
    const margin = { top: 40, right: 40, bottom: 60, left: 70 };

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    svg.attr("width", width).attr("height", height);

    // Tooltip
    const tooltip = d3.select(wrapperRef.current)
      .selectAll(".tooltip")
      .data([null])
      .join("div")
      .style("position", "absolute")
      .style("background", "white")
      .style("padding", "8px 10px")
      .style("border", "1px solid #ccc")
      .style("border-radius", "6px")
      .style("font-size", "12px")
      .style("pointer-events", "none")
      .style("opacity", 0);

    // X Scale (GDP)
    const xScale = d3.scaleLinear()
      .domain([0, d3.max(yearData, d => +d.gdp) * 1.2]) // extra padding
      .range([margin.left, width - margin.right]);

    // Y Scale (HDI)
    const yScale = d3.scaleLinear()
      .domain([0.3, 1]) // HDI values typically 0-1, start from 0.3 for clarity
      .range([height - margin.bottom, margin.top]);

    // Color by continent
    const continents = [...new Set(yearData.map(d => d.continent))];
    const colorScale = d3.scaleOrdinal()
      .domain(continents)
      .range(d3.schemeTableau10);

    // X Axis
    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale).ticks(5, "~s"));

    // Y Axis
    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale));

    // X Label
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height - 15)
      .attr("text-anchor", "middle")
      .style("font-weight", "bold")
      .text("GDP per Capita");

    // Y Label
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", 20)
      .attr("text-anchor", "middle")
      .style("font-weight", "bold")
      .text("Human Development Index (HDI)");

    // Scatter points
    svg.selectAll("circle")
      .data(yearData)
      .enter()
      .append("circle")
      .attr("cx", d => xScale(+d.gdp))
      .attr("cy", d => yScale(+d.hdi_index))
      .attr("r", 5)
      .attr("fill", d => colorScale(d.continent))
      .attr("opacity", 0.8)
      .on("mouseover", function(event, d) {
        tooltip
          .style("opacity", 1)
          .html(`
            <strong>${d.country}</strong><br/>
            Continent: ${d.continent}<br/>
            GDP: $${Math.round(d.gdp).toLocaleString()}<br/>
            HDI: ${(+d.hdi_index).toFixed(3)}
          `);
        d3.select(this).attr("stroke", "black").attr("stroke-width", 2);
      })
      .on("mousemove", function(event) {
        tooltip
          .style("left", event.offsetX + 20 + "px")
          .style("top", event.offsetY + "px");
      })
      .on("mouseleave", function() {
        tooltip.style("opacity", 0);
        d3.select(this).attr("stroke", "none");
      });

    // Optional legend
    const legend = svg.append("g")
      .attr("transform", `translate(${width - 120}, 40)`);

    legend.append("text")
      .style("font-weight", "bold")
      .text("Continent");

    continents.forEach((continent, i) => {
      const row = legend.append("g")
        .attr("transform", `translate(0, ${20 + i * 22})`);

      row.append("rect")
        .attr("width", 14)
        .attr("height", 14)
        .attr("fill", colorScale(continent));

      row.append("text")
        .attr("x", 20)
        .attr("y", 12)
        .style("font-size", "12px")
        .text(continent);
    });

  }, [data, selectedYear]);

  return (
    <div ref={wrapperRef} style={{ width: "100%", position: "relative" }}>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default GDPHDIScatterChart;