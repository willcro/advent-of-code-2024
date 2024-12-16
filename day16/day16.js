// part 1

const text = await Deno.readTextFile("./input.txt");

const grid = text.split("\n").map(line => line.split(""));

const dirs = {
  "N": {
    dx: 0,
    dy: -1,
    rot: ["E", "W"]
  },
  "S": {
    dx: 0,
    dy: 1,
    rot: ["E", "W"]
  },
  "E": {
    dx: 1,
    dy: 0,
    rot: ["N", "S"]
  },
  "W": {
    dx: -1,
    dy: 0,
    rot: ["N", "S"]
  },
}

const startDir = "E";

function id(node) {
  return `${node.x},${node.y},${node.dir}`;
}

function findChar(grid, char) {
  let charX = -1;
  let charY = -1;

  grid.forEach((line, y) => line.forEach((cell, x) => {
    if (cell == char) {
      charX = x;
      charY = y;
    }
  }));

  return { x: charX, y: charY };
}

function findAllPaths(grid) {
  const start = findChar(grid, "S");
  const end = findChar(grid, "E");
  const options = {};
  const searched = new Set();
  options[`${start.x},${start.y},${startDir}`] = { x: start.x, y: start.y, dir: startDir, cost: 0, prev: [] };

  while (true) {
    // This part is very slow. If I have time, I will come back and redo this with a heap or something
    const min = Object.values(options).reduce((a, b) => a.cost < b.cost ? a : b, { cost: Infinity });
    delete options[id(min)];
    searched.add(id(min));

    if (min.x == end.x && min.y == end.y) {
      return min;
    }

    const dir = dirs[min.dir];

    const newOptions = [
      {
        x: min.x + dir.dx,
        y: min.y + dir.dy,
        dir: min.dir,
        cost: min.cost + 1,
        prev: [min]
      },
      {
        x: min.x,
        y: min.y,
        dir: dir.rot[0],
        cost: min.cost + 1000,
        prev: [min]
      },
      {
        x: min.x,
        y: min.y,
        dir: dir.rot[1],
        cost: min.cost + 1000,
        prev: [min]
      }
    ];

    newOptions.forEach(it => it.id = id(it));

    newOptions.filter(it => grid[it.y][it.x] != "#")
      .filter(it => !searched.has(it.id))
      .forEach(it => {
        const cur = options[it.id];
        if (options[it.id] == undefined || it.cost < cur.cost) {
          options[it.id] = it;
        } else if (cur.cost == it.cost) {
          cur.prev.push(min);
        }
      });
  }
}

let node = findAllPaths(grid);
console.log(node.cost)

// part 2

function getAllPrev(node) {
  let out = [`${node.x},${node.y}`];
  node.prev.flatMap(getAllPrev).forEach(it => out.push(it));
  return out;
}
console.log(new Set(getAllPrev(node)).size);
