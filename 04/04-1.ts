import { readFileSync } from 'fs';

const inputFile = process.argv.slice(2)[0];

const data = readFileSync(inputFile, 'utf8').split('\n\n');

const drawNumbers: number[] = data[0].split(',').map(e => +e);

interface Cell {
  value: number;
  isMarked: boolean;
}

const boards: Cell[][][] = data.slice(1)
  .map(str => str.split('\n')
    .map(row => row.trim().split(/\s+/)
      .map(e => ({ value: +e, isMarked: false }))
    )
  );

console.log(solve(boards, drawNumbers));

function solve(boards: Cell[][][], drawNumbers: number[]): number | void {
  for (const drawNumber of drawNumbers) {
    for (const board of boards) {
      markBoard(board, drawNumber);
      if (isSolvedBoard(board)) {
        return getUnmarkedSum(board) * drawNumber;
      }
    }
  }
}

function markBoard(board: Cell[][], drawNumber: number): void {
  for (const row of board) {
    for (const cell of row) {
      if (cell.value === drawNumber) {
        cell.isMarked = true;
      }
    }
  }
}

function isSolvedBoard(board: Cell[][]): boolean {
  for (let y = 0; y < board.length; y++) {
    let isSolved = true;
    for (let x = 0; x < board[0].length; x++) {
      isSolved &&= board[y][x].isMarked;
    }
    if (isSolved) return true;
  }
  for (let x = 0; x < board[0].length; x++) {
    let isSolved = true;
    for (let y = 0; y < board.length; y++) {
      isSolved &&= board[y][x].isMarked; 
    }
    if (isSolved) return true;
  }
  return false;
}

function getUnmarkedSum(board: Cell[][]): number {
  return board.reduce((totalSum, row) => (
    totalSum + row.reduce((rowSum, cell) => (
      rowSum + (cell.isMarked ? 0 : cell.value)
    ), 0)
  ), 0);
}

function printBoard(board: Cell[][]): void {
  for (const row of board) {
    console.log(
      row.map(cell => cell.isMarked
        ? `[${cell.value}:x]`
        : `[${cell.value}:o]`
      ).join(' ')
    );
  }
}