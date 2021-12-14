import { readFileSync } from 'fs';

const inputFile = process.argv.slice(2)[0];

interface Entry {
  patterns: string[];
  output: string[];
}

const entries: Entry[] = readFileSync(inputFile, 'utf8').split('\n')
  .map(s => s.split(' | '))
  .map(([p, o]) => ({
    patterns: p.split(' ')
      .map(s => s.split('').sort().join(''))
      .sort((a, b) => a.length > b.length ? 1 : -1),
    output: o.split(' ')
      .map(s => s.split('').sort().join('')),
  }));

console.log(solve(entries));

function solve(entries: Entry[]): number {
  return entries.reduce((sum, entry) => sum + getOutput(entry), 0);
}

function getOutput(entry: Entry): number {
  const map: { [key: string]: string } = {};
  const reverseMap: { [key: string]: string } = {};
  for (const pattern of entry.patterns) {
    switch (pattern.length) {
      case 2:
        map[pattern] = '1';
        break;
      case 3:
        map[pattern] = '7';
        reverseMap['7'] = pattern;
        break;
      case 4:
        map[pattern] = '4';
        reverseMap['4'] = pattern;
        break;
      case 5:
        if (includesChars(pattern, reverseMap['7'])) {
          map[pattern] = '3';
        } else if (numCommonChars(pattern, reverseMap['4']) === 2) {
          map[pattern] = '2';
        } else {
          map[pattern] = '5';
          reverseMap['5'] = pattern;
        }
        break;
      case 6:
        if (includesChars(pattern, reverseMap['4'])) {
          map[pattern] = '9';
        } else if (includesChars(pattern, reverseMap['5'])) {
          map[pattern] = '6';
        } else {
          map[pattern] = '0';
        }
        break;
      case 7:
        map[pattern] = '8';
        break;
    }
  }
  return +entry.output.reduce((s, d) => s + map[d], '');
}

function numCommonChars(s1: string, s2: string): number {
  return s1.split('').reduce((n, c) => (
    n + (s2.includes(c) ? 1 : 0)
  ), 0);
}

function includesChars(targetStr: string, testStr: string): boolean {
  return testStr.split('').reduce((b: boolean, c) => (
    b && targetStr.includes(c)
  ), true);
}
