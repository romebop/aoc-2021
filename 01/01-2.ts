import { readFileSync } from 'fs';

const inputFile = process.argv.slice(2)[0];

const depths: number[] = readFileSync(inputFile, 'utf8')
  .split('\n')
  .map(e => +e);

const windowSize = 3;

console.log(solve(depths));

function solve(depths: number[]): number {
  let increaseCount = 0;
  for (let i = windowSize; i < depths.length; i++) {
    const prevWindow = depths.slice(i - windowSize, i).reduce((a, c) => a + c, 0);
    const currWindow = depths.slice(i - windowSize + 1, i + 1).reduce((a, c) => a + c, 0);
    if (currWindow > prevWindow) {
      increaseCount++;
    }
  }
  return increaseCount;
}
