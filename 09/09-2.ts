import { readFileSync } from 'fs';

const inputFile = process.argv.slice(2)[0];

const heightMap: number[][] = readFileSync(inputFile, 'utf8').split('\n')
  .map(row => row.split('').map(e => +e));

interface Point {
  x: number,
  y: number,
}

console.log(solve(heightMap));

function solve(heightMap: number[][]): number {
  const basinSizes: number[] = getLowPoints(heightMap)
    .map(p => getBasinSize(heightMap, p));
  basinSizes.sort((a, b) => a > b ? -1 : 1);
  return basinSizes[0] * basinSizes[1] * basinSizes[2];
}

function getBasinSize(heightMap: number[][], point: Point, visitLog = new Set<string>()): number {
  if (visitLog.has(serializePoint(point))) return 0;
  visitLog.add(serializePoint(point));
  return 1 + getAdjacentPoints(heightMap, point)
    .filter(({ x, y }) => heightMap[y][x] > heightMap[point.y][point.x] && heightMap[y][x] !== 9)
    .map(adjPoint => getBasinSize(heightMap, adjPoint, visitLog))
    .reduce((a, c) => a + c, 0);
}

function getLowPoints(heightMap: number[][]): Point[] {
  const lowPoints: Point[] = [];
  for (let y = 0; y < heightMap.length; y++) {
    for (let x = 0; x < heightMap[0].length; x++) {
      const point = { x, y };
      if (isLowPoint(heightMap, point)) {
        lowPoints.push(point);
      } 
    }
  }
  return lowPoints;
}

function isLowPoint(heightMap: number[][], point: Point): boolean {
  return getAdjacentPoints(heightMap, point)
    .map(({ x, y }) => heightMap[y][x])
    .every(adjHeight => adjHeight > heightMap[point.y][point.x]);
}

function getAdjacentPoints(heightMap: number[][], { x, y }: Point): Point[] {
  const adjacentPoints: Point[] = [];
  if (x > 0) adjacentPoints.push({ x: x - 1, y });
  if (x < heightMap[0].length - 1) adjacentPoints.push({ x: x + 1, y });
  if (y > 0) adjacentPoints.push({ x, y: y - 1 });
  if (y < heightMap.length - 1) adjacentPoints.push({ x, y: y + 1 });
  return adjacentPoints;
}

function serializePoint({ x, y }: Point): string {
  return `(${x},${y})`;
}