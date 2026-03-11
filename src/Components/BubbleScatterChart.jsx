import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const BubbleScatterChart = ({ data,selectedYear }) => {
  const svgRef = useRef();
  const wrapperRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const yearData = data.filter(d => +d.year === selectedYear);

    const aggregated = Array.from(
    d3.group(yearData, d => d.country),
      ([country, values]) => ({
        country,
        continent: values[0].continent,
        avgLifeExp: d3.mean(values, d => +d.life_exp),
        avgGDP: d3.mean(values, d => +d.gdp),
        avgCO2: d3.mean(values, d => +d.co2_consump)
      })
    ).filter(d => d.avgLifeExp && d.avgGDP && d.avgCO2);

    const containerWidth = wrapperRef.current.offsetWidth;

    const width = containerWidth - 20;
    const height = 380;

    const margin = { top: 40, right: 160, bottom: 60, left: 80 };

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    svg.attr("width", width).attr("height", height);

    // Tooltip
    const tooltip = d3.select(wrapperRef.current)
      .selectAll(".tooltip")
      .data([null])
      .join("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("background", "white")
      .style("padding", "8px 10px")
      .style("border", "1px solid #ccc")
      .style("border-radius", "6px")
      .style("font-size", "12px")
      .style("pointer-events", "none")
      .style("opacity", 0);

    // Scales
    const xScale = d3.scaleLinear()
      .domain(d3.extent(aggregated, d => d.avgGDP))
      .nice()
      .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
      .domain(d3.extent(aggregated, d => d.avgLifeExp))
      .nice()
      .range([height - margin.bottom, margin.top]);

    const sizeScale = d3.scaleSqrt()
      .domain(d3.extent(aggregated, d => d.avgCO2))
      .range([4, 35]);

    const continents = [...new Set(aggregated.map(d => d.continent))];

    const colorScale = d3.scaleOrdinal()
      .domain(continents)
      .range(d3.schemeTableau10);

    // Axes
    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale));

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale));

    // Axis labels
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height - 15)
      .attr("text-anchor", "middle")
      .style("font-weight", "bold")
      .text("GDP per capita (in Dollars)");

    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", 20)
      .attr("text-anchor", "middle")
      .style("font-weight", "bold")
      .text("Life Expectancy");

    // Bubbles
    svg.selectAll("circle")
      .data(aggregated)
      .enter()
      .append("circle")
      .attr("cx", d => xScale(d.avgGDP))
      .attr("cy", d => yScale(d.avgLifeExp))
      .attr("r", d => sizeScale(d.avgCO2))
      .attr("fill", d => colorScale(d.continent))
      .attr("opacity", 0.75)

      .on("mouseover", function(event, d) {
        tooltip
          .style("opacity", 1)
          .html(`
            <strong>${d.country}</strong><br/>
            Continent: ${d.continent}<br/>
            GDP: $${Math.round(d.avgGDP).toLocaleString()}<br/>
            Life Exp: ${d.avgLifeExp.toFixed(1)}<br/>
            CO₂: ${d.avgCO2.toFixed(2)}
          `);

        d3.select(this)
          .attr("stroke", "black")
          .attr("stroke-width", 2);
      })

      .on("mousemove", function(event) {
        tooltip
          .style("left", event.offsetX + 20 + "px")
          .style("top", event.offsetY + "px");
      })

      .on("mouseleave", function() {
        tooltip.style("opacity", 0);

        d3.select(this)
          .attr("stroke", "none");
      });

    // Legend
    const legend = svg.append("g")
      .attr("transform", `translate(${width - 150}, 80)`);

    legend.append("text")
      .style("font-weight", "bold")
      .text("Continent");

    continents.forEach((continent, i) => {
      const row = legend.append("g")
        .attr("transform", `translate(0, ${25 + i * 22})`);

      row.append("rect")
        .attr("width", 14)
        .attr("height", 14)
        .attr("fill", colorScale(continent));

      row.append("text")
        .attr("x", 22)
        .attr("y", 12)
        .text(continent)
        .style("font-size", "12px");
    });

  }, [data,selectedYear]);

  return (
    <div ref={wrapperRef} style={{ width: "100%", position: "relative" }}>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default BubbleScatterChart;