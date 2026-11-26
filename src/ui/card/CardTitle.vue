<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cn } from "../../utils.ts"

// úprava oproti registru: `as` – úroveň nadpisu podľa stránky (h1 pre hlavný nadpis), predvolene h3
const props = withDefaults(defineProps<{
  class?: HTMLAttributes["class"]
  as?: string
}>(), { as: "h3" })
</script>

<template>
  <component
    :is="props.as"
    data-slot="card-title"
    :class="cn('leading-none font-semibold', props.class)"
  >
    <slot />
  </component>
</template>
