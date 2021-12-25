import { readFileSync } from 'fs';

const inputFile = process.argv.slice(2)[0];

const [p1Start, p2Start]: number[] = readFileSync(inputFile, 'utf8').split('\n')
  .map(s => s.split(' '))
  .map(a => +a[a.length - 1]);

console.log(solve(p1Start, p2Start));

function solve(p1Start: number, p2Start: number): number {
  const memo = new Map<string, number[]>();
  const wins = playGame(p1Start, p2Start, 0, 0, true, 3, 0, memo);
  return Math.max(...wins);
}

function playGame(
  p1Pos: number,
  p2Pos: number,
  p1Score: number,
  p2Score: number,
  isP1Turn: boolean,
  numRemainingRolls: number,
  moveSum: number,
  memo: Map<string, number[]>,
): number[] {
  const ss = serializeState(p1Pos, p2Pos, p1Score, p2Score, isP1Turn, numRemainingRolls, moveSum);
  if (memo.has(ss)) {
    return memo.get(ss)!;
  }
  if (p1Score >= 21 || p2Score >= 21) {
    return [(p1Score >= 21 ? 1 : 0), (p2Score >= 21 ? 1 : 0)];
  }
  const results: number[][] = [];
  if (numRemainingRolls === 0) {
    if (isP1Turn) {
      p1Pos = ((p1Pos + moveSum - 1) % 10) + 1;
      p1Score += p1Pos;
    } else {
      p2Pos = ((p2Pos + moveSum - 1) % 10) + 1;
      p2Score += p2Pos;
    }
    results.push(playGame(p1Pos, p2Pos, p1Score, p2Score, !isP1Turn, 3, 0, memo));
  } else { // numRemainingRolls > 0
    results.push(playGame(p1Pos, p2Pos, p1Score, p2Score, isP1Turn, numRemainingRolls - 1, moveSum + 1, memo));
    results.push(playGame(p1Pos, p2Pos, p1Score, p2Score, isP1Turn, numRemainingRolls - 1, moveSum + 2, memo));
    results.push(playGame(p1Pos, p2Pos, p1Score, p2Score, isP1Turn, numRemainingRolls - 1, moveSum + 3, memo));
  }
  const wins = results.reduce((total, result) => total.map((e, i) => e + result[i]));
  memo.set(ss, wins);
  return wins;
}

function serializeState(
  p1Pos: number,
  p2Pos: number,
  p1Score: number,
  p2Score: number,
  isP1Turn: boolean,
  numRemainingRolls: number,
  moveSum: number,
): string {
  return `(${p1Pos},${p2Pos},${p1Score},${p2Score},${isP1Turn},${numRemainingRolls},${moveSum})`;
}
