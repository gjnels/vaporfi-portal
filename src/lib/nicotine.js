export const calculatePackets = (formData, availablePackets) => {
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
};

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

  return higherPackets
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
