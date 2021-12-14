import { readFileSync } from 'fs';

const inputFile = process.argv.slice(2)[0];

interface Entry {
  patterns: string[];
  output: string[];
}

const entries: Entry[] = readFileSync(inputFile, 'utf8').split('\n')
  .map(s => s.split(' | '))
  .map(([p, o]) => ({ patterns: p.split(' '), output: o.split(' ') }));

const uniqueLens = [2, 4, 3, 7];

console.log(solve(entries));

function solve(entries: Entry[]): number {
  return entries.map(entry => entry.output)
    .reduce((totalSum, outputs: string[]) => (
      totalSum + outputs.reduce((entrySum, output: string) => (
        entrySum + (uniqueLens.includes(output.length) ? 1 : 0)
      ), 0)
    ), 0);
}
