import { readFileSync } from 'fs';

const inputFile = process.argv.slice(2)[0];

const transmission: string = readFileSync(inputFile, 'utf8');

type Packet = { p: number, val: number };

console.log(solve(transmission));

function solve(transmission: string): number {
  const bin = transmission.split('')
    .map(hex => parseInt(hex, 16).toString(2).padStart(4, '0'))
    .join('');
  return getPacket(bin)!.val;
}

function getPacket(bin: string): Packet | void {
  let p = 3;
  const type = parseInt(bin.slice(p, p + 3), 2);
  p += 3;
  switch (type) {
    case 4: { // literal
      let isLast = false;
      let litBin = '';
      while (!isLast) {
        const group = bin.slice(p, p + 5);
        p += 5;
        const prefix = group[0];
        isLast = prefix === '0';
        litBin += group.slice(1);
      }
      return { p, val: parseInt(litBin, 2) };
    }
    default: { // operator
      const args: number[] = [];
      const lenType = bin[p];
      p += 1;
      if (lenType === '0') {
        const subPacLen = parseInt(bin.slice(p, p + 15), 2);
        p += 15;
        while (p < 7 + 15 + subPacLen) {
          const packet = getPacket(bin.slice(p))!;
          p += packet.p;
          args.push(packet.val);
        }
      }
      if (lenType === '1') { // lenType === '1'
        const numSubPacs = parseInt(bin.slice(p, p + 11), 2);
        p += 11;
        for (let i = 0; i < numSubPacs; i++) {
          const packet = getPacket(bin.slice(p))!;
          p += packet.p;
          args.push(packet.val);
        }
      }
      switch (type) {
        case 0:
          return { p, val: args.reduce((a, b) => a + b, 0) };
        case 1:
          return { p, val: args.reduce((a, b) => a * b, 1) };
        case 2:
          return { p, val: Math.min(...args) };
        case 3:
          return { p, val: Math.max(...args) };
        case 5:
          return { p, val: args[0] > args[1] ? 1 : 0 };
        case 6:
          return { p, val: args[0] < args[1] ? 1 : 0 };
        case 7:
          return { p, val: args[0] === args[1] ? 1 : 0 };
      }
    }
  }
}
