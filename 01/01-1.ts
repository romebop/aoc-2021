import { readFileSync } from 'fs';

const inputFile = process.argv.slice(2)[0];

const depths: number[] = readFileSync(inputFile, 'utf8')
  .split('\n')
  .map(e => +e);

console.log(solve(depths));

function solve(depths: number[]): number {
  let increasedCount = 0;
  for (let i = 1; i < depths.length; i++) {
    if (depths[i] > depths[i - 1]) {
      increasedCount++;
    }
  }
  return increasedCount;
}
