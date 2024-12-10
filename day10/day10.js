// part 1

const text = await Deno.readTextFile("./input.txt");
const grid = text.split("\n").map(line => line.split("").map(it => it * 1));

const xMin = 0;
const xMax = grid[0].length - 1;
const yMin = 0;
const yMax = grid.length - 1;

function countAllTrailEnds(countDupes) {
  let out = 0;
  for (let y = 0; y < grid.length; y++) {
    const row = grid[y];
    for (let x = 0; x < row.length; x++) {
      const elevation = row[x];
      if (elevation == 0) {
        out += countTrailEnds(x, y, countDupes);
      }
    }
  }

  return out;
}

function countTrailEnds(x, y, countDupes) {
  const alreadyChecked = new Set();
  const toSearch = [{x,y}];
  let endsReached = 0;
  
  while (toSearch.length > 0) {
    const node = toSearch.pop();

    const str = `${node.x},${node.y}`;
    if (alreadyChecked.has(str)) {
      continue;
    }

    if (!countDupes) {
      alreadyChecked.add(str);
    }

    const elevation = grid[node.y][node.x];
    if (elevation == 9) {
      endsReached += 1;
      continue;
    }

    const options = [
      {x: node.x - 1, y: node.y},
      {x: node.x + 1, y: node.y},
      {x: node.x, y: node.y - 1},
      {x: node.x, y: node.y + 1}
    ];

    options.filter(inBounds).filter(n => grid[n.y][n.x] == elevation + 1).forEach(n => toSearch.push(n));
  }

  return endsReached;
}

function inBounds(node) {
  return node.x >= xMin && node.x <= xMax && node.y >= yMin && node.y <= yMax;
}

console.log(countAllTrailEnds(false));

// part 2

// funny story, I managed to write the code for part 2 while
// trying to write part 1. All I had to do was un-fix a bug
// that I encountered during part 1 and it gets the right answer.
console.log(countAllTrailEnds(true));
