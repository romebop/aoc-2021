import { readFileSync } from 'fs';

const inputFile = process.argv.slice(2)[0];

interface Point {
  x: number;
  y: number;
}

interface Line {
  p1: Point;
  p2: Point;
}

const lines: Line[] = readFileSync(inputFile, 'utf8').split('\n')
  .map(lineStr => {
    const [p1, p2]: Point[] = lineStr.split(' -> ')
      .map(pointStr => {
        const [xStr, yStr] = pointStr.split(',');
        return { x: +xStr, y: +yStr };
      });
    return { p1, p2 };
  })
  .filter(({ p1, p2 }) => (p1.x === p2.x) || (p1.y === p2.y));

console.log(solve(lines));

function solve(lines: Line[]): number {
  const map: { [key: string]: number } = {};
  for (const line of lines) {
    const currPoint = { ...line.p1 };
    recordPoint(line.p2, map);
    while (!isSamePoint(currPoint, line.p2)) {
      recordPoint(currPoint, map);
      if (line.p2.x > currPoint.x) currPoint.x++;
      if (line.p2.x < currPoint.x) currPoint.x--;
      if (line.p2.y > currPoint.y) currPoint.y++;
      if (line.p2.y < currPoint.y) currPoint.y--;
    }
  }
  return Object.keys(map).reduce((count, point) => (
    count + (map[point] >= 2 ? 1 : 0) 
  ), 0);
}

function isSamePoint(p1: Point, p2: Point): boolean {
  return (p1.x === p2.x) && (p1.y === p2.y); 
}

function recordPoint(point: Point, map: { [key: string]: number }): void {
  const pointStr = JSON.stringify(point);
  if (map.hasOwnProperty(pointStr)) {
    map[pointStr]++;
  } else {
    map[pointStr] = 1;
  }
}