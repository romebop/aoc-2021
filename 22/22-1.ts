import { readFileSync } from 'fs';

const inputFile = process.argv.slice(2)[0];

type Toggle = 'on' | 'off';
type Range = { min: number, max: number };
type Step = { toggle: Toggle, x: Range, y: Range, z: Range };
type Point = { x: number, y: number, z: number };

const cuboidRegex = /^(?<toggle>[a-z]*) x=(?<xMin>.*)\.\.(?<xMax>.*),y=(?<yMin>.*)\.\.(?<yMax>.*),z=(?<zMin>.*)\.\.(?<zMax>.*)$/;
const steps: Step[] = readFileSync(inputFile, 'utf8').split('\n')
  .map(s => {
    const g = s.match(cuboidRegex)!.groups;
    return {
      toggle: g!.toggle as Toggle,
      x: { min: +g!.xMin, max: +g!.xMax },
      y: { min: +g!.yMin, max: +g!.yMax },
      z: { min: +g!.zMin, max: +g!.zMax },
    };
  });

console.log(solve(steps));

function solve(steps: Step[]): number {
  const onCubes = new Set<string>();
  for (const step of steps) {
    const zMin = step.z.min < -50 ? -50 : step.z.min;
    const zMax = step.z.max > 50 ? 50 : step.z.max;
    const yMin = step.y.min < -50 ? -50 : step.y.min;
    const yMax = step.y.max > 50 ? 50 : step.y.max;
    const xMin = step.x.min < -50 ? -50 : step.x.min;
    const xMax = step.x.max > 50 ? 50 : step.x.max;
    if (step.toggle === 'on') {
      for (let z = zMin; z <= zMax; z++) {
        for (let y = yMin; y <= yMax; y++) {
          for (let x = xMin; x <= xMax; x++) {
            onCubes.add(serializePoint({ x, y, z }));
          }
        }
      }
    } else { // toggle === 'off'
      for (let z = zMin; z <= zMax; z++) {
        for (let y = yMin; y <= yMax; y++) {
          for (let x = xMin; x <= xMax; x++) {
            onCubes.delete(serializePoint({ x, y, z }));
          }
        }
      }
    }
  }
  return onCubes.size;
}

function serializePoint({ x, y, z }: Point) {
  return `(${x},${y},${z})`;
}
