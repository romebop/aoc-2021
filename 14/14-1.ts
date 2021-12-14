import { readFileSync } from 'fs';

const inputFile = process.argv.slice(2)[0];

const data = readFileSync(inputFile, 'utf8');

const template: string = data.split('\n\n')[0];

const pairMap = data.split('\n\n')[1]
  .split('\n')
  .map(s => s.split(' -> '))
  .reduce((map, [key, val]) => {
    map[key] = val;
    return map;
  }, {} as { [key: string]: string });

const numSteps = 10;

console.log(solve(template, pairMap, numSteps));

function solve(template: string, pairMap: { [key: string]: string }, numSteps: number): number {
  for (let step = 0; step < numSteps; step++) {
    let newTemplate = '';
    for (let i = 1; i < template.length; i++) {
      const pair = template[i - 1] + template[i];
      newTemplate += pairMap.hasOwnProperty(pair) ? pair[0] + pairMap[pair] : pair[0];
    }
    newTemplate += template[template.length - 1];
    template = newTemplate;
  }
  const countMap = template.split('').reduce((map, char) => {
    map.hasOwnProperty(char) ? map[char]++ : map[char] = 0;
    return map;
  }, {} as { [key: string]: number });
  const counts = Object.values(countMap);
  return Math.max(...counts) - Math.min(...counts);
}
