import { readFileSync } from 'fs';

const inputFile = process.argv.slice(2)[0];

type Range = { min: number, max: number };
type Cuboid = { x: Range, y: Range, z: Range };
type Toggle = 'on' | 'off';
type Step = { toggle: Toggle, cuboid: Cuboid };

const cuboidRegex = /^(?<toggle>[a-z]*) x=(?<xMin>.*)\.\.(?<xMax>.*),y=(?<yMin>.*)\.\.(?<yMax>.*),z=(?<zMin>.*)\.\.(?<zMax>.*)$/;
const steps: Step[] = readFileSync(inputFile, 'utf8').split('\n')
  .map(s => {
    const g = s.match(cuboidRegex)!.groups;
    return {
      toggle: g!.toggle as Toggle,
      cuboid: {
        x: { min: +g!.xMin - 0.5, max: +g!.xMax + 0.5 }, // adjust for voxel space
        y: { min: +g!.yMin - 0.5, max: +g!.yMax + 0.5 },
        z: { min: +g!.zMin - 0.5, max: +g!.zMax + 0.5 },
      },
    };
  });

console.log(solve(steps));

function solve(steps: Step[]): number {
  let onCuboids: Cuboid[] = [];
  for (const step of steps) {
    onCuboids = step.toggle === 'on'
      ? updateSubdivides(onCuboids, step.cuboid)
      : updateSubdivides(onCuboids, step.cuboid).filter(c => !doesOverlap(c, step.cuboid));
  }
  return onCuboids.map(c => getVolume(c))
    .reduce((a, c) => a + c, 0);
}

function updateSubdivides(subdivides: Cuboid[], cuboid: Cuboid): Cuboid[] {
  const overlaps = subdivides.reduce((result, subdivide) => (
    doesOverlap(subdivide, cuboid) ? [...result, subdivide] : result
  ), [cuboid]);
  if (overlaps.length > 1) {
    const newSubdivides = [];
    const xBounds = overlaps.map(c => [c.x.min, c.x.max]).flat()
      .filter((e, i, a) => a.indexOf(e) === i)
      .sort((a, b) => a - b);
    const yBounds = overlaps.map(c => [c.y.min, c.y.max]).flat()
      .filter((e, i, a) => a.indexOf(e) === i)
      .sort((a, b) => a - b);
    const zBounds = overlaps.map(c => [c.z.min, c.z.max]).flat()
      .filter((e, i, a) => a.indexOf(e) === i)
      .sort((a, b) => a - b);
    for (let i = 1; i < xBounds.length; i++) {
      for (let j = 1; j < yBounds.length; j++) {
        for (let k = 1; k < zBounds.length; k++) {
          const genCuboid = {
            x: { min: xBounds[i - 1], max: xBounds[i] },
            y: { min: yBounds[j - 1], max: yBounds[j] },
            z: { min: zBounds[k - 1], max: zBounds[k] },
          };
          if (overlaps.some(c => doesOverlap(c, genCuboid))) {
            newSubdivides.push(genCuboid);
          }
        }
      }
    }
    return [
      ...subdivides.filter(c => !overlaps.includes(c)),
      ...newSubdivides,
    ];
  }
  return [...subdivides, cuboid];
}

function doesOverlap(c1: Cuboid, c2: Cuboid): boolean {
  return (c1.x.min < c2.x.max) && (c1.x.max > c2.x.min)
    && (c1.y.min < c2.y.max) && (c1.y.max > c2.y.min)
    && (c1.z.min < c2.z.max) && (c1.z.max > c2.z.min);
}

function getVolume(c: Cuboid): number {
  return (c.x.max - c.x.min) * (c.y.max - c.y.min) * (c.z.max - c.z.min);
}
