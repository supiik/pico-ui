<script setup lang="ts">
// Prepínač ukážkového účtu v režime ukážkových dát (`npm run dev:mock`) – len lokálny vývoj.
// Aplikácia ho načíta len pri VITE_MOCK (defineAsyncComponent), do produkčného buildu sa nedostane.
// Výber spracuje aplikácia (setMockRole z @supiik/pico-security/mock obnoví stránku s novou rolou).
import { FlaskConical } from '@lucide/vue'
import { pt } from '../messages.ts'

defineProps<{ roles: { id: string; label: string }[]; current: string }>()
const emit = defineEmits<{ select: [id: string] }>()
</script>

<template>
  <div class="fixed right-4 bottom-16 z-40 flex items-center gap-2 rounded-full border border-dashed border-primary bg-card px-3 py-1.5 text-xs shadow-md">
    <FlaskConical class="size-4 text-primary" aria-hidden="true" />
    <span class="font-semibold">{{ pt('mockData') }}</span>
    <label class="flex items-center gap-1.5">
      <span class="text-muted-foreground">{{ pt('mockAccount') }}</span>
      <select class="rounded-md border bg-background px-1.5 py-0.5 text-xs focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        :value="current" @change="emit('select', ($event.target as HTMLSelectElement).value)">
        <option v-for="r in roles" :key="r.id" :value="r.id">{{ r.label }}</option>
      </select>
    </label>
  </div>
</template>
