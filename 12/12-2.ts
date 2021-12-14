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
  usedTwice = false,
  paths: string[] = [],
): string[] | void {
  if (currNode === 'start' && soFar.length > 0) return;
  if (
    currNode !== 'start'
    && /^[a-z]+$/.test(currNode)
    && visitLog.has(currNode)
    && usedTwice
  ) return;
  if (currNode === 'end') {
    paths.push([...soFar, currNode].join(','));
    return;
  }
  map[currNode].forEach(node => {
    if (!usedTwice && /^[a-z]+$/.test(currNode) && visitLog.has(currNode)) {
      getPaths(map, node, [...soFar, currNode], new Set([...visitLog]), true, paths);
    } else {
      getPaths(map, node, [...soFar, currNode], new Set([...visitLog, currNode]), usedTwice, paths);
    }
  });
  return paths;
}
