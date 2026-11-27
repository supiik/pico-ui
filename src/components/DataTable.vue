<script setup lang="ts" generic="T">
// Tabuľka dát: stĺpce, riadky, načítanie (spinner), prázdny stav, zebra (z ui/table).
// Vlastné zobrazenie bunky cez slot #cell-<kľúč>="{ row, value }", akcie riadku cez slot #actions="{ row }".
// S @refresh má tabuľka vpravo hore tlačidlo Obnoviť (pri načítaní sa točí, riadky ostanú); vedľa neho slot #toolbar.
// Klikateľný riadok (ruka ako v orgasme): `row-href` = odkaz na detail záznamu, alebo @row-click (napr. otvorenie formulára).
// Klik na tlačidlo či odkaz v riadku sa neprekladá na klik riadku; Ctrl/⌘/stredné tlačidlo otvorí odkaz na novej karte;
// riadok je dosiahnuteľný klávesnicou (Tab, Enter).
import type { HTMLAttributes } from 'vue'
import { cn } from '../utils.ts'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { RefreshCw } from '@lucide/vue'
import { Button } from '../ui/button'
import Spinner from './Spinner.vue'
import { pt } from '../messages.ts'

export interface Column {
  /** kľúč v riadku (alebo len názov slotu) */
  key: string
  label: string
  align?: 'left' | 'right'
  /** triedy bunky aj hlavičky */
  class?: HTMLAttributes['class']
  /** prvý stĺpec ako hlavička riadku (pre čítačku obrazovky) */
  rowHeader?: boolean
}

const props = withDefaults(defineProps<{
  columns: Column[]
  rows: T[]
  rowKey: (row: T) => string | number
  loading?: boolean
  loadingLabel?: string
  empty?: string
  /** popis tabuľky pre čítačku obrazovky (vizuálne skrytý) */
  caption?: string
  /** riadok označený ako vybraný */
  selected?: (row: T) => boolean
  class?: HTMLAttributes['class']
  /** obnovenie dát – zobrazí tlačidlo Obnoviť (v šablóne ako @refresh) */
  onRefresh?: () => unknown
  /** odkaz na detail záznamu – celý riadok je klikateľný */
  rowHref?: (row: T) => string | undefined
  /** klik na riadok (v šablóne ako @row-click), ak nie je odkaz */
  onRowClick?: (row: T) => unknown
}>(), { loading: false })

defineSlots<Record<`cell-${string}`, (p: { row: T; value: unknown }) => unknown> & {
  actions?: (p: { row: T }) => unknown
  empty?: () => unknown
  toolbar?: () => unknown
}>()

const value = (row: T, key: string) => (row as Record<string, unknown>)[key]
const align = (c: Column) => (c.align === 'right' ? 'text-right' : '')

const clickable = (row: T) => !!(props.rowHref?.(row) || props.onRowClick)
// prvky, ktoré majú vlastnú akciu – klik na ne neotvára riadok
const INTERACTIVE = 'a, button, input, select, textarea, label, [role="button"], [role="checkbox"], [contenteditable]'
function activate(row: T, e: MouseEvent | KeyboardEvent) {
  const target = e.target as HTMLElement | null
  if (target?.closest(INTERACTIVE) && target.closest('tr') === e.currentTarget) return
  if (window.getSelection()?.toString()) return // označovanie textu nie je klik
  const href = props.rowHref?.(row)
  if (href) {
    const newTab = 'button' in e && (e.button === 1 || e.ctrlKey || e.metaKey)
    if (newTab) window.open(href, '_blank', 'noopener')
    else window.location.assign(href)
  } else props.onRowClick?.(row)
}
</script>

<template>
  <div v-if="onRefresh || $slots.toolbar" class="flex flex-wrap items-center justify-end gap-2 pb-2">
    <slot name="toolbar" />
    <Button v-if="onRefresh" type="button" variant="outline" size="sm" :disabled="loading" :aria-label="caption ? pt('refreshOf', { what: caption }) : pt('refresh')" @click="onRefresh()">
      <RefreshCw aria-hidden="true" :class="loading && 'animate-spin motion-reduce:animate-none'" />{{ pt('refresh') }}
    </Button>
    <span v-if="loading && rows.length" class="sr-only" role="status">{{ loadingLabel ?? pt('loading') }}</span>
  </div>
  <Table :class="props.class" :aria-busy="loading">
    <caption v-if="caption" class="sr-only">{{ caption }}</caption>
    <TableHeader>
      <TableRow>
        <TableHead v-for="c in columns" :key="c.key" :class="cn(align(c), c.class)">{{ c.label }}</TableHead>
        <TableHead v-if="$slots.actions"><span class="sr-only">{{ pt('actions') }}</span></TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow v-if="loading && !rows.length">
        <TableCell :colspan="columns.length + ($slots.actions ? 1 : 0)"><Spinner :label="loadingLabel ?? pt('loading')" /></TableCell>
      </TableRow>
      <TableRow v-else-if="!rows.length">
        <TableCell :colspan="columns.length + ($slots.actions ? 1 : 0)" class="text-muted-foreground">
          <slot name="empty">{{ empty ?? pt('noRows') }}</slot>
        </TableCell>
      </TableRow>
      <TableRow v-for="row in rows" :key="rowKey(row)" :data-state="selected?.(row) ? 'selected' : undefined"
        :tabindex="clickable(row) ? 0 : undefined"
        :class="clickable(row) && 'cursor-pointer focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring'"
        @click="clickable(row) && activate(row, $event)" @auxclick="clickable(row) && $event.button === 1 && activate(row, $event)"
        @keydown.enter.self="clickable(row) && activate(row, $event)">
        <template v-for="c in columns" :key="c.key">
          <component :is="c.rowHeader ? TableHead : TableCell" :scope="c.rowHeader ? 'row' : undefined" :class="cn(align(c), c.rowHeader && 'font-medium text-foreground', c.class)">
            <slot :name="`cell-${c.key}`" :row="row" :value="value(row, c.key)">{{ value(row, c.key) ?? '—' }}</slot>
          </component>
        </template>
        <TableCell v-if="$slots.actions" class="text-right whitespace-nowrap"><slot name="actions" :row="row" /></TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>
