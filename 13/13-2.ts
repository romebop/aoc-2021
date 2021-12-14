import { readFileSync } from 'fs';

const inputFile = process.argv.slice(2)[0];

interface Point {
  x: number;
  y: number;
}

type Axis = 'x' | 'y';

interface Fold {
  axis: Axis;
  value: number;
}

const data = readFileSync(inputFile, 'utf8');

const dots: Point[] = data.split('\n\n')[0]
  .split('\n')
  .map(s => s.split(','))
  .map(([x, y]) => ({ x: +x, y: +y }));

const origami = initOrigami(dots);

const folds: Fold[] = data.split('\n\n')[1]
  .split('\n')
  .map(s => s.split(' ')[2].split('='))
  .map(([axis, value]) => ({ axis: axis as Axis, value: +value }));

console.log(solve(origami, folds));

function initOrigami(dots: Point[]): string[][] {
  const { maxX, maxY } = getMaxes(dots);
  const origami = Array(maxY + 1).fill('.').map(() => Array(maxX + 1).fill('.'));
  for (const { x, y } of dots) {
    origami[y][x] = '#';
  }
  return origami;
}

function getMaxes(dots: Point[]): { maxX: number, maxY: number } {
  return {
    maxX: dots.reduce((max, p) => Math.max(max, p.x), -Infinity),
    maxY: dots.reduce((max, p) => Math.max(max, p.y), -Infinity),
  };
}

function solve(origami: string[][], folds: Fold[]): string {
  for (const fold of folds) {
    origami = foldOrigami(origami, fold);
  }
  return getOrigamiStr(origami);
}

function foldOrigami(origami: string[][], fold: Fold): string[][] {
  let newOrigami: string[][];
  if (fold.axis === 'x') {
    newOrigami = Array(origami.length).fill('.').map(() => Array((origami[0].length - 1) / 2).fill('.'));
    for (let y = 0; y < newOrigami.length; y++) {
      for (let x = 0; x < newOrigami[0].length; x++) {
        newOrigami[y][x] = origami[y][x] === '#' ? '#' : newOrigami[y][x];
      }
    }
    for (let y = 0; y < newOrigami.length; y++) {
      for (let x = 0; x < newOrigami[0].length; x++) {
        newOrigami[y][x] = origami[y][origami[0].length - 1 - x] === '#' ? '#' : newOrigami[y][x];
      }
    }
  }
  if (fold.axis === 'y') {
    newOrigami = Array((origami.length - 1) / 2).fill('.').map(() => Array(origami[0].length).fill('.'));
    for (let y = 0; y < newOrigami.length; y++) {
      for (let x = 0; x < newOrigami[0].length; x++) {
        newOrigami[y][x] = origami[y][x] === '#' ? '#' : newOrigami[y][x];
      }
    }
    for (let y = 0; y < newOrigami.length; y++) {
      for (let x = 0; x < newOrigami[0].length; x++) {
        newOrigami[y][x] = origami[origami.length - 1 - y][x] === '#' ? '#' : newOrigami[y][x];
      }
    }
  }
  return newOrigami!;
}

function getOrigamiStr(origami: string[][]): string {
  let origamiStr = '';
  for (const row of origami) {
    origamiStr += row.join('') + '\n';
  }
  return origamiStr;
}
