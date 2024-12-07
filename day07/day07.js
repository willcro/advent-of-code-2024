// part 1

const text = await Deno.readTextFile("./input.txt");
const lines = text.split("\n");

function toEquation(line, opCount) {
  const parts = line.split(": ");
  const result = parts[0] * 1;
  const operands = parts[1].split(" ").map(it => it * 1);

  return {result, operands};
}

function solve(equation, opCount) {
  const opNum = equation.operands.length - 1;
  const possibilities = Math.pow(opCount, opNum)

  for (let i = 0; i < possibilities; i++) {
    const operationString = i.toString(opCount).padStart(opNum, "0");
    if (test(equation, operationString)) {
      return operationString;
    }
  }
  return null;
}

function test(equation, operationString) {
  let accumulator = equation.operands[0];
  for (let i = 1; i < equation.operands.length; i++) {
    if (accumulator > equation.result) {
      return false;
    }
    
    const current = equation.operands[i];
    const operator = operationString[i - 1];

    if (operator == "0") {
      accumulator = accumulator * current;
    } else if (operator == "1") {
      accumulator = accumulator + current;
    } else if (operator == "2") {
      accumulator = `${accumulator}${current}` * 1;
    } else {
      throw `Unknown operator ${operator}`;
    }
  }

  return accumulator == equation.result;
}

const out = lines.map(toEquation).filter(e => solve(e, 2) != null).reduce((a, b) => a + b.result, 0);

console.log(out)

// part 2

const out2 = lines.map(toEquation).filter(e => solve(e, 3) != null).reduce((a, b) => a + b.result, 0);

console.log(out2)