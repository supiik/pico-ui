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

defineProps<{
  title: string
  sections: NavSection[]
  user?: string
  /** horná lišta vľavo: kde som (napr. „Orgasm admin“); bez neho title */
  heading?: string
  /** pätička vľavo (napr. názov aplikácie); bez neho názov z title */
  footer?: string
  /** verzia aplikácie (package.json) do pätičky vpravo, napr. 0.3.0 */
  version?: string
  /** skrátený commit buildu (AWS_COMMIT_ID v Amplify) – pri verzii */
  build?: string
}>()
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
      <!-- horná lišta – vždy viditeľná: na mobile tlačidlo menu, názov aplikácie, vpravo akcie (#header, napr. oznámenia) -->
      <header class="flex h-14 shrink-0 items-center gap-2 border-b bg-card px-2 md:px-6">
        <Button variant="ghost" size="icon" class="md:hidden" :aria-label="pt('openMenu')" @click="mobileOpen = true"><Menu class="size-5" aria-hidden="true" /></Button>
        <span class="min-w-0 flex-1 truncate text-sm font-semibold tracking-wide">{{ heading ?? title }}</span>
        <slot name="header" />
      </header>
      <!-- oznámenia nad obsahom (AnnouncementBar) -->
      <slot name="notices" />
      <main id="obsah" class="flex-1 overflow-y-auto p-4 md:p-6">
        <div class="mx-auto max-w-6xl space-y-6"><slot /></div>
      </main>
      <!-- pätička ako v orgasme: vľavo názov, vpravo verzia (a build) -->
      <footer v-if="footer || version || $slots.footer" class="flex shrink-0 items-center justify-between gap-4 border-t px-4 py-3 text-xs text-muted-foreground md:px-6">
        <slot name="footer">
          <span>{{ footer ?? title }}</span>
          <span v-if="version" class="tabular-nums">v{{ version }}<template v-if="build"> · <span class="font-mono">{{ build }}</span></template></span>
        </slot>
      </footer>
    </div>
  </div>
</template>
