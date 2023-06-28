import * as d3 from 'd3'

// Import des données
import data from '../data/cantons_data.geojson'

/*
========================================================================================================================
1. Dessin SVG (15 points)
========================================================================================================================
Vous pouvez dessiner la figure soit à partir d'ici ou directement dans l'HTML (public/index.html).
*/

// d3.select('body')
//     .append('div')
//     .attr('id', 'drawing')
//     .append('svg')
//     .attr('width', 100)
//     .attr('height', 100);
    

// const svg = d3.select('#drawing');

// svg.append('circle')
//     .attr('cx', 20)
//     .attr ('cy', 2)
//     .attr('r', 5) 
//     .attr('fill', 'red');

// svg.append('path')
//     .attr('d', 'M 10 10 L 90 10 L 50 90 Z');





/*
========================================================================================================================
2. Manipulation des données (20 points)
========================================================================================================================
*/

// * `id` : identifiant canton
// * `name`: nom du canton (p. ex. _Vaud_)
// * `precipitation`: précipitation moyenne annuelle
// * `radiation` : ensoleillement moyen annuel
// * `latitude` : coordonnée sud (_à utiliser dans exercice 3.2_)
// * `longitude`: coordonnée est

// Affichez les données dans la console
console.log(data.features);


// Le nom du canton avec le plus d'ensoleillement (maximum radiation)
const maxRadiation = d3.max(data.features, d => d.properties.radiation);
const maxRadiationCanton = data.features.filter(d => d.properties.radiation === maxRadiation)[0].properties.name;

console.log(maxRadiationCanton);



// Les noms des cantons avec le moins de précipitation (minimum precipitation)
const minPrecipitations = d3.min(data.features, d => d.properties.precipitation);
const minPrecipitationsCanton = data.features.filter(d => d.properties.precipitation === minPrecipitations)[0].properties.name;

console.log(minPrecipitationsCanton);


// La moyenne de précipitation en Suisse
const meanPrecipitations = d3.mean(data.features, d => d.properties.precipitation);

console.log(meanPrecipitations);






/*
========================================================================================================================
3. Visualisations (45 points)
========================================================================================================================
*/

// Constantes
const margin = { top: 10, right: 40, bottom: 20, left: 40 },
  width = 0.8 * window.innerWidth - margin.left - margin.right,
  height = 0.5 * window.innerHeight + margin.top + margin.bottom;

// --- 3.1 Carte ---
const mapSvg = d3
  .select('#map')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

const projection = d3.geoMercator()
  .translate([width / 2, height / 2])
  .rotate([-7.43864, -46.95108, 0])
  .center([0.54, -0.1])
  .scale(8000);

// Continuer ci-dessous-----------------------------------

const path = d3.geoPath().projection(projection);

const colorScale = d3
  .scaleLinear()
  .domain([
    d3.min(data.features, (d) => d.properties.precipitation),
    d3.max(data.features, (d) => d.properties.precipitation),
  ])
  .range(['blue', 'white']);

// Ajouter les info-bulles
const tooltip = d3
  .select('body')
  .append('div')
  .attr('class', 'tooltip')
  .style('opacity', 0);

  mapSvg
  .append('g')
  .selectAll('path')
  .data(data.features)
  .join('path')
  .attr('d', path)
  .attr('fill', (d) => {
    let dataFiltered = data.features.find(
      (dc) => dc.properties.name == d.properties.name
    );
    return dataFiltered
      ? colorScale(dataFiltered.properties.precipitation)
      : 'grey';
  })
  .on('mouseover', (event, d) => {
    tooltip.transition().duration(200).style('opacity', 0.9);
    tooltip
      .style('left', event.pageX + 'px')
      .style('top', event.pageY + 'px')
      .html(`Précipitation: ${d.properties.precipitation}`);
  })
  .on('mouseout', () => {
    tooltip.transition().duration(500).style('opacity', 0);
  });






//--------------------------------------------------------

// --- 3.2 Bubble chart ---
const bubbleFigureSvg = d3.select('#scatter-plot')
    .append('svg')
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Continuez ci-dessous-----------------------------------
const xScale = d3
  .scaleLinear()
  .domain([
    d3.min(data.features, (d) => d.properties.precipitation),
    d3.max(data.features, (d) => d.properties.precipitation),
  ])
  .range([0, width]);

const yScale = d3
  .scaleLinear()
  .domain([
    d3.min(data.features, (d) => d.properties.radiation),
    d3.max(data.features, (d) => d.properties.radiation),
  ])
  .range([height, 0]);

const radiusScale = d3
  .scaleLinear()
  .domain([
    d3.min(data.features, (d) => d.properties.latitude),
    d3.max(data.features, (d) => d.properties.latitude),
  ])
  .range([5, 20]);

bubbleFigureSvg
  .selectAll('circle')
  .data(data.features)
  .enter()
  .append('circle')
  .attr('cx', (d) => xScale(d.properties.precipitation))
  .attr('cy', (d) => yScale(d.properties.radiation))
  .attr('r', (d) => radiusScale(d.properties.latitude))
  .attr('fill', 'steelblue')
  .attr('opacity', 0.7)
  .attr('stroke', 'black');

bubbleFigureSvg
  .append('g')
  .attr('transform', 'translate(0,' + height + ')')
  .call(d3.axisBottom(xScale));

bubbleFigureSvg.append('g').call(d3.axisLeft(yScale));





//--------------------------------------------------------



