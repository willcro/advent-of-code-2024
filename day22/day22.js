// part 1
const text = await Deno.readTextFile("./input.txt");
const lines = text.split("\n").map(it => it * 1);

function nextSecret(num) {
  num = (((0b111111111111111111 & num) << 6) ^ num);
  num = ((num >> 5) ^ num) & 0b111111111111111111111111;
  num = (((0b1111111111111 & num) << 11) ^ num);
  return num;
}

function nthSecret(start, n) {
  let num = start;
  for (let i = 0; i < n; i++) {
    num = nextSecret(num);
  }
  return num;
}

console.log(lines.map(l => nthSecret(l, 2000)).reduce((a,b) => a + b, 0));

function getMonkeySellOptions(startPrice, secretCount) {
  let n1 = startPrice;
  let n2 = nextSecret(n1);
  let n3 = nextSecret(n2);
  let n4 = nextSecret(n3);

  let out = {};

  for (let i=3; i<secretCount; i++) {
    const n5 = nextSecret(n4);
    const d1 = ((n2 % 10) - (n1 % 10));
    const d2 = ((n3 % 10) - (n2 % 10));
    const d3 = ((n4 % 10) - (n3 % 10));
    const d4 = ((n5 % 10) - (n4 % 10));
    const id = `${d1},${d2},${d3},${d4}`;

    if (out[id] == undefined) {
      out[id] = (n5 % 10);
    }

    n1 = n2;
    n2 = n3;
    n3 = n4;
    n4 = n5;
  }

  return out;
}

function combineMaps(a, b) {
  Object.entries(b).forEach(entry => {
    if (a[entry[0]] == undefined) {
      a[entry[0]] = entry[1];
    } else {
      a[entry[0]] = a[entry[0]] + entry[1];
    }
  });
}

function findBestSellPrices(lines) {
  const out = {};
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const monkey = getMonkeySellOptions(line, 2000);
    combineMaps(out, monkey);
  }

  return Object.entries(out).reduce((a, b) => a[1] > b[1] ? a : b, ["", 0]);
}

console.log(findBestSellPrices(lines));
