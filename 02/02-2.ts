import { readFileSync } from 'fs';

const inputFile = process.argv.slice(2)[0];

type Direction = 'forward' | 'down' | 'up';

interface Command {
  direction: Direction;
  units: number;
}

interface Position {
  horizontal: number;
  depth: number;
  aim: number;
}

const commands: Command[] = readFileSync(inputFile, 'utf8')
  .split('\n')
  .map(s => s.split(' '))
  .map(([dirStr, unitsStr]) => ({
    direction: dirStr as Direction,
    units: +unitsStr,
  }));

const initialPosition: Position = {
  horizontal: 0,
  depth: 0,
  aim: 0,
};

console.log(solve(initialPosition, commands));

function solve(position: Position, commands: Command[]): number {
  for (const command of commands) {
    switch (command.direction) {
      case 'forward': {
        position.horizontal += command.units;
        position.depth += (position.aim * command.units);
        break;
      }
      case 'down': {
        position.aim += command.units;
        break;
      }
      case 'up': {
        position.aim -= command.units;
        break;
      }
    }
  }
  return position.horizontal * position.depth;
}