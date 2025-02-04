// URL untuk data GDP yang digunakan oleh FreeCodeCamp
const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

// Membaca data JSON dari URL
d3.json(url).then(data => {
  const dataset = data.data;

  // Menetapkan ukuran chart dan margin
  const margin = { top: 20, right: 30, bottom: 40, left: 40 };
  const width = 900 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;

  // Menyiapkan SVG dengan ukuran yang ditentukan
  const svg = d3.select("#chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Menyiapkan skala untuk x dan y
  const x = d3.scaleBand()
    .domain(dataset.map(d => d[0])) // Menggunakan tahun untuk skala x
    .range([0, width])
    .padding(0.1);

  const y = d3.scaleLinear()
    .domain([0, d3.max(dataset, d => d[1])]) // Menggunakan GDP untuk skala y
    .nice()
    .range([height, 0]);

  // Menambahkan sumbu X dan Y ke chart
  svg.append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x));

  svg.append("g")
    .attr("id", "y-axis")
    .call(d3.axisLeft(y));

  // Menambahkan bar untuk setiap data GDP
  svg.selectAll(".bar")
    .data(dataset)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("data-date", d => d[0])
    .attr("data-gdp", d => d[1])
    .attr("x", d => x(d[0]))
    .attr("y", d => y(d[1]))
    .attr("width", x.bandwidth())
    .attr("height", d => height - y(d[1]))
    .attr("index", (d, i) => i)
    .on("mouseover", function(event, d) {
      const date = d[0];
      const gdp = d[1];

      // Menampilkan tooltip saat mouse hover
      d3.select("#tooltip")
        .style("opacity", 1)
        .attr("data-date", date)
        .html(`${date}<br>GDP: ${gdp.toFixed(1)} Billion`)
        .style("left", `${event.pageX + 5}px`)
        .style("top", `${event.pageY - 28}px`);
    })
    .on("mouseout", function() {
      d3.select("#tooltip").style("opacity", 0);
    });
});
