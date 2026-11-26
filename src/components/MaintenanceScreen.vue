<script setup lang="ts">
// Stránka údržby pre zákazníkov: namiesto obsahu aplikácie, kým platí oznámenie druhu „maintenance“ pre produkt.
// Aplikácia počas nej nevolá svoje API (zobrazí len toto). Text a čas konca sú z oznámenia z aquaria.
import { Wrench } from '@lucide/vue'
import { formatDate, locale } from '../locale.ts'
import { pt } from '../messages.ts'
import { noticeText } from '../notices.ts'
import type { PublicNotice } from '../notices.ts'
import PrefsSwitch from './PrefsSwitch.vue'

defineProps<{ notice: PublicNotice; /** názov aplikácie nad textom */ title?: string }>()
</script>

<template>
  <main id="obsah" class="grid min-h-dvh place-items-center bg-background p-6 text-foreground">
    <div class="w-full max-w-lg space-y-5 rounded-xl border bg-card p-8 text-center shadow-sm" role="alert">
      <span class="mx-auto grid size-14 place-items-center rounded-full bg-warning/15 text-warning"><Wrench class="size-7" aria-hidden="true" /></span>
      <p v-if="title" class="text-sm font-medium text-muted-foreground">{{ title }}</p>
      <h1>{{ pt('maintenanceTitle') }}</h1>
      <p class="whitespace-pre-line">{{ noticeText(notice, locale) }}</p>
      <p class="text-sm text-muted-foreground">{{ pt('maintenanceUntil', { date: formatDate(notice.to, 'dateTime') }) }}</p>
      <p class="text-sm text-muted-foreground">{{ pt('maintenanceRetry') }}</p>
      <PrefsSwitch class="mx-auto w-fit" />
    </div>
  </main>
</template>
