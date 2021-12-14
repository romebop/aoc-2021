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
  ')': 1,
  ']': 2,
  '}': 3,
  '>': 4,
};

console.log(solve(lines));

function solve(lines: string[]): number {
  const scores = lines.filter(line => !isCorruptedLine(line))
    .map(line => getCompletionSeq(line))
    .map(seq => getScore(seq))
    .sort((a, b) => a > b ? 1 : -1);
  return scores[Math.floor(scores.length / 2)];
}

function isCorruptedLine(line: string): boolean {
  const stack: string[] = [];
  for (const char of line) {
    if (Object.keys(pairMap).includes(char)) stack.push(char);
    if (
      Object.values(pairMap).includes(char)
      && pairMap[stack.pop()!] !== char
    ) return true;
  }
  return false;
}

function getCompletionSeq(incompleteLine: string): string[] {
  const stack: string[] = [];
  for (const char of incompleteLine) {
    if (Object.keys(pairMap).includes(char)) stack.push(char);
    if (Object.values(pairMap).includes(char)) stack.pop();
  }
  return stack.reverse().map(char => pairMap[char]);
}

function getScore(seq: string[]): number {
  return seq.reduce((score, char) => (
    score * 5 + scoreTable[char]
  ), 0);
}
