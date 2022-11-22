export function calculatePackets(formData, availablePackets) {
  const { bottleSize, initialNic, desiredNic, salt } = formData;

  if (availablePackets == null || !availablePackets.length) return [];

  // calculate the total mg of nicotine to be added to bottle
  const currentNic = bottleSize * initialNic;
  const totalNic = bottleSize * desiredNic;
  const nicAdded = totalNic - currentNic;

  // filter available nic packets to have salt nicotine or not
  const packets = availablePackets.filter(
    (packet) => packet.available && packet.salt === salt
  );

  if (packets == null || !packets.length) return [];

  // array of packets to return including exact packets, lower packets, and higher packets
  const returnPackets = [];

  const higherPackets = findPacketsAbove(packets, nicAdded);
  const lowerPackets = findPacketsBelow(packets, nicAdded);

  if (higherPackets.length) {
    higherPackets.count = 1;
    returnPackets.push({
      type: "higher",
      finalNicLevel: getFinalNicLevel(higherPackets, bottleSize, initialNic),
      packets: higherPackets,
    });
  }

  if (lowerPackets.length) {
    returnPackets.push({
      type: "lower",
      finalNicLevel: getFinalNicLevel(lowerPackets, bottleSize, initialNic),
      packets: lowerPackets,
    });
  }

  return returnPackets;
}

// find all packets needed to get the nicotine level as close to the desired level as possible without going over
function findPacketsBelow(packets, nicToAdd) {
  const lowerPackets = [];
  let currentNic = nicToAdd;
  while (currentNic > 0) {
    const lower = findLowerPacket(packets, currentNic);
    currentNic -= lower?.nic_level ?? currentNic;
    const addedPacket = lowerPackets.find((packet) => packet.id === lower?.id);
    if (addedPacket) {
      addedPacket.count += 1;
    } else if (lower) {
      lowerPackets.push({ count: 1, ...lower });
    }
  }
  return lowerPackets;
}

function findPacketsAbove(packets, nicToAdd) {
  const higherPackets = [];
  let currentNic = nicToAdd;

  while (currentNic > 0) {
    const lower = findLowerPacket(packets, currentNic);
    const higher = findHigherPacket(packets, currentNic);

    if (lower) {
      currentNic -= lower.nic_level;

      const addedPacket = higherPackets.find(
        (packet) => packet.id === lower.id
      );

      if (addedPacket) {
        addedPacket.count += 1;
      } else {
        higherPackets.push({ count: 1, ...lower });
      }
    } else {
      currentNic -= higher.nic_level;

      const addedPacket = higherPackets.find(
        (packet) => packet.id === higher.id
      );

      if (addedPacket) {
        addedPacket.count += 1;
      } else {
        higherPackets.push({ count: 1, ...higher });
      }
    }
  }

  // Filter the results to look for packets that have multiple counts that can be combined to a equal a packet of a higher nicotine level
  // e.g. if there are 2 blue packets (180mg) and purple packets (360mg) are available, remove the 2 blue packets and add one purple packet
  const filteredDuplicatePackets = higherPackets
    .reverse()
    .map((packet) => {
      const betterPacket = packets.find(
        (p) =>
          p.nic_level === packet.nic_level * packet.count && p.id !== packet.id
      );

      const foundPacket = higherPackets.find(
        (packet) => packet.id === betterPacket?.id
      );

      if (foundPacket) {
        foundPacket.count += 1;
        return null;
      }

      return betterPacket ? { count: 1, ...betterPacket } : packet;
    })
    .filter((packet) => packet != null)
    .reverse();

  // Filter packets to find packets that can be added together to make a higher packet
  // e.g. if there is a blue packet (180mg) and a purple packet (360mg) and brown packets (540mg) are available, remove the blue and purple and add a brown
  // Since the multiples of the same packet have already been reduced above, the counts should be one here
  const filteredAdditivePackets = [...filteredDuplicatePackets];
  for (let i = 0; i < filteredAdditivePackets.length; i++) {
    for (let j = i + 1; j < filteredAdditivePackets.length; j++) {
      const found = packets.find(
        (p) =>
          p.nic_level ===
          filteredAdditivePackets[i].nic_level +
            filteredAdditivePackets[j].nic_level
      );

      if (found) {
        const packetInResultIndex = filteredAdditivePackets.findIndex(
          (p) => p.id === found.id
        );
        if (packetInResultIndex >= 0) {
          filteredAdditivePackets[packetInResultIndex].count++;
          filteredAdditivePackets.splice(j, 1);
          filteredAdditivePackets.splice(i, 1);
        } else {
          filteredAdditivePackets[i] = { ...found, count: 1 };
          filteredAdditivePackets.splice(j, 1);
        }
      }
    }
  }
  console.log(filteredDuplicatePackets);

  return filteredAdditivePackets;
}

// find the packet that is closest to the current nicotine level to be added without being less than that nicotine level
function findHigherPacket(packets, nicToAdd) {
  return packets.reduce(
    (closestPacket, currentPacket) =>
      currentPacket.nic_level >= nicToAdd &&
      currentPacket.nic_level <
        (closestPacket?.nic_level ?? Number.MAX_SAFE_INTEGER)
        ? currentPacket
        : closestPacket,
    null
  );
}

// find the packet that is closest to the current nicotine level to be added without being more than that nicotine level
function findLowerPacket(packets, nicToAdd) {
  return packets.reduce(
    (closestPacket, currentPacket) =>
      currentPacket.nic_level <= nicToAdd &&
      currentPacket.nic_level > (closestPacket?.nic_level ?? 0)
        ? currentPacket
        : closestPacket,
    null
  );
}

// calculate the final nicotine level of the bottle based on all packets being added, the bottle size, and the initial nicotine level of the bottle
function getFinalNicLevel(packets, bottleSize, initialNic) {
  return (
    initialNic +
    parseFloat(
      (
        packets.reduce((nic, packet) => {
          const addedNic = packet.nic_level * packet.count;
          return nic + addedNic;
        }, 0) / bottleSize
      ).toFixed(1)
    )
  );
}
