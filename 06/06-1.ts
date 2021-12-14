import { readFileSync } from 'fs';

const inputFile = process.argv.slice(2)[0];

const ages: number[] = readFileSync(inputFile, 'utf8').split(',')
  .map(e => +e);

const numDays = 80;

console.log(solve(ages, numDays));

function solve(ages: number[], numDays: number) {
  for (let i = 0; i < numDays; i++) {
    const updatedAges: number[] = [];
    const newAges: number[] = [];
    for (const age of ages) {
      if (age === 0) {
        updatedAges.push(6);
        newAges.push(8);
      } else {
        updatedAges.push(age - 1);
      }
    }
    ages = [...updatedAges, ...newAges];
  }
  return ages.length;
}
