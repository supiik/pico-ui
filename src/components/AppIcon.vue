<script setup lang="ts">
// Ikona admin aplikácie podľa názvu z registra aquaria (config/apps.ts, pole `icon`).
// Povolené názvy sú v APP_ICONS (aquarium ich kontroluje pri nasadení); neznámy názov = všeobecná ikona.
import { computed } from 'vue'
import { APP_ICONS } from '../icons.ts'

const props = defineProps<{ name?: string }>()
const icon = computed(() => APP_ICONS[props.name ?? ''] ?? APP_ICONS.app)
</script>

<template>
  <component :is="icon" aria-hidden="true" />
</template>
