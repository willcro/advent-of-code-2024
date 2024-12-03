// part 1

let text = await Deno.readTextFile("./input.txt");
let pattern = /mul\(([0-9]+),([0-9]+)\)/

let str = text;
let out = 0;
let match = pattern.exec(text);

while (match) {
  out += match[1] * match[2];
  str = str.substr(match.index + match[0].length)
  match = pattern.exec(str)
}

console.log(out);

// part2

str = text
pattern = /mul\(([0-9]+),([0-9]+)\)|do\(\)|don't\(\)/

out = 0;
match = pattern.exec(str);
let blocked = false;

while (match) {
  if (match[0] == "do()") {
    blocked = false;
  } else if (match[0] == "don't()") {
    blocked = true;
  } else if (!blocked) {
    out += match[1] * match[2];
  }
  text = text.substr(match.index + match[0].length)
  match = pattern.exec(text);
}

console.log(out);

