import { readFileSync } from 'fs';

const inputFile = process.argv.slice(2)[0];

const report: string[] = readFileSync(inputFile, 'utf8').split('\n');

console.log(solve(report));

function solve(report: string[]): number {
  let gammaRate = '';
  let epsilonRate = '';
  for (let i = 0; i < report[0].length; i++) {
    const sum = report.reduce((sum, binary) => sum + +binary[i], 0);
    gammaRate += (sum > report.length / 2) ? '1' : '0';
    epsilonRate += (sum < report.length / 2) ? '1' : '0';
  }
  return parseInt(gammaRate, 2) * parseInt(epsilonRate, 2);
}
