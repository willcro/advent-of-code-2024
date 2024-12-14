// part 1

const text = await Deno.readTextFile("./input.txt");
const lines = text.split("\n");

const regex = /p=([0-9]+),([0-9]+) v=(-?[0-9]+),(-?[0-9]+)/;

const xMin = 0;
const yMin = 0;

const width = 101;
const height = 103;

const xMax = width - 1;
const yMax = height - 1;

function parseLine(line) {
  const match = regex.exec(line);
  return {
    x: match[1] * 1,
    y: match[2] * 1,
    dx: match[3] * 1,
    dy: match[4] * 1
  }
}

function runRobot(robot, steps) {
  let x = (robot.x + (steps * robot.dx)) % width;
  let y = (robot.y + (steps * robot.dy)) % height;

  x = (x + width) % width;
  y = (y + height) % height;

  return {x,y};
}

function quandrant(robot) {
  let quandrant = 0;

  if (robot.x == (xMax / 2) || robot.y == (yMax / 2)) {
    return -1;
  }

  if (robot.x > (xMax) / 2) {
    quandrant += 1;
  }

  if (robot.y > (yMax) / 2) {
    quandrant += 2;
  }

  return quandrant;
}

function score(robots) {
  const quandrants = [0, 0, 0, 0];
  robots.forEach(r => {
    const q = quandrant(r);
    if (q != -1) {
      quandrants[q] = quandrants[q] + 1;
    }
  });

  return quandrants.reduce((a, b) => a * b, 1);
}

const robots = lines.map(parseLine);

console.log(score(robots.map(r => runRobot(r, 100))));

// part 2

function print(robots) {
  const grid = Array.apply(null, Array(height)).map(r => Array.apply(null, Array(width)).map(c => " "));
  robots.forEach(r => grid[r.y][r.x] = "X");
  grid.forEach(it => console.log(it.join("")));
}

function possiblyATree(robots) {
  const threshold = 100;
  const size = 10;
  const left = (xMax / 2) - size;
  const right = (xMax / 2) + size;
  const top = (yMax / 2) - size;
  const bottom = (yMax / 2) + size;
  // I am guessing that the middle will have a lot of robots in the middle if it is a tree
  const count = robots.filter(r => r.x >= left && r.x <= right && r.y >= top && r.y <= bottom).length;

  return count > threshold;
}

function findTree(robots) {
  for (let i = 1; i < 15000; i++) {
    const after = robots.map(r => runRobot(r, i));
    if (possiblyATree(after)) {
      console.log(`After ${i} steps`);
      print(after);
    }
  }
}

findTree(robots)
