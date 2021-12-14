import { readFileSync } from 'fs';

const inputFile = process.argv.slice(2)[0];

const ages: number[] = readFileSync(inputFile, 'utf8').split(',')
  .map(e => +e);

const numDays = 18;
const spawnCycle = 7;

console.log(solve(ages, numDays, spawnCycle));

function solve(ages: number[], numDays: number, spawnCycle: number) {
  return ages.reduce((count, age) => (
    count + 1 + getNumDescendants(age, numDays, spawnCycle)
  ), 0);
}

function getNumDescendants(age: number, numDays: number, spawnCycle: number) {
  let count = 0;
  for (let d = numDays - age; d > 0; d -= spawnCycle) {
    count += 1 + getNumDescendants(8, d - 1, spawnCycle);
  }
  return count;
}
