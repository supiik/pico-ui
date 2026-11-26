<script setup lang="ts">
// úprava oproti registru: zebra – každý párny riadok tela tabuľky má jemné pozadie (vo všetkých tabuľkách)
import type { HTMLAttributes } from "vue"
import { cn } from "../../utils.ts"

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()
</script>

<template>
  <div data-slot="table-container" class="relative w-full overflow-auto">
    <table data-slot="table" :class="cn('w-full caption-bottom text-sm [&_tbody_tr:nth-child(even)]:bg-muted/50', props.class)">
      <slot />
    </table>
  </div>
</template>
