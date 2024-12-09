// part 1

const text = await Deno.readTextFile("./input.txt");
const lines = text.split("\n");

const grid = lines.map(it => it.split(""));

const nodes = {};

const xMin = 0;
const xMax = grid[0].length - 1;
const yMin = 0;
const yMax = grid.length - 1;

for (let y = 0; y < grid.length; y++) {
  const row = grid[y];
  for (let x = 0; x < row.length; x++) {
    const cell = row[x];
    if (cell == ".") {
    } else if (nodes[cell] == undefined) {
      nodes[cell] = [{x, y}];
    } else {
      nodes[cell].push({x, y});
    }
  }
}

function findAllAntinodes(nodes, searchFunction) {
  const antinodes = new Set();
  const frequencies = Object.keys(nodes);

  for (let fid = 0; fid < frequencies.length; fid++) {
    const frequency = frequencies[fid];
    for (let i = 0; i < nodes[frequency].length; i++) {
      const nodeA = nodes[frequency][i];
      for (let j = i + 1; j < nodes[frequency].length; j++) {
        const nodeB = nodes[frequency][j];
        const anodes = searchFunction(nodeA, nodeB);
        anodes.map(it => `${it.x},${it.y}`).forEach(it => antinodes.add(it));
      }
    }
  }

  return antinodes;
}

function findAntinodesPart1(a, b) {
  let foo = {x: a.x - (b.x - a.x), y: a.y - (b.y - a.y)};
  let bar = {x: b.x - (a.x - b.x), y: b.y - (a.y - b.y)};
  return [foo, bar].filter(it => it.x >= xMin && it.x <= xMax && it.y >= yMin && it.y <= yMax);
}

console.log(findAllAntinodes(nodes, findAntinodesPart1).size)

// part 2

function findAntinodesPart2(a, b) {
  const out = [];
  let x = a.x;
  let y = a.y;

  while (x >= xMin && x <= xMax && y >= yMin && y <= yMax) {
    out.push({x,y});
    x = x - (b.x - a.x);
    y = y - (b.y - a.y);
  }

  x = b.x;
  y = b.y;
  while (x >= xMin && x <= xMax && y >= yMin && y <= yMax) {
    out.push({x,y});
    x = x - (a.x - b.x);
    y = y - (a.y - b.y);
  }

  return out;
}

console.log(findAllAntinodes(nodes, findAntinodesPart2).size)
