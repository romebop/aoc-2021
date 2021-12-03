import { readFileSync } from 'fs';

const inputFile = process.argv.slice(2)[0];

const report: string[] = readFileSync(inputFile, 'utf8').split('\n');

console.log(solve(report));

function solve(report: string[]): number {
  const oxygenRating = getOxygenRating([...report]) as string;
  const co2Rating = getCo2Rating([...report]) as string;
  return parseInt(oxygenRating, 2) * parseInt(co2Rating, 2);
}

function getOxygenRating(report: string[]): string | undefined {
  for (let i = 0; i < report[0].length; i++) {
    const sum = report.reduce((sum, binary) => sum + +binary[i], 0);
    report = report.filter(binary =>
      binary[i] === ((sum >= report.length / 2) ? '1' : '0')
    );
    if (report.length === 1) return report[0];
  }
}

function getCo2Rating(report: string[]): string | undefined {
  for (let i = 0; i < report[0].length; i++) {
    const sum = report.reduce((sum, binary) => sum + +binary[i], 0);
    report = report.filter(binary =>
      binary[i] === ((sum >= report.length / 2) ? '0' : '1')
    );
    if (report.length === 1) return report[0];
  }
}