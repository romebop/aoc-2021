import { readFileSync } from 'fs';

const inputFile = process.argv.slice(2)[0];

const depths: number[] = readFileSync(inputFile, 'utf8')
  .split('\n')
  .map(e => +e);

const window = 3;

console.log(solve(depths));

function solve(depths: number[]): number {
  const measurements: number[] = getMeasurements(depths);
  return getIncreasedCount(measurements);
}

function getMeasurements(depths: number[]): number[] {
  const measurements: number[] = [];
  for (let i = window - 1; i < depths.length; i++) {
    let sum = 0;
    for (let j = 0; j < window; j++) {
      sum += depths[i - j];
    }
    measurements.push(sum);
  }
  return measurements;
}

function getIncreasedCount(measurements: number[]): number {
  let increasedCount = 0;
  for (let i = 1; i < measurements.length; i++) {
    const previousMeasurement = measurements[i - 1];
    const currentMeasurement = measurements[i];
    if (currentMeasurement > previousMeasurement) {
      increasedCount++;
    }
  }
  return increasedCount;
}