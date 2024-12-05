// part 1

const text = await Deno.readTextFile("./input.txt");
const parts = text.split("\n\n");

const pors = parts[0].split("\n")
  .map(l => {
    const pages = l.split("|");
    return {
      before: pages[0] * 1,
      after: pages[1] * 1
    }
  });

const befores = {};
const afters = {};

pors.forEach(por => {
  if (befores[por.after] == undefined) {
    befores[por.after] = new Set([por.before]);
  } else {
    befores[por.after].add(por.before);
  }

  if (afters[por.before] == undefined) {
    afters[por.before] = new Set([por.after]);
  } else {
    afters[por.before].add(por.after);
  }
})

const updates = parts[1].split("\n").map(it => it.split(",").map(it => it * 1));

function test(update) {
  for (let i = 0; i < update.length; i++) {
    const page = update[i];
    const beforeSlice = update.slice(0, i);
    const afterSlice = update.slice(i + 1);
    
    if (beforeSlice.some(p => afters[page] != undefined && afters[page].has(p))) {
      return false;
    }

    if (afterSlice.some(p => befores[page] != undefined && befores[page].has(p))) {
      return false;
    }
  }
  return true;
}

function score(update) {
  return update[Math.floor(update.length / 2)];
}

function compare(a, b, recursive = false) {
  if (afters[a] == undefined && afters[a].has(b)) {
    return -1;
  }

  return 1;
}

console.log(updates.filter(test).map(score).reduce((a,b) => a + b, 0));

// part 2

console.log(updates.filter(it => !test(it)).map(it => it.sort(compare)).map(score).reduce((a,b) => a + b, 0));
