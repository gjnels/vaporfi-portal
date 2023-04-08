<script lang="ts">
  import { packetColors } from '$lib/utils/nicotinePackets'

  export let packets: { id: number; color: string; mg: number; count: number }[]
</script>

<div
  class="grid grid-cols-[auto,_1fr] items-center gap-x-2 gap-y-3 text-center font-medium"
>
  {#each packets as packet (packet.id)}
    {@const color = packet.color.toLowerCase()}
    <p class="justify-self-end text-xl">{packet.count} &times;</p>
    <div
      class="rounded-lg border-[3px] {packetColors[color]} bg-surface-950 p-2"
    >
      <p class="capitalize">{color} - {packet.mg}mg</p>
    </div>
  {/each}
</div>
