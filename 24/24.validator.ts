import { readFileSync } from 'fs';

const inputFile = process.argv.slice(2)[0];

type InstructionType = 'inp' | 'add' | 'mul' | 'div' | 'mod' | 'eql';
type Variable = 'w' | 'x' | 'y' | 'z';
type Instruction = { type: InstructionType, args: (Variable|number)[] };

const inputData = readFileSync(inputFile, 'utf8');

const instrs: Instruction[] = inputData.split('\n')
  .map(line => {
    const [instrType, ...args] = line.split(' ');
    return {
      type: instrType as InstructionType,
      args: args.map(s => isNaN(+s) ? s as Variable : +s),
    };
  });

const modelNum = 13579246899999;

console.log(isValidModelNum(modelNum, instrs));

function isValidModelNum(modelNum: number, instrs: Instruction[]): boolean {
  const digits = modelNum.toString().split('').map(e => +e);
  if (digits.length !== 14 || digits.some(d => d === 0)) return false;
  const intVars: Record<Variable, number> = { w: 0, x: 0, y: 0, z: 0 };
  for (const { type, args } of instrs) {
    switch (type) {
      case 'inp': {
        intVars[args[0] as Variable] = digits.shift()!;
        break;
      }
      case 'add': {
        const arg2Val = isNaN(+args[1]) ? intVars[args[1] as Variable] : args[1] as number;
        intVars[args[0] as Variable] += arg2Val;
        break;
      }
      case 'mul': {
        const arg2Val = isNaN(+args[1]) ? intVars[args[1] as Variable] : args[1] as number;
        intVars[args[0] as Variable] *= arg2Val;
        break;
      }
      case 'div': {
        const arg1Val = intVars[args[0] as Variable];
        const arg2Val = isNaN(+args[1]) ? intVars[args[1] as Variable] : args[1] as number;
        intVars[args[0] as Variable] = Math.floor(arg1Val / arg2Val);
        break;
      }
      case 'mod': {
        const arg2Val = isNaN(+args[1]) ? intVars[args[1] as Variable] : args[1] as number;
        intVars[args[0] as Variable] %= arg2Val;
        break;
      }
      case 'eql': {
        const arg1Val = intVars[args[0] as Variable];
        const arg2Val = isNaN(+args[1]) ? intVars[args[1] as Variable] : args[1] as number;
        intVars[args[0] as Variable] = +(arg1Val === arg2Val);
        break;
      }
    }
  }
  return intVars.z === 0;
}
