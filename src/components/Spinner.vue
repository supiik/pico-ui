<script setup lang="ts">
// Indikátor prebiehajúcej asynchrónnej operácie (načítanie, uloženie, volanie API).
// Pravidlo: každý asynchrónny proces v UI ukazuje tento spinner. Čítačka obrazovky prečíta `label`.
import { Loader2Icon } from '@lucide/vue'

withDefaults(defineProps<{ label?: string }>(), { label: 'Načítavam…' })
</script>

<template>
  <span class="inline-flex items-center gap-2 text-sm text-muted-foreground" role="status" aria-live="polite">
    <Loader2Icon class="size-4 animate-spin motion-reduce:animate-pulse" aria-hidden="true" />
    <span>{{ label }}</span>
  </span>
</template>
