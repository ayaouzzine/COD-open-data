import {
  select,
  geoPath,
  geoNaturalEarth1,
  zoom,
  event,
  scaleOrdinal,
  schemePastel2,
  schemeSpectral
} from 'd3';
import { loadAndProcessData } from './loadAndProcessData';
import { colorLegend } from './colorLegend';
import { choroplethMap } from './choroplethMap';

const svg = select('svg');

const projection = geoNaturalEarth1();
const pathGenerator = geoPath().projection(projection);
const choroplethMapG = svg.append('g');


const colorinfo = d => d.properties.Renewables;
const colorValue = d => d.properties.Level;

const colorLegendG = svg.append('g')
  .attr('transform', `translate(40,310)`);


let selectedColorValue;
let features;


const onClick = d => {
  selectedColorValue = d;
  render();
};


const colorScale = scaleOrdinal();


loadAndProcessData().then(countries => {
  features = countries.features;
  render();


});

const render = () => {
  colorScale
    .domain(features.map(colorValue))
    .domain(colorScale.domain().sort().reverse())
    .range(schemeSpectral[colorScale.domain().length]);

  colorLegendG.call(colorLegend, {
    colorScale,
    circleRadius: 8,
    spacing: 20,
    textOffset: 12,
    backgroundRectWidth: 235,
    onClick,
    selectedColorValue
  });

  choroplethMapG.call(choroplethMap, {
    features,
    colorScale,
    colorValue,
    selectedColorValue
  });
};