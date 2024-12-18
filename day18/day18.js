// part 1

const text = await Deno.readTextFile("./input.txt");

const blocks = text.split("\n").map(it => it.split(",")).map(it => {
  return { x: it[0] * 1, y: it[1] * 1 };
});

const blockToIndex = {};

text.split("\n").forEach((it, i) => {
  blockToIndex[it] = i;
});

const xMin = 0;
const yMin = 0;

// const xMax = 6;
// const yMax = 6;
// let blocksFallen = 12;

const xMax = 70;
const yMax = 70;
let blocksFallen = 1024;

const exit = {
  x: xMax,
  y: yMax
};

const start = {
  x: xMin,
  y: yMin,
  cost: 0,
  id: `${xMin},${yMin}`
};

function pathFind() {
  const toSearch = {};
  const searched = new Set();

  toSearch[start.id] = start;

  while (Object.values(toSearch).length > 0) {
    const min = pop(toSearch);
    searched.add(min.id);
    if (min.x == exit.x && min.y == exit.y) {
      return min.cost;
    }

    let options = [[0, 1], [0, -1], [1, 0], [-1, 0]];

    options.map(it => {
      return {
        x: min.x + it[0],
        y: min.y + it[1],
        cost: min.cost + 1,
        id: `${min.x + it[0]},${min.y + it[1]}`
      };
    }).filter(it => !searched.has(it.id))
      .filter(it => it.x >= xMin && it.x <= xMax && it.y >= yMin && it.y <= yMax)
      .filter(it => blockToIndex[it.id] == undefined || blockToIndex[it.id] >= blocksFallen)
      .filter(it => toSearch[it.id] == undefined || toSearch[it.id].cost > it.cost)
      .forEach(it => toSearch[it.id] = it);
  }

  return Infinity;
}

function pop(toSearch) {
  const min = Object.values(toSearch).reduce((a, b) => a.cost < b.cost ? a : b, { cost: Infinity });
  delete toSearch[min.id];
  return min;
}

console.log(pathFind());

// part 2

function bruteForce() {
  for (let i=0; i<blocks.length; i++) {
    blocksFallen = i;
    if (pathFind() == Infinity) {
      console.log(`index ${i}`)
      return blocks[i - 1];
    }
  }

  return null;
}

console.log(bruteForce())
