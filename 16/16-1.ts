import { readFileSync } from 'fs';

const inputFile = process.argv.slice(2)[0];

const transmission: string = readFileSync(inputFile, 'utf8');

type Packet = { p: number, verSum: number };

console.log(solve(transmission));

function solve(transmission: string): number {
  const bin = transmission.split('')
    .map(hex => parseInt(hex, 16).toString(2).padStart(4, '0'))
    .join('');
  return getPacket(bin)!.verSum;
}

function getPacket(bin: string): Packet | void {
  let p = 0;
  const ver = parseInt(bin.slice(p, p + 3), 2);
  p += 3;
  let verSum = ver;
  const type = parseInt(bin.slice(p, p + 3), 2);
  p += 3;
  switch (type) {
    case 4: { // literal
      let isLast = false;
      while (!isLast) {
        const group = bin.slice(p, p + 5);
        p += 5;
        const prefix = group[0];
        isLast = prefix === '0';
      }
      return { p, verSum };
    }
    default: { // operator
      const lenType = bin[p];
      p += 1;
      if (lenType === '0') {
        const subPacLen = parseInt(bin.slice(p, p + 15), 2);
        p += 15;
        while (p < 7 + 15 + subPacLen) {
          const packet = getPacket(bin.slice(p))!;
          p += packet.p;
          verSum += packet.verSum;
        }
      }
      if (lenType === '1') { // lenType === '1'
        const numSubPacs = parseInt(bin.slice(p, p + 11), 2);
        p += 11;
        for (let i = 0; i < numSubPacs; i++) {
          const packet = getPacket(bin.slice(p))!;
          p += packet.p;
          verSum += packet.verSum;
        }
      }
      return { p, verSum };
    }
  }
}
