let baseTempareture = 0;
const colors = [
  { min: 0.0, max: 3.9, color: "rgb(69, 117, 180)" },
  { min: 3.9, max: 5.0, color: "rgb(116, 173, 209)" },
  { min: 5.0, max: 6.1, color: "rgb(171, 217, 233)" },
  { min: 6.1, max: 7.2, color: "rgb(224, 243, 248)" },
  { min: 7.2, max: 8.3, color: "rgb(255, 255, 191)" },
  { min: 8.3, max: 9.5, color: "rgb(254, 224, 144)" },
  { min: 9.5, max: 10.6, color: "rgb(253, 174, 97)" },
  { min: 10.6, max: 11.7, color: "rgb(244, 109, 67)" },
  { min: 11.7, max: 15.0, color: "rgb(215, 48, 39)" },
];

async function getData() {
  const rawData = await fetch(
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
  );
  const data = await rawData.json();

  setDescription(data.baseTemperature);

  return data.monthlyVariance;
}

function setDescription(baseTemp) {
  baseTempareture = baseTemp;
  document.getElementById(
    "description"
  ).innerText = `1753 - 2015: base temperature ${baseTemp}℃`;
}

function setToolTip() {
  const cells = document.querySelectorAll(".cell");

  cells.forEach((cell) => {
    cell.addEventListener("mouseover", (event) => {
      document.getElementById("tooltip")?.remove();

      const month = event.target.getAttribute("data-month");
      const year = event.target.getAttribute("data-year");
      const temperature = event.target.getAttribute("data-temp");
      const mousePosition = [event.x, event.y];

      const tooltip = document.createElement("div");
      tooltip.id = "tooltip";
      tooltip.innerHTML = `
            Month: ${month} <br>
            Year: ${year} <br>
            Temperature: ${Number(temperature).toFixed(1)} <br>
        `;
      tooltip.style.position = "fixed";
      tooltip.style.zIndex = "9999";
      tooltip.style.background = "#fff";
      tooltip.style.padding = "10px";
      tooltip.style.border = "1px solid #ccc";
      tooltip.style.borderRadius = "4px";
      tooltip.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.2)";

      tooltip.setAttribute("data-month", month);
      tooltip.setAttribute("data-year", year);
      tooltip.setAttribute("data-temp", temperature);

      const tooltipWidth = 200;
      const windowWidth = window.innerWidth;
      const spaceRight = windowWidth - mousePosition[0];

      if (spaceRight >= tooltipWidth) {
        tooltip.style.left = `${mousePosition[0]}px`;
      } else {
        const spaceLeft = mousePosition[0] - tooltipWidth;
        tooltip.style.left = `${spaceLeft}px`;
      }

      tooltip.style.top = `${mousePosition[1]}px`;

      document.body.appendChild(tooltip);
    });

    cell.addEventListener("mouseout", (event) => {
      document.getElementById("tooltip")?.remove();
    });
  });
}

function setLegend() {
  const legend = d3
    .select("body")
    .append("div")
    .attr("id", "legend")
    .style("height", "fit-content")
    .style("width", "fit-content")
    .style("display", "flex")
    .style("flex-direction", "column");

  legend.append("h3").text("Legend:").style("text-align", "center");

  legend
    .selectAll("div")
    .data(colors)
    .enter()
    .append("div")
    .style("height", "fit-content")
    .style("padding", "5px")
    .style("width", "200px")
    .style("background-color", (d) => d.color)
    .style("margin", "auto")
    .append("div")
    .style("text-align", "left")
    .style("font-weight", "bold")
    .text((d) => `${d.min}℃ - ${d.max}℃`);
}

function setColor(temp) {
  const temperature = Number(temp).toFixed(2);

  console.log(temperature);

  switch (true) {
    case temperature < colors[0].max:
      return colors[0].color;

    case temperature >= colors[1].min && temperature < colors[1].max:
      return colors[1].color;

    case temperature >= colors[2].min && temperature < colors[2].max:
      return colors[2].color;

    case temperature >= colors[3].min && temperature < colors[3].max:
      return colors[3].color;

    case temperature >= colors[4].min && temperature < colors[4].max:
      return colors[4].color;

    case temperature >= colors[5].min && temperature < colors[5].max:
      return colors[5].color;

    case temperature >= colors[6].min && temperature < colors[6].max:
      return colors[6].color;

    case temperature >= colors[7].min && temperature < colors[7].max:
      return colors[7].color;

    case temperature >= colors[8].min:
      return colors[8].color;
  }
}

function appendChart(data) {
  const width = 1300;
  const height = 630;
  const padding = 50;

  const xScale = d3
    .scaleLinear()
    .domain([d3.min(data, (d) => d.year - 7), d3.max(data, (d) => d.year + 7)])
    .range([padding, width - padding]);

  const yScale = d3
    .scaleLinear()
    .domain([d3.max(data, (d) => d.month + 0.9), d3.min(data, (d) => d.month)])
    .range([height - padding, padding]);

  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  const svg = d3
    .select("main")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  svg
    .append("text")
    .attr("x", padding - 40)
    .attr("y", padding - 20)
    .text("Months")
    .attr("class", "chart-title");

  svg
    .append("text")
    .attr("x", width - 40)
    .attr("y", height - 30)
    .text("Years")
    .attr("class", "chart-title");

  svg
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("width", 5)
    .attr("height", 40)
    .attr("x", (d) => xScale(d.year))
    .attr("y", (d) => yScale(d.month))
    .attr("class", "cell")
    .attr("data-xvalue", (d) => d.year)
    .attr("data-yvalue", (d) => d.month)
    .style("fill", (d) =>
      setColor(Number(d.variance) + Number(baseTempareture))
    )
    .style("stroke", "black")
    .style("stroke-width", 1)
    .attr("data-month", (d) => d.month)
    .attr("data-temp", (d) => Number(d.variance) + Number(baseTempareture))
    .attr("data-year", (d) => d.year);

  svg
    .append("g")
    .attr("transform", "translate(0," + (height - padding) + ")")
    .call(xAxis)
    .attr("id", "x-axis");

  svg
    .append("g")
    .attr("transform", "translate(" + padding + ",0)")
    .call(yAxis)
    .attr("id", "y-axis");

  setToolTip();
  setLegend();
}

getData().then((data) => appendChart(data));
