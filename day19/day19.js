// part 1

const text = await Deno.readTextFile("./input.txt");
const parts = text.split("\n\n");

const towels = parts[0].split(", ");
const regString = "^(" + towels.join("|") + ")+$";
const regex = new RegExp(regString);
const patterns = parts[1].split("\n");

console.log(patterns.filter(p => regex.test(p)).length);

// part 2

const memo = {};

function countAndMemo(string) {
  if (memo[string] != undefined) {
    return memo[string];
  }

  const out = count(string);
  memo[string] = out;
  return out;
}

function count(string) {
  if (string == "") {
    return 1;
  }

  return towels.filter(p => string.startsWith(p))
    .map(p => countAndMemo(string.substring(p.length)))
    .reduce((a, b) => a + b, 0);
}

console.log(patterns.map(p => countAndMemo(p, towels, false)).reduce((a, b) => a + b, 0))