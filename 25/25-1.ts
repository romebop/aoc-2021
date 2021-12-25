import { readFileSync } from 'fs';

const inputFile = process.argv.slice(2)[0];

const map: string[][] = readFileSync(inputFile, 'utf8').split('\n')
  .map(s => s.split(''));

console.log(solve(map));

function solve(map: string[][]): number | void {
  const initMapStr = getMapStr(map);
  let prevMapStr = initMapStr;
  for (let step = 1; step < Infinity; step++) {
    let newMap = JSON.parse(JSON.stringify(map));
    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[0].length; x++) {
        if (map[y][x] === '>' && map[y][(x + 1) % map[0].length] === '.') {
          newMap[y][x] = '.';
          newMap[y][(x + 1) % map[0].length] = '>';
        }
      }
    }
    map = newMap;
    newMap = JSON.parse(JSON.stringify(map));
    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[0].length; x++) {
        if (map[y][x] === 'v' && map[(y + 1) % map.length][x] === '.') {
          newMap[y][x] = '.';
          newMap[(y + 1) % map.length][x] = 'v';
        }
      }
    }
    map = newMap;
    const mapStr = getMapStr(map);
    if (mapStr === prevMapStr) return step;
    prevMapStr = mapStr;
  }
}

function getMapStr(map: string[][]): string {
  return map.reduce((mapStr, row) => (
    mapStr + row.join('') + '\n'
  ), '');
}
