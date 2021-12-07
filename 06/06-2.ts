import { readFileSync } from 'fs';

const inputFile = process.argv.slice(2)[0];

const ages: number[] = readFileSync(inputFile, 'utf8').split(',')
  .map(e => +e);

const numDays = 256;
const lenCycle = 7;
const lenFirstCycle = lenCycle + 2;

console.log(solve(ages, numDays, lenCycle, lenFirstCycle));

function solve(
  ages: number[],
  numDays: number,
  lenCycle: number,
  lenFirstCycle: number,
) {
  const maxAge = Math.max(lenCycle - 1, lenFirstCycle - 1);
  let ageCountMap = initAgeCountMap(maxAge);
  for (const age of ages) {
    ageCountMap[age]++;
  }
  for (let day = 1; day <= numDays; day++) {
    const updatedAgeCountMap = initAgeCountMap(maxAge);
    for (let age = 0; age <= maxAge; age++) {
      const updateAges = age === 0
        ? [lenCycle - 1, lenFirstCycle - 1]
        : [age - 1];
      for (const updateAge of updateAges) {
        updatedAgeCountMap[updateAge] += ageCountMap[age]
      }
    }
    ageCountMap = updatedAgeCountMap;
  }
  return Object.values(ageCountMap).reduce((totalCount, ageCount) => (
    totalCount + ageCount
  ), 0);
}

function initAgeCountMap(maxAge: number): { [key: number]: number } {
  const ageCountMap: { [key: number]: number } = {};
  for (let age = 0; age <= maxAge; age++) {
    ageCountMap[age] = 0;
  }
  return ageCountMap;
}