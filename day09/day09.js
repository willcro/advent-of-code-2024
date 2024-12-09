// part 1

const text = await Deno.readTextFile("./input.txt");
const data = text.split("").map(it => it * 1);

function defrag(data) {
  let checksum = 0;
  let blocksReadFromStart =  0;
  
  let currentEndId = data.length - 1;
  let blocksReadFromCurrentId = 0;

  for (let i = 0; i < data.length; i++) {
    const range = data[i];
    if (i % 2 == 0) {
      // this is a data block
      const id = i / 2;
      if (i > currentEndId) {
        return checksum;
      }

      if (i == currentEndId) {
        // handle leftovers at the end of the disk
        const blocksAbleToBeRead = range - blocksReadFromCurrentId;
        const value = id * (blocksReadFromStart + (blocksReadFromStart + (blocksAbleToBeRead - 1))) * (blocksAbleToBeRead / 2);
        checksum += value;
        return checksum;
      }
      const value = id * (blocksReadFromStart + (blocksReadFromStart + (range - 1))) * (range / 2);
      checksum = checksum + value;
      blocksReadFromStart = blocksReadFromStart + range;
    } else {
      // this is an open block
      let blocksToRead = range;
      let value = 0;
      while (blocksToRead > 0) {
        if (currentEndId <= i) {
          checksum += value;
          return checksum;
        }
        if (currentEndId % 2 == 0) {
          const id = currentEndId / 2;
          const blocksAbleToBeRead = Math.min(blocksToRead, data[currentEndId] - blocksReadFromCurrentId);
          const valueAdd = id * (blocksReadFromStart + (blocksReadFromStart + (blocksAbleToBeRead - 1))) * (blocksAbleToBeRead / 2);
          value += valueAdd;
          blocksToRead = blocksToRead - blocksAbleToBeRead;
          blocksReadFromCurrentId += blocksAbleToBeRead;
          blocksReadFromStart += blocksAbleToBeRead;
        } else {
          currentEndId = currentEndId - 1;
        }

        if (data[currentEndId] == blocksReadFromCurrentId) {
          currentEndId = currentEndId - 2;
          blocksReadFromCurrentId = 0;
        }
      }

      checksum += value;
    }
    
  }

}

console.log(defrag(data))

// part 2

function parseLayout(data) {
  let blocksReadFromStart =  0;
  let layout = [];

  for (let i = 0; i < data.length; i++) {
    const range = data[i];
    if (i % 2 == 0) {
      // this is a data block
      const out = {
        id: i / 2,
        type: "DATA",
        length: range,
        offset: blocksReadFromStart,
        relocated: false,
        counted: false
      };

      layout.push(out);
    } else {
      const out = {
        type: "EMPTY",
        length: range,
        offset: blocksReadFromStart,
        tenents: []
      };
      layout.push(out);
    }

    blocksReadFromStart += range;
  }

  return layout;

}

// this code is really hard to read, but it is pretty fast
function defragPart2(layout) {
  let priorityList = createPriorityList(layout);
  let out = 0;
  for (let i = 0; i < layout.length; i++) {
    const block = layout[i];
    if (block.type == 'DATA' && !block.relocated) {
      block.counted = true;
      out += block.id * (block.offset + (block.offset + (block.length - 1))) * (block.length / 2);
    } else {
      let offset = block.offset;
      let remainingSpace = block.length;
      let filler = findTopFiller(priorityList, remainingSpace);
      while (filler != null) {
        filler.relocated = true;
        out += filler.id * (offset + (offset + (filler.length - 1))) * (filler.length / 2);
        offset += filler.length;
        remainingSpace -= filler.length;
        filler = findTopFiller(priorityList, remainingSpace);
      }
    }
  }

  return out;

}

function findTopFiller(priorityList, size) {
  let highestId = -1;
  let highestLength = -1;
  for (let i = size; i >= 0; i--){
    if (priorityList[i].length > 0) {
      const last = priorityList[i][priorityList[i].length - 1];
      if (last.id > highestId && !last.counted) {
        highestId = last.id;
        highestLength = i;
      }
    }
  }

  if (highestId == -1) {
    return null;
  }

  return priorityList[highestLength].pop();
}

function createPriorityList(layout) {
  const stuff = new Array(10).fill(0).map(it => []);

  layout.forEach(it => {
    if (it.type == "DATA") {
      stuff[it.length].push(it);
    }
  });

  return stuff.map(it => it.sort((a,b) => a.id - b.id));
}

console.log(defragPart2(parseLayout(data)))