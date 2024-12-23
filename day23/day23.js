// part 1
const text = await Deno.readTextFile("./input.txt");
const lines = text.split("\n");
const pairs = lines.map(l => l.split("-"));

function pushToMap(map, key, value) {
  if (map[key] == undefined) {
    map[key] = new Set([value]);
  } else {
    map[key].add(value);
  }
}

function createMap(pairs) {
  const out = {};

  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i];
    pushToMap(out, pair[0], pair[1]);
    pushToMap(out, pair[1], pair[0]);
  }

  return out;
}

function getTuples(list) {
  let out = [];
  for (let i = 0; i < list.length; i++) {
    for (let j = i + 1; j < list.length; j++) {
      out.push([list[i], list[j]]);
    }
  }

  return out;
}

function addToMapOrIncrement(map, key) {
  if (map[key] == undefined) {
    map[key] = 1;
  } else {
    map[key] = map[key] + 1;
  }
}

function createTriplets(map) {
  const out = {};

  Object.entries(map).forEach(entry => {
    const first = entry[0];
    const rest = Array.from(entry[1]);
    const tuples = getTuples(rest);
    tuples.forEach(t => {
      t.push(first);

      if (t.some(it => it.startsWith("t"))) {
        const id = t.sort((a, b) => a.localeCompare(b)).join(",");
        addToMapOrIncrement(out, id);
      }
    })
  });

  return Object.entries(out).filter(it => it[1] == 3).length;
}

const map = createMap(pairs);

console.log(createTriplets(map));

// part 2

function biggestGroup(map, group, tail) {
  const next = Array.from(map[tail]);

  return next
    .filter(it => it.localeCompare(tail) < 0)
    .filter(it => {
      const connections = map[it];
      return Array.from(group).every(groupMember => connections.has(groupMember));
    }).map(it => {
      const newGroup = new Set(group);
      newGroup.add(it);
      return biggestGroup(map, newGroup, it);
    }).reduce((a, b) => a.size > b.size ? a : b, group);
}

function findLongest(map) {
  const outSet = Object.keys(map).map(it => biggestGroup(map, new Set([it]), it))
    .reduce((a, b) => a.size > b.size ? a : b, new Set());
  return Array.from(outSet).sort((a, b) => a.localeCompare(b)).join(",");
}

console.log(findLongest(map))
