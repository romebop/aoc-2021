import { readFileSync } from 'fs';

const inputFile = process.argv.slice(2)[0];

const depths: number[] = readFileSync(inputFile, 'utf8')
  .split('\n')
  .map(e => +e);

const window = 3;

console.log(solve(depths));

function solve(depths: number[]): number {
  const windowSums: number[] = getWindowSums(depths);
  return getIncreasedCount(windowSums);
}

function getWindowSums(depths: number[]): number[] {
  const windowSums: number[] = [];
  for (let i = window - 1; i < depths.length; i++) {
    let windowSum = 0;
    for (let j = 0; j < window; j++) {
      windowSum += depths[i - j];
    }
    windowSums.push(windowSum);
  }
  return windowSums;
}

function getIncreasedCount(data: number[]): number {
  let increasedCount = 0;
  for (let i = 1; i < data.length; i++) {
    if (data[i] > data[i - 1]) {
      increasedCount++;
    }
  }
  return increasedCount;
}