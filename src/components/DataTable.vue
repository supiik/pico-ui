<script setup lang="ts" generic="T">
// Tabuľka dát: stĺpce, riadky, načítanie (spinner), prázdny stav, zebra (z ui/table).
// Vlastné zobrazenie bunky cez slot #cell-<kľúč>="{ row, value }", akcie riadku cez slot #actions="{ row }".
// S @refresh má tabuľka vpravo hore tlačidlo Obnoviť (pri načítaní sa točí, riadky ostanú); vedľa neho slot #toolbar.
import type { HTMLAttributes } from 'vue'
import { cn } from '../utils.ts'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { RefreshCw } from '@lucide/vue'
import { Button } from '../ui/button'
import Spinner from './Spinner.vue'

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
}>(), { loading: false, loadingLabel: 'Načítavam…', empty: 'Žiadne záznamy.' })

defineSlots<Record<`cell-${string}`, (p: { row: T; value: unknown }) => unknown> & {
  actions?: (p: { row: T }) => unknown
  empty?: () => unknown
  toolbar?: () => unknown
}>()

const value = (row: T, key: string) => (row as Record<string, unknown>)[key]
const align = (c: Column) => (c.align === 'right' ? 'text-right' : '')
</script>

<template>
  <div v-if="onRefresh || $slots.toolbar" class="flex flex-wrap items-center justify-end gap-2 pb-2">
    <slot name="toolbar" />
    <Button v-if="onRefresh" type="button" variant="outline" size="sm" :disabled="loading" :aria-label="caption ? `Obnoviť – ${caption}` : 'Obnoviť'" @click="onRefresh()">
      <RefreshCw aria-hidden="true" :class="loading && 'animate-spin motion-reduce:animate-none'" />Obnoviť
    </Button>
    <span v-if="loading && rows.length" class="sr-only" role="status">{{ loadingLabel }}</span>
  </div>
  <Table :class="props.class" :aria-busy="loading">
    <caption v-if="caption" class="sr-only">{{ caption }}</caption>
    <TableHeader>
      <TableRow>
        <TableHead v-for="c in columns" :key="c.key" :class="cn(align(c), c.class)">{{ c.label }}</TableHead>
        <TableHead v-if="$slots.actions"><span class="sr-only">Akcie</span></TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow v-if="loading && !rows.length">
        <TableCell :colspan="columns.length + ($slots.actions ? 1 : 0)"><Spinner :label="loadingLabel" /></TableCell>
      </TableRow>
      <TableRow v-else-if="!rows.length">
        <TableCell :colspan="columns.length + ($slots.actions ? 1 : 0)" class="text-muted-foreground">
          <slot name="empty">{{ empty }}</slot>
        </TableCell>
      </TableRow>
      <TableRow v-for="row in rows" :key="rowKey(row)" :data-state="selected?.(row) ? 'selected' : undefined">
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
