import { readFileSync } from 'fs';

const inputFile = process.argv.slice(2)[0];

const posList: number[] = readFileSync(inputFile, 'utf8').split(',')
  .map(e => +e);

console.log(solve(posList));

function solve(posList: number[]): number {
  posList.sort((a, b) => a > b ? 1 : -1);
  const minPos = posList[0];
  const maxPos = posList[posList.length - 1];
  let minTotalFuel = Infinity;
  for (let pos = minPos; pos <= maxPos; pos++) {
    const currTotalFuel = getTotalFuel(posList, pos);
    if (currTotalFuel < minTotalFuel) {
      minTotalFuel = currTotalFuel;
    }
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