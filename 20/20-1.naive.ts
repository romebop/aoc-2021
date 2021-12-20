import { readFileSync } from 'fs';

const inputFile = process.argv.slice(2)[0];

const data = readFileSync(inputFile, 'utf8').split('\n\n');

const imageEnhancementAlgorithmString: string = data[0];

const image: string[][] = data[1].split('\n')
  .map(s => s.split(''));

const applyCount = 2;

const Pixel = {
  LIGHT: '#',
  DARK: '.',
};

console.log(solve(image, imageEnhancementAlgorithmString, applyCount));

function solve(image: string[][], ieas: string, applyCount: number): number {
  printImage(image);
  for (let i = 0; i < applyCount; i++) {
    image = enhanceImage(image, ieas);
    printImage(image);
  }
  return image.reduce((litCount, row) => (
    litCount + row.reduce((rowLitCount, pixel) => (
      rowLitCount + (pixel === Pixel.LIGHT ? 1 : 0)
    ), 0)
  ), 0);
}

function enhanceImage(image: string[][], ieas: string): string[][] {
  const enhancedImage = Array(image.length).fill(null).map(() => Array(image[0].length).fill(null));
  // i don't feel so good mr stark
  return enhancedImage;
}

function printImage(image: string[][]): void {
  console.log();
  for (const row of image) {
    console.log(row.join(''));
  }
}
