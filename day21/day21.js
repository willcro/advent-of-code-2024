// part 1
const text = await Deno.readTextFile("./input.txt");
const lines = text.split("\n");

const numpadStr =
  `789
456
123
X0A`;
const arrowPadStr =
  `X^A
<v>`;

function gridify(str) {
  return str.split("\n").map(line => line.split(""));
}

const numpad = gridify(numpadStr);
const arrowPad = gridify(arrowPadStr);

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

function pathFind(grid, startChar, endChar, costMap) {
  const start = findChar(grid, startChar);
  const end = findChar(grid, endChar);
  const bonusCost = costMap["A,A"] == undefined ? costMap.default : costMap["A,A"];

  const searched = new Set();
  const toSearch = {};
  const startSquare = {
    id: `${start.x},${start.y},A`,
    x: start.x,
    y: start.y,
    cost: 0,
    bonusCost: bonusCost,
    prevButton: "A",
  };
  toSearch[startSquare.id] = startSquare;

  while (Object.values(toSearch).length > 0) {
    const min = pop(toSearch);
    searched.add(min.id);

    if (min.x == end.x && min.y == end.y) {
      return min;
    }

    let options = [[0, 1, "v"], [0, -1, "^"], [1, 0, ">"], [-1, 0, "<"]];

    options.map(it => {
      const costId = `${min.prevButton},${it[2]}`;
      const bonusCostId = `${it[2]},A`;
      const cost = costMap[costId] == undefined ? costMap.default : costMap[costId];
      const bonusCost = costMap[bonusCostId] == undefined ? costMap.default : costMap[bonusCostId];

      return {
        x: min.x + it[0],
        y: min.y + it[1],
        cost: min.cost + cost,
        bonusCost: bonusCost,
        id: `${min.x + it[0]},${min.y + it[1]},${it[2]}`,
        prevButton: it[2],
      };
    }).filter(it => grid[it.y] != undefined && grid[it.y][it.x] != undefined)
      .filter(it => !searched.has(it.id))
      .filter(it => grid[it.y][it.x] != "X")
      .forEach(it => {
        const existing = toSearch[it.id];

        if (existing == undefined || (existing.cost + existing.bonusCost) > (it.cost + it.bonusCost)) {
          toSearch[it.id] = it;
        }
      });
  }

  throw "No path to destination";

}

function pop(toSearch) {
  const min = Object.values(toSearch).reduce((a, b) => (a.cost + a.bonusCost) < (b.cost + b.bonusCost) ? a : b, { cost: Infinity, bonusCost: Infinity });
  delete toSearch[min.id];
  return min;
}

const humanCostMap = {
  default: 1
}

function createCostMap(grid, prevCostMap) {
  const costMap = { default: 1 };
  grid.flat().forEach(startChar => {
    grid.flat().forEach(endChar => {
      if (startChar == "X" || endChar == "X") {
        return;
      }
      const id = `${startChar},${endChar}`;
      const path = pathFind(grid, startChar, endChar, prevCostMap);
      costMap[id] = path.cost + path.bonusCost;
    });
  });
  return costMap;
}

function totalCost(string, costMap) {
  string = "A" + string;
  const chars = string.split("");
  let out = 0;
  for (let i = 1; i < chars.length; i++) {
    out = out + costMap[`${chars[i - 1]},${chars[i]}`];
  }
  return out;
}

function createMiddlemanRobots(count, startCosts) {
  let outCosts = startCosts;
  for (let i = 0; i < count; i++) {
    outCosts = createCostMap(arrowPad, outCosts);
  }

  return outCosts;
}

const regex = /([0-9]+)A/;

function score(line, costMap) {
  const cost = totalCost(line, costMap);
  const code = regex.exec(line)[1] * 1;
  return cost * code;
}

const partOneMiddlemenCostMap = createMiddlemanRobots(2, humanCostMap);
const partOneNumpadRobotCostMap = createCostMap(numpad, partOneMiddlemenCostMap);
console.log(lines.map(l => score(l, partOneNumpadRobotCostMap)).reduce((a, b) => a + b, 0))

// part 2

const partTwoMiddlemenCostMap = createMiddlemanRobots(25, humanCostMap);
const partTwoNumpadRobotCostMap = createCostMap(numpad, partTwoMiddlemenCostMap);
console.log(lines.map(l => score(l, partTwoNumpadRobotCostMap)).reduce((a, b) => a + b, 0))
