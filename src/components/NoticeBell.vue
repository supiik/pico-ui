<script setup lang="ts">
// Zvonček v hornej lište: počet platných oznámení; klik znova ukáže zatvorené.
import { computed } from 'vue'
import { Bell } from '@lucide/vue'
import { Button } from '../ui/button'
import { pt } from '../messages.ts'
import type { Notices } from '../notices.ts'

const props = defineProps<{ notices: Notices }>()
const count = computed(() => props.notices.active.value.length)
const label = computed(() => (count.value ? pt('noticesCount', { count: count.value }) : pt('noticesNone')))
</script>

<template>
  <Button type="button" variant="ghost" size="icon" class="relative" :aria-label="label" :title="label" @click="notices.restore()">
    <Bell aria-hidden="true" />
    <span
      v-if="count" aria-hidden="true"
      class="absolute right-1 top-1 grid min-w-4 place-items-center rounded-full bg-destructive px-1 text-[0.625rem] font-semibold leading-4 text-white"
    >{{ count }}</span>
  </Button>
</template>
