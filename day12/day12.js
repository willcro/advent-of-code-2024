// part 1

const text = await Deno.readTextFile("./input.txt");
const lines = text.split("\n");

const grid = lines.map(l => l.split(""));

const xMin = 0;
const yMin = 0;
const xMax = grid.length - 1;
const yMax = grid[0].length - 1;

function findRegions() {
  const searched = new Set();
  const toSearch = new Set();
  toSearch.add("0,0")

  const regions = [];

  while (toSearch.size > 0) {
    const current = pop(toSearch);
    const parts = current.split(",");
    const x = parts[0] * 1;
    const y = parts[1] * 1;
    const letter = grid[y][x];

    const toSearchLocal = new Set();
    const searchedLocal = new Set();
    toSearchLocal.add(`${x},${y}`);

    // flood current plot
    while (toSearchLocal.size > 0) {
      const current = pop(toSearchLocal);
      searchedLocal.add(current);
      searched.add(current);
      toSearch.delete(current);

      const parts = current.split(",");
      const x = parts[0] * 1;
      const y = parts[1] * 1;

      const options = [
        { x: x - 1, y: y },
        { x: x + 1, y: y },
        { x: x, y: y - 1 },
        { x: x, y: y + 1 }
      ];

      // find all neighbors that are the same plot
      options.filter(inBounds)
        .filter(it => grid[it.y][it.x] == letter)
        .map(it => `${it.x},${it.y}`)
        .filter(it => !searchedLocal.has(it))
        .forEach(it => toSearchLocal.add(it));

      // find other plots
      options.filter(inBounds)
        .filter(it => grid[it.y][it.x] != letter)
        .map(it => `${it.x},${it.y}`)
        .filter(it => !searched.has(it))
        .forEach(it => toSearch.add(it));
    }

    regions.push({ letter: letter, coord: searchedLocal });

  }

  return regions;
}

function findSides(region) {
  var coords = Array.from(region.coord);
  let sides = new Set();

  for (let i = 0; i < coords.length; i++) {
    const coord = coords[i];
    const parts = coord.split(",");
    const x = parts[0] * 1;
    const y = parts[1] * 1;

    const options = [
      { x: x - 1, y: y },
      { x: x + 1, y: y },
      { x: x, y: y - 1 },
      { x: x, y: y + 1 }
    ];

    options
      .filter(it => !region.coord.has(`${it.x},${it.y}`))
      .map(it => {
        return { x: (it.x - x) / 4 + x, y: (it.y - y) / 4 + y };
      })
      .forEach(it => sides.add(`${it.x},${it.y}`));
  }

  region.sides = sides;
  return region;
}

function findNumberOfSides(region) {
  var sides = Array.from(region.sides);
  let total = 0;
  for (let i = 0; i < sides.length; i++) {
    const side = sides[i];
    const parts = side.split(",");
    const x = parts[0] * 1;
    const y = parts[1] * 1;

    // vertical line
    if (x != Math.floor(x)) {
      const under = `${x},${y + 1}`;
      if (!region.sides.has(under)) {
        total++;
      }
    }

    // horizontal line
    if (y != Math.floor(y)) {
      const right = `${x + 1},${y}`;
      if (!region.sides.has(right)) {
        total++;
      }
    }
  }

  region.numberOfSides = total;
  return region;
}

function inBounds(node) {
  return node.x >= xMin && node.x <= xMax && node.y >= yMin && node.y <= yMax;
}

function pop(set) {
  const entries = set.values();
  const ret = entries.next().value;
  set.delete(ret);
  return ret;
}

console.log(findRegions().map(findSides).map(it => it.coord.size * it.sides.size).reduce((a, b) => a + b))

// part 2

console.log(findRegions().map(findSides).map(findNumberOfSides).map(it => it.coord.size * it.numberOfSides).reduce((a, b) => a + b))
