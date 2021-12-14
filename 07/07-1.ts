import { readFileSync } from 'fs';

const inputFile = process.argv.slice(2)[0];

const posList: number[] = readFileSync(inputFile, 'utf8').split(',')
  .map(e => +e);

console.log(solve(posList));

function solve(posList: number[]): number {
  const alignPos = getMedian(posList);
  return posList.reduce((fuel, pos) => (
    fuel + Math.abs(pos - alignPos)
  ), 0);
}

function getMedian(values: number[]): number {
  const sortedValues = [...values].sort((a, b) => a > b ? 1 : -1);
  const halfIdx = Math.floor(sortedValues.length / 2);
  if (sortedValues.length % 2 === 1) {
    return sortedValues[halfIdx];
  }
  return (sortedValues[halfIdx - 1] + sortedValues[halfIdx]) / 2;
}
