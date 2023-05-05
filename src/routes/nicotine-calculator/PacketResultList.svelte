<script lang="ts">
  import { packetColors } from '$lib/utils/nicotinePackets'

  export let packets: { id: number; color: string; mg: number; count: number }[]
</script>

<div class="grid grid-cols-[auto,_1fr] items-center gap-x-2 gap-y-3 text-center md:text-lg">
  {#each packets as packet (packet.id)}
    {@const color = packet.color.toLowerCase()}
    <span class="justify-self-end">{packet.count} &times;</span>
    <div class="border-2 rounded-token {packetColors[color]} px-3 py-1">
      <span class="capitalize">{color} - {packet.mg}mg</span>
    </div>
  {/each}
</div>
