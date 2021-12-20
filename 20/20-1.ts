import { readFileSync } from 'fs';

const inputFile = process.argv.slice(2)[0];

const data = readFileSync(inputFile, 'utf8').split('\n\n');

const imageEnhancementAlgorithmString: string = data[0];

const image: string[][] = data[1].split('\n')
  .map(s => s.split(''));

const doesToggle: boolean = imageEnhancementAlgorithmString[0] === '#';

type Mode = 'lit' | 'unlit';

type Point = { x: number, y: number };

const litSet: Set<string> = getLitSet(image);

const applyCount = 2;

console.log(solve(litSet, imageEnhancementAlgorithmString, applyCount, doesToggle));

function getLitSet(image: string[][]): Set<string> {
  const litSet = new Set<string>();
  for (let y = 0; y < image.length; y++) {
    for (let x = 0; x < image[0].length; x++) {
      if (image[y][x] === '#') {
        const sp = serializePoint({ x, y });
        litSet.add(sp);
      }
    }
  }
  return litSet;
}

function solve(litSet: Set<string>, ieas: string, applyCount: number, doesToggle: boolean): number {
  let unlitSet: Set<string>;
  console.log(getImageStr(litSet, 'lit'));
  for (let applyStep = 1; applyStep <= applyCount; applyStep++) {
    if (doesToggle) {
      if (applyStep % 2 === 1) {
        unlitSet = enhanceImage(litSet, ieas, true, 'unlit');
        console.log(getImageStr(unlitSet, 'unlit'));
      } else {
        litSet = enhanceImage(unlitSet!, ieas, true, 'lit');
        console.log(getImageStr(litSet, 'lit'));
      }
    } else {
      litSet = enhanceImage(litSet, ieas);
      console.log(getImageStr(litSet, 'lit'));
    }
  }
  return litSet.size;
}

function enhanceImage(set: Set<string>, ieas: string, doesToggle = false, mode: Mode = 'lit'): Set<string> {
  const newSet = new Set<string>();
  if (doesToggle) {
    if (mode === 'unlit') {
      for (const litPoint of [...set].map(deserializePoint)) {
        for (const checkPoint of getSquare(litPoint)) {
          if (newSet.has(serializePoint(checkPoint))) continue;
          const enhancedPixel = getEnhancedPixel(checkPoint, set, ieas, 'lit');
          if (enhancedPixel === '.') {
            newSet.add(serializePoint(checkPoint));
          }
        }
      }
    } else { // mode === 'lit'
      for (const unlitPoint of [...set].map(deserializePoint)) {
        for (const checkPoint of getSquare(unlitPoint)) {
          if (newSet.has(serializePoint(checkPoint))) continue;
          const enhancedPixel = getEnhancedPixel(checkPoint, set, ieas, 'unlit');
          if (enhancedPixel === '#') {
            newSet.add(serializePoint(checkPoint));
          }
        }
      }
    }
  } else {
    for (const litPoint of [...set].map(deserializePoint)) {
      for (const checkPoint of getSquare(litPoint)) {
        if (newSet.has(serializePoint(checkPoint))) continue;
        const enhancedPixel = getEnhancedPixel(checkPoint, set, ieas);
        if (enhancedPixel === '#') {
          newSet.add(serializePoint(checkPoint));
        }
      }
    }
  }
  return newSet;
}

function getEnhancedPixel(point: Point, set: Set<string>, ieas: string, mode: Mode = 'lit'): string {
  const bin = getSquare(point).map(serializePoint)
    .map(s => mode === 'lit' ? (set.has(s) ? 1 : 0) : (set.has(s) ? 0 : 1))
    .join('');
  return ieas[parseInt(bin, 2)];
}

function getSquare(point: Point): Point[] {
  const squarePoints: Point[] = [];
  for (let y = point.y - 1; y <= point.y + 1; y++) {
    for (let x = point.x - 1; x <= point.x + 1; x++) {
      squarePoints.push({ x, y });
    }
  }
  return squarePoints;
}

function serializePoint({ x, y }: Point): string {
  return `(${x},${y})`;
}

function deserializePoint(sp: string): Point {
  const [x, y] = sp.slice(1, -1).split(',').map(e => +e);
  return { x, y };
}

function getImageStr(set: Set<string>, mode: Mode, padding = 4): string {
  let points = [...set].map(deserializePoint);
  const [minX, maxX, minY, maxY] = getMinMax(points);
  points = points.map(p => translatePoint(p, minX, minY));
  const image: string[][] = Array(maxX - minX + padding * 2 + 1).fill(null)
    .map(() => Array(maxY - minY + padding * 2 + 1).fill(mode === 'lit' ? '.' : '#'));
  for (const { x, y } of points) {
    image[y + padding][x + padding] = mode === 'lit' ? '#' : '.';
  }
  return image.reduce((imageStr, row) => (
    imageStr + row.join('') + '\n'
  ), '');
}

function getMinMax(points: Point[]): number[] {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const point of points) {
    minX = Math.min(point.x, minX);
    maxX = Math.max(point.x, maxX);
    minY = Math.min(point.y, minY);
    maxY = Math.max(point.y, maxY);
  }
  return [minX, maxX, minY, maxY];
}

function translatePoint(point: Point, minX: number, minY: number): Point {
  return { x: point.x - minX, y: point.y - minY };
}
