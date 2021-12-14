import { readFileSync } from 'fs';

const inputFile = process.argv.slice(2)[0];

const lines: string[] = readFileSync(inputFile, 'utf8').split('\n');

const pairMap: { [key: string]: string } = {
  '(': ')',
  '[': ']',
  '{': '}',
  '<': '>',
};

const scoreTable: { [key: string]: number } = {
  ')': 3,
  ']': 57,
  '}': 1197,
  '>': 25137,
};

console.log(solve(lines));

function solve(lines: string[]): number {
  return lines.map(line => getFirstIllegalChar(line))
    .filter(e => e !== null)
    .map(illegalChar => scoreTable[illegalChar!])
    .reduce((a, c) => a + c, 0);
}

function getFirstIllegalChar(line: string): string | null {
  const stack: string[] = [];
  for (const char of line) {
    if (Object.keys(pairMap).includes(char)) stack.push(char);
    if (
      Object.values(pairMap).includes(char)
      && pairMap[stack.pop()!] !== char
    ) return char;
  }
  return null;
}
