import { readFileSync } from 'fs';

const inputFile = process.argv.slice(2)[0];

type Point = { x: number, y: number };
type Velocity = { x: number, y: number };
type Area = { xMin: number, xMax: number, yMin: number, yMax: number };

const start: Point = { x: 0, y: 0 };

const targetAreaRegex = /x=(?<xMin>.*)\.\.(?<xMax>.*), y=(?<yMin>.*)\.\.(?<yMax>.*)/;
const groups = readFileSync(inputFile, 'utf8')
  .match(targetAreaRegex)!.groups;
const target: Area = {
  xMin: +groups!.xMin,
  xMax: +groups!.xMax,
  yMin: +groups!.yMin,
  yMax: +groups!.yMax,
};

console.log(solve(start, target));

function solve(start: Point, target: Area): number {
  const targetVels: Velocity[] = [];
  for (let yVel = target.yMin; yVel <= -target.yMin - 1; yVel++) {
    for (let xVel = 0; xVel <= target.xMax; xVel++) {
      const vel: Velocity = { x: xVel, y: yVel };
      if (makesTarget(start, vel, target)) targetVels.push(vel);
    }
  }
  return targetVels.reduce((maxestY: number, vel: Velocity) => (
    Math.max(maxestY, getMaxY(start, vel)!)
  ), -Infinity);
}

function makesTarget(start: Point, vel: Velocity, target: Area): boolean | void {
  let currPos = start;
  let currVel = vel;
  for (let step = 1; step < Infinity; step++) {
    currPos = getNextPos(currPos, currVel);
    if (
      currPos.x >= target.xMin && currPos.x <= target.xMax
      && currPos.y >= target.yMin && currPos.y <= target.yMax
    ) return true;
    if (currPos.x > target.xMax || currPos.y < target.yMin) return false;
    currVel = getNextVel(currVel);
  }
}

function getMaxY(start: Point, vel: Velocity): number | void {
  let currPos = start;
  let currVel = vel;
  for (let step = 1; step < Infinity; step++) {
    currPos = getNextPos(currPos, currVel);
    currVel = getNextVel(currVel);
    if (currPos.y > currPos.y + currVel.y) return currPos.y;
  }
}

function getNextPos(pos: Point, vel: Velocity): Point {
  return { x: pos.x + vel.x, y: pos.y + vel.y };
}

function getNextVel(vel: Velocity): Velocity {
  return {
    x: vel.x > 0 ? (vel.x - 1) : (vel.x < 0 ? vel.x + 1 : 0),
    y: vel.y - 1,
  };
}
