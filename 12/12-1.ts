import { readFileSync } from 'fs';

const inputFile = process.argv.slice(2)[0];

const map: { [key: string]: string[] } = readFileSync(inputFile, 'utf8').split('\n')
  .map(str => str.split('-'))
  .reduce((map: { [key: string]: string[] }, [left, right]) => {
    map[left] ? map[left].push(right) : map[left] = [right];
    map[right] ? map[right].push(left) : map[right] = [left];
    return map;
  }, {});

console.log(solve(map));

function solve(map: { [key: string]: string[] }): number {
  return (getPaths(map) as string[]).length;
}

function getPaths(
  map: { [key: string]: string[] },
  currNode = 'start',
  soFar: string[] = [],
  visitLog = new Set<string>(),
  paths: string[] = [],
): string[] | void {
  if (currNode === 'start' && soFar.length > 0) return;
  if (currNode !== 'start' && /^[a-z]+$/.test(currNode) && visitLog.has(currNode)) return;
  if (currNode === 'end') {
    paths.push([...soFar, currNode].join(','));
    return;
  }
  map[currNode].forEach(node =>
    getPaths(map, node, [...soFar, currNode], new Set([...visitLog, currNode]), paths)
  );
  return paths;
}
