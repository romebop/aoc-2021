import { readFileSync } from 'fs';

const inputFile = process.argv.slice(2)[0];

type Scanner = { id: number, beaconsByOrientations: Point[][] };
type Point = { x: number, y: number, z: number };

const scannerRegex = /^--- scanner (?<id>[0-9]+) ---$/;
const scanners: Scanner[] = readFileSync(inputFile, 'utf8').split('\n\n')
  .map(scannerStr => {
    const lines = scannerStr.split('\n');
    const id = +lines[0].match(scannerRegex)!.groups!.id;
    const beaconsByOrientations: Point[][] = lines.slice(1)
      .map(line => line.split(','))
      .map(([xStr, yStr, zStr]) => ({ x: +xStr, y: +yStr, z: +zStr }))
      .map(point => getOrientations(point));
    return { id, beaconsByOrientations };
  });

console.log(solve(scanners));

function solve(scanners: Scanner[]): number {
  const composite: Point[] = scanners[0].beaconsByOrientations.map(o => o[0]); // scanner 0 as reference frame
  scanners.splice(0, 1);
  while (scanners.length) {
    scannerLoop: for (let i = 0; i < scanners.length; i++) {
      const scanner = scanners[i];
      // TODO: reformulate matching strategy using "orientation agnostic B's" metric
      for (let j = 0; j < 24; j++) { // 1 of 24 orientations
        const beacons = scanner.beaconsByOrientations.map(o => o[j]);
        const scannerPoint = getScannerPoint(composite, beacons);
        if (scannerPoint) {
          // console.log(`found scanner: ${scanner.id}`);
          const translatedBeacons = beacons.map(b => translateBeacon(b, scannerPoint));
          addNewBeacons(composite, translatedBeacons);
          scanners.splice(i, 1);
          break scannerLoop;
        }
      }
    }
  }
  return composite.length;
}

function getScannerPoint(composite: Point[], beacons: Point[]): Point | null {
  for (const t1 of composite) {
    for (const t2 of beacons) {
      const testPoint = {
        x: t1.x - t2.x,
        y: t1.y - t2.y,
        z: t1.z - t2.z,
      };
      const matchingBeacons = [];
      for (const p1 of composite) {
        for (const p2 of beacons) {
          const tp2 = translateBeacon(p2, testPoint);
          if (serializePoint(p1) === serializePoint(tp2)) {
            matchingBeacons.push(p1);
            if (matchingBeacons.length === 12) {
              return testPoint;
            }
            break;
          }
        }
      }
    }
  }
  return null;
}

function translateBeacon(beacon: Point, scannerPoint: Point): Point {
  return {
    x: beacon.x + scannerPoint.x,
    y: beacon.y + scannerPoint.y,
    z: beacon.z + scannerPoint.z,
  };
}

function addNewBeacons(composite: Point[], beacons: Point[]): void {
  const serializedComposite = composite.map(p => serializePoint(p));
  for (const beacon of beacons) {
    if (!serializedComposite.includes(serializePoint(beacon))) {
      composite.push(beacon);
    }
  }
}

function serializePoint({ x, y, z }: Point) {
  return `(${x},${y},${z})`;
}

// TODO: SO(3) Lie Group
function getOrientations({ x, y, z }: Point): Point[] { // 6 directions * 4 rotations
  const orientations: Point[] = [];
  // +x
  orientations.push({ x, y, z });
  orientations.push({ x, y: -z, z: y });
  orientations.push({ x, y: -y, z: -z });
  orientations.push({ x, y: z, z: -y });
  // -x
  orientations.push({ x: -x, y: -y, z });
  orientations.push({ x: -x, y: z, z: y });
  orientations.push({ x: -x, y, z: -z });
  orientations.push({ x: -x, y: -z, z: -y });
  // +y
  orientations.push({ x: y, y: z, z: x });
  orientations.push({ x: y, y: -x, z });
  orientations.push({ x: y, y: -z, z: -x });
  orientations.push({ x: y, y: x, z: -z });
  // -y
  orientations.push({ x: -y, y: -z, z: x });
  orientations.push({ x: -y, y: x, z });
  orientations.push({ x: -y, y: z, z: -x });
  orientations.push({ x: -y, y: -x, z: -z });
  // +z
  orientations.push({ x: z, y: x, z: y });
  orientations.push({ x: z, y: -y, z: x });
  orientations.push({ x: z, y: -x, z: -y });
  orientations.push({ x: z, y, z: -x });
  // -z
  orientations.push({ x: -z, y: -x, z: y });
  orientations.push({ x: -z, y, z: x });
  orientations.push({ x: -z, y: x, z: -y });
  orientations.push({ x: -z, y: -y, z: -x });

  return orientations;
}

// 48 (includes mirrors)
// ['+z', '-z'].forEach(z => {
//   ['+y', '-y'].forEach(y => {
//     ['+x', '-x'].forEach(x => {
//       console.log(`(${x},${y},${z})`);
//       console.log(`(${x},${z},${y})`);
//       console.log(`(${y},${z},${x})`);
//       console.log(`(${y},${x},${z})`);
//       console.log(`(${z},${x},${y})`);
//       console.log(`(${z},${y},${x})`);
//     });
//   });
// });

// function getCross(p1, p2) {
//   const i = p1.y * p2.z - p1.z * p2.y;
//   const j = p1.x * p2.z - p1.z * p2.x;
//   const k = p1.x * p2.y - p1.y * p2.x;
//   return { x: i, y: -j, z: k }
// }
