<script setup lang="ts">
// Miesto pre potvrdzovací dialóg z confirm() – v aplikácii raz, napr. na konci App.vue.
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { confirmState, settleConfirm } from '../confirm.ts'
import { pt } from '../messages.ts'

function onOpen(open: boolean) {
  if (!open) settleConfirm(false)
}
</script>

<template>
  <Dialog :open="confirmState.open" @update:open="onOpen">
    <DialogContent :show-close-button="false" class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{{ confirmState.options.title }}</DialogTitle>
        <DialogDescription v-if="confirmState.options.description">{{ confirmState.options.description }}</DialogDescription>
      </DialogHeader>
      <DialogFooter class="gap-2">
        <Button variant="ghost" @click="settleConfirm(false)">{{ confirmState.options.cancelLabel ?? pt('cancel') }}</Button>
        <Button :variant="confirmState.options.variant ?? 'default'" @click="settleConfirm(true)">
          {{ confirmState.options.confirmLabel ?? pt('confirm') }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
