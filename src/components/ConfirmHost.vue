<script setup lang="ts">
// Miesto pre potvrdzovací dialóg z confirm() / confirmTyped() – v aplikácii raz, napr. na konci App.vue.
import { computed } from 'vue'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { canSettle, confirmState, settleConfirm } from '../confirm.ts'
import { pt } from '../messages.ts'

function onOpen(open: boolean) {
  if (!open) settleConfirm(false)
}
const ready = computed(() => canSettle())
</script>

<template>
  <Dialog :open="confirmState.open" @update:open="onOpen">
    <DialogContent :show-close-button="false" class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{{ confirmState.options.title }}</DialogTitle>
        <DialogDescription v-if="confirmState.options.description">{{ confirmState.options.description }}</DialogDescription>
      </DialogHeader>
      <form v-if="confirmState.options.reason || confirmState.options.typed" class="grid gap-4" @submit.prevent="settleConfirm(true)">
        <div v-if="confirmState.options.reason" class="grid gap-2">
          <Label for="confirm-reason">{{ confirmState.options.reason.label }}</Label>
          <Textarea id="confirm-reason" v-model="confirmState.reason" rows="3" :required="confirmState.options.reason.required" />
        </div>
        <div v-if="confirmState.options.typed" class="grid gap-2">
          <Label for="confirm-typed">{{ pt('confirmTypeWord') }}</Label>
          <Input id="confirm-typed" v-model="confirmState.typed" autocomplete="off" autocapitalize="off" spellcheck="false" />
        </div>
        <button type="submit" class="hidden" tabindex="-1" aria-hidden="true" />
      </form>
      <DialogFooter class="gap-2">
        <Button variant="ghost" @click="settleConfirm(false)">{{ confirmState.options.cancelLabel ?? pt('cancel') }}</Button>
        <Button :variant="confirmState.options.variant ?? 'default'" :disabled="!ready" @click="settleConfirm(true)">
          {{ confirmState.options.confirmLabel ?? pt('confirm') }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
