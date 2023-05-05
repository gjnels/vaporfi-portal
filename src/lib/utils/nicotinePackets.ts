import type { PacketFormData, SavedNicotinePacket } from '$lib/types/nicotinePackets.types'

export const packetColors: { [key: string]: string } = {
  yellow: 'border-yellow-500',
  green: 'border-green-500',
  blue: 'border-sky-500',
  red: 'border-red-500',
  purple: 'border-purple-600',
  brown: 'border-amber-800',
  black: 'border-black',
  orange: 'border-orange-500',
  pink: 'border-pink-500',
  grey: 'border-zinc-500'
}

type FoundPacket = SavedNicotinePacket & { count: number }

export function calculatePackets(
  formData: PacketFormData,
  availablePackets: SavedNicotinePacket[]
) {
  const { bottleSize, current, final, salt } = formData

  if (availablePackets == null || !availablePackets.length) return []

  // calculate the total mg of nicotine to be added to bottle
  const currentNic = bottleSize * current
  const totalNic = bottleSize * final
  const nicAdded = totalNic - currentNic

  // filter available nic packets to have salt nicotine or not
  const packets = availablePackets.filter((packet) => packet.available && packet.salt === salt)

  if (packets == null || !packets.length) return []

  // array of packets to return including exact packets, lower packets, and higher packets
  const returnPackets: {
    packets: FoundPacket[]
    finalNicLevel: number
    type: 'higher' | 'lower' | 'exact'
  }[] = []

  const higherPackets = findPacketsAbove(packets, nicAdded)
  const lowerPackets = findPacketsBelow(packets, nicAdded)

  if (lowerPackets.length) {
    const finalNicLevel = getFinalNicLevel(lowerPackets, bottleSize, current)
    if (finalNicLevel === final) {
      returnPackets.push({
        type: 'exact',
        finalNicLevel,
        packets: lowerPackets
      })
      return returnPackets
    }

    returnPackets.push({
      type: 'lower',
      finalNicLevel,
      packets: lowerPackets
    })
  }

  if (higherPackets.length) {
    returnPackets.push({
      type: 'higher',
      finalNicLevel: getFinalNicLevel(higherPackets, bottleSize, current),
      packets: higherPackets
    })
  }

  return returnPackets
}

// find all packets needed to get the nicotine level as close to the desired level as possible without going over
function findPacketsBelow(packets: SavedNicotinePacket[], nicToAdd: number) {
  const lowerPackets: FoundPacket[] = []
  let currentNic = nicToAdd
  while (currentNic > 0) {
    const lower = findLowerPacket(packets, currentNic)
    currentNic -= lower?.mg ?? currentNic
    const addedPacket = lowerPackets.find((packet) => packet.id === lower?.id)
    if (addedPacket) {
      addedPacket.count += 1
    } else if (lower) {
      lowerPackets.push({ count: 1, ...lower })
    }
  }
  return lowerPackets
}

function findPacketsAbove(packets: SavedNicotinePacket[], nicToAdd: number) {
  const higherPackets: FoundPacket[] = []
  let currentNic = nicToAdd

  while (currentNic > 0) {
    const lower = findLowerPacket(packets, currentNic)
    const higher = findHigherPacket(packets, currentNic)

    if (lower) {
      currentNic -= lower.mg

      const addedPacket = higherPackets.find((packet) => packet.id === lower.id)

      if (addedPacket) {
        addedPacket.count += 1
      } else {
        higherPackets.push({ count: 1, ...lower })
      }
    } else if (higher) {
      currentNic -= higher.mg

      const addedPacket = higherPackets.find((packet) => packet.id === higher.id)

      if (addedPacket) {
        addedPacket.count += 1
      } else {
        higherPackets.push({ count: 1, ...higher })
      }
    }
  }

  return filterPackets(higherPackets, packets)
}

