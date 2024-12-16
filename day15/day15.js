// part 1

const text = await Deno.readTextFile("./input.txt");
const parts = text.split("\n\n");

let grid = parts[0].split("\n").map(line => line.split(""));
const instructions = parts[1].split("").filter(it => it != "\n");

const instructionMap = {
  "<": {
    dx: -1,
    dy: 0
  },
  ">": {
    dx: 1,
    dy: 0
  },
  "^": {
    dx: 0,
    dy: -1
  },
  "v": {
    dx: 0,
    dy: 1
  }
};

function getStart() {
  let robotX = -1;
  let robotY = -1;

  grid.forEach((line, y) => line.forEach((cell, x) => {
    if (cell == "@") {
      robotX = x;
      robotY = y;
    }
  }));

  return { robotX, robotY };
}

function run() {
  const start = getStart();
  let x = start.robotX;
  let y = start.robotY;
  instructions.forEach(insKey => {
    if (instructionMap[insKey] == undefined) {
      throw "Unknown instruction " + insKey;
    }
    const instruction = instructionMap[insKey];
    try {
      const blocksToMove = findBlocksToMove(x, y, instruction.dx, instruction.dy);
      shift(blocksToMove, instruction.dx, instruction.dy)
      x = x + instruction.dx;
      y = y + instruction.dy;
    } catch (e) {
      if (e != "Can't move!") {
        throw e;
      }
    }
  })
}

function shift(blocksToMove, dx, dy) {
  while (blocksToMove.size > 0) {
    Array.from(blocksToMove).forEach(block => {
      const parts = block.split(",");
      const x = parts[0] * 1;
      const y = parts[1] * 1;

      if (grid[y + dy][x + dx] == ".") {
        grid[y + dy][x + dx] = grid[y][x];
        grid[y][x] = ".";
        blocksToMove.delete(block);
      }
    });
  }
}


function findBlocksToMove(x, y, dx, dy) {
  const cur = grid[y][x];
  const next = grid[y + dy][x + dx];
  const us = new Set([`${x},${y}`]);

  if (next == "#") {
    throw "Can't move!";
  }

  if (next == ".") {
    return us;
  }

  if (next == "O" || dy == 0) {
    const recur = findBlocksToMove(x + dx, y + dy, dx, dy);
    recur.forEach(it => us.add(it));
    return us;
  }

  if (next == "[") {
    findBlocksToMove(x + dx, y + dy, dx, dy).forEach(it => us.add(it));
    findBlocksToMove(x + dx + 1, y + dy, dx, dy).forEach(it => us.add(it));
    return us;
  }

  if (next == "]") {
    findBlocksToMove(x + dx, y + dy, dx, dy).forEach(it => us.add(it));
    findBlocksToMove(x + dx - 1, y + dy, dx, dy).forEach(it => us.add(it));
    return us;
  }

  throw "Unknown character " + next;
}

function print() {
  grid.forEach(line => console.log(line.join("")));
}

function score() {
  return grid.map((line, y) => line.map((cell, x) => cell == "O" || cell == "[" ? y * 100 + x : 0)).flat().reduce((a, b) => a + b, 0);
}

run()
console.log(score())

// part 2
const cellMap = {
  "#": "##",
  "O": "[]",
  ".": "..",
  "@": "@."
};

grid = parts[0].split("\n")
  .map(line => line.split("").map(c => cellMap[c]).join("").split(""));

run()
console.log(score())
