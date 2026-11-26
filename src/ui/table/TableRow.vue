<script setup lang="ts">
// úprava oproti registru: hover a výber farbou accent, aby boli viditeľné aj na zebra riadku
import type { HTMLAttributes } from "vue"
import { cn } from "../../utils.ts"

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()
</script>

<template>
  <tr
    data-slot="table-row"
    :class="cn('hover:bg-accent/60 data-[state=selected]:bg-accent border-b transition-colors', props.class)"
  >
    <slot />
  </tr>
</template>