// Get the most accurate count of packets without duplicates or packets that could be combined into another packet
function filterPackets(packets: FoundPacket[], allPackets: SavedNicotinePacket[]): FoundPacket[] {
  const { packets: filteredDuplicatePackets, found: foundDuplicates } = findDuplicatePackets(
    packets,
    allPackets
  )

  const { packets: filteredAdditivePackets, found: foundAdditive } = findAdditivePackets(
    filteredDuplicatePackets,
    allPackets
  )

  // Adjustments were found, so run again until there are no adjustments left to make
  if (foundDuplicates || foundAdditive) {
    return filterPackets(filteredAdditivePackets, allPackets)
  }

  return filteredAdditivePackets
}

// Filter the results to look for packets that have multiple counts that can be combined to a equal a packet of a higher nicotine level
// e.g. if there are 2 blue packets (180mg) and purple packets (360mg) are available, remove the 2 blue packets and add one purple packet
function findDuplicatePackets(currentPackets: FoundPacket[], allPackets: SavedNicotinePacket[]) {
  const packets: FoundPacket[] = []
  let found = false
  currentPackets.forEach((packet) => {
    const betterPacket = allPackets.find(
      (p) => p.mg === packet.mg * packet.count && p.id !== packet.id
    )

    const foundPacketIndex = packets.findIndex((packet) => packet.id === betterPacket?.id)

    if (foundPacketIndex >= 0) {
      packets[foundPacketIndex].count += 1
      found = true
    } else if (betterPacket) {
      packets.push({ count: 1, ...betterPacket })
      found = true
    } else {
      packets.push({ ...packet })
    }
  })
  return { packets, found }
}

// Filter packets to find packets that can be added together to make a higher packet
// e.g. if there is a blue packet (180mg) and a purple packet (360mg) and brown packets (540mg) are available, remove the blue and purple and add a brown
function findAdditivePackets(currentPackets: FoundPacket[], allPackets: SavedNicotinePacket[]) {
  let found = false
  const packets = [...currentPackets]

  for (let i = 0; i < packets.length; i++) {
    for (let j = i + 1; j < packets.length; j++) {
      const foundPacket = allPackets.find((p) => p.mg === packets[i].mg + packets[j].mg)

      if (foundPacket) {
        const packetInResultIndex = packets.findIndex((p) => p.id === foundPacket.id)
        if (packetInResultIndex >= 0) {
          packets[packetInResultIndex].count++
          packets.splice(j, 1)
          packets.splice(i, 1)
        } else {
          packets[i] = { ...foundPacket, count: 1 }
          packets.splice(j, 1)
        }
        found = true
      }
    }
  }

  return { packets, found }
}

// find the packet that is closest to the current nicotine level to be added without being less than that nicotine level
function findHigherPacket(packets: SavedNicotinePacket[], nicToAdd: number) {
  return packets.reduce<SavedNicotinePacket | null>((closestPacket, currentPacket) => {
    if (currentPacket.mg < nicToAdd) {
      return closestPacket
    }

    if (closestPacket && currentPacket.mg > closestPacket.mg) {
      return closestPacket
    }

    return currentPacket
  }, null)
}

// find the packet that is closest to the current nicotine level to be added without being more than that nicotine level
function findLowerPacket(packets: SavedNicotinePacket[], nicToAdd: number) {
  return packets.reduce<SavedNicotinePacket | null>((closestPacket, currentPacket) => {
    if (currentPacket.mg > nicToAdd) {
      return closestPacket
    }

    if (closestPacket && currentPacket.mg < closestPacket.mg) {
      return closestPacket
    }

    return currentPacket
  }, null)
}

// calculate the final nicotine level of the bottle based on all packets being added, the bottle size, and the current nicotine level of the bottle
export function getFinalNicLevel(
  packets: { mg: number; count: number }[],
  bottleSize: number,
  currentLevel: number
) {
  return (
    currentLevel +
    parseFloat(
      (
        packets.reduce((nic, packet) => {
          const addedNic = packet.mg * packet.count
          return nic + addedNic
        }, 0) / bottleSize
      ).toFixed(1)
    )
  )
}
