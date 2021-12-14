import { readFileSync } from 'fs';

const inputFile = process.argv.slice(2)[0];

const octoGrid: number[][] = readFileSync(inputFile, 'utf8').split('\n')
  .map(rowStr => rowStr.split('').map(e => +e));

const numSteps = 100;

console.log(solve(octoGrid, numSteps));

function solve(octoGrid: number[][], numSteps: number): number {
  let numFlash = 0;
  for (let step = 0; step < numSteps; step++) {
    for (let y = 0; y < octoGrid.length; y++) {
      for (let x = 0; x < octoGrid[0].length; x++) {
        octoGrid[y][x]++;
      }
    }
    const flashLog = new Set<string>();
    while (flashLog.size !== getNumFlashable(octoGrid)) {
      for (let y = 0; y < octoGrid.length; y++) {
        for (let x = 0; x < octoGrid[0].length; x++) {
          if (octoGrid[y][x] > 9 && !flashLog.has(serializePoint(x, y))) {
            numFlash++;
            flashLog.add(serializePoint(x, y));
            updateAdjOctos(octoGrid, x, y);
          }
        }
      }
    }
    for (let y = 0; y < octoGrid.length; y++) {
      for (let x = 0; x < octoGrid[0].length; x++) {
        if (octoGrid[y][x] > 9) {
          octoGrid[y][x] = 0;
        }
      }
    }
  }
  return numFlash;
}

function updateAdjOctos(octoGrid: number[][], x: number, y: number): void {
  for (let j = y - 1; j <= y + 1; j++) {
    for (let i = x - 1; i <= x + 1; i++) {
      if (
        j < 0 || j >= octoGrid.length
        || i < 0 || i >= octoGrid[0].length
        || (j === y && i === x)
      ) continue;
      octoGrid[j][i]++;
    }
  }
}

function getNumFlashable(octoGrid: number[][]): number {
  return octoGrid.reduce((totalNum, row) => (
    totalNum + row.reduce((rowNum, octo) => (
      rowNum + (octo > 9 ? 1 : 0)
    ), 0)
  ), 0);
}

function serializePoint(x: number, y: number): string {
  return `(${x},${y})`;
}
