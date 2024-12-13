// part 1

const text = await Deno.readTextFile("./input.txt");
const regex1 = /Button [AB]: X\+([0-9]+), Y\+([0-9]+)/;
const regex2 = /Prize: X=([0-9]+), Y=([0-9]+)/;
const aCost = 3n;
const bCost = 1n;
let modifier = 0n;

function parseGame(game) {
  const lines = game.split("\n");
  const line1 = regex1.exec(lines[0]);
  const line2 = regex1.exec(lines[1]);
  const line3 = regex2.exec(lines[2]);

  // there was probably a way to do this without resorting to BigInts
  // but whatever
  return {
    ax: BigInt(line1[1] * 1),
    ay: BigInt(line1[2] * 1),
    bx: BigInt(line2[1] * 1),
    by: BigInt(line2[2] * 1),
    cx: BigInt(line3[1] * 1),
    cy: BigInt(line3[2] * 1),
  };
}

const games = text.split("\n\n").map(parseGame);

class Rational {
  constructor(n, d) {
    this.numerator = n;
    this.denominator = d;
    this.reduce();
  }

  reduce() {
    const d = gcd(this.numerator, this.denominator);
    this.numerator = this.numerator / d;
    this.denominator = this.denominator / d;

    if (this.denominator < 0) {
      this.numerator = -this.numerator;
      this.denominator = -this.denominator;
    }
  }

  plus(other) {
    const numerator = (this.numerator * other.denominator) + (other.numerator * this.denominator);
    const denominator = this.denominator * other.denominator;
    return new Rational(numerator, denominator)
  }

  minus(other) {
    const numerator = (this.numerator * other.denominator) - (other.numerator * this.denominator);
    const denominator = this.denominator * other.denominator;
    return new Rational(numerator, denominator)
  }

  times(other) {
    const numerator = this.numerator * other.numerator;
    const denominator = this.denominator * other.denominator;
    return new Rational(numerator, denominator)
  }

  divide(other) {
    const numerator = this.numerator * other.denominator;
    const denominator = this.denominator * other.numerator;
    return new Rational(numerator, denominator)
  }

  equals(other) {
    return this.numerator == other.numerator && this.denominator == other.denominator;
  }

  isInteger() {
    return this.denominator == 1;
  }
}

function gcd(a, b) {
  if (b == 0n) {
    return a;
  }

  return gcd(b, a % b);
}

function solve(ax, ay, bx, by, cx, cy) {
  const an = (new Rational(cx, bx).minus(new Rational(cy, by))).divide(new Rational(ax, bx).minus(new Rational(ay, by)));
  const bn = (new Rational(cx, ax).minus(new Rational(cy, ay))).divide(new Rational(bx, ax).minus(new Rational(by, ay)));
  return {an, bn};
}

function solveGame(game) {
  if (new Rational(game.ax, game.ay).equals(new Rational(game.bx, game.by))) {
    // this is an edge case that doesn't come up in the real input, but would cause problems if it did
    throw "A and B are collinear";
  }

  return solve(game.ax, game.ay, game.bx, game.by, game.cx + modifier, game.cy + modifier);
}

function price(solution) {
  if (!solution.an.isInteger() || !solution.an.isInteger()) {
    return 0n;
  }

  return aCost * solution.an.numerator + bCost * solution.bn.numerator;
}

console.log(games.map(solveGame).map(price).reduce((a, b) => a + b, 0n))

// part 2

modifier = 10000000000000n;

console.log(games.map(solveGame).map(price).reduce((a, b) => a + b, 0n))
