const text = await Deno.readTextFile("./input.txt");

const grid = text.split("\n").map(line => line.split(""));

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

// lol, still using dijkstra's even though there is only one path
function pathFind(grid) {
  const start = findChar(grid, "S");
  const end = findChar(grid, "E");

  const searched = {};
  const toSearch = {};
  const startSquare = {
    id: `${start.x},${start.y}`,
    x: start.x,
    y: start.y,
    cost: 0
  };
  toSearch[startSquare.id] = startSquare;

  while (Object.values(toSearch).length > 0) {
    const min = pop(toSearch);
    searched[min.id] = min;
    let options = [[0, 1], [0, -1], [1, 0], [-1, 0]];

    options.map(it => {
      return {
        x: min.x + it[0],
        y: min.y + it[1],
        cost: min.cost + 1,
        id: `${min.x + it[0]},${min.y + it[1]}`
      };
    }).filter(it => searched[it.id] == undefined)
      .filter(it => grid[it.y][it.x] != "#")
      .filter(it => toSearch[it.id] == undefined || toSearch[it.id].cost > it.cost)
      .forEach(it => toSearch[it.id] = it);
  }

  return searched;

}

function pop(toSearch) {
  const min = Object.values(toSearch).reduce((a, b) => a.cost < b.cost ? a : b, { cost: Infinity });
  delete toSearch[min.id];
  return min;
}

function createCheatOptions(maxCheat) {
  const out = [];
  for (let x = -maxCheat; x <= maxCheat; x++) {
    const minY = -(maxCheat - Math.abs(x));
    const maxY = (maxCheat - Math.abs(x));
    for (let y = minY; y <= maxY; y++) {
      out.push([x, y]);
    }
  }

  return out;
}

function countShortCuts(costs, maxCheat, threshold) {
  const paths = createCheatOptions(maxCheat);
  const shortCuts = {};
  let meetsThreshold = 0
  Object.values(costs).forEach(cost => {
    paths.map(p => `${cost.x + p[0]},${cost.y + p[1]}`)
    .filter(sc => costs[sc] != undefined)
    .map(sc => costs[sc])
    .filter(sc => sc.cost > cost.cost)
    .forEach(sc => {
      const shortCutLength = Math.abs(sc.x - cost.x) + Math.abs(sc.y - cost.y);
      const shortCutValue = (sc.cost - cost.cost) - shortCutLength;

      if (shortCuts[shortCutValue] == undefined) {
        shortCuts[shortCutValue] = 1;
      } else {
        shortCuts[shortCutValue]++;
      }

      if (shortCutValue >= threshold) {
        meetsThreshold++;
      }
    })
  });

  return meetsThreshold;
}

console.log(countShortCuts(pathFind(grid), 2, 100));

// part 2

console.log(countShortCuts(pathFind(grid), 20, 100));
