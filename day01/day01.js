// part 1

const text = await Deno.readTextFile("./input.txt");
const lines = text.split("\n");
const pattern = /([0-9]+) +([0-9]+)/

const values = lines.map(l => pattern.exec(l)).map(l => {
  return {
    "a": l[1] * 1,
    "b": l[2] * 1
  }
});

const lists = [];

const aList = values.map(it => it["a"]).sort((a,b) => a - b);
const bList = values.map(it => it["b"]).sort((a,b) => a - b);

let out = 0;

for (let i = 0; i < aList.length; i++) {
  const a = aList[i];
  const b = bList[i];

  out += Math.abs(a - b);
}

console.log(out);

// part 2

const counts = {};

for (let i = 0; i < bList.length; i++) {
  const b = bList[i];
  if (counts[b]) {
    counts[b]++;
  } else {
    counts[b] = 1;
  }
}

let out2 = 0;

for (let i = 0; i < aList.length; i++) {
  const a = aList[i];
  if (counts[a]) {
    out2 += a * counts[a];
  }
}

console.log(out2)
