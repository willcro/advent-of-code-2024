// part 1

const text = await Deno.readTextFile("./input.txt");
const lines = text.split("\n");
const letters = lines.map(it => it.split(""));
const lineLength = lines[0].length;

function totalMatches(text, regexes) {
  return regexes.map(reg => Array.from(text.matchAll(reg)).length).reduce((a,b) => a + b);
}
 
// this is a pretty dumb solution but I thought it would be funny
const regexes = [
  new RegExp(`(?=XMAS)`, "gs"), // east
  new RegExp(`(?=SAMX)`, "gs"), // west
  new RegExp(`(?=X.{${lineLength}}M.{${lineLength}}A.{${lineLength}}S)`, "gs"), // south
  new RegExp(`(?=S.{${lineLength}}A.{${lineLength}}M.{${lineLength}}X)`, "gs"), // north
  new RegExp(`(?=X[XMAS].{${lineLength}}M[XMAS].{${lineLength}}A[XMAS].{${lineLength}}S)`, "gs"), // south east
  new RegExp(`(?=S[XMAS].{${lineLength}}A[XMAS].{${lineLength}}M[XMAS].{${lineLength}}X)`, "gs"), // north west
  new RegExp(`(?=X.{${lineLength - 2}}[XMAS]M.{${lineLength - 2}}[XMAS]A.{${lineLength - 1}}S)`, "gs"), // south west
  new RegExp(`(?=S.{${lineLength - 2}}[XMAS]A.{${lineLength - 2}}[XMAS]M.{${lineLength - 1}}X)`, "gs") // north east
]

console.log(totalMatches(text, regexes));

const regexes2 = [
  new RegExp(`(?=M[XMAS]M.{${lineLength - 1}}A.{${lineLength - 1}}S[XMAS]S)`, "gs"),
  new RegExp(`(?=M[XMAS]S.{${lineLength - 1}}A.{${lineLength - 1}}M[XMAS]S)`, "gs"),
  new RegExp(`(?=S[XMAS]S.{${lineLength - 1}}A.{${lineLength - 1}}M[XMAS]M)`, "gs"),
  new RegExp(`(?=S[XMAS]M.{${lineLength - 1}}A.{${lineLength - 1}}S[XMAS]M)`, "gs"),
]

console.log(totalMatches(text, regexes2))
