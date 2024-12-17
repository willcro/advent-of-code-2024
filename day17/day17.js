// part 1

const text = await Deno.readTextFile("./input.txt");

const regRegex = /Register (.): (-?[0-9]+)/;
const programRegex = /Program: ([0-7,]+)/;

function parseText(text) {
  const reg = {
    A: 0n,
    B: 0n,
    C: 0n,
    out: [],
    ip: 0n
  }
  const parts = text.split("\n\n");
  parts[0].split("\n").map(line => regRegex.exec(line)).forEach(r => reg[r[1]] = BigInt(r[2]));

  const instructions = programRegex.exec(parts[1])[1].split(",").map(it => BigInt(it * 1));

  return {instructions, reg};
}

function getComboOperand(opCode, registers) {
  switch (opCode) {
    case 4n:
      return registers.A;
    case 5n:
      return registers.B;
    case 6n:
      return registers.C;
    case 7n:
      throw "Invalid opcode";
    default:
      return opCode;
  }

}

const instructions = {
  0n: {
    name: "adv",
    command: (op, reg) => {
      reg.A = reg.A / (2n << (getComboOperand(op, reg) - 1n));
      reg.ip += 2n;
    }
  },
  1n: {
    name: "bxl",
    command: (op, reg) => {
      reg.B = op ^ reg.B;
      reg.ip += 2n;
    }
  },
  2n: {
    name: "bst",
    command: (op, reg) => {
      reg.B = getComboOperand(op, reg) % 8n;
      reg.ip += 2n;
    }
  },
  3n: {
    name: "jnz",
    command: (op, reg) => {
      if (reg.A == 0n) {
        reg.ip += 2n;
        return;
      }
      reg.ip = op;
    }
  },
  4n: {
    name: "bxc",
    command: (op, reg) => {
      reg.B = reg.B ^ reg.C;
      reg.ip += 2n;
    }
  },
  5n: {
    name: "out",
    command: (op, reg) => {
      reg.out.push(getComboOperand(op, reg) % 8n);
      reg.ip += 2n;
    }
  },
  6n: {
    name: "bdv",
    command: (op, reg) => {
      reg.B = reg.A / (2n << (getComboOperand(op, reg) - 1n));
      reg.ip += 2n;
    }
  },
  7n: {
    name: "cdv",
    command: (op, reg) => {
      reg.C = reg.A / (2n << (getComboOperand(op, reg) - 1n));
      reg.ip += 2n;
    }
  }
}

function pow(a, b) {
  let out = 1n;
  for (let i=0n; i < b; i++) {
    out = out * a;
  }
  return out;
}

function run(program) {
  while (program.reg.ip < program.instructions.length - 1) {
    const opCode = program.instructions[program.reg.ip];
    const operand = program.instructions[program.reg.ip + 1n];
    instructions[opCode].command(operand, program.reg);
  }

  return program.reg;
}

console.log(run(parseText(text)).out.join(","))

// part 2

/*
Explanation for part 2

I didn't want to include my full notes, since it includes the full input,
which is against the rules of AOC. here is the gist though:

1. The number of digits in the output is determined by the log base 8
   of the starting A. To get 16 digits in the output, the answer will
   need to between 8^15 and 8^16
2. The value of nth digit in the output is related to the multiple of 8^(n-1)
   in A. The exact relationship was too complicated for me to do by hand, but
   this opened the door for an optimized brute force.
3. The earlier digits are also affected by the later powers. There may be
   multiple values of 8^(n-1) that work for a given digit, but may affect
   what is possible for other digits. That is why I recursively check all
   that work instead of stopping at the first one that works for each value of
   n;
*/

function bruteForce(program, startingA, power) {

  for (let n = 0n; n < 8n; n++) {
    let tempA = startingA + pow(8n, power) * n;
    program.reg.A = tempA;
    program.reg.B = 0;
    program.reg.C = 0;
    program.reg.ip = 0n;
    program.reg.out = [];

    run(program);

    if (program.reg.out[power] == program.instructions[power]) {
      if (power == 0n) {
        return tempA;
      }

      let recur = bruteForce(program, tempA, power - 1n);

      if (recur != null) {
        return recur;
      }
    }
  }

  return null;
}

console.log(bruteForce(parseText(text), 0n, 15n))

