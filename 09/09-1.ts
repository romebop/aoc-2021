import { readFileSync } from 'fs';

const inputFile = process.argv.slice(2)[0];

const heightMap: number[][] = readFileSync(inputFile, 'utf8').split('\n')
  .map(row => row.split('').map(e => +e));

console.log(solve(heightMap));

function solve(heightMap: number[][]): number {
  const riskLevels: number[] = [];
  for (let y = 0; y < heightMap.length; y++) {
    for (let x = 0; x < heightMap[0].length; x++) {
      if (isLowPoint(heightMap, x, y)) {
        riskLevels.push(1 + heightMap[y][x]);
      } 
    }
  }
  return riskLevels.reduce((a, c) => a + c, 0);
}

function isLowPoint(heightMap: number[][], x: number, y: number): boolean {
  return getAdjacentHeights(heightMap, x, y).every(h => h > heightMap[y][x]);
}

function getAdjacentHeights(heightMap: number[][], x: number, y: number): number[] {
  const adjacentHeights: number[] = [];
  if (x > 0) adjacentHeights.push(heightMap[y][x - 1]);
  if (x < heightMap[0].length - 1) adjacentHeights.push(heightMap[y][x + 1]);
  if (y > 0) adjacentHeights.push(heightMap[y - 1][x]);
  if (y < heightMap.length - 1) adjacentHeights.push(heightMap[y + 1][x]);
  return adjacentHeights;
}