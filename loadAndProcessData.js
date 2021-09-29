import { feature } from 'topojson';
import { tsv, json } from 'd3';
export const loadAndProcessData = () => 
  Promise
    .all([
      tsv('https://gist.githubusercontent.com/Kahlaoui-Ismail/00983b311620f50d598db60fc7b4c7d3/raw/9aef529189fe77606db83eb631f98fa8b9828b1c/Renawable2.tsv'),
      json('https://unpkg.com/world-atlas@1.1.4/world/50m.json')
    ])
    .then(([tsvData, topoJSONdata]) => {
      const rowById = tsvData.reduce((accumulator, d) => {
        accumulator[d.iso_n3] = d;
        return accumulator;
      }, {});

      const countries = feature(topoJSONdata, topoJSONdata.objects.countries);

      countries.features.forEach(d => {
        Object.assign(d.properties, rowById[d.id]);
      });

      return countries;
    });