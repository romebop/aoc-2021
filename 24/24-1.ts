import { readFileSync } from 'fs';

const inputFile = process.argv.slice(2)[0];

type DigitType = 'zPlus' | 'zMinus';
type DigitInfo = { type: DigitType, critVal: number };

const digitInfos: DigitInfo[] = readFileSync(inputFile, 'utf8').split('\n')
  .reduce((grouped: string[][], line, lineIdx, lines) => {
    const groupIdx = Math.floor(lineIdx / (lines.length / 14));
    if (!grouped[groupIdx]) grouped.push([]);
    grouped[groupIdx].push(line);
    return grouped;
  }, [])
  .map(lines => {
    const type = +lines[5].split(' ')[2] < 0 ? 'zMinus' : 'zPlus';
    return {
      type,
      critVal: type === 'zMinus' ? +lines[5].split(' ')[2] : +lines[15].split(' ')[2]
    };
  });

const validDigits = Array.from({ length: 9 }, (_, i) => i + 1).reverse();

console.log(solve(validDigits, digitInfos));

function solve(validDigits: number[], digitInfos: DigitInfo[]): number | void {
  for (const first of validDigits) {
    for (const second of validDigits) {
      for (const third of validDigits) {
        for (const fourth of validDigits) {
          for (const fifth of validDigits) {
            for (const sixth of validDigits) {
              genLoop: for (const seventh of validDigits) {
                const genDigits = [first, second, third, fourth, fifth, sixth, seventh];
                const modelDigits = Array(14).fill(null);
                let z = 0;
                for (let i = 0; i < modelDigits.length; i++) {
                  const digitInfo = digitInfos[i];
                  if (digitInfo.type === 'zPlus') {
                    const digit = genDigits.shift()!;
                    modelDigits[i] = digit;
                    z = z * 26 + digit + digitInfo.critVal;
                  } else { // digitInfo.type === 'zMinus'
                    const digit = (z % 26) + digitInfo.critVal;
                    if (!validDigits.includes(digit)) continue genLoop;
                    modelDigits[i] = digit;
                    z = Math.floor(z / 26);
                  }
                }
                if (z === 0) return +modelDigits.join('');
              }
            }
          }
        }
      }
    }
  }
}
