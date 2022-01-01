import { readFileSync } from 'fs';
import Heap from 'heap-js';

const inputFile = process.argv.slice(2)[0];

const startMap: string[][] = deserializeMap(readFileSync(inputFile, 'utf8'));
startMap.splice(
  3,
  0,
  ...deserializeMap(
    `  #D#C#B#A#
  #D#B#A#C#`
  ),
);

const endMap: string[][] = deserializeMap(
`#############
#...........#
###A#B#C#D###
  #A#B#C#D#
  #A#B#C#D#
  #A#B#C#D#
  #########`
);

const stepEnergyMap: Record<string, number> = {
  A: 1,
  B: 10,
  C: 100,
  D: 1000,
};

type Point = { x: number, y: number };

console.log(solve(startMap, endMap));

function solve(startMap: string[][], endMap: string[][]): number {
  const costs = new Map<string, number>();
  const remaining = new Heap((a: string, b: string) => costs.get(a)! - costs.get(b)!);
  const prev = new Map<string, string>();
  costs.set(serializeMap(startMap), 0);
  remaining.push(serializeMap(startMap));
  while (remaining.length) {
    const sm = remaining.pop()!;
    const m: string[][] = deserializeMap(sm);
    for (const n of getAdjacentMaps(m, endMap)) {
      const sn = serializeMap(n);
      const newCost = costs.get(sm)! + getEnergyCost(m, n);
      const oldCost = (costs.has(sn) ? costs.get(sn)! : Infinity);
      if (newCost < oldCost) {
        costs.set(sn, newCost);
        remaining.push(sn);
        prev.set(sn, sm);
      }
    }
  }
  console.log(getPathStr(prev, serializeMap(endMap)));
  return costs.get(serializeMap(endMap))!;
}

function getAdjacentMaps(map: string[][], endMap: string[][]): string[][][] {
  const adjacentMaps: string[][][] = [];
  for (const a of getAmphipods(map)) {
    for (const d of getDestinations(map, endMap, a)) {
      const newMap = JSON.parse(JSON.stringify(map));
      newMap[d.y][d.x] = newMap[a.y][a.x];
      newMap[a.y][a.x] = '.';
      adjacentMaps.push(newMap);
    }
  }
  return adjacentMaps;
}

function getAmphipods(map: string[][]): Point[] {
  const amphipods: Point[] = [];
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      if (Object.keys(stepEnergyMap).includes(map[y][x])) {
        amphipods.push({ x, y });
      }
    }
  }
  return amphipods;
}

function getDestinations(map: string[][], endMap: string[][], a: Point): Point[] {
  return getReachables(map, a, a)!.filter((r: Point) => {
    if (
      (isInsideRoom(map, a) && (
        isInsideCompleteRoom(map, endMap, a)
        || !hasInvaders(map, endMap, a)
        || isInsideRoom(map, r)
        || isRightOutsideRoom(map, r)
      ))
      || (!isInsideRoom(map, a) && (
        !isInsideRoom(map, r)
        || !isDestinationRoom(map, endMap, a, r)
        || hasInvaders(map, endMap, r)
        || !isLastReachable(map, r)
      ))
    ) return false;
    return true;
  });
}

function getReachables(map: string[][], p: Point, o: Point, visitLog = new Set(), reachables: Point[] = []): Point[] | void {
  if (visitLog.has(serializePoint(p))) return;
  if (map[p.y][p.x] !== '.' && p !== o) return;
  visitLog.add(serializePoint(p));
  if (p !== o) reachables.push(p);
  getAdjacentPoints(p).forEach(n => getReachables(map, n, o, visitLog, reachables));
  return reachables;
}

function getAdjacentPoints(p: Point): Point[] {
  return [
    { x: p.x + 1, y: p.y },
    { x: p.x - 1, y: p.y },
    { x: p.x, y: p.y + 1 },
    { x: p.x, y: p.y - 1 },
  ];
}

function isInsideRoom(map: string[][], p: Point): boolean {
  return (map[p.y][p.x - 1] === '#' && map[p.y][p.x + 1] === '#')
    && (p.y <= map.length - 2 && p.y >= 2);
}

function isInsideCompleteRoom(map: string[][], end: string[][], p: Point): boolean {
  for (let y = 2; y < map.length - 1; y++) {
    if (map[y][p.x] !== end[y][p.x]) return false;
  }
  return true;
}

function hasInvaders(map: string[][], end: string[][], p: Point): boolean {
  for (let y = 2; y < map.length - 1; y++) {
    if (map[y][p.x] !== end[y][p.x] && map[y][p.x] !== '.') return true;
  }
  return false;
}

function isRightOutsideRoom(map: string[][], p: Point): boolean {
  return map[p.y + 1][p.x] !== '#';
}

function isDestinationRoom(map: string[][], end: string[][], p: Point, r: Point): boolean {
  return map[p.y][p.x] === end[r.y][r.x];
}

function isLastReachable(map: string[][], p: Point): boolean {
  return map[p.y + 1][p.x] !== '.';
}

function getEnergyCost(m1: string[][], m2: string[][]): number {
  const ps: Point[] = [];
  let amphipodType = null;
  for (let y = 0; y < m1.length; y++) {
    for (let x = 0; x < m1[0].length; x++) {
      if (m1[y][x] !== m2[y][x]) {
        amphipodType = m1[y][x] !== '.' ? m1[y][x] : m2[y][x];
        ps.push({ x, y });
      }
    }
  }
  return getManhattanDistance(ps[0], ps[1]) * stepEnergyMap[amphipodType!];
}

function getManhattanDistance(p1: Point, p2: Point): number {
  return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
}

function serializeMap(map: string[][]): string {
  return map.reduce((str, row, idx, arr) => (
    str + row.join('') + (idx < arr.length - 1 ? '\n' : '')
  ), '');
}

function deserializeMap(str: string): string[][] {
  return str.split('\n').map(s => s.split(''));
}

function serializePoint(p: Point) {
  return `(${p.x},${p.y})`;
}

function getPathStr(prev: Map<string, string>, sm: string): string {
  const path: string[] = [sm];
  while (prev.has(sm)) {
    sm = prev.get(sm)!;
    path.push(sm);
  }
  return path.reverse()
    .map((m, idx, arr) => m + (idx < arr.length - 1 ? '\n\n' : '\n'))
    .join('');
}
