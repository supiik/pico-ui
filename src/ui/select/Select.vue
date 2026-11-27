<script setup lang="ts">
// Rozbaľovací výber (Reka UI) – prevzatý z orgasmu: v-model, placeholder, prázdna hodnota = nevybrané.
// Atribúty (`id`, `aria-label`, …) idú na tlačidlo, aby <Label for> a prístupný názov mierili na zameriavateľný prvok.
import type { HTMLAttributes } from 'vue'
import {
  SelectRoot, SelectTrigger, SelectValue, SelectPortal,
  SelectContent, SelectViewport, SelectScrollUpButton, SelectScrollDownButton,
} from 'reka-ui'
import { ChevronDown, ChevronUp } from '@lucide/vue'
import { cn } from '../../utils.ts'
import { pt } from '../../messages.ts'

defineOptions({ inheritAttrs: false })

const props = defineProps<{ placeholder?: string, class?: HTMLAttributes['class'], disabled?: boolean }>()
const model = defineModel<string>()
</script>

<template>
  <SelectRoot v-model="model" :disabled="props.disabled">
    <SelectTrigger
      v-bind="$attrs"
      data-slot="select-trigger"
      :class="cn(
        'flex h-9 w-full items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs dark:bg-input/30',
        'focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50',
        'data-[placeholder]:text-muted-foreground',
        props.class,
      )"
    >
      <SelectValue :placeholder="props.placeholder ?? pt('select')" />
      <ChevronDown class="size-4 shrink-0 opacity-50" aria-hidden="true" />
    </SelectTrigger>

    <SelectPortal>
      <SelectContent
        data-slot="select-content"
        class="relative z-50 max-h-(--reka-select-content-available-height) min-w-(--reka-select-trigger-width) overflow-hidden rounded-md border border-border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
        position="popper"
        :side-offset="4"
      >
        <SelectScrollUpButton class="flex h-6 cursor-default items-center justify-center">
          <ChevronUp class="size-4" aria-hidden="true" />
        </SelectScrollUpButton>
        <SelectViewport class="p-1">
          <slot />
        </SelectViewport>
        <SelectScrollDownButton class="flex h-6 cursor-default items-center justify-center">
          <ChevronDown class="size-4" aria-hidden="true" />
        </SelectScrollDownButton>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>
