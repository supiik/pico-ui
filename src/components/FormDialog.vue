<script setup lang="ts">
// Dialóg s formulárom: nadpis, popis, obsah (polia), tlačidlá Uložiť/Zrušiť, chyba a spinner počas ukladania.
// Odoslanie (Enter alebo Uložiť) vyvolá @submit; dialóg zatvorí rodič (v-model:open = false) po úspechu.
import { Alert, AlertDescription } from '../ui/alert'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import Spinner from './Spinner.vue'

withDefaults(defineProps<{
  title: string
  description?: string
  submitLabel?: string
  busy?: boolean
  busyLabel?: string
  error?: string
  /** napr. sm:max-w-2xl pre širší formulár */
  class?: string
}>(), { submitLabel: 'Uložiť', busy: false, busyLabel: 'Ukladám…' })
const open = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{ submit: [] }>()
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent :class="$props.class">
      <form class="grid gap-4" @submit.prevent="emit('submit')">
        <DialogHeader>
          <DialogTitle>{{ title }}</DialogTitle>
          <DialogDescription v-if="description">{{ description }}</DialogDescription>
        </DialogHeader>
        <Alert v-if="error" variant="destructive" role="alert"><AlertDescription>{{ error }}</AlertDescription></Alert>
        <slot />
        <DialogFooter class="items-center gap-2">
          <Spinner v-if="busy" :label="busyLabel" class="mr-auto" />
          <Button type="button" variant="ghost" :disabled="busy" @click="open = false">Zrušiť</Button>
          <Button type="submit" :disabled="busy">{{ submitLabel }}</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
