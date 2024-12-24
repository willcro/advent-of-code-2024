// part 1
const text = await Deno.readTextFile("./input.txt");

const parts = text.split("\n\n");

const regex1 = /([a-z0-9]+): ([01])/;
const regex2 = /([a-z0-9]+) (AND|XOR|OR) ([a-z0-9]+) -> ([a-z0-9]+)/;

const inputs = {};
parts[0].split("\n").map(line => regex1.exec(line)).forEach(input => inputs[input[1]] = input[2] * 1);

const opMap = {
  OR: (a, b) => a | b,
  XOR: (a, b) => a ^ b,
  AND: (a, b) => a & b
};

function executeGate(gate, values) {
  if (gate.inputs.some(i => values[i] == undefined)) {
    throw "Not all inputs are ready";
  }

  if (values[gate.output] != undefined) {
    throw "Output already set";
  }

  const a = values[gate.inputs[0]];
  const b = values[gate.inputs[1]];
  const result = opMap[gate.operation](a, b);

  values[gate.output] = result;
}

const gates = parts[1].split("\n").map(line => regex2.exec(line)).map(g => {
  return {
    id: g[0],
    inputs: [g[1], g[3]],
    output: g[4],
    operation: g[2]
  };
});

const wireToGate = {};
const outputToGate = {}

gates.forEach(g => g.inputs.forEach(i => {
  if (wireToGate[i] == undefined) {
    wireToGate[i] = [g];
  } else {
    wireToGate[i].push(g);
  }

  outputToGate[g.output] = g;
}));

function enqueueNewGates(wireToGate, gatesToProcess, gatesInQueue, values, newInputGate) {
  if (wireToGate[newInputGate] != undefined) {
    wireToGate[newInputGate].filter(g => g.inputs.every(input => values[input] != undefined))
      .filter(g => !gatesInQueue.has(g.id))
      .forEach(g => {
        gatesToProcess.push(g);
        gatesInQueue.add(g.id);
      });
  }
}

function run(wireToGate, inputs) {
  const values = JSON.parse(JSON.stringify(inputs));

  const gatesInQueue = new Set();
  const gatesToProcess = [];
  Object.keys(inputs).forEach(i => {
    enqueueNewGates(wireToGate, gatesToProcess, gatesInQueue, values, i);
  });

  while (gatesToProcess.length > 0) {
    const gate = gatesToProcess.pop();
    executeGate(gate, values);
    enqueueNewGates(wireToGate, gatesToProcess, gatesInQueue, values, gate.output);
  }

  return values;
}

function readOutputValue(values, startsWith) {
  return parseInt(Object.entries(values).filter(e => e[0].startsWith(startsWith)).sort((a, b) => b[0].localeCompare(a[0])).map(it => it[1]).join(""), 2);
}

function getAnomolousOutputs(expected, z) {
  return (BigInt(z) ^ BigInt(expected)).toString(2).split("").reverse().map((it, i) => it == 1 ? i : null).filter(it => it != null).map(it => "z" + it);
}

const out = run(wireToGate, inputs);
const x = readOutputValue(out, "x");
const y = readOutputValue(out, "y");
const z = readOutputValue(out, "z");
const expected = x + y;

function getGatesThatAffectOutput(outputToGate, output) {
  if (output.startsWith("x") || output.startsWith("y")) {
    return new Set();
  }

  const outputGate = outputToGate[output];

  const out = new Set([outputGate.id]);

  outputGate.inputs.forEach(i => {
    Array.from(getGatesThatAffectOutput(outputToGate, i)).forEach(it => out.add(it));
  });

  return out;
}

function getGatesThatAffectOutputs(outputToGate, outputs) {
  const ret = new Set();

  Array.from(outputs).forEach(it => Array.from(getGatesThatAffectOutput(outputToGate, it)).forEach(a => ret.add(a)));

  return ret;
}

function findAllAnomolousBits(simCount, inputs, outputToGate, wireToGate) {
  const ret = new Set();
  const nonAnom = new Set();
  const out = run(wireToGate, inputs);
  Object.keys(out).filter(it => it.startsWith("z")).forEach(it => nonAnom.add(it));

  for (let n = 0; n < simCount; n++) {
    Object.keys(inputs).forEach(i => {
      inputs[i] = Math.random() > 0.5 ? 1 : 0;
    });

    const out = run(wireToGate, inputs);
    const x = readOutputValue(out, "x");
    const y = readOutputValue(out, "y");
    const z = readOutputValue(out, "z");
    const expected = x + y;
    getAnomolousOutputs(expected, z).forEach(it => {
      ret.add(it)
      nonAnom.delete(it);
    });
  }

  return { anom: ret, nonAnom: nonAnom };

}

// this proves that it is fixed
const nonAnomBits = findAllAnomolousBits(100, inputs, outputToGate, wireToGate);
console.log(`There are ${nonAnomBits.anom.size} anomolous bits`);

// this didn't work, but I decided to leave it here for reference
function trySwitches(gateToSwapFromId, gates, inputs, wireToGate, dontSwapWith, trials) {
  let gateToSwapFrom = gates.filter(it => it.id == gateToSwapFromId)[0];
  console.log(gateToSwapFrom)
  let bestGate = null;
  const baseLine = findAllNonAnomolousBits(trials, inputs, null, wireToGate);
  let bestScore = Infinity;

  console.log(bestScore);

  gates.filter(gate => !dontSwapWith.has(gate.id)).forEach(gate => {

    const originalOutputFromGate = gate.output;
    const originalOutputFromGateToSwapFrom = gateToSwapFrom.output;

    gate.output = originalOutputFromGateToSwapFrom;
    gateToSwapFrom.output = originalOutputFromGate;

    console.log(wireToGate["y35"]);

    let bits = findAllNonAnomolousBits(trials, inputs, null, wireToGate);
    if (bits.nonAnom.size > bestScore && bits.nonAnom.has("z35")) {
      bestScore = bits.nonAnom.size;
      bestGate = gate;
    }

    gateToSwapFrom.output = originalOutputFromGateToSwapFrom;
    gate.output = originalOutputFromGate;
  });

  return { bestGate, bestScore }
}


const regex3 = /[xy]([0-9]{2}) AND [xy]\1 -> ([a-z0-9]{3})/

function standardizeName(inputs, operation) {
  return inputs.sort((a,b) => a.localeCompare(b)).join(operation);
}

// I gave up trying to solve this programtically. Instead
// I made a spreadsheet to keep track of the patterns I 
// was seeing. I kept running this function over and over
// and fixing things whenever it got stuck.
function makeSpreadsheet(gates) {
  let nameToGate = {};
  gates.forEach(g => {
    nameToGate[standardizeName(g.inputs, g.operation)] = g;
  });

  const out = [];

  out.push({
    A: 0, B: "z00", C: "qtf", D: "qtf", E: "qtf", F: ""
  });

  let i = 1;

  while (true) {
    const A = `${i}`.padStart(2, "0");
    const B  = nameToGate[standardizeName([`x${A}`, `y${A}`], "XOR")].output;
    const C = nameToGate[standardizeName([`x${A}`, `y${A}`], "AND")].output;
    const D = nameToGate[standardizeName([out[i-1].E, B], "AND")].output;
    const E = nameToGate[standardizeName([D, C], "OR")].output;
    const F = nameToGate[standardizeName([out[i-1].E, B], "XOR")].output;
    out.push({A,B,C,D,E,F});
    console.log(`${A}\t${B}\t${C}\t${D}\t${E}\t${F}`)
    i++
  }
}

let part2Answer = "" // redacted because you aren't supposed to commit the answers

console.log(part2Answer);
