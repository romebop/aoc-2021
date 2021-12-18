import { readFileSync } from 'fs';

const inputFile = process.argv.slice(2)[0];

type SnailNum = Array<SnailNum | number>;

const nums: SnailNum[] = readFileSync(inputFile, 'utf8').split('\n')
  .map(s => JSON.parse(s));

console.log(solve(nums));

function solve(nums: SnailNum[]): number {
  const finalSum = nums.reduce((sum: SnailNum, num: SnailNum) =>
    getReduced([sum, num])
  );
  return getMagnitude(finalSum);
}

function getReduced(num: SnailNum): SnailNum {
  while (getExplodingPair(num) || getSplitVal(num)) {
    if (getExplodingPair(num)) {
      num = getExploded(num);
    } else {
      num = getSplit(num);
    }
  }
  return num;
}

function getExploded(num: SnailNum): SnailNum {
  const explodedNum = deepCopy(num);
  const explodingPair = getExplodingPair(explodedNum)!;
  const explodingPairParent = getExplodingPairParent(explodedNum, explodingPair)!;
  const leafPairs: SnailNum[] = getLeafPairs(explodedNum)!;
  const explodeIdx = leafPairs.findIndex(pair => pair === explodingPair);
  if (explodeIdx > 0) {
    const leftAddPair = leafPairs[explodeIdx - 1];
    if (!Array.isArray(leftAddPair[1])) {
      (leftAddPair[1] as number) += (explodingPair[0] as number);
    } else {
      (leftAddPair[0] as number) += (explodingPair[0] as number);
    }
  }
  if (explodeIdx < leafPairs.length - 1) {
    const rightAddPair = leafPairs[explodeIdx + 1];
    if (!Array.isArray(rightAddPair[0])) {
      (rightAddPair[0] as number) += (explodingPair[1] as number);
    } else {
      (rightAddPair[1] as number) += (explodingPair[1] as number);
    }
  }
  if (explodingPairParent[0] === explodingPair) {
    explodingPairParent[0] = 0;
  } else {
    explodingPairParent[1] = 0;
  }
  return explodedNum;
}

function getExplodingPair(num: SnailNum | number, nesting = 0): SnailNum | null {
  if (!Array.isArray(num)) return null;
  if (nesting === 4) return num;
  return getExplodingPair(num[0], nesting + 1) ?? getExplodingPair(num[1], nesting + 1);
}

function getExplodingPairParent(num: SnailNum | number, explodingPair: SnailNum): SnailNum | null {
  if (!Array.isArray(num)) return null;
  if (num[0] === explodingPair || num[1] === explodingPair) return num;
  return getExplodingPairParent(num[0], explodingPair) ?? getExplodingPairParent(num[1], explodingPair);
}

function getLeafPairs(
  num: SnailNum | number,
  result = new Set<SnailNum>(),
  parent: SnailNum | null = null
): SnailNum[] | void {
  if (!Array.isArray(num)) {
    result.add(parent!);
    return;
  }
  getLeafPairs(num[0], result, num);
  getLeafPairs(num[1], result, num);
  return [...result];
}

function getSplitVal(num: SnailNum | number): number | null {
  if (!Array.isArray(num) && num >= 10) return num;
  if (!Array.isArray(num)) return null;
  return getSplitVal(num[0]) ?? getSplitVal(num[1]);
}

function getSplit(num: SnailNum): SnailNum {
  const splitNum = deepCopy(num);
  const splitVal = getSplitVal(num)!;
  const splitPair = getSplitPair(splitNum, splitVal)!;
  const insertPair = [Math.floor(splitVal / 2), Math.ceil(splitVal / 2)];
  if (splitPair[0] === splitVal) {
    splitPair[0] = insertPair;
  } else {
    splitPair[1] = insertPair;
  }
  return splitNum;
}

function getSplitPair(num: SnailNum | number, maxNum: number): SnailNum | null {
  if (!Array.isArray(num)) return null;
  if (num[0] === maxNum || num[1] === maxNum) return num;
  return getSplitPair(num[0], maxNum) ?? getSplitPair(num[1], maxNum);
}

function getMagnitude(num: SnailNum | number): number {
  if (!Array.isArray(num)) return num;
  return getMagnitude(num[0]) * 3 + getMagnitude(num[1]) * 2;
}

function deepCopy(num: SnailNum): SnailNum {
  return JSON.parse(JSON.stringify(num));
}
