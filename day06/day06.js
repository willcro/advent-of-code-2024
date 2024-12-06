// part 1

const text = await Deno.readTextFile("./input.txt");
const lines = text.split("\n");

const grid = lines.map(l => l.split(""));

const maxX = grid.length - 1;
const maxY = grid[0].length - 1;
let startX = 0;
let startY = 0;
let startDx = 0;
let startDy = -1;

for (let y = 0; y < grid.length; y++) {
  const row = grid[y];
  for (let x = 0; x < row.length; x++) {
    const cell = row[x];
    if (cell == "^") {
      startX = x;
      startY = y;
      grid[y][x] = ".";
    }
  }
}

function walk() {
  let x = startX;
  let y = startY;
  let dx = startDx;
  let dy = startDy;
  let pastSteps = new Set();
  let pastCoords = new Set();
  pastSteps.add(`${x},${y},${dx},${dy}`);
  pastCoords.add(`${x},${y}`);

  while (true) {
    let nextX = x + dx;
    let nextY = y + dy;
    // we have hit the edge
    if (nextX > maxX || nextX < 0 || nextY > maxY || nextY < 0) {
      return { exitType: "WALL", total: pastCoords.size };
    }
    
    const nextSquare = grid[nextY][nextX];
    let nextDx = dx;
    let nextDy = dy;
    if (nextSquare == "#") {
      nextX = x;
      nextY = y;
      nextDx = -(dx + dy) * Math.abs(dy);
      nextDy = (dx + dy) * Math.abs(dx);
    }

    const nextStep = `${nextX},${nextY},${nextDx},${nextDy}`;
    // we are back to a place we have been before
    if (pastSteps.has(nextStep)) {
      return { exitType: "LOOP", total: pastCoords.size };
    }

    x = nextX;
    y = nextY;
    dx = nextDx
    dy = nextDy;
    pastSteps.add(`${x},${y},${dx},${dy}`);
    pastCoords.add(`${x},${y}`);
  }
}

console.log(walk().total)

// part 2

function findLoops() {
  let total = 0;
  for (let y = 0; y < grid.length; y++) {
    const row = grid[y];
    for (let x = 0; x < row.length; x++) {
      const cell = row[x];
      if (cell == "." && (x != startX || y != startY)) {
        grid[y][x] = "#";
        const walkResult = walk();
        if (walkResult.exitType == "LOOP") {
          total++;
        }
        grid[y][x] = ".";
      }
    }
  }

  return total;
}

console.log(findLoops())
