import { readFileSync } from 'fs';

const inputFile = process.argv.slice(2)[0];

const posList: number[] = readFileSync(inputFile, 'utf8').split(',')
  .map(e => +e);

console.log(solve(posList));

function solve(posList: number[]): number {
  const minPos = Math.min(...posList);
  const maxPos = Math.max(...posList);
  let minTotalFuel = Infinity;
  for (let testPos = minPos; testPos <= maxPos; testPos++) {
    minTotalFuel = Math.min(getTotalFuel(posList, testPos), minTotalFuel);
  }
  return minTotalFuel;
}

function getTotalFuel(posList: number[], targetPos: number): number {
  return posList.reduce((totalFuel, currPos) => (
    totalFuel + getFuel(currPos, targetPos)
  ), 0);
}

function getFuel(pos1: number, pos2: number) {
  const diff = Math.abs(pos1 - pos2);
  return diff * (1 + diff) / 2;
}