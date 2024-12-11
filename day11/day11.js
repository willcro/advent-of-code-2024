// part 1

const text = await Deno.readTextFile("./input.txt");
const stones = text.split(" ").map(it => it * 1);
const memo = {};

function findTotalMemo(startingNumber, steps) {
  const id = `${startingNumber},${steps}`;
  if (memo[id] != undefined) {
    return memo[id];
  }
  const out = findTotal(startingNumber, steps);
  memo[id] = out;
  return out;
}

function findTotal(startingNumber, steps) {
  if (steps == 0) {
    return 1;
  }

  if (startingNumber == 0) {
    return findTotalMemo(1, steps - 1);
  }

  const str = `${startingNumber}`;
  if (str.length % 2 == 0) {
    const firstHalf = str.substring(0, str.length / 2) * 1;
    const secondHalf = str.substring(str.length / 2) * 1;

    return findTotalMemo(firstHalf, steps - 1) + findTotalMemo(secondHalf, steps - 1);
  }

  return findTotalMemo(startingNumber * 2024, steps - 1);
}

console.log(stones.map(it => findTotalMemo(it, 25)).reduce((a,b) => a + b, 0))

// part 2
console.log(stones.map(it => findTotalMemo(it, 75)).reduce((a,b) => a + b, 0))

