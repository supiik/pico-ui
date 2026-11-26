<script setup lang="ts">
// Oznámenia nad obsahom (v AppShell do slotu #notices). Výpadok a údržba sa nedajú zavrieť a čítačka ich oznámi hneď.
import { CircleAlert, Info, TriangleAlert, Wrench, X } from '@lucide/vue'
import { formatDate, locale } from '../locale.ts'
import { pt } from '../messages.ts'
import { dismissible, noticeText } from '../notices.ts'
import type { NoticeKind, Notices } from '../notices.ts'

const props = defineProps<{ notices: Notices; /** názvy produktov podľa id (pri oznámení pre konkrétny produkt) */ names?: Record<string, string> }>()

const ICON = { info: Info, warning: TriangleAlert, outage: CircleAlert, maintenance: Wrench }
const CLASS: Record<NoticeKind, string> = {
  info: 'border-primary/30 bg-accent text-accent-foreground',
  warning: 'border-warning/40 bg-warning/15 text-foreground',
  outage: 'border-destructive/40 bg-destructive/15 text-foreground',
  maintenance: 'border-warning/40 bg-warning/15 text-foreground',
}
const KIND_LABEL = { info: 'kindInfo', warning: 'kindWarning', outage: 'kindOutage', maintenance: 'kindMaintenance' } as const
const where = (products: string[]) => (products.includes('*') ? '' : products.map((p) => props.names?.[p] ?? p).join(', '))
</script>

<template>
  <div v-if="notices.visible.value.length" class="space-y-px border-b">
    <div
      v-for="n in notices.visible.value" :key="n.id" :role="dismissible(n) ? 'status' : 'alert'"
      :class="['flex items-start gap-3 border-l-4 px-4 py-2.5 text-sm md:px-6', CLASS[n.kind]]"
    >
      <component :is="ICON[n.kind]" class="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <p class="min-w-0 flex-1">
        <span class="font-medium">{{ pt(KIND_LABEL[n.kind]) }}<template v-if="where(n.products)"> · {{ where(n.products) }}</template>:</span>
        {{ noticeText(n, locale) }}
        <span v-if="n.kind !== 'info'" class="whitespace-nowrap text-muted-foreground">({{ pt('noticeUntil', { date: formatDate(n.to, 'dateTime') }) }})</span>
      </p>
      <button
        v-if="dismissible(n)" type="button" :aria-label="pt('dismiss')" :title="pt('dismiss')"
        class="-m-1 rounded p-1 opacity-70 hover:opacity-100" @click="notices.dismiss(n.id)"
      ><X class="size-4" aria-hidden="true" /></button>
    </div>
  </div>
</template>
