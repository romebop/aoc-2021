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
}

const commands: Command[] = readFileSync(inputFile, 'utf8')
  .split('\n')
  .map(s => s.split(' '))
  .map(([dirStr, unitsStr]) => ({
    direction: dirStr as Direction,
    units: +unitsStr,
  }));

console.log(solve(commands));

function solve(commands: Command[]): number {
  const initialPosition: Position = {
    horizontal: 0,
    depth: 0,
  };
  const newPosition = applyCommands(initialPosition, commands);
  return newPosition.horizontal * newPosition.depth;
}

function applyCommands(position: Position, commands: Command[]): Position {
  const newPosition = { ...position };
  for (const command of commands) {
    switch (command.direction) {
      case 'forward': {
        newPosition.horizontal += command.units;
        break;
      }
      case 'down': {
        newPosition.depth += command.units;
        break;
      }
      case 'up': {
        newPosition.depth -= command.units;
        break;
      }
    }
  }
  return newPosition;
}
