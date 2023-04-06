<script lang="ts">
  import { packetColors } from '$lib/utils/nicotinePackets'

  export let packets: { id: number; color: string; mg: number; count: number }[]
</script>

<div
  class="grid grid-cols-[auto,_1fr] items-center gap-4 text-center text-lg font-medium text-zinc-100"
>
  {#each packets as packet (packet.id)}
    {@const color = packet.color.toLowerCase()}
    <p class="justify-self-end text-xl">{packet.count} &times;</p>
    <div class="rounded-lg border-[3px] {packetColors[color]} bg-zinc-900 p-2">
      <p class="capitalize">{color} - {packet.mg}mg</p>
    </div>
  {/each}
</div>
