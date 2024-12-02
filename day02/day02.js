// part 1

const text = await Deno.readTextFile("./input.txt");
const lines = text.split("\n");

const reports = lines.map(it => it.split(" ").map(it => it * 1));

function isSafe(report) {
  if (report.length < 2) {
    return true;
  }

  if (report[1] == report[0]) {
    return false;
  }

  const direction = (report[1] - report[0]) / Math.abs(report[1] - report[0]);

  for (let i = 1; i < report.length; i++) {
    const previousLevel = report[i - 1];
    const level = report[i];
    const localDirection = (level - previousLevel) / Math.abs(level - previousLevel);
    const magnitude = Math.abs(level - previousLevel);

    if (localDirection != direction || magnitude < 1 || magnitude > 3) {
      return false;
    }
  }
  return true;
}

console.log(reports.filter(isSafe).length)

// part 2

// lol, pretty bad. don't care
function isSafePart2(report) {

  if (isSafe(report)) {
    return true;
  }

  for (let i = 0; i < report.length; i++) {
    const copy  = report.filter((it, index) => index != i);
    if (isSafe(copy)) {
      return true;
    }
  }
  return false;
}

console.log(reports.filter(isSafePart2).length)

