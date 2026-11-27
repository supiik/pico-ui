<script setup lang="ts">
// Položka výberu – prevzatá z orgasmu. Hodnota nesmie byť prázdny reťazec (Reka ho vyhradzuje pre „nevybrané“).
import type { HTMLAttributes } from 'vue'
import { SelectItem, SelectItemText, SelectItemIndicator } from 'reka-ui'
import { Check } from '@lucide/vue'
import { cn } from '../../utils.ts'

const props = defineProps<{ value: string, class?: HTMLAttributes['class'], disabled?: boolean }>()
</script>

<template>
  <SelectItem
    :value="props.value"
    :disabled="props.disabled"
    data-slot="select-item"
    :class="cn(
      'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pr-8 pl-2 text-sm outline-none',
      'focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      props.class,
    )"
  >
    <span class="absolute right-2 flex size-3.5 items-center justify-center">
      <SelectItemIndicator>
        <Check class="size-4" aria-hidden="true" />
      </SelectItemIndicator>
    </span>
    <SelectItemText>
      <slot />
    </SelectItemText>
  </SelectItem>
</template>
