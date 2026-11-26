<script setup lang="ts">
// Rám aplikácie ako v orgasme: ľavé menu (od šírky md), na mobile horná lišta s tlačidlom a vysúvacím menu.
// Obsah stránky do predvoleného slotu; dole voliteľná pätička.
import { onBeforeUnmount, ref } from 'vue'
import { Menu } from '@lucide/vue'
import { Button } from '../ui/button'
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '../ui/sheet'
import type { NavSection } from '../nav.ts'
import SidebarNav from './SidebarNav.vue'
import PrefsSwitch from './PrefsSwitch.vue'
import { pt } from '../messages.ts'

const props = defineProps<{ title: string; sections: NavSection[]; user?: string; footer?: string }>()
const emit = defineEmits<{ logout: [] }>()
const mobileOpen = ref(false)
// po zmene stránky (hash) sa vysúvacie menu zatvorí
const close = () => (mobileOpen.value = false)
window.addEventListener('hashchange', close)
onBeforeUnmount(() => window.removeEventListener('hashchange', close))
</script>

<template>
  <a class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-card focus:p-2" href="#obsah">{{ pt('skipToContent') }}</a>
  <div class="flex h-dvh bg-background text-foreground">
    <aside class="hidden w-60 shrink-0 flex-col border-r bg-card md:flex">
      <div class="flex h-14 items-center gap-2 border-b px-4 text-sm font-semibold tracking-wide">
        <slot name="logo" />{{ title }}
      </div>
      <SidebarNav :sections="sections" :user="user" @logout="emit('logout')"><template #footer><slot name="nav-footer" /><PrefsSwitch /></template></SidebarNav>
    </aside>

    <Sheet v-model:open="mobileOpen">
      <SheetContent side="left" class="w-72 gap-0 p-0">
        <SheetTitle class="flex h-14 items-center gap-2 border-b px-4 pr-12 text-sm font-semibold tracking-wide"><slot name="logo" />{{ title }}</SheetTitle>
        <SheetDescription class="sr-only">{{ pt('mainMenu') }}</SheetDescription>
        <SidebarNav :sections="sections" :user="user" @navigate="mobileOpen = false" @logout="emit('logout')"><template #footer><slot name="nav-footer" /><PrefsSwitch /></template></SidebarNav>
      </SheetContent>
    </Sheet>

    <div class="flex min-w-0 flex-1 flex-col overflow-hidden">
      <header class="flex h-14 shrink-0 items-center gap-2 border-b bg-card px-2 md:hidden">
        <Button variant="ghost" size="icon" :aria-label="pt('openMenu')" @click="mobileOpen = true"><Menu class="size-5" aria-hidden="true" /></Button>
        <span class="truncate text-sm font-semibold tracking-wide">{{ title }}</span>
      </header>
      <main id="obsah" class="flex-1 overflow-y-auto p-4 md:p-6">
        <div class="mx-auto max-w-6xl space-y-6"><slot /></div>
      </main>
      <footer v-if="footer || $slots.footer" class="flex shrink-0 items-center justify-between border-t px-4 py-3 text-xs text-muted-foreground md:px-6">
        <slot name="footer">{{ footer }}</slot>
      </footer>
    </div>
  </div>
</template>
