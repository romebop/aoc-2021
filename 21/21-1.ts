import { readFileSync } from 'fs';

const inputFile = process.argv.slice(2)[0];

const [p1Start, p2Start]: number[] = readFileSync(inputFile, 'utf8').split('\n')
  .map(s => s.split(' '))
  .map(a => +a[a.length - 1]);

console.log(solve(p1Start, p2Start));

type Player = { space: number, score: number };
type Die = { value: number, rollCount: number };

function solve(p1Start: number, p2Start: number): number {
  const players: Player[] = [
    { space: p1Start, score: 0 },
    { space: p2Start, score: 0 },
  ];
  const die: Die = { value: 1, rollCount: 0 };
  let turnIdx = 0;
  while (players.map(p => p.score).every(s => s < 1000)) {
    const player = players[turnIdx];
    const moveVal = rollDie(die) + rollDie(die) + rollDie(die);
    movePlayer(player, moveVal);
    turnIdx = (turnIdx + 1) % players.length;
  }
  return Math.min(...players.map(p => p.score)) * die.rollCount;
}

function rollDie(die: Die): number {
  const val = die.value;
  die.value = (die.value % 100) + 1;
  die.rollCount++;
  return val;
}

function movePlayer(player: Player, moveVal: number) {
  player.space = ((player.space + moveVal - 1) % 10) + 1;
  player.score += player.space;
}
