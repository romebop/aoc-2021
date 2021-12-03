import { readFileSync } from 'fs';

const inputFile = process.argv.slice(2)[0];

const report: string[] = readFileSync(inputFile, 'utf8').split('\n');

type Molecule = 'oxygen' | 'co2';

console.log(solve(report));

function solve(report: string[]): number {
  const oxygenRating = getRating([...report], 'oxygen') as string;
  const co2Rating = getRating([...report], 'co2') as string;
  return parseInt(oxygenRating, 2) * parseInt(co2Rating, 2);
}

function getRating(report: string[], molecule: Molecule): string | undefined {
  for (let i = 0; i < report[0].length; i++) {
    const sum = report.reduce((sum, binary) => sum + +binary[i], 0);
    report = report.filter(binary => {
      switch (molecule) {
        case 'oxygen':
          return binary[i] === ((sum >= report.length / 2) ? '1' : '0')
        case 'co2':
          return binary[i] === ((sum >= report.length / 2) ? '0' : '1')
      }
    });
    if (report.length === 1) return report[0];
  }
}