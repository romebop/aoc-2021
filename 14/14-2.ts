import { readFileSync } from 'fs';

const inputFile = process.argv.slice(2)[0];

const data = readFileSync(inputFile, 'utf8');

const template: string = data.split('\n\n')[0];

const insertMap = data.split('\n\n')[1]
  .split('\n')
  .map(s => s.split(' -> '))
  .reduce((map, [key, val]) => {
    map.set(key, val);
    return map;
  }, new Map<string, string>());

const numSteps = 40;

console.log(solve(template, insertMap, numSteps));

function solve(template: string, insertMap: Map<string, string>, numSteps: number): number {
  let pairCountMap = initPairCountMap(template);
  const charCountMap = initCharCountMap(template);
  for (let step = 0; step < numSteps; step++) {
    const newPairCountMap = new Map<string, number>();
    for (const pair of pairCountMap.keys()) {
      const pairCount = pairCountMap.get(pair)!;
      if (insertMap.has(pair)) {
        const char = insertMap.get(pair)!;
        const genPair1 = pair[0] + char;
        const genPair2 = char + pair[1];
        newPairCountMap.set(genPair1, (newPairCountMap.get(genPair1) ?? 0) + pairCount);
        newPairCountMap.set(genPair2, (newPairCountMap.get(genPair2) ?? 0) + pairCount);
        charCountMap.set(char, (charCountMap.get(char) ?? 0) + pairCount);
      } else {
        newPairCountMap.set(pair, pairCount);
      }
    }
    pairCountMap = newPairCountMap;
  }
  return Math.max(...charCountMap.values()) - Math.min(...charCountMap.values());
}

function initPairCountMap(template: string): Map<string, number> {
  const pairCountMap = new Map<string, number>();
  for (let i = 1; i < template.length; i++) {
    const pair = template[i - 1] + template[i];
    pairCountMap.set(pair, (pairCountMap.get(pair) ?? 0) + 1);
  }
  return pairCountMap;
}

function initCharCountMap(template: string): Map<string, number> {
  const charCountMap = new Map<string, number>();
  for (const char of template) {
    charCountMap.set(char, (charCountMap.get(char) ?? 0) + 1);
  }
  return charCountMap;
}
