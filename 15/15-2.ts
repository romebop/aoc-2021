import { readFileSync } from 'fs';
import Heap from 'heap-js';

const inputFile = process.argv.slice(2)[0];

const map: number[][] = readFileSync(inputFile, 'utf8').split('\n')
  .map(s => s.split('').map(e => +e));

console.log(solve(map));

type Point = { x: number; y: number; };

function solve(map: number[][]): number {
  const fullMap = getFullMap(map, 5);
  const start: Point = { x: 0, y: 0 };
  const end: Point = { x: fullMap[0].length - 1, y: fullMap.length - 1 };
  return dijkstra(fullMap, start, end);
}

function getFullMap(map: number[][], multiplier: number): number[][] {
  const fullMap = Array(map.length * multiplier).fill(0)
    .map(() => Array(map[0].length * multiplier).fill(0));
  for (let j = 0; j < multiplier; j++) {
    for (let i = 0; i < multiplier; i++) {
      for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[0].length; x++) {
          fullMap[y + (map.length * j)][x + (map[0].length * i)] = ((map[y][x] - 1 + i + j) % 9) + 1;
        }
      }
    }
  }
  return fullMap;
}

function dijkstra(map: number[][], start: Point, end: Point): number {
  const distances = new Map<string, number>();
  const remaining = new Heap((a: string, b: string) =>
    distances.get(a)! > distances.get(b)! ? 1 : -1
  );
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      const p = { x, y };
      const sp = serializePoint(p);
      distances.set(sp, Infinity);
    }
  }
  distances.set(serializePoint(start), 0);
  remaining.push(serializePoint(start));
  while (remaining.length) {
    const sp = remaining.pop()!;
    const p: Point = deserializePoint(sp);
    for (const n of getAdjacentPoints(map, p)) {
      const sn = serializePoint(n);
      const newPathVal = distances.get(sp)! + map[n.y][n.x];
      const oldPathVal = distances.get(sn)!;
      if (newPathVal < oldPathVal) {
        distances.set(sn, newPathVal);
        remaining.push(sn);
      }
    }
  }
  return distances.get(serializePoint(end))!;
}

function getAdjacentPoints(map: number[][], { x, y }: Point): Point[] {
  const adjacentPoints: Point[] = [];
  if (x > 0) adjacentPoints.push({ x: x - 1, y });
  if (x < map[0].length - 1) adjacentPoints.push({ x: x + 1, y });
  if (y > 0) adjacentPoints.push({ x, y: y - 1 });
  if (y < map.length - 1) adjacentPoints.push({ x, y: y + 1 });
  return adjacentPoints;
}

function serializePoint({ x, y }: Point): string {
  return `(${x},${y})`;
}

function deserializePoint(str: string): Point {
  const [x, y] = str.slice(1, -1).split(',').map(e => +e);
  return { x, y };
}

// TODO:

// function Astar() {}

// function getDistance({ x: x1, y: y1 }: Point, { x: x2, y: y2 }: Point): number {
//   return Math.sqrt(((x1 - x2) ** 2) + ((y1 - y2) ** 2));
// }
